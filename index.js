const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.static("../client"));

const rooms = {};

io.on("connection", (socket) => {
  console.log("New client:", socket.id);

  socket.on("join", (room) => {
    socket.join(room);
    if (!rooms[room]) rooms[room] = [];
    rooms[room].push(socket.id);

    // Once two players in room
    if (rooms[room].length === 2) {
      const hand1 = getRandomHand();
      const hand2 = getRandomHand();
      const [id1, id2] = rooms[room];

      io.to(id1).emit("state", { hand1: { id: id1, cards: hand1 }, hand2: { id: id2, cards: hand2 } });
      io.to(id2).emit("state", { hand1: { id: id1, cards: hand1 }, hand2: { id: id2, cards: hand2 } });
    }
  });

  socket.on("disconnect", () => {
    for (let room in rooms) {
      rooms[room] = rooms[room].filter(id => id !== socket.id);
      if (rooms[room].length === 0) delete rooms[room];
    }
    console.log("Client disconnected:", socket.id);
  });
});

function getRandomHand() {
  const sample = [
    { name: "Katana Slash", damage: 15, effect: "Bleed" },
    { name: "Wind Step", damage: 0, effect: "Evade" },
    { name: "Healing Chant", damage: -20, effect: "Restore" },
    { name: "Blazing Arrow", damage: 20, effect: "Burn" }
  ];
  return Array.from({ length: 3 }, () => sample[Math.floor(Math.random() * sample.length)]);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
