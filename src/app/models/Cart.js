const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo mô hình cho giỏ hàng
const CartSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId, // Tham chiếu đến sản phẩm
      ref: "Product", // Tên của model sản phẩm
      required: true,
    },
    quantity: {
      type: Number, // Số lượng sản phẩm trong giỏ hàng
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    paid: {
      type: Boolean, // Số lượng sản phẩm trong giỏ hàng
      default: false,
    },
    delivered: {
      type: Boolean, // Số lượng sản phẩm trong giỏ hàng
      default: false,
    },
    // Các trường thông tin khác liên quan đến sản phẩm trong giỏ hàng
  },
  { timestamps: true }
);

// Tạo model từ schema
const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
