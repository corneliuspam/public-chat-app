const socket = io();

function joinChat() {
  const name = document.getElementById("username").value;
  if (!name) return;

  socket.emit("join", name);
  document.getElementById("login").style.display = "none";
  document.getElementById("chat").style.display = "block";
}

function sendMsg() {
  const msg = document.getElementById("msg");
  if (!msg.value) return;

  socket.emit("message", msg.value);
  msg.value = "";
}

socket.on("message", (data) => {
  const div = document.createElement("div");
  div.textContent = `[${data.time}] ${data.user}: ${data.text}`;
  document.getElementById("messages").appendChild(div);
});

socket.on("system", (text) => {
  const div = document.createElement("div");
  div.style.color = "gray";
  div.textContent = text;
  document.getElementById("messages").appendChild(div);
});
