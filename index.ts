//imports
import express from "express";
import publicRoutes from "./routes/public";
import privateRoutes from "./routes/private";
import adminRoutes from "./routes/admin";
import auth from "./middleware/auth";
//import jwt from "jsonwebtoken";

//consts
const app = express();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

//basics
app.use(express.json());
app.use("/", publicRoutes);
app.use("/", auth, privateRoutes);
app.use("/", auth, adminRoutes);


//output
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
