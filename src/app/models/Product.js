const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Product = new Schema(
  {
    name: { type: String, default: "" },
    description: { type: String },
    image: { type: [String], default: [] },
    price: { type: Number, default: 0 },
    size: { type: [String], default: [] },
    color: { type: String },
    brand: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", Product); // link đến collection cources của thèn database với schema là Product
