import { FormEvent, useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const socket = useSocket();

  /** for creating a new room */
  function handleFormSubmit(event: FormEvent) {
    event.preventDefault();
    socket?.emit("create-room", { username, roomId });
  }

  function handleJoinRoom(data: { username: string; roomId: string }) {
    navigate(`/room/${data.roomId}`);
  }

  useEffect(() => {
    socket?.on("room", handleJoinRoom);
    return () => {
      socket?.off("room", handleJoinRoom);
    };
  }, [socket]);

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        placeholder="room id"
        type="text"
        onChange={(e) => setRoomId(e.target.value)}
      />
      <input
        type="text"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <button type="submit">Create a Room</button>
    </form>
  );
};

export default Home;
