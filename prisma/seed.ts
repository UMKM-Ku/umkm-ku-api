import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.role.createMany({
        data: [
            { name: 'Lender' },
            { name: 'Borrower' },
        ],
        skipDuplicates: true
    });

    await prisma.userStatus.createMany({
        data: [
            { status: 'Pending verification' },
            { status: 'Active' },
            { status: 'Inactive' },
            { status: 'Suspended' },
        ],
        skipDuplicates: true
    });
}

main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});