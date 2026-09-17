import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { category, priority, subject, message } = await request.json();
  if (!category || !subject || !message) return NextResponse.json({ error: "Category, subject, and message are required." }, { status: 400 });
  const user = await db.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const ticket = await db.supportTicket.create({ data: { userId: user.id, category, priority: priority || "NORMAL", subject, message } });
  await db.auditLog.create({ data: { userId: user.id, action: "CREATE_SUPPORT_TICKET" } });
  return NextResponse.json({ ticket }, { status: 201 });
}