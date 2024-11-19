import { Borrower, Lender } from "@prisma/client";

export type User = {
    id: number;
    email: string;
    role: string;
    borrower?: Borrower | null;
    lender?: Lender | null;
}

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}