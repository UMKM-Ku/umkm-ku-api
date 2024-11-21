import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { compare, genSalt, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '../utils/envConfig';

const prisma = new PrismaClient();

async function RegisterUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, password, phoneNumber, role } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) throw new Error("Email is already in use");
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        const roleId = await prisma.role.findUnique({
            where: { name: role.toLowerCase() },
        });
        if (!roleId) throw new Error('Role not found');

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phoneNumber,
                roleId: roleId.id,
                statusId: 2,
            },
        })

        res.status(201).json({
            message: 'User registered successfully',
            data: newUser,
        });

    } catch (error) {
        next(error);
    }
}

async function RegisterLenderDetails(req: Request, res: Response, next: NextFunction) {
    try {
        const { address, identityNumber, accountNumber, birthDate } = req.body;

        if (!req.user?.id) throw new Error('User not found');
        if (!req.file) throw new Error('Identity card is required');
        const identityCardUrl = (req.file as any).path

        const newLender = await prisma.lender.create({
            data: {
                userId: req.user.id,
                identityNumber,
                identityCard: identityCardUrl,
                accountNumber,
                address,
                birthDate: new Date(birthDate),
            },
        })

        if (newLender) {
            await prisma.wallet.create({
                data: {
                    lenderId: newLender.id,
                    balance: 0,
                },
            });
        }

        res.status(201).json({
            message: 'Lender Details registered successfully',
            data: newLender,
        });

    } catch (error) {
        next(error);
    }
}

async function RegisterBorrowerDetails(req: Request, res: Response, next: NextFunction) {
    try {

        const { address, identityNumber, accountNumber, npwp, isInstitution } = req.body;

        if (!req.user?.id) throw new Error("User not found");
        if (!req.file) throw new Error("Identity card is required");
        const identityCardUrl = (req.file as any).path

        // interface BorrowerDetails {
        //     userId: number;
        //     address: string;
        //     identityNumber: string;
        //     identityCard: string;
        //     accountNumber: string;
        //     npwp: string;
        //     isInstitution: boolean;
        //     documents?: { create: { type: string; filePath: string }[] };
        // }

        const borrowerDetails = {
            userId: req.user.id,
            address,
            identityNumber,
            identityCard: identityCardUrl,
            accountNumber,
            npwp,
            isInstitution: isInstitution === "true",
        };

        // await prisma.$transaction(async (tx) => {
        //     const borrower = await tx.borrower.create({
        //         data: borrowerDetails,
        //     });

        //     if (borrowerDetails.isInstitution) {
        //         const documentFiles = req.files as { [fieldname: string]: Express.Multer.File[] };
        //         if (!documentFiles.documents || documentFiles.documents.length !== 3) {
        //             throw new Error("Institution borrower must have 3 documents");
        //         }

        //         const documentData = documentFiles.documents.map((doc) => ({
        //             borrowerId: borrower.id,
        //             type: doc.fieldname,
        //             filePath: doc.path,
        //         }));

        //         await tx.document.createMany({
        //             data: documentData
        //         });
        //     }
        // });

        let documents: { type: string; filePath: string }[] = [];
        if (borrowerDetails.isInstitution) {
            const documentFiles = req.files as { [fieldname: string]: Express.Multer.File[] };
            if (!documentFiles.documents || documentFiles.documents.length !== 3) {
                throw new Error("Institution borrower must have 3 documents");
            }

            documents = documentFiles.documents.map((doc) => ({
                type: doc.fieldname,
                filePath: doc.path,
            }));
        }

        const borrower = await prisma.borrower.create({
            data: {
                ...borrowerDetails,
                documents: {
                    create: documents,
                },
            },
        });

        res.status(201).json({
            message: "Borrower Details registered successfully",
            borrower,
        });
    } catch (error) {
        next(error);
    }
}

async function Login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;

        const findUser = await prisma.user.findUnique({
            where: { email },
            include: { role: true }
        });

        if (!findUser || !(await compare(password, findUser.password))) {
            throw new Error("Invalid email or password!");
        }

        const payload = {
            id: findUser.id,
            email,
            role: findUser.role.name,
        }

        const token = sign(payload, SECRET_KEY as string, { expiresIn: "1d" });

        res.status(200).cookie("access_token", token).send({
            message: "Login successful",
            access_token: token,
        });
    } catch (error) {
        next(error);
    }
}

export { RegisterUser, RegisterLenderDetails, RegisterBorrowerDetails, Login };