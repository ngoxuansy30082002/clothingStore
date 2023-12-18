const express = require("express");
const router = express.Router();
const shopController = require("../app/controllers/ShopController");

// router.get("/create", shopController.create);
router.get("/filter/:slug", shopController.shopFilter); //slug là biến động, nhận bất kỳ
router.get("/:slug", shopController.detail); //slug là biến động, nhận bất kỳ
router.get("/", shopController.shop);

module.exports = router;
