const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".login-container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
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
// toast({ title: "aaa", type: "toast__error", message: "aaa" });

let user = {};
function handleChange(event) {
  user[event.target.name] = event.target.value;
}

async function handleLogin(event) {
  event.preventDefault();
  let { ResStatus, ResData } = await loginReq(user);
  if (ResStatus === 404) {
    toast({ title: "LOGIN ERROR", type: "toast__error", message: ResData });
  }
  if (ResStatus === 200) {
    localStorage.setItem("currentUser", JSON.stringify(ResData));
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser.other.admin) window.location.href = "/";
    else window.location.href = "/admin";
  }
}
async function loginReq(user) {
  try {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const ResStatus = await res.status;
    const ResData = await res.json();
    return { ResStatus, ResData };
  } catch (error) {
    console.error("Error:", error);
  }
}

async function handleRegister(event) {
  event.preventDefault();
  let { ResStatus, ResData } = await RegisterReq(user);
  if (ResStatus === 500) {
    toast({ title: "REGISTER ERROR", type: "toast__error", message: ResData });
  }
  if (ResStatus === 200) {
    toast({
      title: "REGISTER SUCCESSFULLY",
      type: "toast__success",
      message: "Congratulation",
    });
    setTimeout(() => {
      window.location.href = "/auth";
    }, 1000);
  }
}
async function RegisterReq(user) {
  try {
    const res = await fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const ResStatus = await res.status;
    const ResData = await res.json();
    return { ResStatus, ResData };
  } catch (error) {
    console.error("Error:", error);
  }
}
