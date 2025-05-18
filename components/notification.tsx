import { useEffect, useState } from 'react';
import { useWebSocket } from '@/lib/websocket-context';
import { LoadingSpinner } from './loading-spinner';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: number;
}

export function NotificationCenter() {
  const { lastMessage } = useWebSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (lastMessage?.type === 'notification') {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: lastMessage.payload.type,
        message: lastMessage.payload.message,
        timestamp: Date.now(),
      };
      setNotifications(prev => [newNotification, ...prev].slice(0, 5));
    }
  }, [lastMessage]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          role="alert"
          className={`p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ${
            notification.type === 'error' ? 'bg-red-100 text-red-800' :
            notification.type === 'success' ? 'bg-green-100 text-green-800' :
            notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}
        >
          <div className="flex items-start">
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.message}</p>
              <p className="text-xs opacity-75">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-gray-500 hover:text-gray-700"
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function NotificationBadge() {
  const { lastMessage } = useWebSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (lastMessage?.type === 'notification') {
      setUnreadCount(prev => prev + 1);
    }
  }, [lastMessage]);

  if (unreadCount === 0) {
    return null;
  }

  return (
    <div className="relative">
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {unreadCount}
      </span>
    </div>
  );
} 