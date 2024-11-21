import { Router } from 'express';
import { Login, RegisterBorrowerDetails, RegisterLenderDetails, RegisterUser } from '../controllers/auth.controller';
import { LoginValidation, RegisterUserValidation } from '../middlewares/validations/auth.validation';
import { verifyToken } from '../middlewares/auth.middleware';
import { documentUploader, identityUploader } from '../utils/multerCloudinaryConfig';

const router = Router();

router.post("/register/user", RegisterUserValidation, RegisterUser);
router.post("/register/lender", verifyToken, identityUploader.single("identityCard"), RegisterLenderDetails);
router.post("/register/borrower", verifyToken, documentUploader, RegisterBorrowerDetails);
router.post("/login", LoginValidation, Login);


export default router;