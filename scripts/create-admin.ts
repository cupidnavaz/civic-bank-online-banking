import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const db = new PrismaClient();

async function main() {
  const [, , emailArg, passwordArg, firstNameArg = "Civic", lastNameArg = "Administrator"] = process.argv;
  const email = emailArg?.trim().toLowerCase();
  const password = passwordArg;

  if (!email || !password || password.length < 8) {
    throw new Error("Usage: npm run admin:create -- email password [firstName] [lastName] (password must be at least 8 characters)");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await db.user.findUnique({ where: { email } });
  const user = existing
    ? await db.user.update({ where: { email }, data: { role: "ADMIN", password: passwordHash, firstName: firstNameArg, lastName: lastNameArg, name: `${firstNameArg} ${lastNameArg}` } })
    : await db.user.create({ data: { email, password: passwordHash, role: "ADMIN", firstName: firstNameArg, lastName: lastNameArg, name: `${firstNameArg} ${lastNameArg}` } });

  console.log(`Admin account ready: ${user.email}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}).finally(() => db.$disconnect());