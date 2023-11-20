const mongoose = require("mongoose");
var slug = require("mongoose-slug-generator");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// Định nghĩa Schema
const Feedback = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

mongoose.plugin(slug);

module.exports = mongoose.model("Feedback", Feedback); // link đến collection cources của thèn database với schema là Feedback
