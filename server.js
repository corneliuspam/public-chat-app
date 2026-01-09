// server.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const fileUpload = require("express-fileupload");

const app = express();
const PORT = process.env.PORT || 3000;

// Path to users file (pre-created users)
const USERS_FILE = path.join(__dirname, "data", "users.json");

// ===== MIDDLEWARE =====
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve public folder
app.use(fileUpload());

// ===== ROUTES =====

// Root → Login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Dashboard page
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// ===== LOGIN ROUTE =====
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing login fields" });
    }

    // Read users from JSON file
    let users = [];
    if (fs.existsSync(USERS_FILE)) {
      users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    } else {
      console.error("Users file not found:", USERS_FILE);
      return res.status(500).json({ error: "Server error: users file missing" });
    }

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Wrong password" });
    }

    // Login success
    res.json({
      success: true,
      username: user.username,
      profile: user.profile
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`PAM APP running on port ${PORT}`);
});
