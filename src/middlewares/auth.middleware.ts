import { Request, Response, NextFunction } from "express";
import { User } from "../custom";
import { verify } from "jsonwebtoken";
import { SECRET_KEY } from "../utils/envConfig";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.header('Authorization')?.replace("Bearer ", "");

        if (!token) throw new Error("Unauthorized");

        const decoded = verify(token, SECRET_KEY as string) as User;

        if (!decoded) throw new Error("Unauthorized");

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { borrower: true, lender: true }
        });

        if (!user) throw new Error("Unauthorized");

        req.user = {
            id: user.id,
            email: user.email,
            role: decoded.role,
            borrower: user.borrower || null,
            lender: user.lender || null
        };

        next();
    } catch (error) {
        next(error);
    }
}

async function BorrowerGuard(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.user?.role !== "Borrower") throw new Error("Unauthorized: Only borrowers can access this route");
        next();
    } catch (error) {
        next(error);
    }
}

async function AdminGuard(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.user?.role !== "Admin") throw new Error("Unauthorized: Only Admin can access this route");

        next();
    } catch (error) {
        next(error);
    }
}

async function LenderGuard(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.user?.role !== "Lender") throw new Error("Unauthorized: Only Lenders can access this route");

        next();
    } catch (error) {
        next(error);
    }
}

export { verifyToken, AdminGuard, BorrowerGuard, LenderGuard };