const express = require("express");
const router = express.Router();
const messageController = require("../app/controllers/MessageController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware.verifyToken, messageController.message);
module.exports = router;
