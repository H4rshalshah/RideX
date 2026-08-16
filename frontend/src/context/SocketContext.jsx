import { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const BASE_URL = import.meta.env.VITE_BASE_URL;

const socket = BASE_URL
  ? io(BASE_URL, { transports: ['websocket', 'polling'], reconnectionAttempts: 5 })
  : null;

const SocketProvider = ({ children }) => {
  useEffect(() => {
    if (!socket) return undefined;
    socket.on('connect', () => undefined);
    socket.on('disconnect', () => undefined);
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
