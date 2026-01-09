function register() {
  const username = document.getElementById("reg-username").value;
  const email = document.getElementById("reg-email").value;
  const phone = document.getElementById("reg-phone").value;
  const password = document.getElementById("reg-password").value;

  fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, phone, password })
  })
  .then(async res => {
    const text = await res.text();

    try {
      const data = JSON.parse(text);
      if (data.success) {
        alert("Registration successful. Please login.");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch {
      alert(text);
    }
  })
  .catch(err => {
    alert("Registration error");
    console.error(err);
  });
}
