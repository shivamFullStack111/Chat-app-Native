import React, { createContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

const SocketProvider = (props) => {
  const socket = useMemo(() => {
    return io("http://192.168.41.216:9000");
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
