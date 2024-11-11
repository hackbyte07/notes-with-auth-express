import { Router } from "express";
import { auth } from "../controllers/auth.controller";

const router = Router();

router.post("/login", auth.userLoginController);

router.post("/signup", auth.userSignupController);

export const authRouter = router;
