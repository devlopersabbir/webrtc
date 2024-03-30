import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { getStrem } from "../service/config";

const Room = () => {
  const [remoteSocketId, setRemoteSocketId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [mediaStrem, setMediaStrem] = useState<MediaStream | null>(null);
  const [remoteStrem, setRemoteStrem] = useState<MediaStream | null>(null);
  const socket = useSocket();

  async function handleUserJoined({
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
    setMediaStrem(await getStrem());

    const offer = await peer.createOffer();
    socket?.emit("call-user", { remoteSocketId, offer });
  }

  async function handleIncommingCall({
    from,
    offer,
  }: {
    from: string;
    offer: RTCSessionDescriptionInit;
  }) {
    setRemoteSocketId(from);
    const answer = await peer.createAnswer(offer);
    setMediaStrem(await getStrem());
    socket?.emit("accepted-call", { from, answer });
  }

  function sendStrem() {
    if (!mediaStrem || !peer.peer) return;
    for (const track of mediaStrem?.getTracks()) {
      // send stream
      peer.peer.addTrack(track, mediaStrem);
    }
  }

  async function handleCallAccepted({
    from,
    answer,
  }: {
    from: string;
    answer: RTCSessionDescriptionInit;
  }) {
    console.log("call accepted :)");
    await peer.setLocalDescription(answer);

    sendStrem();
  }

  async function handleNegoNeeded() {
    const offer = await peer.createOffer();
    socket?.emit("peer-nego-needed", { to: remoteSocketId, offer });
  }

  async function handleIncommingNegoNeeded({
    from,
    offer,
  }: {
    from: string;
    offer: RTCSessionDescriptionInit;
  }) {
    const answer = await peer.createAnswer(offer);
    socket?.emit("peer-nego-done", { to: from, answer });
  }

  async function handleNegoFinal({
    from,
    answer,
  }: {
    from: string;
    answer: RTCSessionDescriptionInit;
  }) {
    await peer.setLocalDescription(answer);
  }

  // nego needed
  useEffect(() => {
    peer.peer?.addEventListener("negotiationneeded", handleNegoNeeded);

    return () => {
      peer.peer?.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  // remote strem
  useEffect(() => {
    peer.peer?.addEventListener("track", async (event) => {
      const remoteStrem = event.streams;
      setRemoteStrem(remoteStrem[0]);
    });
  }, []);

  useEffect(() => {
    socket?.on("user-joined", handleUserJoined); /** joined call */
    socket?.on("incomming-call", handleIncommingCall); /** incomming call */
    socket?.on(
      "user-call-accepted",
      handleCallAccepted
    ); /** user call accepted */
    socket?.on("user-nego-needed", handleIncommingNegoNeeded); /** incom nego */
    socket?.on("user-nego-final", handleNegoFinal);

    return () => {
      socket?.off("user-joined", handleUserJoined);
      socket?.off("incomming-call", handleIncommingCall);
      socket?.off("user-call-accepted", handleCallAccepted);
      socket?.off("user-nego-needed", handleIncommingNegoNeeded);
      socket?.off("user-nego-final", handleNegoFinal);
    };
  }, [socket, handleUserJoined, handleIncommingCall, handleCallAccepted]);

  return (
    <>
      <div>RoomPage</div>
      <h1>{remoteSocketId ? `connected` : "No one on this room"}</h1>

      {remoteSocketId && (
        <>
          <button onClick={sendStrem}>Send Strem</button>
          <button onClick={handleCallUser}>Call</button>
        </>
      )}
      <div>
        {mediaStrem && (
          <>
            <h3>my strem</h3>
            <ReactPlayer
              playing
              muted
              width={200}
              height={120}
              url={mediaStrem}
            />
          </>
        )}
        {remoteStrem && (
          <>
            <h4>Friend Strem here</h4>
            <ReactPlayer
              playing
              muted
              width={500}
              height={300}
              url={remoteStrem}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Room;
