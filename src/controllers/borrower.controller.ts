import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function FundingRequest(req: Request, res: Response, next: NextFunction) {
    try {
        const { title, description, totalFund, tenor, returRate, sectorId } = req.body;
        const borrowerId = req.user?.borrower?.id;
    } catch (error) {
        next(error);
    }
}