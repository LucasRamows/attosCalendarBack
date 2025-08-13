import { PrismaClient, Role } from "@prisma/client";

import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "null";

const prisma = new PrismaClient();

async function createUser(
  name: string,
  access: number,
  key: string,
  email: string,
  role?: string
) {
  const user = await prisma.user.create({
    data: {
      name: name,
      access: access,
      key: key,
      email: email,
      role: role === "ADMIN" ? Role.ADMIN : Role.USER,
    },
  });
  return user;
}

async function loginUser(access: number, key: string) {
  const user = await prisma.user.findUnique({
    where: { access: access },
  });

  const log =
    user && user.key === key
      ? {
          token: jwt.sign(
            { access: access, role: user.role, id: user.id },
            SECRET_KEY
          ),
        }
      : {};

  return log;
}

// Exemplo de como a função createTask deveria ser
async function createTask(
  name: string,
  date: string,
  description: string,
  userId: string
) {
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
  const user = await prisma.user.findUnique({ where: { access: access } });
  return user;
}

async function getTask(id: number) {
  const task = await prisma.task.findUnique({ where: { id: id} });
  return task;
}
async function getTasks(id: string) {
  const tasks = await prisma.task.findMany({ where: { userId: id, status:false } });
  return tasks;
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

async function updateUser(
  access: number,
  name?: string,
  key?: string,
  email?: string,
  task?: string
) {
  try {
    const users = await prisma.user.update({
      where: { access: access },
      data: {
        name: name ? name : undefined,
        key: key ? key : undefined,
        email: email ? email : undefined,
        task: task ? { connect: { id: parseInt(task) } } : undefined,
      },
    });
    return "Atualização realizada com sucesso";
  } catch (error) {
    console.error("Erro ao atualizar usuários:", error);
    throw error;
  }
}

async function updateTask(
  id: number,
  status: boolean,
  isPriority: boolean,
  name?: string,
  description?: string,
  date?: string,
) {
  try {
    const tasks = await prisma.task.update({
      where: { id: id },
      data: {
        status: status,
        isPrioriry: isPriority,
        name: name ? name : undefined,
        description: description ? description : undefined,
        date: date ? date : undefined,
      },
    });
    return tasks;
  } catch (error) {
    console.error("Erro ao atualizar tarefas:", error);
    throw error;
  }
}

async function deleteUser(access: number) {
  const user = await prisma.user.delete({ where: { access: access } });

  return user;
}

async function deleteTask(id: number) {
  const task = await prisma.task.delete({ where: { id: id } });

  return task;
}
export {
  createUser,
  getUser,
  getAllUsers,
  deleteUser,
  createTask,
  updateUser,
  loginUser,
  updateTask,
  getTask,
  getTasks,
  deleteTask,
};
