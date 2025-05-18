import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n-context';

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface MessageReactionsProps {
  messageId: string;
  reactions: Reaction[];
  onAddReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, emoji: string) => void;
  currentUserId: string;
}

const COMMON_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

export function MessageReactions({
  messageId,
  reactions,
  onAddReaction,
  onRemoveReaction,
  currentUserId
}: MessageReactionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReactionClick = (emoji: string) => {
    const reaction = reactions.find(r => r.emoji === emoji);
    if (reaction?.users.includes(currentUserId)) {
      onRemoveReaction(messageId, emoji);
    } else {
      onAddReaction(messageId, emoji);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div className="flex items-center space-x-1">
        {reactions.map((reaction) => (
          <button
            key={reaction.emoji}
            onClick={() => handleReactionClick(reaction.emoji)}
            className={`inline-flex items-center px-2 py-1 text-sm rounded-full transition-colors ${
              reaction.users.includes(currentUserId)
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title={reaction.users.join(', ')}
          >
            <span className="mr-1">{reaction.emoji}</span>
            <span>{reaction.count}</span>
          </button>
        ))}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label={t('chat.reactions.add')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-10">
          <div className="grid grid-cols-3 gap-2">
            {COMMON_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReactionClick(emoji)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xl"
                aria-label={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 