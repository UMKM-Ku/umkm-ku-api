import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

const ErrorMiddleware: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'ValidationError' || err.errors) {
        const formattedErrors = err.errors.map((error: any) => ({
            msg: error.msg,
            path: error.path
        }));
        res.status(400).json({ errors: formattedErrors });
    } else {
        res.status(500).send({ message: err.message });
    }
    next();
}

export default ErrorMiddleware;