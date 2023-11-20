const express = require("express");
const router = express.Router();
const messageController = require("../app/controllers/MessageController");

router.get("/", messageController.chat);
module.exports = router;
