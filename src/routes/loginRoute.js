const express = require("express");
const router = express.Router();
const loginController = require("../app/controllers/LoginController");

router.post("/signUp", loginController.signUp);
router.post("/signIn", loginController.signIn);
router.get("/", loginController.loginForm);

module.exports = router;
