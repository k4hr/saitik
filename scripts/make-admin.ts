import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.MAKE_ADMIN_EMAIL?.trim().toLowerCase();

  if (!email) {
    throw new Error("MAKE_ADMIN_EMAIL is not set");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      login: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error(`User with email ${email} not found`);
  }

  const updated = await prisma.user.update({
    where: { email },
    data: {
      role: UserRole.ADMIN,
    },
    select: {
      id: true,
      email: true,
      login: true,
      role: true,
    },
  });

  console.log("User promoted to admin:", updated);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
