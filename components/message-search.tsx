import { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { Search } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  timestamp: string;
}

interface Props {
  messages: Message[];
  onSelectMessage: (id: string) => void;
}

export function MessageSearch({ messages, onSelectMessage }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.ctrlKey) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredMessages.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        if (selectedIndex >= 0 && selectedIndex < filteredMessages.length) {
          onSelectMessage(filteredMessages[selectedIndex].id);
          setIsOpen(false);
          setSearchQuery('');
          setSelectedIndex(-1);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        setSelectedIndex(-1);
        break;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
        aria-label={t('search.open')}
      >
        <Search className="w-4 h-4 mr-2" />
        {t('search.placeholder')}
        <kbd className="ml-2 px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded">
          Ctrl + K
        </kbd>
      </button>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 pl-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('search.placeholder')}
        />
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
      </div>

      {searchQuery && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          {filteredMessages.length > 0 ? (
            <ul className="py-1 max-h-96 overflow-auto">
              {filteredMessages.map((message, index) => (
                <li
                  key={message.id}
                  className={`px-4 py-2 cursor-pointer ${
                    index === selectedIndex
                      ? 'bg-blue-100'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    onSelectMessage(message.id);
                    setIsOpen(false);
                    setSearchQuery('');
                    setSelectedIndex(-1);
                  }}
                >
                  {message.content}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              {t('search.no_results')}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 