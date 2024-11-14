import express, { Application } from "express";
import { PORT as port } from "./utils/envConfig";
import authRouter from "./routes/auth.route";
import ErrorMiddleware from "./middlewares/error.middleware";

const PORT = Number(port) || 8083;

const app: Application = express();

app.use(express.json());

app.use("/auth", authRouter);

app.use(ErrorMiddleware);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));