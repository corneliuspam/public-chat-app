const express = require("express");
const path = require("path");
const fs = require("fs");
const fileUpload = require("express-fileupload");

const app = express();
const PORT = process.env.PORT || 3000;

const USERS_FILE = path.join(__dirname, "data", "users.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Fallback: serve dashboard static file
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// Fallback for unknown routes → index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Login
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

// Start server
app.listen(PORT, () => console.log(`PAM APP running on port ${PORT}`));
