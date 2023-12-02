// var URLSocket = currentUser.URLSocket;
var currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

var socket = io("http://localhost:9000");
var des = "admin";
var uname;

$(document).ready(() => {
  socket.emit("chat:user-online", currentUser);
});

//admin
socket.on("chat:list-user-online", (users, destination, clientCount) => {
  des = destination;
  renderListUser(users, clientCount);
});

socket.on("chat:message", (payload) => {
  if (payload.sender === des || payload.sender === "admin")
    renderMessage("other", payload);
});

socket.on("chat:load-message", (payload, destination) => {
  des = destination;
  $(".messages").html("");
  // console.log(payload);
  // console.log(currentUser.other.username);
  payload.forEach((message) => {
    // console.log(message);
    if (message.sender === currentUser.other.username)
      renderMessage("my", message);
    else renderMessage("other", message);
  });
  // renderMessage("other", payload);
});

function renderMessage(type, message) {
  let messageContainer = $(".messages");
  if (type === "my") {
    messageContainer.append(`
                <div class="message my-message">
                    <div>
                        <div class="name">You</div>
                        <div class="text">${message.message}</div>
                    </div>
                </div>
        `);
  } else if (type == "other") {
    messageContainer.append(`
                 <div class="message other-message">
                    <div>
                        <div class="name">${message.sender}</div>
                        <div class="text">${message.message}</div>
                    </div>
                </div>
      `);
  } else if (type == "update") {
  }
  messageContainer.scrollTop =
    messageContainer.scrollHeight - messageContainer.clientHeight;
}
