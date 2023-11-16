const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connect successfully!!!");
  } catch (error) {
    console.log("MongoDB connect ERROR!!!");
  }
}
module.exports = { connect };
