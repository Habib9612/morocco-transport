import { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '@/lib/websocket-context';
import { useAuth } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n-context';
import { LoadingSpinner } from './loading-spinner';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  status?: 'sent' | 'pending' | 'failed';
}

interface ChatProps {
  recipientId: string;
  recipientName: string;
}

const STORAGE_KEY = 'chat_messages';

export function Chat({ recipientId, recipientName }: ChatProps) {
  const { user } = useAuth();
  const { sendMessage, lastMessage, isConnected } = useWebSocket();
  const { t, dir } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const storedMessages = localStorage.getItem(`${STORAGE_KEY}_${recipientId}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, [recipientId]);

  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_${recipientId}`, JSON.stringify(messages));
  }, [messages, recipientId]);

  // Handle incoming messages
  useEffect(() => {
    if (lastMessage?.type === 'chat_message') {
      const message = lastMessage.payload as Message;
      if (message.senderId === recipientId || message.senderId === user?.id) {
        setMessages(prev => [...prev, message]);
      }
    }
  }, [lastMessage, recipientId, user?.id]);

  // Try to resend pending messages when connection is restored
  useEffect(() => {
    if (isConnected && pendingMessages.length > 0) {
      pendingMessages.forEach(message => {
        sendMessage({
          type: 'chat_message',
          payload: {
            ...message,
            recipientId
          }
        });
      });
      
      // Update pending messages to sent
      setMessages(prev => 
        prev.map(msg => 
          pendingMessages.some(pending => pending.id === msg.id)
            ? { ...msg, status: 'sent' }
            : msg
        )
      );
      
      setPendingMessages([]);
    }
  }, [isConnected, pendingMessages, recipientId, sendMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setIsLoading(true);
    try {
      const message: Message = {
        id: Date.now().toString(),
        senderId: user.id,
        senderName: user.name,
        content: newMessage.trim(),
        timestamp: Date.now(),
        status: isConnected ? 'sent' : 'pending'
      };

      if (isConnected) {
        sendMessage({
          type: 'chat_message',
          payload: {
            ...message,
            recipientId
          }
        });
      } else {
        setPendingMessages(prev => [...prev, message]);
      }

      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error(t('error.message.failed'), error);
      // Update the last message status to failed
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg) {
          return [...prev.slice(0, -1), { ...lastMsg, status: 'failed' }];
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow" dir={dir()}>
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {t('chat.with', { name: recipientName })}
        </h2>
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-500">
            {t(isConnected ? 'chat.status.connected' : 'chat.status.offline')}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === user?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === user?.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.senderId !== user?.id && (
                <p className="text-xs font-medium mb-1">{message.senderName}</p>
              )}
              <p className="text-sm">{message.content}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs opacity-75">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
                {message.senderId === user?.id && message.status && (
                  <span className="text-xs ml-2">
                    {message.status === 'sent' && '✓'}
                    {message.status === 'pending' && '⏳'}
                    {message.status === 'failed' && '❌'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t(isConnected ? 'chat.placeholder' : 'chat.placeholder.offline')}
            className="flex-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !newMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : t('chat.send')}
          </button>
        </div>
      </form>
    </div>
  );
} 