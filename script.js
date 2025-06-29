const loginBtn = document.getElementById("login-btn");
const userInfo = document.getElementById("user-info");
const usernameEl = document.getElementById("username");
const avatarEl = document.getElementById("avatar");
const reposBtn = document.getElementById("repos-btn");
const reposEl = document.getElementById("repos");
const logoutBtn = document.getElementById("logout-btn");

const BACKEND_URL = "https://github-tracker-backend-5bu3.onrender.com";

// Extract token from URL on first login
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("token")) {
  const jwt = urlParams.get("token");
  localStorage.setItem("token", jwt);
  window.history.replaceState({}, document.title, "/"); // remove ?token= from URL
  showUser();
}

// If token exists on page load, show user info
if (localStorage.getItem("token")) {
  showUser();
}

loginBtn.onclick = () => {
  window.location.href = `${BACKEND_URL}/login/github`;
};

function showUser() {
  const token = localStorage.getItem("token");
  if (!token) {
    // No token: hide user info and logout, show login
    userInfo.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    usernameEl.textContent = payload.name || payload.sub;
    avatarEl.src = payload.avatar_url;
    userInfo.classList.remove("hidden");
    loginBtn.classList.add("hidden");

    // Show logout button when logged in
    logoutBtn.classList.remove("hidden");
  } catch (e) {
    console.error("Invalid JWT:", e);
    localStorage.removeItem("token");
    location.reload();
  }
}

reposBtn.onclick = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(`${BACKEND_URL}/github/private`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Failed to fetch repos");
    const data = await res.json();
    reposEl.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    reposEl.textContent = "Error fetching repositories.";
    console.error(e);
  }
};

if (logoutBtn) {
  logoutBtn.onclick = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`${BACKEND_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    localStorage.removeItem("token");
    location.reload();
  };
}