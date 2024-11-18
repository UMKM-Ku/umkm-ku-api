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
}

export default firstSeed;