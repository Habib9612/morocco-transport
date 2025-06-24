import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { KeyboardShortcutsHelp } from './keyboard-shortcuts-help';
import { KeyboardShortcutsProvider } from '@/lib/keyboard-shortcuts';
import { I18nProvider } from '@/lib/i18n-context';

expect.extend(toHaveNoViolations);

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <I18nProvider>
      <KeyboardShortcutsProvider>
        {ui}
      </KeyboardShortcutsProvider>
    </I18nProvider>
  );
};

describe('KeyboardShortcutsHelp', () => {
  it('opens when Ctrl + ? is pressed', () => {
    renderWithProvider(<KeyboardShortcutsHelp />);
    fireEvent.keyDown(document, { key: '?', ctrlKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes when close button is clicked', () => {
    renderWithProvider(<KeyboardShortcutsHelp />);
    fireEvent.keyDown(document, { key: '?', ctrlKey: true });
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes when Escape is pressed', () => {
    renderWithProvider(<KeyboardShortcutsHelp />);
    fireEvent.keyDown(document, { key: '?', ctrlKey: true });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = renderWithProvider(<KeyboardShortcutsHelp />);
    fireEvent.keyDown(document, { key: '?', ctrlKey: true });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
}); 