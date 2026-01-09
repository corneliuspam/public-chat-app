const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const { Server } = require("socket.io");
const fileUpload = require("express-fileupload");
const bcrypt = require("bcrypt");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const USERS_FILE = path.join(DATA_DIR, "users.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(fileUpload());

// ===== Registration =====
app.post("/register", async (req, res) => {
  const { username, email, phone, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  let users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8") || "[]");

  if (users.find(u => u.username === username || u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  users.push({
    username,
    email,
    phone,
    password: hash,
    profile: ""
  });

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ success: true });
});

// ===== Login =====
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing login fields" });
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8") || "[]");
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ error: "Wrong password" });
  }

  res.json({
    success: true,
    username: user.username
  });
});

// ===== Dashboard page =====
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// ===== File uploads =====
app.post("/upload", (req, res) => {
  if (!req.files || !req.files.image) return res.status(400).send("No file uploaded");

  const image = req.files.image;
  const uploadPath = path.join(__dirname, "public", "uploads", image.name);

  image.mv(uploadPath, err => {
    if (err) return res.status(500).send(err);
    res.send({ url: "/uploads/" + image.name });
  });
});

// ===== Socket.IO =====
io.on("connection", (socket) => {
  let messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8") || "[]");
  socket.emit("history", messages);

  socket.on("message", msg => {
    messages.push(msg);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    io.emit("message", msg);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("PAM APP running on port", PORT));
