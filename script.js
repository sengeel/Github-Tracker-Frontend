function loginWithGitHub() {
  window.location.href = "https://mybackend.com/login/github";
}

window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (token) {
    fetch("https://mybackend.com/github/private", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      document.getElementById("user-info").innerHTML = `
        <p>Welcome back! Here are your private repos:</p>
        <ul>${data.map(repo => `<li>${repo.name}</li>`).join('')}</ul>
      `;
    });
  }
}