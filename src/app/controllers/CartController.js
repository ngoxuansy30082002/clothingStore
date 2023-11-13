const Product = require("../models/Product");
const {
  multipleMongooseToObject,
  shuffleArray,
} = require("../../util/mongoose");
class CartController {
  //[GET] /home
  async cart(req, res, next) {
    res.render("cart/cart", {
      showHeaderAndFooter: true,
    });
  }
}
module.exports = new CartController();
