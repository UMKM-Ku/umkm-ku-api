import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function depositWallet(req: Request, res: Response, next: NextFunction) {
    try {
        const lenderId = req.user?.lender?.id;
        const { amount } = req.body;

        if (!lenderId) throw new Error("Lender not found");
        if (!amount || amount < 0) throw new Error("Invalid deposit amount");

        const wallet = await prisma.wallet.findUnique({
            where: { lenderId },
        })
        if (!wallet) throw new Error("Lender wallet not found");

        const updateWallet = await prisma.wallet.update({
            where: { id: wallet.id },
            data: { balance: { increment: amount } },
        });

        await prisma.walletTransaction.create({
            data: {
                walletId: wallet.id,
                typeId: 1,
                amount,
            }
        })

        res.status(200).json({
            message: "Deposit successful",
            wallet: updateWallet,
        });
    } catch (error) {
        next(error);
    }
}

async function getPublishedFundingRequests(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const skip = (page - 1) * pageSize;

        const fundingRequests = await prisma.fundingRequest.findMany({
            where: { status: 2 },
            skip,
            take: pageSize,
            orderBy: { createdAt: "desc" },
        });

        const totalRequests = await prisma.fundingRequest.count({
            where: { status: 2 },
        });

        res.status(200).json({
            message: "Published funding requests",
            fundingRequests,
            pagination: {
                total: totalRequests,
                page,
                pageSize,
                totalPages: Math.ceil(totalRequests / pageSize),
            }
        });
    } catch (error) {
        next(error);
    }
}

async function getFundingRequestDetails(req: Request, res: Response, next: NextFunction) {
    try {
        const fundingRequestId = parseInt(req.params.id);
        const fundingRequest = await prisma.fundingRequest.findUnique({
            where: { id: fundingRequestId },
            include: {
                sector: true,
                borrower: true,
            }
        });

        if (!fundingRequest || fundingRequest.status !== 2) throw new Error("Funding request not found");

        res.status(200).json({
            message: "Funding request details fetched successfully",
            fundingRequest,
        })
    } catch (error) {
        next(error);
    }
}

async function createFundingTransaction(req: Request, res: Response, next: NextFunction) {
    try {
        const lenderId = req.user?.lender?.id;
        const { fundingRequestId, amount } = req.body;

        if (!lenderId) throw new Error("Lender not found");
        if (!amount || amount <= 0) throw new Error("Invalid amount");

        const fundingRequest = await prisma.fundingRequest.findUnique({
            where: { id: fundingRequestId },
        })

        if (!fundingRequest || fundingRequest.status !== 2) throw new Error("Funding request not found");

        const wallet = await prisma.wallet.findUnique({
            where: { lenderId },
        })

        if (!wallet || wallet.balance < amount) throw new Error("Insufficient balance");

        const transaction = await prisma.transaction.create({
            data: {
                fundingRequestId,
                lenderId,
                totalFundRaised: amount,
            }
        })

        await prisma.transactionDetail.create({
            data: {
                transactionId: transaction.id,
                lenderId,
                amount,
            }
        })

        await prisma.wallet.update({
            where: { id: wallet.id },
            data: { balance: { decrement: amount } },
        });

        await prisma.walletTransaction.create({
            data: {
                walletId: wallet.id,
                typeId: 3,
                amount,
            }
        })

        const updatedFundingRequest = await prisma.fundingRequest.update({
            where: { id: fundingRequestId },
            data: {
                fundsRaised: { increment: amount },
                isFullyFunded: fundingRequest.fundsRaised + amount >= fundingRequest.totalFund,
                status: fundingRequest.fundsRaised + amount >= fundingRequest.totalFund ? 4 : 2,
            },
        })

        res.status(201).json({
            message: "Funding transaction created successfully",
            transaction,
            updatedFundingRequest,
        });
    } catch (error) {
        next(error);
    }
}

async function filterFundingRequests(req: Request, res: Response, next: NextFunction) {
    try {
        const { returnRate, sectorId, totalFund, page = 1, pageSize = 10 } = req.query;

        const filters: any = { status: 2 };

        if (returnRate) {
            filters.returnRate = parseFloat(returnRate as string);
        }
        if (sectorId) {
            filters.sectorId = parseInt(sectorId as string);
        }
        if (totalFund) {
            filters.totalFund = parseInt(totalFund as string);
        }

        const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);

        const fundingRequests = await prisma.fundingRequest.findMany({
            where: filters,
            skip,
            take: parseInt(pageSize as string),
            orderBy: { createdAt: "desc" },
        });

        const totalRequests = await prisma.fundingRequest.count({
            where: filters,
        });

        res.status(200).json({
            message: "Filtered funding requests fetched successfully",
            fundingRequests,
            pagination: {
                total: totalRequests,
                page: parseInt(pageSize as string),
                pageSize: parseInt(pageSize as string),
                totalPages: Math.ceil(totalRequests / parseInt(pageSize as string)),
            }
        });
    } catch (error) {
        next(error);
    }
}

export { depositWallet, getPublishedFundingRequests, getFundingRequestDetails, createFundingTransaction, filterFundingRequests }