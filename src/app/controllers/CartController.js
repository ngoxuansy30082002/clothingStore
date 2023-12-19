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
      let subTotal = 0;
      for (const cart of carts) {
        const product = await Product.findById(cart.productId);
        cart.name = product.name;
        cart.image = product.image.shift();
        cart.price = product.price;
        subTotal += cart.price * cart.quantity;
      }
      res.render("cart/cart", {
        showHeaderAndFooter: true,
        carts: carts,
        subTotal,
      });
    } catch (error) {
      next(error);
    }
  }

  // [POST] /cart/add-to-cart
  async addToCart(req, res) {
    try {
      const { productId, quantity, size } = req.body;
      if (size !== "Select Size") {
        const product = await Product.findOne({ _id: productId });
        const existingCartItem = await Cart.findOne({
          productId: productId,
          userId: req.user.id,
        });

        if (existingCartItem) {
          // Nếu sản phẩm đã tồn tại trong giỏ hàng
          if (existingCartItem.size === size) {
            // Nếu sản phẩm có cùng size, tăng quantity lên 1
            existingCartItem.quantity += parseInt(quantity);
            await existingCartItem.save();
          } else {
            // Nếu sản phẩm có size khác, thêm sản phẩm mới vào giỏ hàng với size mới
            const cartItem = new Cart({
              productId: product._id,
              userId: req.user.id,
              quantity: quantity,
              size: size,
            });
            await cartItem.save();
          }
        } else {
          // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm sản phẩm mới vào giỏ hàng
          const cartItem = new Cart({
            productId: product._id,
            userId: req.user.id,
            quantity: quantity,
            size: size,
          });
          await cartItem.save();
        }
      }
      res.redirect("back");
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async deletecart(req, res, next) {
    try {
      await Cart.deleteOne({ _id: req.params.id });
      res.redirect("back");
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = new CartController();
