const loginUser = document.querySelector("#navbar li:last-child a");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
var newText = "Login";

if (currentUser) {
  newText = "Hi, " + currentUser.other.username;
  const nav = document.getElementById("navbar");
  if (nav) {
    const newLi = document.createElement("li");
    const newLink = document.createElement("a");
    newLink.href = "/";
    newLink.textContent = "Logout";

    newLi.appendChild(newLink);
    nav.appendChild(newLi);
    newLink.addEventListener("click", function (event) {
      localStorage.removeItem("currentUser");
    });
  }
}

if (loginUser) loginUser.innerText = newText;
if (newText !== "Login") {
  loginUser.addEventListener("click", function (event) {
    event.preventDefault();
  });
}
