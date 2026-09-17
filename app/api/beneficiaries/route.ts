import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const MAX_NAME_LENGTH = 120;
const MAX_BANK_LENGTH = 120;
const MAX_ACCOUNT_LENGTH = 34;
const SWIFT_PATTERN = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

function validateBeneficiaryInput(body: unknown) {
  if (!body || typeof body !== "object") {
    return { error: "A beneficiary payload is required." };
  }

  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const bankName = typeof input.bankName === "string" ? input.bankName.trim() : "";
  const accountNumber = typeof input.accountNumber === "string" ? input.accountNumber.trim() : "";
  const swiftCode = typeof input.swiftCode === "string" ? input.swiftCode.trim().toUpperCase() : "";

  if (!name || name.length > MAX_NAME_LENGTH) {
    return { error: `Beneficiary name is required and must be ${MAX_NAME_LENGTH} characters or fewer.` };
  }
  if (!bankName || bankName.length > MAX_BANK_LENGTH) {
    return { error: `Bank name is required and must be ${MAX_BANK_LENGTH} characters or fewer.` };
  }
  if (!accountNumber || accountNumber.length > MAX_ACCOUNT_LENGTH || !/^[A-Za-z0-9 -]+$/.test(accountNumber)) {
    return { error: "Enter a valid account number or IBAN." };
  }
  if (swiftCode && !SWIFT_PATTERN.test(swiftCode)) {
    return { error: "Enter a valid 8 or 11 character SWIFT/BIC code." };
  }

  return { data: { name, bankName, accountNumber, swiftCode: swiftCode || null } };
}

async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) return null;

  return db.user.findUnique({ where: { email }, select: { id: true } });
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const beneficiaries = await db.beneficiary.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ beneficiaries });
  } catch (error) {
    console.error("Beneficiary list error:", error);
    return NextResponse.json({ error: "Unable to load beneficiaries." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const validation = validateBeneficiaryInput(await req.json());
    if (validation.error || !validation.data) {
      return NextResponse.json({ error: validation.error || "Invalid beneficiary payload." }, { status: 400 });
    }

    const beneficiary = await db.beneficiary.create({
      data: { ...validation.data, userId: user.id },
    });

    await db.auditLog.create({
      data: { userId: user.id, action: "CREATE_BENEFICIARY" },
    });

    return NextResponse.json({ beneficiary }, { status: 201 });
  } catch (error) {
    console.error("Beneficiary creation error:", error);
    return NextResponse.json({ error: "Unable to create beneficiary." }, { status: 500 });
  }
}