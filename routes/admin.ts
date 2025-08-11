import express from "express";
import { createTask, getAllUsers, getUser, deleteUser, updateUser } from "../functions/prismaFunctions";

//consts
const router = express.Router();

//basics
router.use(express.json());

router.delete("/delete/:id", async (req, res) => {
    const user = await (req.user) || { access: 0 };
    const  id = req.params.id;
    if (user.role === "ADMIN") {
        const user = await deleteUser(parseInt(id))
        res.json(user);
    }
    else {
        res.status(403).json({ message: "Acesso negado" });
    }
});

router.get("/get-users", async (_, res) => {
    const result = await getAllUsers();
    res.json(result);
});

export default router;