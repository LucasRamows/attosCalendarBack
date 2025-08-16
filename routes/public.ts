import express from "express";
import { createUser, getAllUsers, getUser, deleteUser, createTask, updateUser, loginUser } from "../functions/prismaFunctions";

//consts
const router = express.Router();

//basics
router.use(express.json());

//routes
router.post("/create-user", async (req, res) => {
  const { name, access, key, email, phone, role } = req.body;
  const user = await createUser(name, access, key, email, phone, role);
  res.json(user);
});

router.post("/login-user", async (req, res) => {
  console.log("login")
  const { access, key} = req.body;
  const user = await loginUser( access, key);
  res.json(user);
});


export default router;