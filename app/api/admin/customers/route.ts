import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const customers = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, role: true, image: true, createdAt: true,
      accounts: { select: { id: true, currency: true, balance: true, status: true } },
      virtualCards: { select: { id: true, status: true, balance: true } },
      cryptoHoldings: { select: { id: true, asset: true, quantity: true } },
      _count: { select: { transactions: true, notifications: true, auditLogs: true } },
    },
  });
  return NextResponse.json({ customers });
}