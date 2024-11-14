import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { compare, genSalt, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '../utils/envConfig';

const prisma = new PrismaClient();

async function RegisterLender(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, password, phoneNumber, birthDate, identityNumber, identityCard, accountNumber } = req.body;

        const findUser = await prisma.user.findUnique({ where: { email } });

        if (findUser) throw new Error("Email is already in use");

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
                identityNumber,
                identityCard,
                accountNumber,
                roleId: lenderRole.id,
                statusId: 1,
                lender: {
                    create: {
                        birthDate: new Date(birthDate),
                    }
                },
            },
        });

        res.status(201).json({ message: 'User registered successfully', data: user });

    } catch (error) {
        next(error);
    }
}

async function RegisterBorrower(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, password, phoneNumber, identityNumber, identityCard, address, npwp, accountNumber } = req.body;

        const findUser = await prisma.user.findUnique({ where: { email } });

        if (findUser) throw new Error("Email is already in use");

        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        let borrowerRole = await prisma.role.findUnique({ where: { name: 'Borrower' } });
        if (!borrowerRole) {
            borrowerRole = await prisma.role.create({ data: { name: "Borrower" } });
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phoneNumber,
                identityNumber,
                identityCard,
                accountNumber,
                roleId: borrowerRole.id,
                statusId: 1,
                borrower: {
                    create: {
                        address,
                        npwp,
                    },
                },
            },
        });

        res.status(201).json({ message: 'User registered successfully', data: user });

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

        res.status(200).send({
            message: "Login successful",
            access_token: token,
        });
    } catch (error) {
        next(error);
    }
}

export { RegisterLender, RegisterBorrower, Login };