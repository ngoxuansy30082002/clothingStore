const express = require("express");
const router = express.Router();
const chatController = require("../app/controllers/ChatController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware.verifyToken, chatController.chat);
module.exports = router;
