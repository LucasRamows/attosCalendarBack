import express from "express";
import {
  createTask,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  updateTask,
  getTask,
  getTasks,
  deleteTask,
} from "../functions/prismaFunctions";

//consts
const router = express.Router();

//basics
router.use(express.json());

//routes
router.post("/create-task", async (req, res) => {
  let { name, date, description } = req.body;
  const userId = req.user?.id;
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

router.get("/get-tasks", async (req, res) => {
  const id = req.user?.id as string;
  const task = await getTasks(id);
  res.json(task);
});

router.put("/update-user/:access", async (req, res) => {
  const access = parseInt(req.params.access as string, 10);
  const { name, email, key, isPrioriry } = req.body;
  const user = updateUser(
    access,
    name ? name : undefined,
    key ? key : undefined,
    email ? email : undefined
  );
  res.json(user);
});

router.put("/update-task/:id", async (req, res) => {
  const taskId = parseInt(req.params.id as string, 10);
  console.log(taskId);
  const { name, description, date, isPriority, status } = req.body;
  const taskOwner = await getTask(taskId).then((task) => {
    if (task?.userId !== req.user?.id) {
      console.log(req.user?.id,"-----" , task?.userId);

      console.log("user not the one");
      return false;
    } else {
      return true;
    }
  });

  if (!taskOwner) {
    return res.status(403).json({ message: "Acesso negado" });
  } else {
    const task = await updateTask(
      taskId,
      status,
      isPriority,
      name ? name : undefined,
      description ? description : undefined,
      date ? date : undefined,
    );

    res.json(task);
  }
});

router.delete("/delete-task/:id", async (req, res) => {
  const taskId = parseInt(req.params.id as string, 10);
  const taskOwner = await getTask(taskId).then((task) => {
    if (task?.userId !== req.user?.id) {
      return false;
    } else {
      return true;
    }
  });

  if (!taskOwner) {
    return res.status(403).json({ message: "Acesso negado" });
  } else {
    const task = await deleteTask(taskId);

    res.json(task);
  }
});
router.delete("/self-delete/:id", async (req, res) => {
  const access = (await req.user) || { access: 0 };

  try {
    const user = await deleteUser(parseInt(access.access));
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar usuário" });
  }
});

export default router;
