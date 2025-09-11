import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token: "hoang 18 tuoi",
    role: "host",
  }
});

// client-side
socket.on("connect", () => {
  console.log(socket.id);

  socket.onAny(async (eventName, ...args) => {
    console.log(eventName, args);
  });
});

socket.on("disconnect", () => {
  console.log(socket.id); // undefined
  socket.removeAllListeners();
});