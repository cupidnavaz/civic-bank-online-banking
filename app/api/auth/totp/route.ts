import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import * as OTPAuth from "otpauth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { token, secret } = await req.json();
    const user = session.user as any;

    const totp = new OTPAuth.TOTP({
      issuer: "InstitutionalCore",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: secret, // Base32 secret stored per user in DB
    });

    const delta = totp.validate({ token, window: 1 });

    if (delta === null) {
      return NextResponse.json({ error: "Invalid authenticator code" }, { status: 400 });
    }

    await db.user.update({
      where: { email: user.email },
      data: { twoFactorEnabled: true } as any,
    }).catch(() => null);

    return NextResponse.json({ success: true, message: "2FA verified and enabled successfully" });
  } catch (error) {
    console.error("TOTP verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}