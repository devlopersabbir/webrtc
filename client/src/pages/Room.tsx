import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import ReactPlayer from "react-player";

const Room = () => {
  const [remoteSocketId, setRemoteSocketId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [mediaStrem, setMediaStrem] = useState<MediaStream | null>(null);
  const socket = useSocket();

  function handleUserJoined({
    username,
    socketId,
  }: {
    username: string;
    socketId: string;
  }) {
    console.log(`Username: ${username} is joined on ${socketId} room`);
    setRemoteSocketId(socketId);
    setUsername(username);
  }

  /** call to the joined user */
  async function handleCallUser() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    if (stream) return setMediaStrem(stream);
  }
  useEffect(() => {
    socket?.on("user-joined", handleUserJoined);
    return () => {
      socket?.off("user-joined", handleUserJoined);
    };
  }, [socket, handleUserJoined]);

  return (
    <>
      <div>RoomPage</div>
      <h1>
        {remoteSocketId ? `${username} is joined!` : "No one on this room"}
      </h1>
      {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
      <div>
        <h3>my strem</h3>
        {mediaStrem && (
          <ReactPlayer
            playing
            muted
            width={200}
            height={120}
            url={mediaStrem}
          />
        )}
      </div>
    </>
  );
};

export default Room;
