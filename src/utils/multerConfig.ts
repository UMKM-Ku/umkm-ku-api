import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FilenameCallback = (error: Error | null, filename: string) => void;

export const uploader = (filePrefix: string, foldername?: string) => {
    const maxSize = 5 * 1024 * 1024;
    const uploadPath = path.join(__dirname, "../../uploads");

    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (
            req: Request,
            file: Express.Multer.File,
            cb: DestinationCallback
        ) => {
            const destination = foldername ? path.join(uploadPath, foldername) : uploadPath;
            if (!fs.existsSync(destination)) {
                fs.mkdirSync(destination, { recursive: true });
            }
            cb(null, destination);
        },
        filename: (
            req: Request,
            file: Express.Multer.File,
            cb: FilenameCallback
        ) => {
            const originalNameParts = file.originalname.split('.');
            const fileExtension = originalNameParts[originalNameParts.length - 1];
            const newFileName = `${filePrefix}${Date.now()}.${fileExtension}`;
            cb(null, newFileName);
        }
    });

    const fileFilter = (
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    ) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
    };

    return multer({ storage: storage, fileFilter, limits: { fileSize: maxSize } });
}

export const borrowerUploader = uploader("borrower-docs", "borrower");