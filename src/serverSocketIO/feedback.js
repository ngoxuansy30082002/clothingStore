const User = require("../app/models/User");
const Product = require("../app/models/Product");
const Feedback = require("../app/models/Feedback");

module.exports = (io, socket) => {
  const feedbackPush = async (payload) => {
    try {
      const feedback = await Feedback.create({
        userId: payload.userId,
        comment: payload.comment,
        rating: payload.rating,
      });
      await Product.updateOne(
        { slug: payload.product },
        { $push: { feedbacks: feedback._id } }
      );
    } catch (error) {}
    io.sockets.emit("feedback:pull", {
      username: payload.username,
      comment: payload.comment,
      rating: payload.rating,
      product: payload.product,
    });
  };

  const feedbackLoad = async (payload) => {
    try {
      const product = await Product.findOne({ slug: payload.product });
      const feedbacks = await Feedback.find({
        _id: { $in: product.feedbacks },
      });
      const result = await Promise.all(
        feedbacks.map(async (feedback) => {
          const user = await User.findOne({
            _id: feedback.userId,
          });

          return {
            username: user ? user.username : "Unknown User",
            comment: feedback.comment,
            rating: feedback.rating,
            product: payload.product,
          };
        })
      );
      socket.emit("feedback:get", result);
    } catch (error) {}
  };

  socket.on("feedback:push", feedbackPush);
  socket.on("feedback:load", feedbackLoad);
};
