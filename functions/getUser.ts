import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient;

async function getUser (access:number) {
    const user = await prisma.user.findUnique({where:{access:access}})
    return(user)
}

export default getUser;