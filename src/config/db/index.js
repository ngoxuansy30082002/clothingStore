const mongoose = require("mongoose");
async function connect() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/clothingStore");
    console.log("MongoDB connect successfully!!!");
  } catch (error) {
    console.log("MongoDB connect ERROR!!!");
  }
}
module.exports = { connect };
