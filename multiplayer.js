const socket = io();
let room = "";

function joinRoom() {
  room = document.getElementById("room-id").value;
  socket.emit("join", room);
  document.getElementById("multiplayer-status").textContent = `Joined room: ${room}`;
}

function createRoom() {
  room = Math.random().toString(36).substring(2, 8);
  socket.emit("join", room);
  document.getElementById("room-id").value = room;
  document.getElementById("multiplayer-status").textContent = `Room created: ${room}`;
}

socket.on("state", ({ hand1, hand2 }) => {
  const player = socket.id === hand1.id ? hand1 : hand2;
  const opponent = socket.id === hand1.id ? hand2 : hand1;

  document.getElementById("player-hand").innerHTML = player.cards.map(renderCard).join("");
  document.getElementById("opponent-hand").innerHTML = opponent.cards.map(renderCard).join("");
});

function renderCard(card) {
  return `<div class="card">
    <h3>${card.name}</h3>
    <p><strong>Power:</strong> ${card.damage}</p>
    <p><strong>Effect:</strong> ${card.effect}</p>
  </div>`;
}
