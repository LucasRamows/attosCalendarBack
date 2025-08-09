import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient;

async function deleteUser(access:number){
    const user = await prisma.user.delete({where:{access:access}})
    
    return(user)
}

export default deleteUser;