// === DOM Elements ===
const loginBtn = document.getElementById("login-btn");
const userInfo = document.getElementById("user-info");
const usernameEl = document.getElementById("username");
const avatarEl = document.getElementById("avatar");
const reposBtn = document.getElementById("repos-btn");
const reposEl = document.getElementById("repos");
const logoutBtn = document.getElementById("logout-btn");
const status = document.getElementById("status");
const darkToggle = document.getElementById("dark-mode-toggle");

const BACKEND_URL = "https://github-tracker-backend-5bu3.onrender.com";

// === DARK MODE TOGGLE ===
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  darkToggle.checked = true;
}

darkToggle.addEventListener("change", () => {
  if (darkToggle.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});

// === INITIAL CHECK ===
showUser();

// === LOGIN BUTTON ===
loginBtn.onclick = () => {
  window.location.href = `${BACKEND_URL}/login/github`;
};

// === FETCH USER INFO ===
async function showUser() {
  try {
    const res = await fetch(`${BACKEND_URL}/me`, {
      method: "GET",
      credentials: "include"
    });

    if (!res.ok) throw new Error("Not logged in");

    const data = await res.json();
    usernameEl.textContent = data.name || data.username;
    avatarEl.src = data.avatar_url;

    userInfo.classList.remove("hidden");
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
  } catch (err) {
    console.warn("User not authenticated:", err);
    userInfo.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
  }
}

// === FETCH PRIVATE REPOS ===
reposBtn.onclick = async () => {
  reposBtn.disabled = true;
  reposEl.textContent = "Loading...";
  status.textContent = "";

  try {
    const res = await fetch(`${BACKEND_URL}/github/private`, {
      method: "GET",
      credentials: "include"
    });

    if (res.status === 401) {
      status.textContent = "Session expired. Please log in again.";
      window.location.href = "/";
      return;
    }

    if (!res.ok) throw new Error("Failed to fetch repos");

    const data = await res.json();
    reposEl.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    reposEl.textContent = "";
    status.textContent = "Error fetching repositories.";
    console.error(e);
  } finally {
    reposBtn.disabled = false;
  }
};

// === LOGOUT BUTTON ===
logoutBtn.onclick = async () => {
  logoutBtn.disabled = true;
  try {
    await fetch(`${BACKEND_URL}/logout`, {
      method: "POST",
      credentials: "include"
    });

    await new Promise((r) => setTimeout(r, 400));
    window.location.href = "/";
  } catch (e) {
    console.warn("Logout error:", e);
    alert("Logout failed. Please try again.");
    logoutBtn.disabled = false;
  }
};