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
      const carts = multipleMongooseToObject(
        await Cart.find({ userId: user.id })
      );
      for (const cart of carts) {
        const product = await Product.findById(cart.productId);
        cart.name = product.name;
        cart.image = product.image;
        cart.price = product.price;
      }
      res.render("cart/cart", {
        showHeaderAndFooter: true,
        carts: carts,
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
