import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) return null;

  return db.user.findUnique({ where: { email }, select: { id: true } });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const deleted = await db.beneficiary.deleteMany({
      where: { id, userId: user.id },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Beneficiary not found." }, { status: 404 });
    }

    await db.auditLog.create({
      data: { userId: user.id, action: "DELETE_BENEFICIARY" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Beneficiary deletion error:", error);
    return NextResponse.json({ error: "Unable to delete beneficiary." }, { status: 500 });
  }
}