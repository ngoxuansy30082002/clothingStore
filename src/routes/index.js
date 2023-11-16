const homeRoute = require("./home.routes");
const shopRoute = require("./shop.routes");
const adminRoute = require("./admin.routes");
const authRoute = require("./auth.routes");
const blogRoute = require("./blog.routes");
const aboutRoute = require("./about.routes");
const contactRoute = require("./contact.routes");
const cartRoute = require("./cart.routes");

function route(app) {
  app.use("/shop", shopRoute);
  app.use("/blog", blogRoute);
  app.use("/about", aboutRoute);
  app.use("/contact", contactRoute);
  app.use("/cart", cartRoute);
  app.use("/admin", adminRoute);
  app.use("/auth", authRoute);
  app.use("/", homeRoute);
}
module.exports = route;
