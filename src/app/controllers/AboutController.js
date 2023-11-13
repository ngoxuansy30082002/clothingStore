const Product = require("../models/Product");
const {
  multipleMongooseToObject,
  shuffleArray,
} = require("../../util/mongoose");
class AboutController {
  //[GET] /home
  async about(req, res, next) {
    res.render("about/about", {
      showHeaderAndFooter: true,
    });
  }
}
module.exports = new AboutController();
