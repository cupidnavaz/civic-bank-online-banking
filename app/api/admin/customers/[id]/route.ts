import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Fetch single customer details with associated accounts and investments
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    const { id: customerId } = await params;

    const customer = await db.user.findUnique({
      where: { id: customerId },
      include: {
        accounts: true,
        virtualCards: { select: { id: true, cardHolder: true, cardNumber: true, balance: true, status: true, expiryDate: true } },
        cryptoHoldings: { select: { id: true, asset: true, quantity: true, averagePrice: true } },
        transactions: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Exclude password hash from response data
    const { password, ...customerData } = customer;

    return NextResponse.json({ success: true, data: customerData });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch customer details" },
      { status: 500 }
    );
  }
}

// PATCH: Update customer status or profile details (e.g., suspending an account)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    const { id: customerId } = await params;
    const { name, email } = await req.json();

    const updatedCustomer = await db.user.update({
      where: { id: customerId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    });

    // Log the administrative action
    await db.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "UPDATE_CUSTOMER_PROFILE",
      },
    });

    const { password, ...customerData } = updatedCustomer;

    return NextResponse.json({
      success: true,
      message: "Customer updated successfully",
      data: customerData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update customer" },
      { status: 400 }
    );
  }
}