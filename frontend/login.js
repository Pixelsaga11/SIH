const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const mobile = document.getElementById("mobile");
const mobileError = document.getElementById("mobileError");
const formMessage = document.getElementById("formMessage");
const togglePassword = document.getElementById("togglePassword");
const methodTabs = [...document.querySelectorAll(".method-tab")];
let loginMethod = "email";
const demoLoginButton = document.getElementById("demoLoginButton");

const returnTo = new URLSearchParams(window.location.search).get("returnTo");
if (sessionStorage.getItem("railsenseSignedIn") === "true" || localStorage.getItem("railsenseRemembered") === "true") {
  window.location.replace(returnTo || "index.html");
}

methodTabs.forEach((tab) => tab.addEventListener("click", () => {
  loginMethod = tab.dataset.method;
  methodTabs.forEach((item) => item.classList.toggle("active", item === tab));
  document.getElementById("emailLogin").hidden = loginMethod !== "email";
  document.getElementById("mobileLogin").hidden = loginMethod !== "mobile";
  emailError.textContent = "";
  mobileError.textContent = "";
}));

togglePassword.addEventListener("click", () => {
  const showing = password.type === "text";
  password.type = showing ? "password" : "text";
  togglePassword.textContent = showing ? "Show" : "Hide";
  togglePassword.setAttribute("aria-label", showing ? "Show password" : "Hide password");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  emailError.textContent = "";
  mobileError.textContent = "";
  passwordError.textContent = "";
  formMessage.textContent = "";

  let valid = true;
  if (loginMethod === "email" && (!email.value.trim() || !email.validity.valid)) {
    emailError.textContent = "Enter a valid work email address.";
    valid = false;
  }
  if (loginMethod === "mobile" && !/^[6-9]\d{9}$/.test(mobile.value.replace(/\D/g, ""))) {
    mobileError.textContent = "Enter a valid 10-digit mobile number.";
    valid = false;
  }
  if (password.value.length < 6) {
    passwordError.textContent = "Password must contain at least 6 characters.";
    valid = false;
  }
  if (!valid) {
    form.classList.add("has-error");
    return;
  }

  const submitButton = form.querySelector(".sign-in-button");
  submitButton.disabled = true;
  submitButton.classList.add("is-loading");
  submitButton.innerHTML = "Connecting to Command Center <span class=\"loading-dots\">...</span>";
  formMessage.classList.remove("is-success");
  formMessage.textContent = "Verifying demo access...";
  form.classList.remove("has-error");
  setTimeout(() => {
    sessionStorage.setItem("railsenseSignedIn", "true");
    if (document.getElementById("remember").checked) {
      localStorage.setItem("railsenseRemembered", "true");
    } else {
      localStorage.removeItem("railsenseRemembered");
    }
    submitButton.classList.remove("is-loading");
    submitButton.classList.add("is-success");
    submitButton.innerHTML = "Access granted <span>✓</span>";
    formMessage.classList.add("is-success");
    formMessage.textContent = "Access granted. Opening Command Center...";
    setTimeout(() => { window.location.replace(returnTo || "index.html"); }, 450);
  }, 650);
});

demoLoginButton.addEventListener("click", () => {
  sessionStorage.setItem("railsenseSignedIn", "true");
  sessionStorage.setItem("railsenseDemoRole", "Control Room Operator");
  formMessage.classList.add("is-success");
  formMessage.textContent = "Demo access granted. Opening Command Center...";
  demoLoginButton.disabled = true;
  demoLoginButton.classList.add("is-success");
  demoLoginButton.innerHTML = "Demo access granted <span>✓</span>";
  setTimeout(() => window.location.replace(returnTo || "index.html"), 550);
});

document.getElementById("forgotPassword").addEventListener("click", (event) => {
  event.preventDefault();
  formMessage.textContent = "Password reset instructions will be sent by your administrator.";
});
