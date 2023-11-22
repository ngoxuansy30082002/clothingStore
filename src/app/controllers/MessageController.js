const jwt = require("jsonwebtoken");

class MessageController {
  //[GET] /home
  async message(req, res, next) {
    const accessToken = req.cookies.accessToken;
    var currentUser;
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        currentUser = user;
      });
    }
    try {
      res.render("message/message", {
        showHeaderAndFooter: true,
        currentUser,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
module.exports = new MessageController();
