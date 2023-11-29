$(".person").on("click", function () {
  $(this).toggleClass("focus").siblings().removeClass("focus");
});
// currentUser = JSON.parse(localStorage.getItem("currentUser"));
//connect to server
var socket = io(`http://localhost:9000`);
$(document).ready(() => {
  socket.emit("chat:user-online", currentUser);
});
socket.on("chat:list-user-online", (payload) => {
  console.log(payload);
  const people = $("#people");

  people.html("");
  payload.forEach((element) => {
    people.append(`
            <li class="person">
                <div class="title">${element.username} </div>
                <div class="preview">${element.email}</div>
            </li>
    `);
  });
});
