// controllers/CartController.js
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const {
  multipleMongooseToObject,
  singleMongooseToObject,
  shuffleArray,
} = require("../../util/mongoose");

class CartController {
  // [GET] /cart
  async index(req, res, next) {
    try {
      const user = req.user;
      // Truy xuất tất cả mục trong giỏ hàng từ cơ sở dữ liệu
      let carts = await Cart.find({ userId: user.id });
      let products = [];
      for (let cart of carts) {
        const product = await Product.findById(cart.productId);
        products.push(product);
      }
      res.render("cart/cart", {
        showHeaderAndFooter: true,
        carts: multipleMongooseToObject(carts),
        products: multipleMongooseToObject(products),
      });
    } catch (error) {
      next(error);
    }
  }

  // [POST] /cart/add-to-cart
  async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;
      const product = await Product.findOne({ _id: productId });

      const cartItem = new Cart({
        productId: product._id,
        userId: req.user.id,
        quantity: quantity,
      });

      const savedCartItem = await cartItem.save();
      res.redirect("back");
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new CartController();
