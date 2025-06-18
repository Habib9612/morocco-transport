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
    // Prevent multiple connections
    if (ws && ws.readyState !== WebSocket.CLOSED) {
      // console.log("WebSocket is already connected or connecting.");
      return () => {
        // If ws exists and is not closed, this cleanup is for an existing socket
        // It might be better to ensure the old socket is closed before creating a new one
        // For now, this will be handled by the useEffect cleanup
      };
    }

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    // console.log("Attempting to connect WebSocket to:", socketUrl);
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      // console.log('WebSocket connected');
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      if (typeof event.data === 'string') {
        setLastMessage(event.data);
      } else {
        console.warn('Received non-string message data:', event.data);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      // The onclose event will typically follow an error, handling reconnection.
    };

    socket.onclose = () => {
      // console.log('WebSocket disconnected');
      setIsConnected(false);
      setWs(null); // Clear the WebSocket instance on close
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        // console.log("Attempting to reconnect WebSocket...");
        connect();
      }, 5000);
    };

    setWs(socket);

    // Cleanup function to be called when the component unmounts or connect is re-called
    return () => {
      // console.log("Cleaning up WebSocket connection");
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
      setIsConnected(false);
      setWs(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws]); // Add ws as a dependency to re-run connect if ws instance changes externally or is nullified.

  useEffect(() => {
    const cleanup = connect(); // Initial connection attempt
    // This cleanup will be called when the WebSocketProvider unmounts.
    return cleanup;
  }, [connect]);

  const send = useCallback((message: string) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(message);
    } else {
      console.warn("WebSocket not connected. Message not sent:", message);
    }
  }, [ws]);

  return (
    <WebSocketContext.Provider value={{ connected: isConnected, send, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};