import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function createFundingRequest(req: Request, res: Response, next: NextFunction) {
    try {
        const { title, description, totalFund, tenor, returRate, sectorId } = req.body;
        const roleBorrower = req.user?.role === "Borrower";

        if (!roleBorrower) throw new Error("Unathorized: Only borrowers can create funding requests");
        if (!req.file) throw new Error("Image is required");

        const borrowerId = req.user?.borrower?.id;
        if (!borrowerId) throw new Error("Borrower not found");

        const newFundingRequest = await prisma.fundingRequest.create({
            data: {
                title,
                description,
                image: req.file?.path,
                totalFund: parseInt(totalFund),
                tenor: parseInt(tenor),
                returnRate: parseFloat(returRate),
                sectorId: parseInt(sectorId),
                borrowerId: borrowerId,
                status: 1,
                fundingExpired: new Date(new Date().setDate(new Date().getDate() + 7)),
            },
        });

        res.status(201).json({
            message: "Funding request created successfully",
            FundingRequest: newFundingRequest,
        })
    } catch (error) {
        next(error);
    }
}

async function editFundingRequest(req: Request, res: Response, next: NextFunction) {
    try {
        const { id, title, description, totalFund, tenor, returnRate, sectorId } = req.body;
        const fundingRequest = await prisma.fundingRequest.findUnique({ where: { id } });

        if (!fundingRequest) throw new Error("Funding Request not found");
        if (fundingRequest.borrowerId !== req.user?.borrower?.id) throw new Error("Unauthorized: You are not the owner of this funding request");

        if (req.file && fundingRequest.image) {
            fs.unlinkSync(fundingRequest.image);
        }

        const updateFundingRequest = await prisma.fundingRequest.update({
            where: { id },
            data: {
                title,
                description,
                image: req.file?.path || fundingRequest.image,
                totalFund: totalFund ? parseInt(totalFund) : fundingRequest.totalFund,
                tenor: tenor ? parseInt(tenor) : fundingRequest.tenor,
                returnRate: returnRate ? parseFloat(returnRate) : fundingRequest.returnRate,
                sectorId: sectorId ? parseInt(sectorId) : fundingRequest.sectorId,
            }
        })

        res.status(200).json({
            message: "Funding request updated successfully",
            FundingRequest: updateFundingRequest,
        })
    } catch (error) {
        next(error);
    }
}

async function requestExtend(req: Request, res: Response, next: NextFunction) {
    try {
        const { fundingRequestId } = req.body;
        const fundingRequest = await prisma.fundingRequest.findUnique({ where: { id: fundingRequestId } });

        if (!fundingRequest) throw new Error("Funding Request not found");
        if (fundingRequest.borrowerId !== req.user?.borrower?.id) throw new Error("Unauthorized: You are not the owner of this funding request");
        if (fundingRequest.status !== 3) throw new Error("Funding request must be expired to request an extension.");

        const extendAction = await prisma.fundingAction.create({
            data: {
                fundingRequestId,
                typeId: 2,
                actionBy: req.user?.borrower?.id,
            }
        });
        res.status(201).json({
            message: "Funding request extension requested successfully",
            FundingAction: extendAction,
        })
    } catch (error) {
        next(error);
    }
}

export { createFundingRequest, editFundingRequest, requestExtend };
