$(".person").on("click", function () {
  $(this).toggleClass("focus").siblings().removeClass("focus");
});
// currentUser = JSON.parse(localStorage.getItem("currentUser"));
//connect to server
var socket = io("http://localhost:9000");
$(document).ready(() => {
  socket.emit("user-online", currentUser);
});
socket.on("server-response", (data) => {
  console.log(data);
});
