import { render, screen, fireEvent, act } from '@testing-library/react';
import { useEffect } from 'react';
import { KeyboardShortcutsProvider, useKeyboardShortcuts, useDefaultShortcuts } from './keyboard-shortcuts';
import { ThemeProvider } from './theme-context';
import { I18nProvider } from './i18n-context';

// Test component that uses shortcuts
function TestComponent() {
  const { registerShortcut } = useKeyboardShortcuts();
  useDefaultShortcuts();

  useEffect(() => {
    registerShortcut({
      key: 'a',
      description: 'Test shortcut',
      action: () => {
        const element = document.createElement('div');
        element.textContent = 'Shortcut triggered';
        element.setAttribute('data-testid', 'shortcut-result');
        document.body.appendChild(element);
      }
    });
  }, [registerShortcut]);

  return <div>Test Component</div>;
}

// Test component for modifier keys
function ModifierTestComponent() {
  const { registerShortcut } = useKeyboardShortcuts();

  useEffect(() => {
    registerShortcut({
      key: 'b',
      description: 'Test shortcut with modifiers',
      ctrlKey: true,
      shiftKey: true,
      action: () => {
        const element = document.createElement('div');
        element.textContent = 'Modifier shortcut triggered';
        element.setAttribute('data-testid', 'modifier-shortcut-result');
        document.body.appendChild(element);
      }
    });
  }, [registerShortcut]);

  return <div>Modifier Test Component</div>;
}

// Test component for unregistering shortcuts
function UnregisterTestComponent() {
  const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts();

  useEffect(() => {
    registerShortcut({
      key: 'c',
      description: 'Test shortcut to unregister',
      action: () => {
        const element = document.createElement('div');
        element.textContent = 'Unregistered shortcut triggered';
        element.setAttribute('data-testid', 'unregistered-shortcut-result');
        document.body.appendChild(element);
      }
    });

    return () => unregisterShortcut('c');
  }, [registerShortcut, unregisterShortcut]);

  return <div>Unregister Test Component</div>;
}

describe('KeyboardShortcuts', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('registers and triggers shortcuts', () => {
    render(
      <ThemeProvider>
        <I18nProvider>
          <KeyboardShortcutsProvider>
            <TestComponent />
          </KeyboardShortcutsProvider>
        </I18nProvider>
      </ThemeProvider>
    );

    // Trigger shortcut
    act(() => {
      fireEvent.keyDown(document, { key: 'a' });
    });

    expect(screen.getByTestId('shortcut-result')).toBeInTheDocument();
    expect(screen.getByText('Shortcut triggered')).toBeInTheDocument();
  });

  it('handles modifier keys correctly', () => {
    render(
      <ThemeProvider>
        <I18nProvider>
          <KeyboardShortcutsProvider>
            <ModifierTestComponent />
          </KeyboardShortcutsProvider>
        </I18nProvider>
      </ThemeProvider>
    );

    // Try without modifiers (should not trigger)
    act(() => {
      fireEvent.keyDown(document, { key: 'b' });
    });
    expect(screen.queryByTestId('modifier-shortcut-result')).not.toBeInTheDocument();

    // Try with modifiers (should trigger)
    act(() => {
      fireEvent.keyDown(document, { key: 'b', ctrlKey: true, shiftKey: true });
    });
    expect(screen.getByTestId('modifier-shortcut-result')).toBeInTheDocument();
    expect(screen.getByText('Modifier shortcut triggered')).toBeInTheDocument();
  });

  it('unregisters shortcuts', () => {
    const { unmount } = render(
      <ThemeProvider>
        <I18nProvider>
          <KeyboardShortcutsProvider>
            <UnregisterTestComponent />
          </KeyboardShortcutsProvider>
        </I18nProvider>
      </ThemeProvider>
    );

    // Trigger shortcut
    act(() => {
      fireEvent.keyDown(document, { key: 'c' });
    });
    expect(screen.getByTestId('unregistered-shortcut-result')).toBeInTheDocument();

    // Clear the result
    document.body.innerHTML = '';

    // Unmount to unregister the shortcut
    unmount();

    // Try to trigger again (should not work)
    act(() => {
      fireEvent.keyDown(document, { key: 'c' });
    });
    expect(screen.queryByTestId('unregistered-shortcut-result')).not.toBeInTheDocument();
  });

  it('handles default shortcuts', () => {
    render(
      <ThemeProvider>
        <I18nProvider>
          <KeyboardShortcutsProvider>
            <TestComponent />
          </KeyboardShortcutsProvider>
        </I18nProvider>
      </ThemeProvider>
    );

    // Add test elements for default shortcuts
    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    document.body.appendChild(searchInput);

    const chatButton = document.createElement('button');
    chatButton.setAttribute('data-testid', 'chat-toggle');
    document.body.appendChild(chatButton);

    const notificationButton = document.createElement('button');
    notificationButton.setAttribute('data-testid', 'notification-toggle');
    document.body.appendChild(notificationButton);

    // Test search focus shortcut
    act(() => {
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    });
    expect(document.activeElement).toBe(searchInput);

    // Test chat toggle shortcut
    const chatClickSpy = jest.spyOn(chatButton, 'click');
    act(() => {
      fireEvent.keyDown(document, { key: 'j', ctrlKey: true });
    });
    expect(chatClickSpy).toHaveBeenCalled();

    // Test notification toggle shortcut
    const notificationClickSpy = jest.spyOn(notificationButton, 'click');
    act(() => {
      fireEvent.keyDown(document, { key: 'n', ctrlKey: true });
    });
    expect(notificationClickSpy).toHaveBeenCalled();

    // Test escape key
    searchInput.focus();
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });
    expect(document.activeElement).not.toBe(searchInput);
  });
}); 