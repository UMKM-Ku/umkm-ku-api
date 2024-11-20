import { Router } from 'express';
import { Login, RegisterBorrowerDetails, RegisterLenderDetails, RegisterUser } from '../controllers/auth.controller';
import { LoginValidation, RegisterBorrowerValidation, RegisterLenderValidation, RegisterUserValidation } from '../middlewares/validations/auth.validation';
import { uploader } from '../utils/multerConfig';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

const lenderUpload = uploader("KTP", "Lender");
const borrowerUpload = uploader("borrower-docs", "borrower");

router.post("/register/user", RegisterUserValidation, RegisterUser);
router.post("/register/lender", verifyToken, RegisterLenderValidation, lenderUpload.single("identityCard"), RegisterLenderDetails);
router.post("/register/borrower", verifyToken, RegisterBorrowerValidation, borrowerUpload.fields([
    { name: "identityCard", maxCount: 1 },
    { name: "documents", maxCount: 3 },
]), RegisterBorrowerDetails);
router.post("/login", LoginValidation, Login);


export default router;