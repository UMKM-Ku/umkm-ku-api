import { Router } from 'express';
import { Login, RegisterBorrower, RegisterLender } from '../controllers/auth.controller';
import { RegisterBorrowerValidation, RegisterLenderValidation } from '../middlewares/validations/auth.validation';

const router = Router();

router.post("/register/lender", RegisterLenderValidation, RegisterLender);
router.post("/register/borrower", RegisterBorrowerValidation, RegisterBorrower);
router.post("/login", Login);


export default router;