const mongoose = require("mongoose");
var slug = require("mongoose-slug-generator");
var mongooseDelete = require("mongoose-delete");
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
    catelogy: { type: String },
    feedbacks: { type: [mongoose.Schema.Types.ObjectId] },
    slug: { type: String, slug: ["name", "brand"] },
  },
  { timestamps: true }
);

mongoose.plugin(slug);
Product.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: ["deleteOne"],
});

module.exports = mongoose.model("Product", Product); // link đến collection cources của thèn database với schema là Product
