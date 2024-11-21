import { Router } from "express";
import { BorrowerGuard, verifyToken } from "../middlewares/auth.middleware";
import { createFundingRequest, editFundingRequest, getAllFundingRequest, getFundingRequestById, requestExtend } from "../controllers/borrower.controller";
import { imageUploader } from "../utils/multerCloudinaryConfig";

const router = Router();

router.post('/create', verifyToken, imageUploader.single('image'), createFundingRequest);
router.put('/edit/:id', verifyToken, imageUploader.single('image'), editFundingRequest);
router.post('/extend', verifyToken, requestExtend);
router.get('/funding-requests', verifyToken, BorrowerGuard, getAllFundingRequest);
router.get('/funding-requests/:id', verifyToken, BorrowerGuard, getFundingRequestById);

export default router;