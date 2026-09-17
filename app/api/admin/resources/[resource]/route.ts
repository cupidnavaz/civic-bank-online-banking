import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const resources = ["users", "accounts", "transactions", "cards", "crypto", "news"] as const;
type Resource = typeof resources[number];

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session && (session.user as any)?.role === "ADMIN" ? session : null;
}

function validResource(value: string): value is Resource { return resources.includes(value as Resource); }

export async function GET(_request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { resource } = await params;
  if (!validResource(resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  const queries: Record<Resource, () => Promise<unknown>> = {
    users: () => db.user.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { accounts: true, transactions: true, virtualCards: true } } } }),
    accounts: () => db.account.findMany({ orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, email: true } } } }),
    transactions: () => db.transaction.findMany({ orderBy: { createdAt: "desc" }, take: 200, include: { user: { select: { name: true, email: true } }, account: { select: { accountNumber: true, currency: true } } } }),
    cards: () => db.virtualCard.findMany({ orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, email: true } } } }),
    crypto: () => db.cryptoHolding.findMany({ orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, email: true } } } }),
    news: () => db.newsItem.findMany({ orderBy: { createdAt: "desc" }, include: { author: { select: { name: true, email: true } } } }),
  };
  return NextResponse.json({ resource, items: await queries[resource]() });
}

export async function POST(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { resource } = await params;
  if (resource !== "news") return NextResponse.json({ error: "Creation is only supported for news content." }, { status: 400 });
  const { title, excerpt, body, category, status } = await request.json();
  if (!title || !excerpt || !body) return NextResponse.json({ error: "Title, excerpt, and body are required." }, { status: 400 });
  const item = await db.newsItem.create({ data: { authorId: (session.user as any).id, title, excerpt, body, category: category || "GENERAL", status: status || "DRAFT", publishedAt: status === "PUBLISHED" ? new Date() : null } });
  await db.auditLog.create({ data: { userId: (session.user as any).id, action: "CREATE_NEWS_ITEM" } });
  return NextResponse.json({ item }, { status: 201 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { resource } = await params;
  if (!validResource(resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  const { id, ...input } = await request.json();
  if (!id) return NextResponse.json({ error: "Record id is required." }, { status: 400 });
  let item: unknown;
  if (resource === "users") item = await db.user.update({ where: { id }, data: { ...(input.name !== undefined && { name: String(input.name).slice(0, 120) }), ...(input.role !== undefined && { role: String(input.role) }) }, select: { id: true, name: true, email: true, role: true } });
  if (resource === "accounts") item = await db.account.update({ where: { id }, data: { ...(input.status !== undefined && { status: String(input.status) }), ...(input.type !== undefined && { type: String(input.type) }) } });
  if (resource === "transactions") item = await db.transaction.update({ where: { id }, data: { ...(input.status !== undefined && { status: String(input.status) }), ...(input.description !== undefined && { description: String(input.description).slice(0, 240) }) } });
  if (resource === "cards") item = await db.virtualCard.update({ where: { id }, data: { ...(input.status !== undefined && { status: String(input.status) }), ...(input.cardHolder !== undefined && { cardHolder: String(input.cardHolder).slice(0, 80) }) } });
  if (resource === "crypto") item = await db.cryptoHolding.update({ where: { id }, data: { ...(input.asset !== undefined && { asset: String(input.asset) }) } });
  if (resource === "news") item = await db.newsItem.update({ where: { id }, data: { ...(input.title !== undefined && { title: String(input.title) }), ...(input.excerpt !== undefined && { excerpt: String(input.excerpt) }), ...(input.body !== undefined && { body: String(input.body) }), ...(input.status !== undefined && { status: String(input.status), publishedAt: input.status === "PUBLISHED" ? new Date() : null }) } });
  if (!item) return NextResponse.json({ error: "Unsupported resource" }, { status: 400 });
  await db.auditLog.create({ data: { userId: (session.user as any).id, action: `UPDATE_${resource.toUpperCase()}` } });
  return NextResponse.json({ item });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { resource } = await params;
  if (!validResource(resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  const { id } = await request.json();
  if (!id || resource === "transactions") return NextResponse.json({ error: "This resource cannot be deleted from the admin console." }, { status: 400 });
  if (resource === "users") await db.user.delete({ where: { id } });
  if (resource === "accounts") await db.account.delete({ where: { id } });
  if (resource === "cards") await db.virtualCard.delete({ where: { id } });
  if (resource === "crypto") await db.cryptoHolding.delete({ where: { id } });
  if (resource === "news") await db.newsItem.delete({ where: { id } });
  await db.auditLog.create({ data: { userId: (session.user as any).id, action: `DELETE_${resource.toUpperCase()}` } });
  return NextResponse.json({ success: true });
}