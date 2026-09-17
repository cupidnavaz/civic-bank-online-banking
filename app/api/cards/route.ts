import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

function digits(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { cardHolder } = await req.json();
    const user = await db.user.findUnique({ where: { email: session.user.email }, select: { id: true, name: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const holder = typeof cardHolder === "string" && cardHolder.trim() ? cardHolder.trim().slice(0, 80) : user.name || "CivicBank Customer";
    let cardNumber = `4${digits(15)}`;
    while (await db.virtualCard.findUnique({ where: { cardNumber }, select: { id: true } })) cardNumber = `4${digits(15)}`;

    const now = new Date();
    const expiryDate = `${String((now.getMonth() + 1)).padStart(2, "0")}/${String(now.getFullYear() + 4).slice(-2)}`;
    const card = await db.virtualCard.create({ data: { userId: user.id, cardNumber, cardHolder: holder, expiryDate, cvv: digits(3), balance: 0, status: "ACTIVE" } });
    await db.auditLog.create({ data: { userId: user.id, action: "CREATE_VIRTUAL_CARD" } });
    await db.notification.create({ data: { userId: user.id, title: "Virtual card issued", message: `A new virtual card ending in ${cardNumber.slice(-4)} is active.` } });
    return NextResponse.json({ card }, { status: 201 });
  } catch (error) {
    console.error("Virtual card creation error:", error);
    return NextResponse.json({ error: "Unable to issue virtual card." }, { status: 500 });
  }
}