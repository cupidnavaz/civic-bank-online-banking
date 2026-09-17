import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { generateAccountNumber } from "@/lib/account";

// Explicitly export the POST handler to avoid HTTP 405 Method Not Allowed errors
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password } = body;

    // Strict validation for required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields: first name, last name, email, and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in." },
        { status: 400 }
      );
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    let accountNumber = `CB-${generateAccountNumber()}`;
    while (await db.account.findUnique({ where: { accountNumber }, select: { id: true } })) {
      accountNumber = `CB-${generateAccountNumber()}`;
    }

    // Create a brand new unique user and initial USD account
    const newUser = await db.user.create({
      data: {
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role: "CUSTOMER",
        accounts: {
          create: {
            accountNumber,
            balance: 1000.00,
            currency: "USD",
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Account created successfully", userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 }
    );
  }
}