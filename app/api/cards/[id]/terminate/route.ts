import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const user = await db.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const card = await db.virtualCard.findFirst({ where: { id, userId: user.id, status: "ACTIVE" } });
    if (!card) return NextResponse.json({ error: "Active card not found." }, { status: 404 });

    await db.$transaction([
      db.virtualCard.update({ where: { id: card.id }, data: { status: "TERMINATED" } }),
      db.auditLog.create({ data: { userId: user.id, action: "TERMINATE_VIRTUAL_CARD" } }),
      db.notification.create({ data: { userId: user.id, title: "Virtual card terminated", message: `Card •••• ${card.cardNumber.slice(-4)} has been terminated.` } }),
    ]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Card termination error:", error);
    return NextResponse.json({ error: "Unable to terminate virtual card." }, { status: 500 });
  }
}