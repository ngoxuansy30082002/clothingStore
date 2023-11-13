const path = require("path"); // lấy đường dẫn thư mục
const express = require("express");
const morgan = require("morgan"); // HTTp logger
const { engine } = require("express-handlebars"); // handle view
const route = require("./routes"); //router
const db = require("./config/db"); // mongo database
// connect to mongodb
db.connect();

const app = express();
const port = 9876;

const staticPath = path.join(__dirname, "public");
app.use(express.static(staticPath)); //static file

app.use(express.urlencoded({ extended: true })); //midleware xử lí submit từ thẻ dạng form phía html và chuyển vào req.body
app.use(express.json()); //midleware xử lí dữ liệu từ các thư viện javascript (XMLhttpRequest, fetch, axios, ...)

// HTTp logger
app.use(morgan("combined"));

// template engine, render views
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views")); // chỉ định đường dẫn thư mục views

// Routes init
route(app);

app.listen(port, (request, respond) => {
  console.log(`Our server is live on ${port}. Yay!`);
});
