import { Request, Response, NextFunction } from "express";
import fs from "fs";

export const validateUploadFile = (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    if (!file) {
        throw new Error('File is required');
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
        fs.unlink(file.path, (err) => {
            if (err) throw new Error(err.message);
        })
        throw new Error('Invalid file type');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        fs.unlink(file.path, (err) => {
            if (err) throw new Error(err.message);
        })
        throw new Error('File size exceeds the maximum limit of 5MB');
    }

    next();
}