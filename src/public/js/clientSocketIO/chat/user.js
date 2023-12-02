// currentUser = JSON.parse(localStorage.getItem("currentUser"));

const messageInputUser = $("#message-input");
const sendBtnUser = $("#send-message");
const adminItem = $("#user-list.user");

$(document).ready(() => {
  sendBtnUser.click(() => sendMessageToAdmin());
  messageInputUser.keydown(function (event) {
    // Kiểm tra xem phím người dùng nhấn có phải là Enter không
    if (event.which == 13) sendMessageToAdmin();
  });
});
adminItem.click(() => {
  socket.emit("chat:load-message", currentUser.other.username);
});
function sendMessageToAdmin() {
  let message = messageInputUser.val();
  if (message.trim() === "") return;
  renderMessage("my", {
    sender: uname,
    message: message,
  });
  socket.emit("chat:message-to-admin", {
    sender: currentUser.other.username,
    message: message,
  });
  messageInputUser.val("");
}
