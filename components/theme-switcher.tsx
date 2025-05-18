import { useState, useEffect } from 'react';
import { useTheme } from '@/lib/theme-context';

type Theme = 'light' | 'dark' | 'system';

const options = [
  { value: 'light' as const, label: 'Light', icon: '☀️' },
  { value: 'dark' as const, label: 'Dark', icon: '🌙' },
  { value: 'system' as const, label: 'System', icon: '💻' },
] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Theme>(theme);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.theme-switcher')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setSelectedOption(newTheme);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent, option: Theme) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleThemeChange(option);
    }
  };

  const selectedOptionData = options.find(opt => opt.value === selectedOption) || options[2];

  return (
    <div className="relative inline-block theme-switcher">
      <button
        type="button"
        className="inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select theme"
        id="theme-button"
      >
        <span className="flex items-center">
          <span className="text-xl mr-2" role="img" aria-label={selectedOptionData.label}>
            {selectedOptionData.icon}
          </span>
          <span className="block truncate">{selectedOptionData.label}</span>
        </span>
        <svg
          className={`ml-2 h-5 w-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200"
          role="listbox"
          aria-labelledby="theme-button"
          id="theme-options"
        >
          <div className="py-1 overflow-auto text-base" role="group">
            {options.map((option) => (
              <div
                key={option.value}
                role="option"
                aria-selected={option.value === selectedOption}
                tabIndex={0}
                className={`cursor-pointer select-none relative py-2 px-4 ${
                  option.value === selectedOption
                    ? 'text-white bg-blue-600'
                    : 'text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => handleThemeChange(option.value)}
                onKeyDown={(e) => handleKeyDown(e, option.value)}
              >
                <div className="flex items-center">
                  <span className="text-xl mr-2" role="img" aria-label={option.label}>
                    {option.icon}
                  </span>
                  <span className={`block truncate ${option.value === selectedOption ? 'font-semibold' : 'font-normal'}`}>
                    {option.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 