import { useI18n } from '@/lib/i18n-context';
import { useState, useRef, useEffect } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧', region: 'United Kingdom' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', region: 'France' },
  { code: 'ar', name: 'العربية', flag: '🇲🇦', region: 'المغرب' }
] as const;

export function LanguageSelector() {
  const { language, setLanguage, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent, code?: typeof language) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (code) {
        setLanguage(code);
        setIsOpen(false);
      } else {
        setIsOpen(!isOpen);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      const currentIndex = languages.findIndex(lang => lang.code === language);
      const nextIndex = e.key === 'ArrowDown'
        ? (currentIndex + 1) % languages.length
        : (currentIndex - 1 + languages.length) % languages.length;
      setLanguage(languages[nextIndex].code);
    }
  };

  const handleListboxKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const currentIndex = languages.findIndex(lang => lang.code === language);
      const nextIndex = e.key === 'ArrowDown'
        ? (currentIndex + 1) % languages.length
        : (currentIndex - 1 + languages.length) % languages.length;
      setLanguage(languages[nextIndex].code);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => handleKeyDown(e)}
        className="inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby="language-selector-label"
      >
        <span className="flex items-center">
          <span className="text-xl mr-2" role="img" aria-label={currentLanguage?.region}>
            {currentLanguage?.flag}
          </span>
          <span className="block truncate">{currentLanguage?.name}</span>
        </span>
        <svg className={`ml-2 h-5 w-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      <div
        className={`absolute right-0 mt-1 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
          isOpen ? 'transform opacity-100 scale-100' : 'transform opacity-0 scale-95 pointer-events-none'
        }`}
        role="listbox"
        aria-labelledby="language-selector-label"
        tabIndex={0}
        onKeyDown={handleListboxKeyDown}
      >
        <span id="language-selector-label" className="sr-only">
          {t('language.select')}
        </span>
        <ul className="py-1 overflow-auto text-base" role="group">
          {languages.map(({ code, name, flag, region }) => (
            <li
              key={code}
              className={`cursor-pointer select-none relative py-2 px-4 ${
                code === language
                  ? 'text-white bg-blue-600'
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
              role="option"
              aria-selected={code === language}
              tabIndex={0}
              onClick={() => {
                setLanguage(code);
                setIsOpen(false);
              }}
              onKeyDown={(e) => handleKeyDown(e, code)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span
                    className="text-xl mr-2"
                    role="img"
                    aria-label={region}
                  >
                    {flag}
                  </span>
                  <span className={`block truncate ${
                    code === language ? 'font-semibold' : 'font-normal'
                  }`}>
                    {name}
                  </span>
                </div>
                {code === language && (
                  <span className={`absolute inset-y-0 right-4 flex items-center ${
                    code === language ? 'text-white' : 'text-blue-600'
                  }`}>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
              <p className={`mt-1 text-sm ${
                code === language ? 'text-blue-200' : 'text-gray-500'
              }`}>
                {region}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 