import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Webhook configuration is not available in the current database schema." },
      { status: 501 }
    );
  } catch (error) {
    console.error("Webhook registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}