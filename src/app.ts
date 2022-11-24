import express from "express";
import authRoutes from "./routes/auth";
import accountRoutes from "./routes/account";
import notFound from "./routes/notFound";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/account", accountRoutes);
app.use(notFound);

app.listen(8080);
