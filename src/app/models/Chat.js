const mongoose = require("mongoose");
var slug = require("mongoose-slug-generator");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Chat = new Schema(
  {
    sender: { type: String },
    message: { type: String },
    room: { type: String },
    slug: { type: String, slug: "title" },
  },
  { timestamps: true }
);

mongoose.plugin(slug);

module.exports = mongoose.model("Chat", Chat); // link đến collection cources của thèn database với schema là Chat
