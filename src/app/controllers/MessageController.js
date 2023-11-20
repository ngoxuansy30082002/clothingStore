class MessageController {
  //[GET] /home
  async chat(req, res, next) {
    res.render("message/message", {
      showHeaderAndFooter: true,
    });
  }
}
module.exports = new MessageController();
