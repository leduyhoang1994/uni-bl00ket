import { io } from "socket.io-client";
import { randomUUID } from 'crypto';

const socket = io("http://localhost:3000", {
  auth: {
    token: `client-${ randomUUID()}.client`,
    hostId: 'a89de2'
  }
});

// client-side
socket.on("connect", () => {
  console.log(socket.id);

  socket.onAny(async (eventName, ...args) => {
    console.log(eventName, args[0]);
  });
});

socket.on("disconnect", () => {
  console.log(socket.id); // undefined
  socket.removeAllListeners();
});