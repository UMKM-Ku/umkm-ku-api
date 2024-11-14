import { Request, Response, NextFunction } from "express";
import { User } from "../custom";
import { verify } from "jsonwebtoken";
import { SECRET_KEY } from "../utils/envConfig";

async function verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.header('Authorization')?.replace("Bearer ", "");

        if (!token) throw new Error("Unathorized");

        const user = verify(token, SECRET_KEY as string);

        if (!user) throw new Error("Unathorized");

        req.user = user as User;

        next();
    } catch (error) {
        next(error);
    }
}

export { verifyToken };