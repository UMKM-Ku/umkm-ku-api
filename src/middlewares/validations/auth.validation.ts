import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const RegisterUserValidation = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('phoneNumber')
        .notEmpty().withMessage('Phone number is required')
        .isLength({ min: 10, max: 15 }).withMessage("Phone number must be at least 10 characters long"),
    body('role')
        .notEmpty().withMessage('Role is required'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation Error');
            error.name = 'ValidationError';
            (error as any).errors = errors.array();
            return next(error);
        }
        next();
    }
];

export const RegisterLenderValidation = [
    body('birthDate')
        .notEmpty().withMessage('Birth date is required'),
    body('identityNumber')
        .notEmpty().withMessage('Identity number is required')
        .isLength({ min: 16, max: 16 }).withMessage('Identity number must be 16 characters long'),
    body('address')
        .notEmpty().withMessage('Address is required'),
    body('accountNumber')
        .notEmpty().withMessage('Account number is required'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation Error');
            error.name = 'ValidationError';
            (error as any).errors = errors.array();
            return next(error);
        }
        next();
    },
];

export const RegisterBorrowerValidation = [
    body('identityNumber')
        .notEmpty().withMessage('Identity number is required')
        .isLength({ min: 16, max: 16 }).withMessage('Identity number must be 16 characters long'),
    body('address')
        .notEmpty().withMessage('Address is required'),
    body('npwp')
        .notEmpty().withMessage('NPWP is required'),
    body('accountNumber')
        .notEmpty().withMessage('Account number is required'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation Error');
            error.name = 'ValidationError';
            (error as any).errors = errors.array();
            return next(error);
        }
        next();
    }
];

export const LoginValidation = [
    body('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .notEmpty().withMessage('Password is required'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation Error');
            error.name = 'ValidationError';
            (error as any).errors = errors.array();
            return next(error);
        }
        next();
    }
];