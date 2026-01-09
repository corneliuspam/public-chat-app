function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(async res => {
    const text = await res.text();

    try {
      const data = JSON.parse(text);
      if (data.username) {
        window.location.href = "/dashboard";
      } else {
        alert(text);
      }
    } catch {
      alert(text);
    }
  })
  .catch(err => {
    alert("Login error");
    console.error(err);
  });
}
