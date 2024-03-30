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
  // console.log("new connection ", socket.id);
  // enter the room with (join-room) event
  socket.on("create-room", (data) => {
    const { username, roomId } = data;
    // console.log(`${username} is connected on ${roomId} room :)`);

    // set the trying to join username and socket id to the map
    usernameToSocketMapping.set(username, socket.id);
    socketIdToUsername.set(socket.id, username);

    // now join socket
    io.to(roomId).emit("user-joined", { username, socketId: socket.id });
    socket.join(roomId); /** join a user with the room id */
    io.to(socket.id).emit("room", data);
  });
  // call user
  socket.on("call-user", ({ remoteSocketId, offer }) => {
    io.to(remoteSocketId).emit("incomming-call", { from: socket.id, offer });
  });
  // call accpeted
  socket.on("accepted-call", ({ from, answer }) => {
    io.to(from).emit("user-call-accepted", { from: socket.id, answer });
  });
  // nego needed
  socket.on("peer-nego-needed", ({ to, offer }) => {
    io.to(to).emit("user-nego-needed", { from: socket.id, offer });
  });
  // nego needed answer final
  socket.on("peer-nego-done", ({ to, answer }) => {
    io.to(to).emit("user-nego-final", { from: socket.id, answer });
  });
});

// listen server
app.listen(5000, () => console.log("Server running!"));
io.listen(5001);
