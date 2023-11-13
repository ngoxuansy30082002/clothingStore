const Product = require("../models/Product");
const {
  multipleMongooseToObject,
  shuffleArray,
} = require("../../util/mongoose");
class ContactController {
  //[GET] /home
  async contact(req, res, next) {
    res.render("contact/contact", {
      showHeaderAndFooter: true,
    });
  }
}
module.exports = new ContactController();
