const path = require("path"); // lấy đường dẫn thư mục
const express = require("express");
const { createServer } = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan"); // HTTp logger
const methodOverride = require("method-override");
const { engine } = require("express-handlebars"); // handle view
const route = require("./routes"); //router
const socketio = require("./serverSocketIO");

const db = require("./config/db.config"); // mongo database
const User = require("./app/models/User");
// connect to mongodb
db.connect();
async function init() {
  try {
    await User.updateMany({}, { active: false });
  } catch (error) {}
}
init();

const app = express();
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {});
//
const port = process.env.PORT || 9000;

const staticPath = path.join(__dirname, "public");
app.use(express.static(staticPath)); //static file

app.use(express.urlencoded({ extended: true })); //midleware xử lí submit từ thẻ dạng form phía html và chuyển vào req.body
app.use(express.json()); //midleware xử lí dữ liệu từ các thư viện javascript (XMLhttpRequest, fetch, axios, ...)
app.use(cors());
app.use(cookieParser());
// HTTp logger
app.use(morgan("combined"));
//method Override
app.use(methodOverride("_method"));

// template engine, render views
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    helpers: {
      sum: (a, b) => a + b,
      mul: (a, b) => a * b,
      formatPrice: (price) => {
        const numberString = price.toString();
        const length = numberString.length;
        const numGroups = Math.ceil(length / 3);
        const groups = [];
        for (let i = 0; i < numGroups; i++) {
          const start = length - (i + 1) * 3;
          const end = start + 3;
          groups.push(numberString.slice(Math.max(0, start), end));
        }
        const result = groups.reverse().join(".");
        return result;
      },
      getUserInfo: (user, field) => typeof user,
      lastItem: (arr) => arr.shift(),
      convertTime: (utcDateString) => {
        var created_date = new Date(utcDateString);

        var months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        var year = created_date.getFullYear();
        var month = months[created_date.getMonth()];
        var date = created_date.getDate();
        var hour = created_date.getHours();
        var min = created_date.getMinutes();
        var sec = created_date.getSeconds();
        var time =
          date +
          "," +
          month +
          " " +
          year +
          " At: " +
          hour +
          ":" +
          min +
          ":" +
          sec;
        return time;
      },
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views")); // chỉ định đường dẫn thư mục views

// Routes init
route(app); //

// socketIO
socketio(io);
//end socketIO

httpServer.listen(port, (request, respond) => {
  console.log(`Our server is live on ${port}. Yay!`);
});
