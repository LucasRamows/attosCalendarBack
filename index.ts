//imports
import express from "express";
import {createUser, getAllUsers, getUser, deleteUser, createTask, updateUser} from "./functions/prismaFunctions";

import { PrismaClient } from "@prisma/client";

//consts
const prisma = new PrismaClient();
const app = express();

//basics
app.use(express.json());

//routes
app.post("/create-user", async (req, res) => {
  const { name, access, key, email } = req.body;
  const user = await createUser(name, access, key, email);
  res.json(user);
});

app.post("/create-task", async (req, res) => {
  let { name, userId, date, description } = req.body;
  date = new Date(date);
  const task = await createTask(name, date, description, userId);
  res.json(task);
});

app.get("/get-users", async (_, res) => {
  const result = await getAllUsers();
  res.json(result);
});

app.get("/get-user", async (req, res) => {
  const access = parseInt(req.query.access as string, 10);
  const user = await getUser(access);
  res.json(user);
});

app.put("/update-user/:access", async (req, res) => {
  const access = parseInt(req.params.access as string, 10);
  const {name, email, key} = req.body;
  const user = updateUser(access,
    name ? name : undefined,
    key ? key : undefined,
    email ? email : undefined
  );
  res.json(user);
});

app.delete("/delete/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await deleteUser(id);
  res.json(user);
});

//output
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
