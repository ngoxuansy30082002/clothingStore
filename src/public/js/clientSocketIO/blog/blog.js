var currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

$(document).ready(() => {
  socket.emit("blog:load");
  $(".btn-like").on("click", function () {
    const blogTitle = $(this)
      .closest(".blog-box")
      .find(".blog-details h4")
      .text();

    if ($(this).hasClass("active")) {
      socket.emit("blogunclick:push", {
        title: blogTitle,
        user: currentUser,
      });
      if (currentUser) {
        $(this).toggleClass("active");
        $(this).find("i").remove();
        $(this).append(' <i class="far fa-heart"></i>');
      }
    } else {
      socket.emit("blogclick:push", {
        title: blogTitle,
        user: currentUser,
      });
      if (currentUser) {
        $(this).toggleClass("active");
        $(this).find("i").remove();
        $(this).append('<i class="fa-solid fa-heart"></i>');
      }
    }
  });
});

socket.on("blogclick:update", (payload) => {
  const blogBox = $(".blog-box");
  blogBox.each(function () {
    const blogTitle = $(this).find(".blog-details h4").text();
    if (blogTitle === payload.title) {
      $(this).find(".blog-details .like-count").html(`${payload.likecount}`);
    }
  });
});
socket.on("blog:get", (payload) => {
  const blogBox = $(".blog-box");
  blogBox.each(function () {
    const blogTitle = $(this).find(".blog-details h4").text();
    const likeCount = $(this).find(".blog-details .like-count");
    payload.forEach((blog) => {
      if (blogTitle === blog.title) {
        likeCount.html(`${blog.like}`);
      }
    });
  });
});
socket.on("blog:error", (payload) => {
  toast({
    title: "ACTION FAIL",
    type: "toast__error",
    message: "Please login your account!!",
  });
});

function toast({ title = "", type = "toast__success", message = "" }) {
  const main = document.getElementById("toast");
  if (main) {
    const toast = document.createElement("div");
    const icons = {
      toast__success: "fa-check-circle",
      toast__error: "fa-exclamation-circle",
    };
    const icon = icons[type];
    toast.classList.add("toast", type);
    toast.innerHTML = `
        <div class="toast__icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="toast__body">
            <h3 class="toast__title">${title}</h3>
            <p class="toast__msg">${message}!!!</p>
        </div>
    `;
    main.appendChild(toast);

    setTimeout(() => {
      main.removeChild(toast);
    }, 2600);
  }
}
