import { Router } from "express";
import { validateToken } from "../utils/jwt.js";
import { createGroup, getMessagePrivate, sendMessagePrivate, sendMessagePublic, getMessagePublic, createConversation } from "../handlers/conversation.handler.js";

const router = Router();

router.post("/createChat/:id", validateToken, createConversation)
router.post("/sendMessagePrivate/:id", validateToken, sendMessagePrivate)
router.get("/getMessagePrivate/:id", validateToken, getMessagePrivate)
router.post("/createGroup", validateToken, createGroup)
router.post("/sendMessagePublic/:id", validateToken, sendMessagePublic)
router.get("/getMessagePublic/:id", validateToken, getMessagePublic)

export default router;