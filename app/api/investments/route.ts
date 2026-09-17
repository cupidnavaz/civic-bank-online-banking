import { NextResponse } from "next/server";

export async function GET() {
	return NextResponse.json(
		{ error: "Investment plans are not available in the current database schema." },
		{ status: 501 }
	);
}