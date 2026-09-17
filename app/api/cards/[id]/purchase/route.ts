import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id: cardId } = await params;
    const { merchant, amount } = await req.json();
    const purchaseAmount = Number(amount);
    if (typeof merchant !== "string" || !merchant.trim() || !Number.isFinite(purchaseAmount) || purchaseAmount <= 0) return NextResponse.json({ error: "Enter a merchant and valid purchase amount." }, { status: 400 });

    const user = await db.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const card = await db.virtualCard.findFirst({ where: { id: cardId, userId: user.id, status: "ACTIVE" } });
    if (!card) return NextResponse.json({ error: "Active card not found." }, { status: 404 });
    if (Number(card.balance) < purchaseAmount) return NextResponse.json({ error: "Insufficient virtual card balance." }, { status: 400 });

    const reference = `CARD-PURCHASE-${Date.now()}`;
    const purchase = await db.$transaction(async (tx) => {
      await tx.virtualCard.update({ where: { id: card.id }, data: { balance: { decrement: purchaseAmount } } });
      const result = await tx.cardPurchase.create({ data: { userId: user.id, cardId: card.id, merchant: merchant.trim().slice(0, 120), amount: purchaseAmount, reference } });
      await tx.auditLog.create({ data: { userId: user.id, action: "CARD_PURCHASE" } });
      await tx.notification.create({ data: { userId: user.id, title: "Card purchase completed", message: `USD ${purchaseAmount.toLocaleString()} was spent at ${merchant.trim()}.` } });
      return result;
    });
    return NextResponse.json({ success: true, reference, purchase });
  } catch (error) {
    console.error("Card purchase error:", error);
    return NextResponse.json({ error: "Unable to complete card purchase." }, { status: 500 });
  }
}