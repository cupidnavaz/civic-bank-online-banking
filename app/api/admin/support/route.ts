import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function admin() { const session = await getServerSession(authOptions); return session && (session.user as any)?.role === "ADMIN" ? session : null; }
export async function GET() { if (!(await admin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 }); return NextResponse.json({ tickets: await db.supportTicket.findMany({ include: { user: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" }, take: 100 }) }); }
export async function PATCH(request: Request) { const session = await admin(); if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 }); const { id, status, adminNote } = await request.json(); const ticket = await db.supportTicket.update({ where: { id }, data: { ...(status && { status }), ...(adminNote !== undefined && { adminNote }) } }); await db.auditLog.create({ data: { userId: (session.user as any).id, action: "UPDATE_SUPPORT_TICKET" } }); return NextResponse.json({ ticket }); }