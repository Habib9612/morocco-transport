import { createContext, useContext, useEffect, ReactNode, useMemo } from 'react';
import { useTheme } from './theme-context';

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

interface KeyboardShortcutsContextType {
  registerShortcut: (shortcut: Shortcut) => void;
  unregisterShortcut: (key: string) => void;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | undefined>(undefined);

export function KeyboardShortcutsProvider({ children }: { children: ReactNode }) {
  const shortcuts = useMemo(() => new Map<string, Shortcut>(), []);

  const registerShortcut = (shortcut: Shortcut) => {
    shortcuts.set(shortcut.key, shortcut);
  };

  const unregisterShortcut = (key: string) => {
    shortcuts.delete(key);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.get(event.key);
      if (!shortcut) return;

      if (
        (shortcut.ctrlKey && !event.ctrlKey) ||
        (shortcut.shiftKey && !event.shiftKey) ||
        (shortcut.altKey && !event.altKey)
      ) {
        return;
      }

      event.preventDefault();
      shortcut.action();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  return (
    <KeyboardShortcutsContext.Provider value={{ registerShortcut, unregisterShortcut }}>
      {children}
    </KeyboardShortcutsContext.Provider>
  );
}

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext);
  if (context === undefined) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider');
  }
  return context;
}

// Default shortcuts
export function useDefaultShortcuts() {
  const { registerShortcut } = useKeyboardShortcuts();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Toggle theme (Ctrl/Cmd + T)
    registerShortcut({
      key: 't',
      description: 'Toggle theme',
      ctrlKey: true,
      action: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }
    });

    // Focus search (Ctrl/Cmd + K)
    registerShortcut({
      key: 'k',
      description: 'Focus search',
      ctrlKey: true,
      action: () => {
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput instanceof HTMLElement) {
          searchInput.focus();
        }
      }
    });

    // Toggle chat (Ctrl/Cmd + J)
    registerShortcut({
      key: 'j',
      description: 'Toggle chat',
      ctrlKey: true,
      action: () => {
        const chatButton = document.querySelector('[data-testid="chat-toggle"]');
        if (chatButton instanceof HTMLElement) {
          chatButton.click();
        }
      }
    });

    // Toggle notifications (Ctrl/Cmd + N)
    registerShortcut({
      key: 'n',
      description: 'Toggle notifications',
      ctrlKey: true,
      action: () => {
        const notificationButton = document.querySelector('[data-testid="notification-toggle"]');
        if (notificationButton instanceof HTMLElement) {
          notificationButton.click();
        }
      }
    });

    // Escape key to close modals/dropdowns
    registerShortcut({
      key: 'Escape',
      description: 'Close modal/dropdown',
      action: () => {
        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLElement) {
          activeElement.blur();
        }
      }
    });
  }, [registerShortcut, theme, setTheme]);
} 