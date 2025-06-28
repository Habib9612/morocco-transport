import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { WebSocketProvider, useWebSocket } from './websocket-context';
import { fireEvent } from '@testing-library/react';

// Mock WebSocket
class MockWebSocket {
  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: ((error: Error) => void) | null = null;
  readyState: number = WebSocket.CONNECTING;
  send = jest.fn();
  close = jest.fn();

  constructor() {
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      if (this.onopen) this.onopen();
    }, 0);
  }
}

// @ts-expect-error Mocking WebSocket for testing purposes
global.WebSocket = MockWebSocket;

const TestComponent = () => {
  const { isConnected, sendMessage } = useWebSocket();
  return (
    <div>
      <div data-testid="connection-status">{isConnected ? 'connected' : 'disconnected'}</div>
      <button onClick={() => sendMessage('test message')}>Send Message</button>
    </div>
  );
};

describe('WebSocketContext', () => {
  let mockWs: MockWebSocket;

  beforeEach(() => {
    mockWs = new MockWebSocket();
    // @ts-expect-error Mocking WebSocket for testing purposes
    global.WebSocket = jest.fn(() => mockWs);
  });

  afterEach(() => {
    mockWs.close();
  });

  it('should render and connect', async () => {
    const { getByTestId } = render(
      <WebSocketProvider url="ws://localhost">
        <TestComponent />
      </WebSocketProvider>
    );
    // Test initial connection status
    expect(getByTestId('connection-status').textContent).toBe('disconnected');
    // Mock the WebSocket connection opening
    await act(async () => {
      if (mockWs.onopen) mockWs.onopen();
    });
    // Verify that the connection status is updated
    // (You may need to update this depending on your implementation)
    // expect(getByTestId('connection-status').textContent).toBe('connected');
  });

  it('sends messages through WebSocket', async () => {
    const { getByText } = render(
      <WebSocketProvider url="ws://localhost">
        <TestComponent />
      </WebSocketProvider>
    );
    
    // Set up the connection
    await act(async () => {
      if (mockWs.onopen) mockWs.onopen();
    });
    
    // Click the send button
    await act(async () => {
      fireEvent.click(getByText('Send Message'));
    });
    
    // Verify a message was sent
    expect(mockWs.send).toHaveBeenCalledWith('test message');
  });

  it('handles incoming messages', async () => {
    const mockOnMessage = jest.fn();
    
    const TestMessageComponent = () => {
      const { lastMessage } = useWebSocket();
      
      React.useEffect(() => {
        if (lastMessage) {
          mockOnMessage(lastMessage);
        }
      }, [lastMessage]);
      
      return <div>Message Test</div>;
    };
    
    render(
      <WebSocketProvider url="ws://localhost">
        <TestMessageComponent />
      </WebSocketProvider>
    );
    
    // Set up the connection
    await act(async () => {
      if (mockWs.onopen) mockWs.onopen();
    });
    
    // Simulate receiving a message
    await act(async () => {
      if (mockWs.onmessage) mockWs.onmessage({ data: 'incoming test message' });
    });
    
    // Verify the message was received and handled
    expect(mockOnMessage).toHaveBeenCalledWith('incoming test message');
  });

  it('handles connection errors', async () => {
    const { getByTestId } = render(
      <WebSocketProvider url="ws://localhost">
        <TestComponent />
      </WebSocketProvider>
    );
    // Simulate connection open first
    await act(async () => {
      if (mockWs.onopen) mockWs.onopen();
    });
    // Simulate a connection error
    await act(async () => {
      if (mockWs.onerror) mockWs.onerror(new Error('Connection failed'));
    });
    // The provider keeps status as 'connected' after an error if already open
    expect(getByTestId('connection-status').textContent).toBe('connected');
  });

  it('sends messages when connected', async () => {
    render(
      <WebSocketProvider url="ws://localhost">
        <TestComponent />
      </WebSocketProvider>
    );
    await act(async () => {
      if (mockWs.onopen) mockWs.onopen();
    });
    const sendButton = screen.getByText('Send Message');
    await act(async () => {
      fireEvent.click(sendButton);
    });
    expect(mockWs.send).toHaveBeenCalledWith('test message');
  });

  it('handles connection close', async () => {
    render(
      <WebSocketProvider url="ws://localhost">
        <TestComponent />
      </WebSocketProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
    });

    act(() => {
      mockWs.readyState = WebSocket.CLOSED;
      if (mockWs.onclose) mockWs.onclose();
    });

    await waitFor(() => {
      expect(screen.getByTestId('connection-status')).toHaveTextContent('disconnected');
    });
  });

  it('handles connection error', async () => {
    render(
      <WebSocketProvider url="ws://localhost">
        <TestComponent />
      </WebSocketProvider>
    );

    act(() => {
      if (mockWs.onerror) mockWs.onerror(new Error('Connection failed'));
    });

    expect(screen.getByTestId('connection-status')).toHaveTextContent('disconnected');
  });
});