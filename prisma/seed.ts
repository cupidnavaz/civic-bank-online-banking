import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
	console.log("No seed records configured for the current schema.");
}

main().finally(() => db.$disconnect());