function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(async res => {
    const data = await res.json();

    if (data.success) {
      window.location.href = "/dashboard";
    } else {
      alert(data.error || "Login failed");
    }
  })
  .catch(err => {
    alert("Login error");
    console.error(err);
  });
}
