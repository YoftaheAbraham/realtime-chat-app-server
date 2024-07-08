import { Router } from "express";
import { loginHandler, signupHandler } from "../handlers/auth.handler.js";
import { hashPassword } from "../utils/hash.js";


const router = Router();

router.post("/signup", hashPassword, signupHandler)
router.post("/login", loginHandler)

export default router