import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id: cardId } = await params;
    const { accountId, amount } = await req.json();
    const topUpAmount = Number(amount);
    if (!accountId || !Number.isFinite(topUpAmount) || topUpAmount <= 0) return NextResponse.json({ error: "Choose a funding account and valid amount." }, { status: 400 });

    const user = await db.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const card = await db.virtualCard.findFirst({ where: { id: cardId, userId: user.id, status: "ACTIVE" } });
    const account = await db.account.findFirst({ where: { id: accountId, userId: user.id, currency: "USD", status: "ACTIVE" } });
    if (!card || !account) return NextResponse.json({ error: "Active card or funding account not found." }, { status: 404 });
    if (Number(account.balance) < topUpAmount) return NextResponse.json({ error: "Insufficient account balance." }, { status: 400 });

    const reference = `CARD-TOPUP-${Date.now()}`;
    await db.$transaction(async (tx) => {
      await tx.account.update({ where: { id: account.id }, data: { balance: { decrement: topUpAmount } } });
      await tx.virtualCard.update({ where: { id: card.id }, data: { balance: { increment: topUpAmount } } });
      await tx.transaction.create({ data: { userId: user.id, accountId: account.id, amount: topUpAmount, type: "CARD_TOPUP", status: "COMPLETED", reference, description: `Top up virtual card •••• ${card.cardNumber.slice(-4)}` } });
      await tx.auditLog.create({ data: { userId: user.id, action: "CARD_TOPUP" } });
      await tx.notification.create({ data: { userId: user.id, title: "Virtual card funded", message: `USD ${topUpAmount.toLocaleString()} was added to card •••• ${card.cardNumber.slice(-4)}.` } });
    });
    return NextResponse.json({ success: true, reference });
  } catch (error) {
    console.error("Card top-up error:", error);
    return NextResponse.json({ error: "Unable to top up virtual card." }, { status: 500 });
  }
}