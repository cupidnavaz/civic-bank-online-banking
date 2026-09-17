import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateAccountNumber } from "@/lib/account";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("Accounts API error:", error);
    return NextResponse.json({ error: "Unable to load accounts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { currency, type } = await req.json();
    const supportedCurrencies = ["USD", "EUR", "GBP"];
    const accountType = typeof type === "string" ? type.trim().toUpperCase() : "CHECKING";

    if (!supportedCurrencies.includes(currency) || !["CHECKING", "SAVINGS"].includes(accountType)) {
      return NextResponse.json({ error: "Choose a supported currency and account type." }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email: session.user.email }, select: { id: true, name: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const existing = await db.account.findFirst({ where: { userId: user.id, currency, type: accountType } });
    if (existing) return NextResponse.json({ error: `You already have a ${currency} ${accountType.toLowerCase()} account.` }, { status: 409 });

    const account = await db.account.create({
      data: { userId: user.id, accountNumber: `CB-${generateAccountNumber()}`, currency, type: accountType, balance: 0, status: "ACTIVE" },
    });
    await db.auditLog.create({ data: { userId: user.id, action: "CREATE_ACCOUNT" } });
    await db.notification.create({ data: { userId: user.id, title: "Account opened", message: `Your ${currency} ${accountType.toLowerCase()} account is ready.` } });
    return NextResponse.json({ account }, { status: 201 });
  } catch (error) {
    console.error("Account creation error:", error);
    return NextResponse.json({ error: "Unable to open account." }, { status: 500 });
  }
}