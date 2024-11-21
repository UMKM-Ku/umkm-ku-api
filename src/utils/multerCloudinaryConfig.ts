import { CloudinaryStorage, Options } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cludinaryConfig";

interface CustomParams extends Options {
   folder: string;
   allowed_formats: string[];
 }

const identityCardStorage = new CloudinaryStorage({
  cloudinary,
  params: {
      folder: "borrower-identity-cards",
      allowed_formats: ["jpeg", "png", "jpg", "pdf"],
  } as CustomParams,
});

const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
      folder: "borrower-documents", 
      allowed_formats: ["jpeg", "png", "jpg", "pdf"],
  } as CustomParams,
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
      folder: "image-borower", 
      allowed_formats: ["jpeg", "png", "jpg", "pdf"],
  } as CustomParams,
});

export const identityUploader = multer({ storage: identityCardStorage });
export const imageUploader = multer({ storage: imageStorage });
export const documentUploader = multer({ storage: documentStorage }).fields([
  { name: "identityCard", maxCount: 1 },
  { name: "documents", maxCount: 3 },
]);