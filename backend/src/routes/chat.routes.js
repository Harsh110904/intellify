const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const chatController = require("../controllers/chat.controller");

// POST /api/chat
router.post('/', authMiddleware.authUser, chatController.createChat);

// GET /api/chat
router.get('/', authMiddleware.authUser, chatController.getChats);

module.exports = router;