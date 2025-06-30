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
  window.history.replaceState({}, document.title, "/"); // clean URL
  showUser();
} else if (urlParams.has("error")) {
  alert("GitHub authentication failed.");
  console.error("GitHub login error:", urlParams.get("error"));
}

// If token exists on page load, show user info
if (localStorage.getItem("token")) {
  showUser();
}

// Login button click → redirect to GitHub login via backend
loginBtn.onclick = () => {
  window.location.href = `${BACKEND_URL}/login/github`;
};

// Show user info from decoded JWT
function showUser() {
  const token = localStorage.getItem("token");
  if (!token) {
    userInfo.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    return;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Malformed JWT");

    const payload = JSON.parse(atob(parts[1]));
    console.log("Decoded JWT payload:", payload);

    usernameEl.textContent = payload.name || payload.sub;
    avatarEl.src = payload.avatar_url;

    userInfo.classList.remove("hidden");
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
  } catch (e) {
    console.error("Invalid JWT:", e);
    localStorage.removeItem("token");
    alert("Session expired or login failed. Please log in again.");
    location.reload();
  }
}

// Fetch private GitHub repos using token
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

// Logout: clear token, notify backend, reload
if (logoutBtn) {
  logoutBtn.onclick = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${BACKEND_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (e) {
      console.warn("Logout error:", e);
    }

    localStorage.removeItem("token");
    location.reload();
  };
}