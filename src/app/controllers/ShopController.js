const Product = require("../models/Product");
const {
  multipleMongooseToObject,
  singleMongooseToObject,
  shuffleArray,
} = require("../../util/mongoose");

class ShopController {
  // [GET] /shop/
  async shop(req, res, next) {
    const regex = new RegExp(req.query.search, "i");
    const actionFilter = req.cookies.actionFilter;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 8;
    var products;
    var countProducts;
    try {
      if (req.query.search) {
        products = await Product.find({ name: { $regex: regex } });
        countProducts = await Product.countDocuments({
          name: { $regex: regex },
        });
      } else {
        switch (actionFilter) {
          case "shirt":
            products = await Product.find({
              catelogy: "Áo",
            })
              .skip((page - 1) * pageSize)
              .limit(pageSize);
            countProducts = await Product.countDocuments({
              catelogy: "Áo",
            });
            break;
          case "pants":
            products = await Product.find({
              catelogy: "Quần",
            })
              .skip((page - 1) * pageSize)
              .limit(pageSize);
            countProducts = await Product.countDocuments({
              catelogy: "Quần",
            });
            break;
          case "accessory":
            products = await Product.find({
              catelogy: "Phụ kiện",
            })
              .skip((page - 1) * pageSize)
              .limit(pageSize);
            countProducts = await Product.countDocuments({
              catelogy: "Phụ kiện",
            });
            break;
          case "shoes":
            products = await Product.find({
              catelogy: "Giày",
            })
              .skip((page - 1) * pageSize)
              .limit(pageSize);
            countProducts = await Product.countDocuments({
              catelogy: "Giày",
            });
            break;
          default:
            products = await Product.find({})
              .skip((page - 1) * pageSize)
              .limit(pageSize);
            countProducts = await Product.countDocuments({});
            break;
        }
      }
      const countPage =
        countProducts % pageSize === 0
          ? countProducts / pageSize
          : countProducts / pageSize + 1;
      const pages = Array.from({ length: countPage }, (_, index) => index + 1);

      res.render("shop/shop", {
        product: multipleMongooseToObject(products),
        pages,
        showHeaderAndFooter: true,
        actionFilter: actionFilter,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async shopFilter(req, res, next) {
    try {
      const actionFilter = req.params.slug;
      if (actionFilter === "all")
        res.clearCookie("actionFilter", {
          path: `/shop/filter/${actionFilter}`,
        });
      res.cookie("actionFilter", actionFilter, {
        httpOnly: true,
        secure: false,
        path: "/",
        samSite: "strict",
      });
      res.redirect("/shop");
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
}
module.exports = new ShopController();
