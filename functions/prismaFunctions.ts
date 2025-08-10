import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createUser(name: string, access: number, key: string, email: string) {
  const user = await prisma.user.create({
    data: { name: name, access: access, key: key, email: email },
  });
  return (user);
}

// Exemplo de como a função createTask deveria ser
async function createTask(name: string, date: Date, description: string, userId: string) {
  const task = await prisma.task.create({
    data: {
      name: name,
      date: date,
      description: description,
      status: false, // status pode ter um valor padrão como false
      userId: userId, // Passe o id do usuário aqui
    },
  });
  return task;
}

async function getUser(access: number) {
  const user = await prisma.user.findUnique({ where: { access: access } })
  return (user)
}


async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({ include: { task: true } });
    return users;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
}

async function updateUser(access: number, name?: string, key?: string, email?: string) {
  try {
    const users = await prisma.user.update({
      where: { access: access },
      data: {
        name: name ? name : undefined,
        key: key ? key : undefined,
      }
    });
    return users;
  } catch (error) {
    console.error("Erro ao atualizar usuários:", error);
    throw error;
  }
}

async function deleteUser(access: number) {
  const user = await prisma.user.delete({ where: { access: access } })

  return (user)
}
export { createUser, getUser, getAllUsers, deleteUser, createTask, updateUser };
