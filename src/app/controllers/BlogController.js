const Product = require("../models/Product");
const {
  multipleMongooseToObject,
  shuffleArray,
} = require("../../util/mongoose");

const Blog = require("../models/Blog");

class BlogController {
  //[GET] /home
  async blog(req, res, next) {
    try {
      // Truy xuất tất cả bài viết từ cơ sở dữ liệu
      const blogs = await Blog.find();

      res.render("blog/blog", {
        showHeaderAndFooter: true,
        blogs: multipleMongooseToObject(blogs),
      });
    } catch (error) {
      next(error);
    }
  }
}



// class BlogController {
//   //[GET] /blog
//   async blog(req, res, next) {
//     try {
//       // Lấy tất cả blog từ cơ sở dữ liệu
//       const blog = await blog.find({}).sort({ createdAt: -1 }); // Sắp xếp từ mới đến cũ
      
//       // Render trang blog và truyền dữ liệu blogs qua
//       res.render("blog/blog", {
//         blogs: multipleMongooseToObject(blogs),
//         showHeaderAndFooter: true,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// }

// class BlogController {
//   //[GET] /home
//   async blog(req, res, next) {
//     res.render("blog/blog", {
//       showHeaderAndFooter: true,
//     });
//   }
// }
module.exports = new BlogController();
