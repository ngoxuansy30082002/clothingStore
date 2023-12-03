const mongoose = require("mongoose");
var slug = require("mongoose-slug-generator");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Blog = new Schema(
  {
    title: { type: String, default: "" },
    description: { type: String },
    image: { type: String },
    slug: { type: String, slug: "title" },
    like: { type: Number },
  },
  { timestamps: true }
);

mongoose.plugin(slug);

module.exports = mongoose.model("Blog", Blog); // link đến collection cources của thèn database với schema là Blog
