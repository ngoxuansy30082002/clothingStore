const User = require("../app/models/User");
const Chat = require("../app/models/Chat");

var activeUser;
var destination = "admin";
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
      else socket.join(username);

      const clientCount = io.engine.clientsCount;

      io.to("admin").emit(
        "chat:list-user-online",
        activeUser,
        destination,
        clientCount
      );

      // console.log(socket.adapter.rooms);
    } catch (error) {}
  };

  const messageToAdmin = async (payload) => {
    io.to("admin").emit("chat:message", payload);
    try {
      await Chat.create({
        sender: payload.sender,
        room: payload.sender,
        message: payload.message,
      });
    } catch (error) {}
  };

  const message = async (payload) => {
    try {
      await Chat.create({
        sender: payload.sender,
        room: destination,
        message: payload.message,
      });
    } catch (error) {}
    socket.to(destination).emit("chat:message", payload);
  };

  const joinRoom = async (payload) => {
    destination = payload;
    try {
      const chats = await Chat.find({
        room: destination,
      });
      socket.emit("chat:load-message", chats, destination);
    } catch (error) {}
  };
  const loadMessage = async (payload) => {
    try {
      const chats = await Chat.find({
        room: payload,
      });
      socket.emit("chat:load-message", chats);
    } catch (error) {}
  };
  const messageAllUser = async (payload) => {
    try {
      await Chat.create({
        sender: payload.sender,
        room: destination,
        message: payload.message,
      });
      socket.broadcast.emit("chat:message", payload);
    } catch (error) {}
  };

  const userOffline = async (payload) => {
    const user = await socket.username;
    // if (!user) {
    //   console.log("disconnect", user);
    //   await User.updateMany({}, { active: false });
    //   await getActiveUser();
    // } else {
    console.log("disconnect", user);
    await User.updateOne({ username: socket.username }, { active: false });
    await getActiveUser();
    // }
    io.to("admin").emit("chat:list-user-online", activeUser);
  };

  socket.on("chat:user-online", userOnline);
  socket.on("disconnect", userOffline);
  socket.on("chat:message-to-admin", messageToAdmin);
  socket.on("chat:message", message);
  socket.on("chat:join-room", joinRoom);
  socket.on("chat:load-message", loadMessage);
  socket.on("chat:message-to-all-user", messageAllUser);
};
