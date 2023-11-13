const siteRoute = require("./homeRoute");
const shopRoute = require("./shopRoute");
const adminRoute = require("./adminRoute");
const loginRoute = require("./loginRoute");
const blogRoute = require("./blogRoute");
const aboutRoute = require("./aboutRoute");
const contactRoute = require("./contactRoute");
const cartRoute = require("./cartRoute");

function route(app) {
  app.use("/shop", shopRoute);
  app.use("/home", siteRoute);
  app.use("/admin", adminRoute);
  app.use("/blog", blogRoute);
  app.use("/about", aboutRoute);
  app.use("/contact", contactRoute);
  app.use("/cart", cartRoute);
  app.use("/", loginRoute);
}
module.exports = route;
