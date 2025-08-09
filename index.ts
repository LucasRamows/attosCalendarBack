//imports
import express from "express";
import createUser from "./functions/createUser";
import getAllUsers from "./functions/getAllUsers";
import { PrismaClient } from "@prisma/client";
import getUser from "./functions/getUser";
import deleteUser from "./functions/deleteUser";

//consts
const prisma = new PrismaClient();
const app = express();

//basics
app.use(express.json());

//routes
app.post("/create-user", async (req, res) => {
  const { name, access, key } = req.body;
  const user = await createUser(name, access, key);
  res.json(user);
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

app.delete("/delete/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await deleteUser(id);

  res.json(user);
});

//output
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
