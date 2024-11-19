import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function firstSeed() {
    const roles = ['Admin', 'Lender', 'Borrower'];
    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role },
            update: {},
            create: { name: role }
        })
    }

    const userStatuses = ['Pending verification', 'Active', 'Inactive', 'Suspended'];
    for (const status of userStatuses) {
        await prisma.userStatus.upsert({
            where: { status },
            update: {},
            create: { status }
        })
    }

    const fundingStatuses = ['Pending', 'Published', 'Expired', 'Funded'];
    for (const status of fundingStatuses) {
        await prisma.fundingStatus.upsert({
            where: { status },
            update: {},
            create: { status }
        })
    }

    const fundingActionType = ['Publish', 'Extend', 'Withdraw'];
    for (const action of fundingActionType) {
        await prisma.fundingActionType.upsert({
            where: { action },
            update: {},
            create: { action }
        })
    }

    const walletTransactionType = ['Deposit', 'Withdraw', 'Funding'];
    for (const type of walletTransactionType) {
        await prisma.walletTransactionType.upsert({
            where: { type },
            update: {},
            create: { type }
        })
    }

    const sectors = ['Pertanian', 'Perdagangan', 'Peternakan', 'Tekstil', 'Farmasi', 'Industri', 'Makanan dan Minuman'];
    for (const sector of sectors) {
        await prisma.sector.upsert({
            where: { sector },
            update: {},
            create: { sector }
        })
    }
}

export default firstSeed;