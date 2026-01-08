const socket = io();

socket.on("history", msgs => {
  msgs.forEach(msg => addMessage(msg));
});

socket.on("message", msg => addMessage(msg));

function addMessage(msg) {
  const div = document.createElement("div");
  if(msg.image){
    div.innerHTML = `<b>${msg.user}:</b> <img src="${msg.image}" style="max-width:150px;">`;
  } else {
    div.innerHTML = `<b>${msg.user}:</b> ${msg.text}`;
  }
  document.getElementById("messages").appendChild(div);
}

function sendMsg() {
  const text = document.getElementById("msg").value;
  if (!text) return;
  socket.emit("message", { user: "Anonymous", text });
  document.getElementById("msg").value = "";
}

function sendImage() {
  const file = document.getElementById("file").files[0];
  if (!file) return;
  const form = new FormData();
  form.append("image", file);

  fetch("/upload", { method: "POST", body: form })
    .then(res => res.json())
    .then(data => {
      socket.emit("message", { user: "Anonymous", image: data.url });
    });
}
