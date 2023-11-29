const chatHandler = require("./chat");

function socketio(io) {
  const onConnection = (socket) => {
    chatHandler(io, socket);

    //handler
  };

  io.on("connection", onConnection);
  //event
}

module.exports = socketio;
//  io.on("connection", (socket) => {
//    // const count = io.engine.clientsCount; // lấy số lượng kết nối
//    // console.log(count);
//    console.log("Connect: ", socket.id);
//    socket.on("disconnect", () => {
//      console.log("Disconnect: ", socket.id);
//    });
//    socket.on("user-online", (data) => {
//      console.log(data);
//      socket.emit("server-response", "OK");
//      // io.sockets.emit("Server-send-data", `server: ${data}`); // return response all client
//      // socket.emit("Server-send-data", `server: ${data}`); // only return response to sending client
//      // socket.broadcast.emit("Server-send-data", `server: ${data}`); // return response broadcast except client send
//    });
//  });
