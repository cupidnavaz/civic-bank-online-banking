import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { fromCurrency, toCurrency, amount } = await req.json();
    const user = session.user as any;

    if (!fromCurrency || !toCurrency || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid conversion parameters" }, { status: 400 });
    }

    const dbUser = await db.user.findUnique({
      where: { email: user.email },
      include: { accounts: true } as any,
    });

    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const accounts = (dbUser as any).accounts || [];
    const sourceAcc = accounts.find((a: any) => a.currency === fromCurrency);
    const targetAcc = accounts.find((a: any) => a.currency === toCurrency);

    if (!sourceAcc || Number(sourceAcc.balance) < amount) {
      return NextResponse.json({ error: "Insufficient liquidity in source currency account" }, { status: 400 });
    }

    // Mock live institutional FX mid-market rates lookup
    const exchangeRates: Record<string, number> = { "USD_EUR": 0.92, "EUR_USD": 1.09, "USD_GBP": 0.79, "GBP_USD": 1.27 };
    const rateKey = `${fromCurrency}_${toCurrency}`;
    const rate = exchangeRates[rateKey] || 1.0;
    const convertedAmount = amount * rate;

    // Execute atomic Prisma transaction
    await db.$transaction([
      db.account.update({
        where: { id: sourceAcc.id },
        data: { balance: { decrement: amount } },
      }),
      targetAcc 
        ? db.account.update({ where: { id: targetAcc.id }, data: { balance: { increment: convertedAmount } } })
        : db.account.create({ data: { userId: dbUser.id, currency: toCurrency, balance: convertedAmount, accountNumber: `FX-${Math.floor(10000000 + Math.random() * 90000000)}` } }),
      db.transaction.create({
        data: {
          userId: dbUser.id,
          accountId: sourceAcc.id,
          amount: convertedAmount,
          type: "FX_CONVERSION",
          status: "COMPLETED",
          reference: `FX-${fromCurrency}-${toCurrency}-${Date.now()}`,
          description: `${fromCurrency} to ${toCurrency} conversion`,
        }
      })
    ]);

    return NextResponse.json({ success: true, convertedAmount, rate });
  } catch (error) {
    console.error("FX conversion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}