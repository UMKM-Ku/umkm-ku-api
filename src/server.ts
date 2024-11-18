import express, { Application } from "express";
import { PORT as port } from "./utils/envConfig";
import authRouter from "./routes/auth.route";
import borrowerRouter from "./routes/borrower.route";
import ErrorMiddleware from "./middlewares/error.middleware";
import firstSeed from "./utils/firstSeed";
import { cleanupUploadedFiles } from "./middlewares/cleanupUploadedFiles";

const PORT = Number(port) || 8083;

const app: Application = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use('/borrower', borrowerRouter);

app.use(cleanupUploadedFiles);

app.use(ErrorMiddleware);

const startServer = async () => {
    try {
        await firstSeed();
        app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

startServer();