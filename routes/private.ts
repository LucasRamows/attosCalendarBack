import express from "express";
import { createTask, getAllUsers, getUser, deleteUser, updateUser, updateTask, getTask } from "../functions/prismaFunctions";

//consts
const router = express.Router();

//basics
router.use(express.json());

//routes
router.post("/create-task", async (req, res) => {
    let { name, userId, date, description } = req.body;
    date = new Date(date);
    const task = await createTask(name, date, description, userId);
    res.json(task);
});

router.get("/get-user", async (req, res) => {
    const access = parseInt(req.query.access as string, 10);
    const user = await getUser(access);
    res.json(user);
});

router.get("/get-task", async (req, res) => {
    const id = parseInt(req.query.id as string, 10);
    const task = await getTask(id);
    res.json(task);
});


router.put("/update-user/:access", async (req, res) => {
    const access = parseInt(req.params.access as string, 10);
    const { name, email, key, isPrioriry } = req.body;
    const user = updateUser(access,
        name ? name : undefined,
        key ? key : undefined,
        email ? email : undefined,
    );
    res.json(user);
});

router.put("/update-task/:id", async (req, res) => {
    const taskId = parseInt(req.params.id as string, 10);
    const { name, description, date, isPriority, status } = req.body;
    const taskOwner = await getTask(taskId).then(task => {
        if (task?.userId !== req.user?.id) {
            return false;
        } else {
            return true;
        }
    });

    if (!taskOwner) {
        return res.status(403).json({ message: "Acesso negado" });
    } else {
        const task = await updateTask(taskId,
            name ? name : undefined,
            description ? description : undefined,
            date ? date : undefined,
            isPriority ? isPriority : undefined,
            status ? status : undefined);

        res.json(task);

    }


});


router.delete("/self-delete/:id", async (req, res) => {
    const access = await (req.user) || { access: 0 };

    try {
        const user = await deleteUser(parseInt(access.access))
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar usuário" });
    }
});

export default router;