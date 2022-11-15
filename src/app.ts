import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

app.listen(3000);
