import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    const user = session.user as any;

    const { recipientName, recipientBank, accountNumber, recipientAccountNumber, swiftCode, amount, currency, narration, accountId } = await req.json();

    const transferAmount = Number(amount);
    if (!transferAmount || transferAmount <= 0) {
      return NextResponse.json({ error: "Invalid transfer amount specified." }, { status: 400 });
    }

    // Fetch user and primary account
    const dbUser = await db.user.findUnique({
      where: { email: user.email },
      include: { accounts: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const account = dbUser.accounts.find((candidate) => candidate.id === accountId && candidate.status === "ACTIVE")
      || dbUser.accounts.find((candidate) => candidate.currency === (currency || "USD"))
      || dbUser.accounts[0];

    if (!account) {
      return NextResponse.json({ error: "No active bank account found for this currency." }, { status: 404 });
    }

    const currentBalance = Number(account.balance);
    const internalRecipient = typeof recipientAccountNumber === "string" && recipientAccountNumber.trim()
      ? await db.account.findUnique({
          where: { accountNumber: recipientAccountNumber.trim() },
          include: { user: { select: { id: true, name: true } } },
        })
      : null;

    if (recipientAccountNumber && !internalRecipient) {
      return NextResponse.json({ error: "CivicBank recipient account was not found." }, { status: 404 });
    }
    if (internalRecipient && (internalRecipient.userId === dbUser.id || internalRecipient.currency !== account.currency || internalRecipient.status !== "ACTIVE")) {
      return NextResponse.json({ error: "Recipient account is invalid for this transfer." }, { status: 400 });
    }

    const transferFee = transferAmount > 5000 ? 25.00 : 10.00; // Tiered wire fee
    const totalDeduction = internalRecipient ? transferAmount : transferAmount + transferFee;

    if (currentBalance < totalDeduction) {
      return NextResponse.json({ error: "Insufficient funds including transfer fees." }, { status: 400 });
    }

    const referenceNumber = `TRX-WT-${Date.now().toString().slice(-8)}`;
    const needsApproval = transferAmount >= 10000; // High value flag for admin review

    await db.$transaction(async (tx) => {
      await tx.account.update({ where: { id: account.id }, data: { balance: currentBalance - totalDeduction } });
      await tx.transaction.create({
        data: {
          userId: dbUser.id,
          accountId: account.id,
          amount: transferAmount,
          reference: referenceNumber,
          description: internalRecipient
            ? `${narration || "CivicBank transfer"} to ${internalRecipient.user.name || "CivicBank customer"} (${internalRecipient.accountNumber})`
            : `${narration || "Wire transfer"} to ${recipientName} at ${recipientBank} (${accountNumber}${swiftCode ? `, ${swiftCode}` : ""})`,
          type: internalRecipient ? "TRANSFER_OUT" : "TRANSFER",
          status: needsApproval ? "PENDING" : "COMPLETED",
        },
      });

      if (internalRecipient && !needsApproval) {
        await tx.account.update({ where: { id: internalRecipient.id }, data: { balance: { increment: transferAmount } } });
        await tx.transaction.create({
          data: {
            userId: internalRecipient.userId,
            accountId: internalRecipient.id,
            amount: transferAmount,
            reference: `${referenceNumber}-IN`,
            description: `CivicBank transfer from ${dbUser.name || "CivicBank customer"}`,
            type: "TRANSFER_IN",
            status: "COMPLETED",
          },
        });
        await tx.notification.create({
          data: {
            userId: internalRecipient.userId,
            title: "Funds received",
            message: `${account.currency} ${transferAmount.toLocaleString()} was received in your account. Ref: ${referenceNumber}`,
          },
        });
      }

      await tx.notification.create({
        data: {
          userId: dbUser.id,
          title: internalRecipient ? "Transfer completed" : needsApproval ? "Wire transfer under review" : "Wire transfer completed",
          message: `Your ${account.currency} ${transferAmount.toLocaleString()} transfer has been ${needsApproval ? "submitted for review" : "completed"}. Ref: ${referenceNumber}`,
        },
      });
      await tx.auditLog.create({ data: { userId: dbUser.id, action: internalRecipient ? "PLATFORM_TRANSFER" : "INITIATE_WIRE_TRANSFER" } });
    });

    return NextResponse.json({ 
      success: true, 
      reference: referenceNumber,
      status: needsApproval ? "PENDING" : "COMPLETED"
    });
  } catch (error) {
    console.error("Transfer execution error:", error);
    return NextResponse.json({ error: "Internal server error during transaction processing." }, { status: 500 });
  }
}