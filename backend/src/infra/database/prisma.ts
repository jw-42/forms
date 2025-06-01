import { PrismaClient } from '@prisma/client'
let prisma: PrismaClient | null = null;

process.on("SIGINT", async () => {
  console.log("Disconnect to Prisma by SIGINT");
  if (prisma) {
    await prisma.$disconnect();
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Disconnect to Prisma by SIGTERM");
  if (prisma) {
    await prisma.$disconnect();
  }
  process.exit(0);
});

process.on("uncaughtException", async (err) => {
  console.log("Disconnect to Prisma by uncaughtException");
  if (prisma) {
    await prisma.$disconnect();
  }
  process.exit(1);
});

export default function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}