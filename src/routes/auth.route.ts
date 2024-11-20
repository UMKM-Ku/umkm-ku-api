import { Router } from 'express';
import { Login, RegisterBorrowerDetails, RegisterLenderDetails, RegisterUser } from '../controllers/auth.controller';
import { LoginValidation, RegisterBorrowerValidation, RegisterLenderValidation } from '../middlewares/validations/auth.validation';
import { uploader } from '../utils/multerConfig';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

const lenderUpload = uploader("KTP", "Lender");
const borrowerUpload = uploader("borrower-docs", "borrower");

router.post("/register/user", RegisterUser);
router.post("/register/lender", verifyToken, lenderUpload.single("identityCard"), RegisterLenderDetails);
router.post("/register/borrower", verifyToken, borrowerUpload.fields([
    { name: "identityCard", maxCount: 1 },
    { name: "documents", maxCount: 3 },
]), (req, res, next) => {
    console.log("Body:", req.body); // Debug body
    console.log("Files:", req.files); // Debug files
    next();
}, RegisterBorrowerDetails);
router.post("/login", LoginValidation, Login);


export default router;