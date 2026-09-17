import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const ASSET_PRICES: Record<string, number> = { BTC: 64250, ETH: 3180, USDC: 1 };

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { asset, amount, accountId } = await req.json();
    const price = ASSET_PRICES[asset];
    const purchaseAmount = Number(amount);
    if (!price || !Number.isFinite(purchaseAmount) || purchaseAmount <= 0) return NextResponse.json({ error: "Choose a supported asset and valid purchase amount." }, { status: 400 });

    const user = await db.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const account = await db.account.findFirst({ where: { id: accountId, userId: user.id, currency: "USD", status: "ACTIVE" } });
    if (!account) return NextResponse.json({ error: "Select an active USD funding account." }, { status: 400 });
    if (Number(account.balance) < purchaseAmount) return NextResponse.json({ error: "Insufficient USD balance." }, { status: 400 });

    const quantity = purchaseAmount / price;
    const reference = `CRYPTO-${Date.now()}`;
    const result = await db.$transaction(async (tx) => {
      await tx.account.update({ where: { id: account.id }, data: { balance: { decrement: purchaseAmount } } });
      const holding = await tx.cryptoHolding.findFirst({ where: { userId: user.id, accountId: account.id, asset } });
      const updatedHolding = holding
        ? await tx.cryptoHolding.update({ where: { id: holding.id }, data: { quantity: { increment: quantity }, averagePrice: price } })
        : await tx.cryptoHolding.create({ data: { userId: user.id, accountId: account.id, asset, quantity, averagePrice: price } });
      await tx.transaction.create({ data: { userId: user.id, accountId: account.id, amount: purchaseAmount, type: "CRYPTO_PURCHASE", status: "COMPLETED", reference, description: `Demo purchase of ${quantity.toFixed(8)} ${asset}` } });
      await tx.auditLog.create({ data: { userId: user.id, action: "CRYPTO_PURCHASE" } });
      await tx.notification.create({ data: { userId: user.id, title: `${asset} purchase completed`, message: `You purchased ${quantity.toFixed(8)} ${asset} for USD ${purchaseAmount.toLocaleString()}.` } });
      return updatedHolding;
    });

    return NextResponse.json({ success: true, reference, holding: result, price });
  } catch (error) {
    console.error("Crypto purchase error:", error);
    return NextResponse.json({ error: "Unable to complete crypto purchase." }, { status: 500 });
  }
}