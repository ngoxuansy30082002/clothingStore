const User = require("../app/models/User");
var activeUser;

async function getActiveUser() {
  const users = await User.find({ active: true });
  activeUser = users.map((user) => {
    const { password, ...userWithoutPassword } = user._doc || user;
    return userWithoutPassword;
  });
}

module.exports = (io, socket) => {
  const userOnline = async (payload) => {
    try {
      const { username, email } = payload.other;
      socket.username = username;

      await User.updateOne({ username: username }, { active: true });
      await getActiveUser();

      if (username === "admin") socket.join("admin");
      else socket.join("user");

      io.to("admin").emit("chat:list-user-online", activeUser);
    } catch (error) {}
  };

  const messageToAdmin = (payload) => {
    io.to("admin").emit("chat:message", payload);
  };

  const message = (payload) => {
    io.to("user").emit("chat:message", payload);
  };

  const userOffline = async (payload) => {
    const user = socket.username;
    await User.updateOne({ username: user }, { active: false });
    await getActiveUser();
    io.to("admin").emit("chat:list-user-online", activeUser);
  };

  socket.on("chat:user-online", userOnline);
  socket.on("disconnect", userOffline);
  socket.on("chat:message-to-admin", messageToAdmin);
  socket.on("chat:message", message);
};
