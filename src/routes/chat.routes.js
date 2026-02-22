const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

// POST /api/chat
router.post('/', authMiddleware.authUser,)

module.exports = router;