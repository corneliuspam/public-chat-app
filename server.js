const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("join", (username) => {
    socket.username = username;
    io.emit("system", `${username} joined the chat`);
  });

  socket.on("message", (msg) => {
    io.emit("message", {
      user: socket.username || "Anonymous",
      text: msg,
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit("system", `${socket.username} left the chat`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});