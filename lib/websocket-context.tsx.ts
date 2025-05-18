import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

interface WebSocketContextProps {
  isConnected: boolean;
  connectionStatus: string;
  connectionError: string | null;
  sendMessage: (message: any) => void;
  lastMessage: any | null;
  reconnect: () => void;
}

interface WebSocketProviderProps {
  children: ReactNode;
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
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
  url,
  reconnectInterval = 5000,
  maxReconnectAttempts = 5
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<any | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  // Function to establish WebSocket connection
  const connectWebSocket = useCallback(() => {
    try {
      const ws = new WebSocket(url);
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
          const message = JSON.parse(event.data);
          setLastMessage(message);
        } catch (error) {
          setLastMessage(event.data);
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
        
        // Attempt to reconnect if not at max attempts
        if (reconnectAttempts < maxReconnectAttempts) {
          setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connectWebSocket();
          }, reconnectInterval);
        } else {
          setConnectionError('Connection failed after multiple attempts. Please refresh the page or try again later.');
        }
      };

      return ws;
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setConnectionError('Failed to establish connection. Please check your network and try again.');
      setConnectionStatus('error');
      return null;
    }
  }, [url, reconnectAttempts, maxReconnectAttempts, reconnectInterval]);

  // Connect on mount and cleanup on unmount
  useEffect(() => {
    const ws = connectWebSocket();
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connectWebSocket]);

  // Function to manually reconnect
  const reconnect = useCallback(() => {
    if (socket) {
      socket.close();
    }
    setReconnectAttempts(0);
    connectWebSocket();
  }, [socket, connectWebSocket]);

  // Function to send messages
  const sendMessage = useCallback(
    (message: any) => {
      if (socket && isConnected) {
        const messageString = typeof message === 'string' ? message : JSON.stringify(message);
        socket.send(messageString);
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