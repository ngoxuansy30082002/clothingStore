$(".person").on("click", function () {
  $(this).toggleClass("focus").siblings().removeClass("focus");
});

//connect to server
var socket = io("http://localhost:9000");
$(document).ready(() => {
  $(document).ready(function () {
    $("#mrA").click(() => {
      socket.emit("Client-send-data", `Hello I'm ${socket.id}`);
    });
  });

  socket.on("Server-send-data", (data) => {
    alert(data);
  });
});
