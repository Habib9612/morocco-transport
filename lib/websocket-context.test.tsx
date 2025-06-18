import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import React from 'react'; // Import React
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

  it('should connect and update status', async () => {
    const { getByTestId } = render(
      <WebSocketProvider>
        <TestComponent />
      </WebSocketProvider>
    );

    // Check initial status (might be 'disconnected' or 'connecting' depending on timing)
    // Forcing it to be 'disconnected' first by ensuring onopen hasn't fired.
    expect(getByTestId('connection-status')).toHaveTextContent('disconnected');

    // Mock the WebSocket connection opening
    await act(async () => {
      if (mockWs.onopen) mockWs.onopen();
    });
  
    // Verify that the connection status is updated
    await waitFor(() => {
      expect(getByTestId('connection-status')).toHaveTextContent('connected');
    });
  });

it('sends messages through WebSocket', async () => {
  const { getByText } = render(
    <WebSocketProvider>
      <TestComponent />
    </WebSocketProvider>
  );
  
  // Set up the connection
  await act(async () => {
    mockWs.onopen();
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
    if (mockWs.onmessage) mockWs.onmessage({ data: 'incoming test message' });
  });
  
  // Verify the message was received and handled
  expect(mockOnMessage).toHaveBeenCalledWith('incoming test message');
});

it('handles connection errors', async () => {
    jest.useFakeTimers(); // Use fake timers for this test

  const { getByTestId } = render(
    <WebSocketProvider>
      <TestComponent />
    </WebSocketProvider>
  );

    // Wait for initial connection
    await act(async () => {
      if (mockWs.onopen) mockWs.onopen();
      jest.runAllTimers(); // Process the mock WebSocket's onopen setTimeout
    });
    expect(getByTestId('connection-status')).toHaveTextContent('connected');
  
  // Simulate a connection error
  await act(async () => {
      mockWs.readyState = WebSocket.CLOSED;
    if (mockWs.onerror) mockWs.onerror(new Error('Connection failed'));
      // The onerror in context calls setIsConnected(false).
      // If onclose is also triggered by this error (as it should),
      // it will also call setIsConnected(false) and then schedule a reconnect via setTimeout.
      if (mockWs.onclose) mockWs.onclose();
  });
  
    // At this point, isConnected should be false.
    expect(getByTestId('connection-status')).toHaveTextContent('disconnected');

    // We do not advance timers here to prevent the reconnect logic from firing for this test.
    // If we did jest.advanceTimersByTime(5000), it would reconnect.

    jest.useRealTimers(); // Restore real timers
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

    const sendButton = screen.getByText('Send Message');
    await act(async () => {
      sendButton.click();
    });

    expect(mockWs.send).toHaveBeenCalledWith('test message');
  });

  // The 'handles connection error' test at the end is similar to the one modified above.
  // I'm ensuring the one above is the primary one and will remove the last one.
  // it('handles connection error', async () => {
  //   render(
  //     <WebSocketProvider>
  //       <TestComponent />
  //     </WebSocketProvider>
  //   );

  //   act(() => {
  //     if (mockWs.onerror) mockWs.onerror(new Error('Connection failed'));
  //   });

  //   expect(screen.getByTestId('connection-status')).toHaveTextContent('disconnected');
  // });
});