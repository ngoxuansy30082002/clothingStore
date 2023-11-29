const jwt = require("jsonwebtoken");

class ChatController {
  //[GET] /home
  async chat(req, res, next) {
    const accessToken = req.cookies.accessToken;
    var currentUser;
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        currentUser = user;
      });
    }
    try {
      res.render("chat/chat", {
        showHeaderAndFooter: true,
        currentUser,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
module.exports = new ChatController();
