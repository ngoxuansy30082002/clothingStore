// currentUser = JSON.parse(localStorage.getItem("currentUser"));

// const app = $("#right-block");
const messageInputAdmin = $("#message-input.admin");
const sendBtnAdmin = $("#send-message.admin");
const userList = $("#user-list.admin");
const countUserOnline = $("#count-user-online");

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
    sender: uname,
    message: message,
  });
  if (des === "admin")
    socket.emit("chat:message-to-all-user", {
      sender: currentUser.other.username,
      message: message,
    });
  else
    socket.emit("chat:message", {
      sender: currentUser.other.username,
      message: message,
    });
  messageInputAdmin.val("");
}
function renderListUser(users, clientCount) {
  countUserOnline.html(`(${users.length})`);

  userList.html("");
  $.each(users, function (_, user) {
    const listItem = $("<li>")
      .addClass("user-item")
      .html(`<strong>${user.username}</strong><br>${user.email}`)
      .on("click", function () {
        userList.find("li").removeClass("active");
        $(this).addClass("active");
        socket.emit("chat:join-room", user.username);
      });
    if (user.username === des) {
      listItem.addClass("active");
    }
    userList.append(listItem);
  });
}
