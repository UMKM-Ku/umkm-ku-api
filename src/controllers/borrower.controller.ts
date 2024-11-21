import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function createFundingRequest(req: Request, res: Response, next: NextFunction) {
    try {
        const { title, description, totalFund, tenor, returnRate, sectorId } = req.body;

        const borrowerId = req.user?.borrower?.id;
        if (!borrowerId) throw new Error("Borrower not found");

        if (!req.file) throw new Error("Image is required");
        const imageUrl = (req.file as any).path

        const newFundingRequest = await prisma.fundingRequest.create({
            data: {
                title,
                description,
                image: imageUrl,
                totalFund: parseInt(totalFund),
                tenor: parseInt(tenor),
                returnRate: parseFloat(returnRate),
                sectorId: parseInt(sectorId),
                borrowerId,
                status: 2,
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
        const fundingRequestId = parseInt(req.params.id);
        const borrowerId = req.user?.borrower?.id;

        if (!borrowerId) throw new Error("Borrower not found");

        const fundingRequest = await prisma.fundingRequest.findFirst({
            where: { id: fundingRequestId, borrowerId },
        });

        if (!fundingRequest) throw new Error("Funding Request not found");

        const { title, description, totalFund, tenor, returnRate, sectorId } = req.body;

        let updatedData: {
            title?: string;
            description?: string;
            totalFund?: number;
            tenor?: number;
            returnRate?: number;
            sectorId?: number;
            image?: string;
        } = {
            title,
            description,
            totalFund: totalFund ? parseInt(totalFund) : undefined,
            tenor: tenor ? parseInt(tenor) : undefined,
            returnRate: returnRate ? parseFloat(returnRate) : undefined,
            sectorId: sectorId ? parseInt(sectorId) : undefined,
        }

        updatedData = Object.fromEntries(
            Object.entries(updatedData).filter(([_, value]) => value !== undefined)
        );


        if (req.file) {
            updatedData.image = req.file.path;
        }

        const updatedFundingRequest = await prisma.fundingRequest.update({
            where: { id: fundingRequestId },
            data: updatedData,
        });

        res.status(200).json({
            message: "Funding request updated successfully",
            fundingRequest: updatedFundingRequest,
        });
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
                actionTypeId: 2,
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

async function getAllFundingRequest(req: Request, res: Response, next: NextFunction) {
    try {
        const borrowerId = req.user?.borrower?.id;
        if (!borrowerId) throw new Error("Borrower not found");

        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const skip = (page - 1) * pageSize;

        const fundingRequest = await prisma.fundingRequest.findMany({
            where: { borrowerId },
            skip,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
        });

        const totalFundingRequest = await prisma.fundingRequest.count({ where: { borrowerId } });

        res.status(200).json({
            message: "Funding request retrieved successfully",
            fundingRequest,
            pagination: {
                total: totalFundingRequest,
                page,
                pageSize,
                totalPages: Math.ceil(totalFundingRequest / pageSize),
            }
        })
    } catch (error) {
        next(error);
    }
}

async function getFundingRequestById(req: Request, res: Response, next: NextFunction) {
    try {
        const borrowerId = req?.user?.borrower?.id;
        const fundingRequestId = parseInt(req.params.id);

        if (!borrowerId) throw new Error("Borrower not found");

        const fundingRequest = await prisma.fundingRequest.findFirst({
            where: { id: fundingRequestId, borrowerId },
            include: { sector: true },
        });

        if (!fundingRequest) throw new Error("Funding Request not found");

        res.status(200).json({
            message: "Funding request retrieved successfully",
            fundingRequest,
        });
    } catch (error) {
        next(error);
    }
}

async function getReview(req: Request, res: Response, next: NextFunction) {
    const { borrowerId } = req.params
    try {
        const reviews = await prisma.review.findMany({
            where: { borrowerId: parseInt(borrowerId) },
            include: { lender: true },
        });

        res.status(200).json({
            message: "Reviews fetched successfully",
            reviews,
        });
    } catch (error) {
        next(error);
    }
}

export { createFundingRequest, editFundingRequest, requestExtend, getAllFundingRequest, getFundingRequestById, getReview };
