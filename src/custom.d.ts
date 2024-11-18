export type User = {
    id: number,
    email: string,
    role: string,
    roleId?: number,
    borrower?: {
        id: number,
    },
    lender?: {
        id: number,
    }
}

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}