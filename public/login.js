// login.js
window.location.href = "dashboard.html";

// LOGIN FUNCTION
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
      // Save username in sessionStorage to show in dashboard
      sessionStorage.setItem("username", data.username);
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

// OPTIONAL: On dashboard, display logged-in username
// In dashboard.html, call this function after loading
function showUsername() {
  const username = sessionStorage.getItem("username");
  if (username) {
    const topBar = document.querySelector(".top-bar h2");
    if (topBar) topBar.textContent = `PAM APP – ${username}`;
  }
}
