const BACKEND_URL = "https://github-tracker-backend-5bu3.onrender.com"; // Replace with real backend

document.getElementById("login-btn").addEventListener("click", () => {
  window.location.href = `${BACKEND_URL}/login/github`;
});

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (token) {
    localStorage.setItem("token", token);
    const res = await fetch(`${BACKEND_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = await res.json();
    document.getElementById("username").textContent = user.username || user.name;
    document.getElementById("avatar").src = user.avatar_url;
    document.getElementById("user-info").classList.remove("hidden");
    document.getElementById("login-btn").style.display = "none";
  }
};

document.getElementById("repos-btn").addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BACKEND_URL}/github/private?token=${token}`);
  const repos = await res.json();
  document.getElementById("repos").textContent = JSON.stringify(repos, null, 2);
});