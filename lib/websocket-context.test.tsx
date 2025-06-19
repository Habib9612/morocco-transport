import React from 'react'; // Added React import
import { render, screen, waitFor, act } from '@testing-library/react';
import { WebSocketProvider, useWebSocket } from './websocket-context';

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

// @ts-ignore
global.WebSocket = MockWebSocket;

const TestComponent = () => {
  const { connected, send } = useWebSocket();
  return (
    <div>
      <div data-testid="connection-status">{connected ? 'connected' : 'disconnected'}</div>
      <button onClick={() => send('test message')}>Send Message</button>
    </div>
  );
};

describe('WebSocketContext', () => {
  let mockWs: MockWebSocket;

  beforeEach(() => {
    mockWs = new MockWebSocket();
    // @ts-ignore
    global.WebSocket = jest.fn(() => mockWs);
  });

  afterEach(() => {
    mockWs.close();
  });

it('sends messages through WebSocket', async () => {
  const { getByText, getByTestId } = render( // Added getByTestId
    <WebSocketProvider>
      <TestComponent />
    </WebSocketProvider>
  );
  
  // Set up the connection
  await act(async () => {
    if (mockWs.onopen) mockWs.onopen(); // Ensure onopen is callable
  });
  
  // Wait for connection
  await waitFor(() => {
    expect(getByTestId('connection-status')).toHaveTextContent('connected');
  });

  // Click the send button
  const sendButton = getByText('Send Message');
  await act(async () => {
    sendButton.click(); // userEvent.click is preferred but keeping it simple for now
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
    <WebSocketProvider>
      <TestMessageComponent />
    </WebSocketProvider>
  );
  
  // Set up the connection
  await act(async () => {
    mockWs.onopen();
  });
  
  // Simulate receiving a message
  await act(async () => {
    if (mockWs.onmessage) mockWs.onmessage({ data: 'incoming test message' }); // Ensure onmessage is callable
  });
  
  // Verify the message was received and handled
  expect(mockOnMessage).toHaveBeenCalledWith('incoming test message');
});

// This specific test for connection error handling seems redundant or misplaced
// as there's another one at the end. Removing this one.
// it('handles connection errors', async () => { ... });

it('establishes connection', async () => {
    render(
      <WebSocketProvider>
        <TestComponent />
      </WebSocketProvider>
    );

    expect(screen.getByTestId('connection-status')).toHaveTextContent('disconnected');

    await waitFor(() => {
      expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
    });
  });

  it('sends messages when connected', async () => {
    render(
      <WebSocketProvider>
        <TestComponent />
      </WebSocketProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
    });

    const sendButton = screen.getByText('Send Message');
    await act(async () => {
      sendButton.click();
    });

    expect(mockWs.send).toHaveBeenCalledWith('test message');
  });

  it('handles connection close', async () => {
    render(
      <WebSocketProvider>
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
      <WebSocketProvider>
        <TestComponent />
      </WebSocketProvider>
    );

    act(() => {
      if (mockWs.onerror) mockWs.onerror(new Error('Connection failed'));
    });

    expect(screen.getByTestId('connection-status')).toHaveTextContent('disconnected');
  });
});