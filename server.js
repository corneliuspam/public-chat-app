// server.js
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

const USERS_FILE = path.join(__dirname, "data", "users.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // serve static files

// Login page
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

// Dashboard page
app.get("/dashboard", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/dashboard.html"));
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing login fields" });

  if (!fs.existsSync(USERS_FILE)) return res.status(500).json({ error: "Server error: users file missing" });

  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ error: "User not found" });
  if (password !== user.password) return res.status(400).json({ error: "Wrong password" });

  res.json({ success: true, username: user.username });
});

// Fallback route (must come last)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

app.listen(PORT, () => console.log(`PAM APP running on port ${PORT}`));
