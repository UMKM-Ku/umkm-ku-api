import { Router } from "express";
import { BorrowerGuard, verifyToken } from "../middlewares/auth.middleware";
import { borrowerUploader } from "../utils/multerConfig";
import { createFundingRequest, editFundingRequest, getAllFundingRequest, getFundingRequestById, requestExtend } from "../controllers/borrower.controller";

const router = Router();

router.post('/create', verifyToken, borrowerUploader.single('image'), createFundingRequest);
router.put('/edit/:id', verifyToken, borrowerUploader.single('image'), editFundingRequest);
router.post('/extend', verifyToken, requestExtend);
router.get('/funding-requests', verifyToken, BorrowerGuard, getAllFundingRequest);
router.get('/funding-requests/:id', verifyToken, BorrowerGuard, getFundingRequestById);

export default router;