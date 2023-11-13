const User = require("../models/User");
const {
  multipleMongooseToObject,
  shuffleArray,
} = require("../../util/mongoose");
class LoginController {
  //[POST] /signIn
  async signIn(req, res, next) {
    try {
      if (req.body.username === "admin" && req.body.password === "admin") {
        res.redirect("/admin");
      } else {
        const user = await User.findOne({
          username: req.body.username,
          password: req.body.password,
        });
        if (user !== null) res.redirect("/home");
        else {
          res.render("login/loginForm", {
            signInError: true,
          });
        }
      }
    } catch (error) {
      //
    }
  }

  //[POST] /signUp
  async signUp(req, res, next) {
    try {
      const user = await User.findOne({
        username: req.body.username,
      });
      const email = await User.findOne({
        email: req.body.email,
      });
      if (user !== null || email !== null) {
        res.render("login/loginForm", {
          signUpError: true,
        });
      } else {
        await User.create(req.body);
        res.render("login/loginForm", {
          signUpSucces: true,
        });
      }
    } catch (error) {
      //
    }
  }

  //[GET] /
  async loginForm(req, res, next) {
    res.render("login/loginForm");
  }
}
module.exports = new LoginController();
