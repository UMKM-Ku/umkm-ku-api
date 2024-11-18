import { Router } from 'express';
import { Login, RegisterBorrower, RegisterLender } from '../controllers/auth.controller';
import { LoginValidation, RegisterBorrowerValidation, RegisterLenderValidation } from '../middlewares/validations/auth.validation';
import { uploader } from '../utils/multerConfig';

const router = Router();

const lenderUpload = uploader("KTP", "Lender");
const borrowerUpload = uploader("borrower-docs", "borrower");

router.post("/register/lender", lenderUpload.single("identityCard"), RegisterLenderValidation, RegisterLender);
router.post("/register/borrower", borrowerUpload.fields([
    { name: "identityCard", maxCount: 1 },
    { name: "document1", maxCount: 1 },
    { name: "document2", maxCount: 1 },
    { name: "document3", maxCount: 1 },
]), RegisterBorrowerValidation, RegisterBorrower);
router.post("/login", LoginValidation, Login);


export default router;