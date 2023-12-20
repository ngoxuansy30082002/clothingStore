const jwt = require("jsonwebtoken");
const Product = require("../models/Product");
const Blog = require("../models/Blog");
const User = require("../models/User");
const Feedback = require("../models/Feedback");
const Cart = require("../models/Cart");

const {
  multipleMongooseToObject,
  shuffleArray,
  singleMongooseToObject,
} = require("../../util/mongoose");

class AdminController {
  // [GET]/admin
  async adminPage(req, res, next) {
    res.status(200).render("admin/home", {
      showAdminHeaderAndFooter: true,
    });
  }

  //[GET] /admin/product
  async products(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = 8;
      var products;
      const actionFilter = req.cookies.actionFilter;
      const productDeleted = await Product.countDocuments({ deleted: true });
      var productNotDeleted;
      const condition = {
        $or: [
          { deleted: null }, // Điều kiện: deleted là null
          { deleted: false }, // Điều kiện: deleted không tồn tại
        ],
      };
      switch (actionFilter) {
        case "shirt":
          // console.log(req.query.action);
          products = await Product.find({
            $and: [condition, { catelogy: "Áo" }],
          })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
          productNotDeleted = await Product.countDocuments({
            $and: [condition, { catelogy: "Áo" }],
          });
          break;
        case "pants":
          products = await Product.find({
            $and: [condition, { catelogy: "Quần" }],
          })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
          productNotDeleted = await Product.countDocuments({
            $and: [condition, { catelogy: "Quần" }],
          });
          break;
        default:
          products = await Product.find(condition)
            .skip((page - 1) * pageSize)
            .limit(pageSize);
          productNotDeleted = await Product.countDocuments(condition);
          break;
      }
      const countPage =
        productNotDeleted % pageSize === 0
          ? productNotDeleted / pageSize
          : productNotDeleted / pageSize + 1;
      const pages = Array.from({ length: countPage }, (_, index) => index + 1);
      res.render("admin/product/product", {
        products: multipleMongooseToObject(products),
        productDeleted,
        productNotDeleted,
        pages,
        showAdminHeaderAndFooter: true,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  //[POST] /admin/product/handle-filter
  async productsFilter(req, res, next) {
    const actionFilter = req.body.filter;
    if (actionFilter === "all")
      res.clearCookie("actionFilter", { path: "/admin/product/handle-filter" });
    res.cookie("actionFilter", actionFilter, {
      httpOnly: true,
      secure: false,
      path: "/",
      samSite: "strict",
    });
    res.redirect("/admin/product");
  }

  //[GET] /admin/product/create
  async createProduct(req, res, next) {
    res.render("admin/product/createProduct", {
      showAdminHeaderAndFooter: true,
    });
  }

  //[POST] /admin/product/create
  async insertProduct(req, res, next) {
    try {
      // console.log(req.body);
      let createProduct = req.body;
      if (createProduct.size) {
        createProduct.size = createProduct.size.split(",");
        createProduct.size = createProduct.size.map((size) => size.trim());
      }
      await Product.create(req.body);
      // const products = await Product.find({});
      res.redirect("/admin/product");
    } catch (error) {
      res.status(500).json(error);
    }
  }

  //[GET] /admin/product/:id/edit
  async editProduct(req, res, next) {
    try {
      const product = await Product.findById(req.params.id);
      res.render("admin/product/editProduct", {
        product: singleMongooseToObject(product),
        showAdminHeaderAndFooter: true,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  //[PUT] /admin/product/:id
  async updateProduct(req, res, next) {
    try {
      let createProduct = req.body;
      if (createProduct.size) {
        createProduct.size = createProduct.size.split(",");
        createProduct.size = createProduct.size.map((size) => size.trim());
      }
      await Product.findByIdAndUpdate(req.params.id, req.body);
      res.redirect("/admin/product");
    } catch (error) {
      res.status(500).json(error);
    }
  }

  //[POST] /admin/product/handle-multi-form
  async handleMultiProduct(req, res, next) {
    switch (req.body.action) {
      case "delete":
        try {
          await Product.delete({ _id: { $in: req.body.productIds } });
          res.redirect("back");
        } catch (error) {
          res.status(500).json(error);
        }
        break;
      case "forceDelete":
        try {
          await Product.deleteMany({ _id: { $in: req.body.productIds } });
          res.redirect("back");
        } catch (error) {
          res.status(500).json(error);
        }
        break;
      case "restore":
        try {
          await Product.restore({ _id: { $in: req.body.productIds } });
          res.redirect("back");
        } catch (error) {
          res.status(500).json(error);
        }
        break;
      default:
        break;
    }
  }

  //[DELETE] /admin/product/:id
  async deleteProduct(req, res, next) {
    try {
      await Product.delete({ _id: req.params.id });
      res.redirect("back");
    } catch (error) {
      res.status(500).json(error);
    }
  }

  //[GET] /admin/product/trash
  async trashProduct(req, res, next) {
    try {
      const products = await Product.find({ deleted: true });
      const productDeleted = await Product.countDocuments({ deleted: true });
      const productNotDeleted = await Product.countDocuments({
        deleted: null,
      });
      res.render("admin/product/trash-product", {
        products: multipleMongooseToObject(products),
        productDeleted,
        productNotDeleted,
        showAdminHeaderAndFooter: true,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  //[PATCH] /admin/product/:id/restore
  async restoreProduct(req, res, next) {
    try {
      await Product.restore({ _id: req.params.id });
      res.redirect("back");
    } catch (error) {
      res.status(500).json(error);
    }
  }

  //[DELETE] /admin/product/:id/force
  async forceDeleteProduct(req, res, next) {
    try {
      await Product.deleteOne({ _id: req.params.id });
      res.redirect("back");
    } catch (error) {
      res.status(500).json(error);
    }
  }

  //[GET] /admin/product/:id/feedback
  async feedbackProduct(req, res, next) {
    try {
      const product = await Product.findById(req.params.id).lean();
      const feedbacks = await Feedback.find({
        _id: { $in: product.feedbacks },
      }).lean();
      var users = [];
      const user = await User.findById(feedbacks[0].userId).lean();
      users.push(user);
      res.render("admin/product/feedback", {
        showAdminHeaderAndFooter: true,
        product,
        feedbacks,
        users,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  //[GET] /admin/blog
  async blogs(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = 8;
      const blogs = await Blog.find({})
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      const blogCount = await Blog.countDocuments({});
      const countPage =
        blogCount % pageSize === 0
          ? blogCount / pageSize
          : blogCount / pageSize + 1;
      const pages = Array.from({ length: countPage }, (_, index) => index + 1);
      res.render("admin/blog/blog", {
        blogs: multipleMongooseToObject(blogs),
        blogCount,
        pages,
        showAdminHeaderAndFooter: true,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  //[DELETE] /admin/blog/:id
  async deleteBlog(req, res, next) {
    try {
      await Blog.deleteOne({ _id: req.params.id });
      res.redirect("back");
    } catch (error) {
      res.status(500).json(error);
    }
  }

  //[GET] /admin/blog/create
  async createBlog(req, res, next) {
    res.render("admin/blog/createBlog", {
      showAdminHeaderAndFooter: true,
    });
  }

  //[POST] /admin/blog/create
  async insertBlog(req, res, next) {
    try {
      let createBlog = req.body;
      if (createBlog.size) {
        createBlog.size = createBlog.size.split(",");
        createBlog.size = createBlog.size.map((size) => size.trim());
      }

      req.body.like = 0;
      await Blog.create(req.body);
      // const Blogs = await Blog.find({});
      res.redirect("/admin/Blog");
    } catch (error) {
      res.status(500).json(error);
    }
  }

  //[GET] /admin/chat
  async chat(req, res, next) {
    const accessToken = req.cookies.accessToken;
    var currentUser;
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        currentUser = user;
      });
    }
    try {
      res.render("admin/chat/chat", {
        showAdminHeaderAndFooter: true,
        currentUser,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  //[GET] /admin/cart
  async cart(req, res, next) {
    try {
      const carts = multipleMongooseToObject(await Cart.find({}));
      let subTotal = 0;
      for (const cart of carts) {
        const product = singleMongooseToObject(
          await Product.findById(cart.productId)
        );
        const user = singleMongooseToObject(await User.findById(cart.userId));
        cart.product = product;
        cart.user = user;
        subTotal += cart.price * cart.quantity;
      }
      res.render("admin/cart/cart", {
        showAdminHeaderAndFooter: true,
        carts: carts,
        subTotal: subTotal,
      });
    } catch (error) {}
  }

  //[GET] /admin/all-user
  async getAllUser(req, res, next) {
    try {
      const users = await User.find({});
      res.render("admin/user/user", {
        showAdminHeaderAndFooter: true,
        users: multipleMongooseToObject(users),
      });
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
}
module.exports = new AdminController();
