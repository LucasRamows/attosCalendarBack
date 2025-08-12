import express from "express";
import { createTask, getAllUsers, getUser, deleteUser, updateUser } from "../functions/prismaFunctions";
import { stringify } from "querystring";

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

router.get("/get-users", async (req, res) => {
    const token = req.user;
    if (token?.role === "ADMIN"){
        const result = await getAllUsers();
        res.json(result);
    }else{
        res.json("Acesso não permitido");

    }
    
});

export default router;