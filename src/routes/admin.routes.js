const express = require("express");
const router = express.Router();
const adminController = require("../app/controllers/AdminController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/all-user", authMiddleware.verifyToken, adminController.getAllUser);
router.delete(
  "/delete-user/:id",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.deleteUser
);
router.get("/", adminController.adminPage);

module.exports = router;
