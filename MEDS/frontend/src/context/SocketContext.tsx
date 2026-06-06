import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (token) {
      const envUrl = import.meta.env.VITE_SOCKET_URL;
      let SOCKET_URL: string | undefined;
      if (envUrl) SOCKET_URL = envUrl;
      else if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        // In dev, connect to local backend. In production, avoid localhost and use current origin (undefined)
        SOCKET_URL = host === 'localhost' || host === '127.0.0.1' ? 'http://localhost:5000' : undefined;
      }

      const newSocket = io(SOCKET_URL ?? undefined, {
        auth: { token }
      });

      newSocket.on('connect', () => setIsConnected(true));
      newSocket.on('disconnect', () => setIsConnected(false));

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      setSocket(null);
      setIsConnected(false);
    }
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
