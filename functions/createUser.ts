import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createUser(name: string, access: number, key: string) {
  const user = await prisma.user.create({
    data: { name: name, access: access, key: key },
  });
  return(user);
}

export default createUser;
