const Product = require("../models/Product");
const {
  multipleMongooseToObject,
  shuffleArray,
} = require("../../util/mongoose");
class BlogController {
  //[GET] /home
  async blog(req, res, next) {
    res.render("blog/blog", {
      showHeaderAndFooter: true,
    });
  }
}
module.exports = new BlogController();
