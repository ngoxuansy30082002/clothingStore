const express = require("express");
const router = express.Router();
const adminController = require("../app/controllers/AdminController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/all-user", authMiddleware.verifyToken, adminController.getAllUser);
router.delete(
  "/delete-user/:id",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.deleteUser
);

// lấy form thêm sản phẩm
router.get(
  "/product/create",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.createProduct
);
// thêm sản phẩm
router.post(
  "/product/create",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.insertProduct
);
// hiển thị sản phẩm đã bị xóa (nằm ở thùng rác)
router.get(
  "/product/trash",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.trashProduct
);
// hành động thay đổi nhiều product
router.post(
  "/product/handle-multi-form",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.handleMultiProduct
);
// hành động thay đổi nhiều product
router.post(
  "/product/handle-filter",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.productsFilter
);
// khôi phục sản phẩm từ thùng rác
router.patch(
  "/product/:id/restore",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.restoreProduct
);
// xóa vĩnh viễn sản phẩm
router.delete(
  "/product/:id/force",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.forceDeleteProduct
);
// lấy form sửa sản phẩm
router.get(
  "/product/:id/edit",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.editProduct
);
// lấy feedback của sản phẩm
router.get(
  "/product/:id/feedback",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.feedbackProduct
);
// sửa sản phẩm
router.put(
  "/product/:id",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.updateProduct
);
// xóa sản phẩm
router.delete(
  "/product/:id",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.deleteProduct
);
// lấy tất cả sản phẩm (ngoại trừ thùng rác)
router.get(
  "/product",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.products
);
// blog
router.get(
  "/blog",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.blogs
);
// xóa blog
router.delete(
  "/blog/:id",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.deleteBlog
);
// lấy form thêm blog
router.get(
  "/blog/create",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.createBlog
);
// thêm blog
router.post(
  "/blog/create",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.insertBlog
);
router.get(
  "/chat",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.chat
);
// home page admin
router.get(
  "/",
  authMiddleware.verifyTokenAndAdminAuth,
  adminController.adminPage
);

module.exports = router;
