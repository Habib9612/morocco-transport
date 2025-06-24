import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

export interface WebSocketMessage<T = any> {
  type: string;
  payload: T;
}

interface WebSocketContextProps {
  isConnected: boolean;
  connectionStatus: string;
  connectionError: string | null;
  sendMessage: (message: WebSocketMessage) => void;
  lastMessage: WebSocketMessage | null;
  reconnect: () => void;
}

interface WebSocketProviderProps {
  children: ReactNode;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

  const connectWebSocket = useCallback(() => {
    if (!url || !session?.accessToken) {
      setConnectionStatus('disconnected');
      return;
    }

    try {
      const authenticatedUrl = `${url}?token=${session.accessToken}`;
      const ws = new WebSocket(authenticatedUrl);
      setSocket(ws);
      setConnectionStatus('connecting');
      setConnectionError(null);

      ws.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        setConnectionError(null);
        setReconnectAttempts(0);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
        } catch {
          // Handle non-JSON messages if necessary
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection error. Please try again later.');
        setConnectionStatus('error');
      };

      ws.onclose = () => {
        setIsConnected(false);
        setConnectionStatus('disconnected');

        if (reconnectAttempts < 5) {
          setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connectWebSocket();
          }, 5000);
        } else {
          setConnectionError('Connection failed after multiple attempts.');
        }
      };

      return ws;
    } catch {
      setConnectionError('Failed to establish connection.');
      setConnectionStatus('error');
      return null;
    }
  }, [url, session, reconnectAttempts]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    if (session) {
      ws = connectWebSocket();
    }
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [session, connectWebSocket]);

  const reconnect = useCallback(() => {
    if (socket) {
      socket.close();
    }
    setReconnectAttempts(0);
    connectWebSocket();
  }, [socket, connectWebSocket]);

  const sendMessage = useCallback(
    (message: WebSocketMessage) => {
      if (socket && isConnected) {
        socket.send(JSON.stringify(message));
      } else {
        console.warn('Cannot send message, socket is not connected');
        setConnectionError('Cannot send message, not connected to server');
      }
    },
    [socket, isConnected]
  );

  const value = {
    isConnected,
    connectionStatus,
    connectionError,
    sendMessage,
    lastMessage,
    reconnect
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};