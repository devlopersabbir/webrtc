import { FormEvent, useState } from "react";
import { useSocket } from "../hooks/useSocket";

const Home = () => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const socket = useSocket();

  function createRoom(event: FormEvent) {
    event.preventDefault();
    socket?.emit("join-room", { roomId, username });
  }
  return (
    <div className="root">
      <form onSubmit={createRoom}>
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
    </div>
  );
};

export default Home;
