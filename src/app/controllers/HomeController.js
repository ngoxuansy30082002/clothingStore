const Product = require("../models/Product");
const {
  multipleMongooseToObject,
  shuffleArray,
} = require("../../util/mongoose");
class HomeController {
  //[GET] /home
  async home(req, res, next) {
    try {
      res.clearCookie("accessToken", { path: "/" });
      let product = await Product.find({});
      let shuffledProducts = shuffleArray(product);
      let freadtureProduct = shuffledProducts.slice(0, 4); //lấy randorm 8 sản phẩm trong database
      let newArrivals = shuffledProducts.slice(4, 8);
      res.render("home", {
        freadtureProduct: multipleMongooseToObject(freadtureProduct), // Do handlebars không thể xử lý đối tượng trả về từ Mongoose nên ta cần chuyển nó thành Object
        newArrivals: multipleMongooseToObject(newArrivals),
        showHeaderAndFooter: true,
      });
    } catch (error) {
      next(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
module.exports = new HomeController();
