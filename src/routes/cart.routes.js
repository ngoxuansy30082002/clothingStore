const express = require("express");
const router = express.Router();
const cartController = require("../app/controllers/CartController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/add-to-cart",
  authMiddleware.verifyToken,
  cartController.addToCart
);
router.delete("/cart/:id", cartController.deletecart);
router.get("/", authMiddleware.verifyToken, cartController.index);
module.exports = router;
