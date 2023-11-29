const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/AuthController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/logout", authMiddleware.verifyToken, authController.logoutUser);
// router.post("/refreshToken", authController.refreshToken);
router.get("/", authController.loginForm);

module.exports = router;
