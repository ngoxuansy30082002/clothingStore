const iconFeedback = document.querySelectorAll(".feedback li");
const btnPushFeedback = $("#form-feedback button");
const textPushFeedback = $("#feedbackinput");
const feedbackList = $("#feedbackList");
var rating = 4;

$(document).ready(() => {
  socket.emit("feedback:load", {
    product: getSlugFromURL(),
  });
  iconFeedback.forEach(function (el, index) {
    el.addEventListener("click", () => {
      rating = index + 1;
    });
  });
  btnPushFeedback.click((e) => {
    e.preventDefault();

    socket.emit("feedback:push", {
      userId: currentUser.other._id,
      username: currentUser.other.username,
      rating: rating,
      comment: textPushFeedback.val(),
      product: getSlugFromURL(),
    });
  });
});

socket.on("feedback:pull", (payload) => {
  if (payload.product === getSlugFromURL()) renderFeedback(payload);
});

socket.on("feedback:get", (payload) => {
  feedbackList.html("");
  payload.forEach((feedback) => {
    if (feedback.product === getSlugFromURL()) renderFeedback(feedback);
  });
});

function renderFeedback(payload) {
  let starsHTML = "";
  for (let i = 0; i < payload.rating; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }
  feedbackList.append(`
                 <li class="list-group-item">
                    <strong>Username:</strong> ${payload.username} <br>
                    <strong></strong> ${payload.comment} <br>
                    <strong>Rating:</strong>
                    <div class="star">${starsHTML}</div>
                </li>
    `);
}

function getSlugFromURL() {
  var currentURL = window.location.href;
  var pathArray = currentURL.split("/");
  var shopPartIndex = pathArray.indexOf("shop");
  if (shopPartIndex !== -1 && shopPartIndex < pathArray.length - 1) {
    var result = pathArray.slice(shopPartIndex + 1, pathArray.length).join("/");
    return result;
  }
}
