import { FormEvent, useCallback, useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const socket = useSocket();
  const handleCreateRoom = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      socket?.emit("join-room", { roomId, username });
    },
    [roomId, username, socket]
  );

  const handleJoinRoom = useCallback(
    ({ username, roomId }: { username: string; roomId: string }) => {
      navigate(`/room/${roomId}`);
    },
    []
  );

  useEffect(() => {
    socket?.on("user-joined", handleJoinRoom);

    return () => {
      socket?.off("user-joined", handleJoinRoom);
    };
  }, [socket]);

  return (
    <div className="root">
      <form onSubmit={handleCreateRoom}>
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
