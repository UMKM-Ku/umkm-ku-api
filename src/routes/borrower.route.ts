import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { borrowerUploader } from "../utils/multerConfig";
import { createFundingRequest, editFundingRequest, requestExtend } from "../controllers/borrower.controller";

const router = Router();

router.post('/create', verifyToken, borrowerUploader.single('image'), createFundingRequest);
router.put('/edit', verifyToken, borrowerUploader.single('image'), editFundingRequest);
router.post('/extend', verifyToken, requestExtend);

export default router;