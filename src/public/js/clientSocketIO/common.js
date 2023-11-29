// var URLSocket = currentUser.URLSocket;
var currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

var socket = io("http://localhost:9000");

var uname;
$(document).ready(() => {
  socket.emit("chat:user-online", currentUser);
});

//admin
socket.on("chat:list-user-online", (users) => {
  renderListUser(users);
});
// socket.on("chat:user-offline", (users) => {
//   console.log(users);
//   //   renderListUser(users);
// });

socket.on("chat:message", (payload) => renderMessage("other", payload));

function renderMessage(type, message) {
  let messageContainer = $(".messages");
  if (type === "my") {
    messageContainer.append(`
                <div class="message my-message">
                    <div>
                        <div class="name">You</div>
                        <div class="text">${message.text}</div>
                    </div>
                </div>
        `);
  } else if (type == "other") {
    messageContainer.append(`
                 <div class="message other-message">
                    <div>
                        <div class="name">${message.username}</div>
                        <div class="text">${message.text}</div>
                    </div>
                </div>
      `);
  } else if (type == "update") {
  }
  messageContainer.scrollTop =
    messageContainer.scrollHeight - messageContainer.clientHeight;
}
function renderListUser(users) {
  userList.html("");
  $.each(users, function (_, user) {
    const listItem = $("<li>")
      .addClass("user-item")
      .html(`<strong>${user.username}</strong><br>${user.email}`);
    userList.append(listItem);
  });
}
