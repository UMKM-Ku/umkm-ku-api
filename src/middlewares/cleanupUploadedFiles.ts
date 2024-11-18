import { Request, Response, NextFunction } from "express";
import fs from "fs";

export const cleanupUploadedFiles = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
        fs.unlink(req.file.path, (error) => {
            if (error) {
                next(error);
            }
        });
    } else if (req.files) {
        Object.values(req.files).forEach((fileArray) => {
            (fileArray as Express.Multer.File[]).forEach((file) => {
                fs.unlink(file.path, (error) => {
                    if (error) next(error);
                });
            });
        });
    }
    next(err);
}