import { Router } from "express";
import { getUserData, getSearchQuery, getSingleUser, update } from "../handlers/AllUserData.handler.js";
import { validateToken } from "../utils/jwt.js";

const router = Router();

router.get("/", validateToken, getUserData)
router.get("/search", validateToken, getSearchQuery)
router.get("/user/:id", validateToken, getSingleUser)
router.put("/update", validateToken, update)
export default router;