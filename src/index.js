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
// connect to mongodb
db.connect();

const app = express();
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  // connectionStateRecovery: {
  //   // the backup duration of the sessions and the packets
  //   maxDisconnectionDuration: Infinity,
  //   // whether to skip middlewares upon successful recovery
  //   skipMiddlewares: true,
  // },
});
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
      getUserInfo: (user, field) => typeof user,
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views")); // chỉ định đường dẫn thư mục views
// Routes init
route(app);

// socketIO
socketio(io);
//end socketIO

httpServer.listen(port, (request, respond) => {
  console.log(`Our server is live on ${port}. Yay!`);
});
