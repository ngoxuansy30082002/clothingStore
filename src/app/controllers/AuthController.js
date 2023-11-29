const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const os = require("os");
const networkInterfaces = os.networkInterfaces();
// Lấy địa chỉ IPv4 của thiết bị
function getIPv4Address() {
  for (const key in networkInterfaces) {
    const interfaceList = networkInterfaces[key];
    for (const interfaceItem of interfaceList) {
      if (interfaceItem.family === "IPv4" && !interfaceItem.internal) {
        return interfaceItem.address;
      }
    }
  }
  return "Không tìm thấy địa chỉ IPv4";
}
var URLSocket = getIPv4Address();
console.log(URLSocket);

const {
  multipleMongooseToObject,
  shuffleArray,
} = require("../../util/mongoose");
const { generateAccessToken, generateRefreshToken } = require("../../util/jwt");

class AuthController {
  //[POST] /auth/login
  async loginUser(req, res, next) {
    try {
      //check user
      const user = await User.findOne({
        username: req.body.username,
      });
      if (!user) {
        return res.status(404).json("Username not found");
        // res.render("login/loginForm", {
        //   usernameError: true,
        // });
        // return;
      }
      //check password
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(404).json("Password incorrect");
        // res.render("login/loginForm", {
        //   passwordError: true,
        // });
        // return;
      }
      if (user.active) {
        return res.status(404).json("Account is active");
      }

      //username & password correct
      if (user && validPassword) {
        await User.updateOne(
          {
            username: req.body.username,
          },
          { active: true }
        );
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          samSite: "strict",
        });
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          samSite: "strict",
        });
        const { password, ...other } = user._doc; // xóa password trong response
        // res.redirect("/home");
        res.status(200).json({
          URLSocket,
          other,
          accessToken,
        });
        // res.redirect("/");
        return;
      }
    } catch (error) {}
  }

  //[GET] /auth/logout
  async logoutUser(req, res, next) {
    try {
      await User.updateOne(
        {
          username: req.user.username,
        },
        { active: false }
      );
      res.clearCookie("accessToken");
      res.redirect("/");
    } catch (error) {
      res.status(500).json(error);
    }
  }

  //[POST] /auth/register
  async registerUser(req, res, next) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      //created new user
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });
      // save newUser to DB
      const user = await newUser.save();

      res.status(200).json(user);
      // res.render("login/loginForm", {
      //   signUpSucces: true,
      // });
    } catch (error) {
      res.status(500).json("Username or email already exists");
      // res.render("login/loginForm", {
      //   signUpError: true,
      // });
    }
  }

  async refreshToken(req, res, next) {
    //lấy refresh token từ user
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("You 're not auth");
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        samSite: "strict",
      });
      res.status(200).json(newAccessToken);
    });
  }

  //[GET] /auth
  async loginForm(req, res, next) {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY); // Thay 'your-secret-key' bằng key bạn đã sử dụng khi tạo accessToken
      const user = decoded.username;
      console.log(user);
      try {
        await User.updateOne(
          {
            username: user,
          },
          { active: false }
        );
        res.clearCookie("accessToken");
      } catch (error) {
        res.status(404).json("Error");
      }
    }
    res.render("login/loginForm");
  }
}
module.exports = new AuthController();
