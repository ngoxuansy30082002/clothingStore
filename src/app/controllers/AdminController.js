const Product = require("../models/Product");
const {
  multipleMongooseToObject,
  shuffleArray,
} = require("../../util/mongoose");
const { admin } = require("./LoginController");

class AdminController {
  //[GET] /admin
  async admin(req, res, next) {
    res.render("admin");
  }
}
module.exports = new AdminController();
