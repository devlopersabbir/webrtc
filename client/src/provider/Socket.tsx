import { Socket, io } from "socket.io-client";
import { PropsWithChildren, createContext, useMemo } from "react";

export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const socket = useMemo(
    () =>
      io({
        host: "localhost",
        port: 5001,
      }),
    []
  );
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
