const Product = require("../models/Product");
const {
  multipleMongooseToObject,
  singleMongooseToObject,
  shuffleArray,
} = require("../../util/mongoose");

class ShopController {
  // [GET] /shop/
  async shop(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 8;
    try {
      const product = await Product.find({})
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      const countProducts = await Product.countDocuments({});
      const countPage =
        countProducts % pageSize === 0
          ? countProducts / pageSize
          : countProducts / pageSize + 1;
      const pages = Array.from({ length: countPage }, (_, index) => index + 1);
      // console.log(pages);
      res.render("shop/shop", {
        product: multipleMongooseToObject(product),
        pages,
        showHeaderAndFooter: true,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  //[GET] /shop/:slug
  async detail(req, res, next) {
    try {
      let newArrivals = await Product.find({});
      newArrivals = shuffleArray(newArrivals).slice(4, 8);
      let product = await Product.findOne({
        slug: req.params.slug, //tìm document theo slug (hành động click chỗ href của thẻ a trong file home thì sẽ truyền slug về URL)
      }).exec();
      res.render("shop/detail", {
        product: singleMongooseToObject(product), // Do handlebars không thể xử lý đối tượng trả về từ Mongoose nên ta cần chuyển nó thành Object
        newArrivals: multipleMongooseToObject(newArrivals),
        showHeaderAndFooter: true,
      });
    } catch (error) {
      next(error); //chuyển error đến middleware để xử lý tập trung(chưa học)
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // //[POST] /courses/store
  // async store(req, res, next) {
  //   try {
  //     console.log(req.query);
  //     await Course.insertMany([req.body]); // chèn dữ liệu vào database
  //     res.redirect("/"); // chuyển hướng về lại home
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}
module.exports = new ShopController();
