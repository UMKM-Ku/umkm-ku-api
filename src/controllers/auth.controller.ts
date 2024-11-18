import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { compare, genSalt, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '../utils/envConfig';

const prisma = new PrismaClient();

async function RegisterLender(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, password, phoneNumber, birthDate, identityNumber, accountNumber, address } = req.body;

        const findUser = await prisma.user.findUnique({ where: { email } });

        if (findUser) throw new Error("Email is already in use");

        if (!req.file) {
            throw new Error("Identity card file is required");
        }

        const existingLender = await prisma.lender.findUnique({
            where: { identityNumber },
        });
        if (existingLender) {
            throw new Error("Identity Number is already in use");
        }

        const existingAccountNumber = await prisma.lender.findUnique({
            where: { accountNumber },
        });
        if (existingAccountNumber) {
            throw new Error("Account Number is already in use");
        }

        const identityCardPath = req.file.path;
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        let lenderRole = await prisma.role.findUnique({ where: { name: 'Lender' } });
        if (!lenderRole) {
            lenderRole = await prisma.role.create({ data: { name: "Lender" } });
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phoneNumber,
                roleId: lenderRole.id,
                statusId: 1,
                lender: {
                    create: {
                        identityNumber,
                        identityCard: identityCardPath,
                        accountNumber,
                        address,
                        birthDate: new Date(birthDate),
                    }
                },
            },
        });

        res.status(201).json({
            message: 'User registered successfully',
            data: user,
        });

    } catch (error) {
        next(error);
    }
}

async function RegisterBorrower(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, password, phoneNumber, identityNumber, address, npwp, accountNumber, isInstitution } = req.body;

        const findUser = await prisma.user.findUnique({ where: { email } });

        if (!req.files || !(req.files as { [fieldname: string]: Express.Multer.File[] })['identityCard']) {
            throw new Error("Identity card file is required");
        }

        const identityCardPath = (req.files as { [fieldname: string]: Express.Multer.File[] })["identityCard"][0].path;

        if (findUser) throw new Error("Email is already in use");

        const existingBorrower = await prisma.borrower.findUnique({
            where: { identityNumber },
        });
        if (existingBorrower) {
            throw new Error("Identity Number is already in use");
        }

        const existingAccountNumber = await prisma.lender.findUnique({
            where: { accountNumber },
        });
        if (existingAccountNumber) {
            throw new Error("Account Number is already in use");
        }

        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        let borrowerRole = await prisma.role.findUnique({ where: { name: 'Borrower' } });
        if (!borrowerRole) {
            borrowerRole = await prisma.role.create({ data: { name: "Borrower" } });
        }

        const borrowerData: {
            address: string;
            identityNumber: string;
            identityCard: string;
            accountNumber: string;
            npwp: string;
            isInstitution: boolean;
            documents?: { create: { type: string; filePath: string; }[] };
        } = {
            address,
            identityNumber,
            identityCard: identityCardPath,
            accountNumber,
            npwp,
            isInstitution: isInstitution === "true",
        };

        if (borrowerData.isInstitution) {
            if (!req.files || !(req.files as { [fieldname: string]: Express.Multer.File[] })['document']) {
                throw new Error("Document file is required");
            }

            const documentPath = (req.files as { [fieldname: string]: Express.Multer.File[] })["document"][0].path;
            borrowerData.documents = {
                create: [
                    {
                        type: "institution_document",
                        filePath: documentPath
                    }
                ]
            }
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phoneNumber,
                roleId: borrowerRole.id,
                statusId: 1,
                borrower: {
                    create: borrowerData
                },
            },
        });

        res.status(201).json({
            message: 'User registered successfully',
            data: user,
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
            email,
            role: findUser.role.name,
        }

        const token = sign(payload, SECRET_KEY as string, { expiresIn: "1hr" });

        res.status(200).cookie("access_token", token).send({
            message: "Login successful",
            access_token: token,
        });
    } catch (error) {
        next(error);
    }
}

export { RegisterLender, RegisterBorrower, Login };