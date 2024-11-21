import { Router } from "express";
import { LenderGuard, verifyToken } from "../middlewares/auth.middleware";
import { addReview, createFundingTransaction, depositWallet, filterFundingRequests, getFundingRequestDetails, getPublishedFundingRequests } from "../controllers/lender.controller";

const router = Router();

router.post("/wallet/deposit", verifyToken, LenderGuard, depositWallet);
router.get('/fundings', verifyToken, LenderGuard, getPublishedFundingRequests);
router.get('/fundings/:id', verifyToken, LenderGuard, getFundingRequestDetails);
router.post("/fundings/transaction", verifyToken, LenderGuard, createFundingTransaction);
router.get("/fundings/filter", verifyToken, LenderGuard, filterFundingRequests);
router.post('/review', verifyToken, LenderGuard, addReview);

export default router;