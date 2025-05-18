/**
 * Global error handling utilities
 */

/**
 * Custom error class for API responses
 */
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Custom error class for WebSocket connections
 */
export class WebSocketError extends Error {
  code: number;
  
  constructor(message: string, code: number = 1006) {
    super(message);
    this.name = 'WebSocketError';
    this.code = code;
  }
}

/**
 * Error codes with their corresponding messages
 */
export const ErrorCodes = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  UNAUTHORIZED: 'Authentication required. Please login to continue.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'A server error occurred. Please try again later.',
  WEBSOCKET_CONNECTION: 'WebSocket connection failed. Retrying...',
  WEBSOCKET_CLOSED: 'WebSocket connection closed unexpectedly.',
  VALIDATION_ERROR: 'Validation error. Please check your input.'
};

/**
 * Handles API fetch errors with proper error messages
 */
export function handleFetchError(error: any): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  // Network error
  if (!navigator.onLine || error.message === 'Failed to fetch') {
    return new ApiError(0, ErrorCodes.NETWORK_ERROR);
  }

  // Default to server error if we don't know the specific error
  return new ApiError(500, ErrorCodes.SERVER_ERROR, error);
}

/**
 * Parses API response and throws appropriate errors
 */
export async function parseApiResponse(response: Response): Promise<any> {
  let data;
  try {
    // Try to parse as JSON
    data = await response.json();
  } catch (e) {
    // Fallback to text if not JSON
    data = await response.text();
  }

  if (!response.ok) {
    const message = data?.message || `HTTP Error ${response.status}`;
    throw new ApiError(response.status, message, data);
  }

  return data;
}

/**
 * Creates a fetch wrapper with error handling
 */
export function createFetchWithErrorHandling() {
  return async function fetchWithErrorHandling(url: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(url, options);
      return await parseApiResponse(response);
    } catch (error) {
      throw handleFetchError(error);
    }
  };
}

/**
 * WebSocket connection with automatic reconnection and error handling
 */
export class WebSocketManager {
  url: string;
  socket: WebSocket | null = null;
  reconnectAttempts: number = 0;
  maxReconnectAttempts: number = 5;
  reconnectTimeout: number = 1000;
  onMessage: ((data: any) => void) | null = null;
  onError: ((error: WebSocketError) => void) | null = null;
  onOpen: (() => void) | null = null;
  onClose: (() => void) | null = null;

  constructor(url: string) {
    this.url = url;
  }

  connect(): void {
    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        if (this.onOpen) this.onOpen();
      };

      this.socket.onmessage = (event) => {
        if (this.onMessage) {
          try {
            const data = JSON.parse(event.data);
            this.onMessage(data);
          } catch (e) {
            this.onMessage(event.data);
          }
        }
      };

      this.socket.onerror = (event) => {
        const wsError = new WebSocketError(ErrorCodes.WEBSOCKET_CONNECTION);
        if (this.onError) this.onError(wsError);
      };

      this.socket.onclose = () => {
        if (this.onClose) this.onClose();
        this.handleReconnect();
      };
    } catch (error) {
      const wsError = new WebSocketError(
        ErrorCodes.WEBSOCKET_CONNECTION,
        (error instanceof Error) ? 1006 : 1006
      );
      if (this.onError) this.onError(wsError);
      this.handleReconnect();
    }
  }

  send(data: any): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new WebSocketError('WebSocket is not connected');
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.socket.send(message);
    } catch (error) {
      const wsError = new WebSocketError(
        'Failed to send message through WebSocket',
        (error instanceof Error) ? 1011 : 1011
      );
      if (this.onError) this.onError(wsError);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect();
      }, this.reconnectTimeout * this.reconnectAttempts);
    }
  }
}lib/error-handling.tsx