// currentUser = JSON.parse(localStorage.getItem("currentUser"));

// const app = $("#right-block");
const messageInputAdmin = $("#message-input.admin");
const sendBtnAdmin = $("#send-message.admin");
const userList = $("#user-list.admin");

$(document).ready(() => {
  sendBtnAdmin.click(() => sendMessageToUser());
  messageInputAdmin.keydown(function (event) {
    // Kiểm tra xem phím người dùng nhấn có phải là Enter không
    if (event.which == 13) sendMessageToUser();
  });
});

function sendMessageToUser() {
  let message = messageInputAdmin.val();
  if (message.trim() === "") return;
  renderMessage("my", {
    username: uname,
    text: message,
  });

  socket.emit("chat:message", {
    username: currentUser.other.username,
    text: message,
  });
  messageInputAdmin.val("");
}
