import express, { Application } from "express";
import { BASE_WEB_URL, PORT as port } from "./utils/envConfig";
import authRouter from "./routes/auth.route";
import borrowerRouter from "./routes/borrower.route";
import lenderRouter from "./routes/lender.route";
import ErrorMiddleware from "./middlewares/error.middleware";
import firstSeed from "./utils/firstSeed";
import { cleanupUploadedFiles } from "./middlewares/cleanupUploadedFiles";
import cors from "cors";

const PORT = Number(port) || 8083;

const app: Application = express();

app.use(
    cors({
        origin: BASE_WEB_URL || 'http://localhost:3000',
        credentials: true,
    })
);

app.use(express.json());


app.use("/auth", authRouter);
app.use('/borrower', borrowerRouter);
app.use('/lender', lenderRouter);

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