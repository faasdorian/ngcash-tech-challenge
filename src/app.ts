import express from "express";
import authRoutes from "./routes/auth";
import accountRoutes from "./routes/account";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/account", accountRoutes);

app.listen(3000);
