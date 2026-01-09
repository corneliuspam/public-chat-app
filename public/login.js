// public/login.js
function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!username || !password) {
    alert("Please enter username and password");
    return;
  }

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      // Store username in sessionStorage
      sessionStorage.setItem("username", data.username);
      // Redirect to dashboard route
      window.location.href = "/dashboard";
    } else {
      alert(data.error || "Login failed");
    }
  })
  .catch(err => {
    console.error("Login error:", err);
    alert("Server error. Try again later.");
  });
}
