import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    // Strict Admin Role Enforcement
    if (!session || userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Investment payment approval is not available in the current database schema." },
      { status: 501 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process payment approval" },
      { status: 400 }
    );
  }
}