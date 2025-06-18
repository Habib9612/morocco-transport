"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface WebSocketContextType {
  connected: boolean;
  send: (message: string) => void;
  lastMessage: string | null; // Added lastMessage
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null); // Added lastMessage state

  const connect = useCallback(() => {
    const socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');

    socket.onopen = () => {
      setIsConnected(true);
    };
    socket.onclose = () => {
      setIsConnected(false);
      
      // Auto reconnect logic - Attempt to reconnect after a delay
      setTimeout(() => {
        if (!isConnected) {
          connect();
        }
      }, 3000); // Wait 3 seconds before reconnecting
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      // Errors are handled gracefully - connection will be retried by onclose handler
    };

    socket.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        connect();
      }, 5000);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    socket.onmessage = (event) => { // Added onmessage handler
      console.log('WebSocket message received:', event.data);
      setLastMessage(event.data as string);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const cleanup = connect();
    return () => {
      cleanup();
    };
  }, [connect]);

  const send = useCallback((message: string) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  }, [ws]);

  return (
    <WebSocketContext.Provider value={{ connected: isConnected, send, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};