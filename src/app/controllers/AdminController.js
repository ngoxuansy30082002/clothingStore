const Product = require("../models/Product");
const User = require("../models/User");

const {
  multipleMongooseToObject,
  shuffleArray,
} = require("../../util/mongoose");

class AdminController {
  //[GET] /admin/all-user
  async getAllUser(req, res, next) {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  //[DELETE] /admin/delete-user/:id
  async deleteUser(req, res, next) {
    try {
      const users = await User.findById(req.params.id);
      res.status(200).json("delete ok");
    } catch (error) {
      res.status(500).json(error);
    }
  }
  // [GET]/admin
  async adminPage(req, res, next) {
    res.status(200).render("admin/admin", {
      showHeaderAndFooter: true,
    });
  }
}
module.exports = new AdminController();
