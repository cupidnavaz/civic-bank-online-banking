import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() { const session = await getServerSession(authOptions); if (!session || (session.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 }); return NextResponse.json({ settings: await db.adminSetting.findMany({ orderBy: { key: "asc" } }) }); }
export async function PUT(request: Request) { const session = await getServerSession(authOptions); if (!session || (session.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 }); const values = await request.json(); for (const [key, value] of Object.entries(values)) await db.adminSetting.upsert({ where: { key }, update: { value: String(value) }, create: { key, value: String(value) } }); await db.auditLog.create({ data: { userId: (session.user as any).id, action: "UPDATE_ADMIN_SETTINGS" } }); return NextResponse.json({ success: true }); }