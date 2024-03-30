import { io } from "socket.io-client";
import { PropsWithChildren, useMemo } from "react";
import { SocketContext } from "../context/socket";
import dotenv from "dotenv";
dotenv.config();

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const socket = useMemo(() => io("http://127.0.0.1:5001"), []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
