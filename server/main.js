import express from "express";
import { Server } from "socket.io";
import cors from "cors";

const io = new Server({
  cors: true,
});
const app = express();
app.use(express.json());
app.use(cors());

// local DB to store username and socketId
const usernameToSocketMapping = new Map();
const socketIdToUsername = new Map();

// signal from socket
io.on("connection", (socket) => {
  console.log("new connection ");
  // enter the room with (join-room) event
  socket.on("join-room", (data) => {
    const { username, roomId } = data;
    console.log(`${username} is connected on ${roomId} room :)`);

    // set the trying to join username and socket id to the map
    usernameToSocketMapping.set(username, socket.id);
    socketIdToUsername.set(socket.id, username);

    // now join socket
    socket.join(roomId); /** join a user with the room id */
    io.to(roomId).emit("user-joined", data);
  });
});

// listen server
app.listen(5000, () => console.log("Server running!"));
io.listen(5001);
