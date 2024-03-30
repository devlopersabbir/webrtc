import { io } from "socket.io-client";
import { PropsWithChildren, useMemo } from "react";
import { SocketContext } from "../context/socket";

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const socket = useMemo(() => io("https://webrtc-2wvf.onrender.com"), []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
