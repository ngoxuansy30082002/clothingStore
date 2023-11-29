// currentUser = JSON.parse(localStorage.getItem("currentUser"));

const messageInputUser = $("#message-input");
const sendBtnUser = $("#send-message");

$(document).ready(() => {
  sendBtnUser.click(() => sendMessageToAdmin());
  messageInputUser.keydown(function (event) {
    // Kiểm tra xem phím người dùng nhấn có phải là Enter không
    if (event.which == 13) sendMessageToAdmin();
  });
});

function sendMessageToAdmin() {
  let message = messageInputUser.val();
  if (message.trim() === "") return;
  renderMessage("my", {
    username: uname,
    text: message,
  });
  socket.emit("chat:message-to-admin", {
    username: currentUser.other.username,
    text: message,
  });
  messageInputUser.val("");
}
