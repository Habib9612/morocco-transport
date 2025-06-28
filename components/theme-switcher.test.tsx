import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@/lib/theme-context';
import { I18nProvider } from '@/lib/i18n-context';
import { ThemeSwitcher } from './theme-switcher';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
  });

  it('renders with system theme by default', () => {
    render(
      <ThemeProvider>
        <I18nProvider>
          <ThemeSwitcher />
        </I18nProvider>
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: /select theme/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('System');
    expect(screen.getByRole('img', { name: 'System' })).toBeInTheDocument();
  });

  it('opens dropdown when clicked', () => {
    render(
      <ThemeProvider>
        <I18nProvider>
          <ThemeSwitcher />
        </I18nProvider>
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  it('changes theme when an option is selected', async () => {
    render(
      <ThemeProvider>
        <I18nProvider>
          <ThemeSwitcher />
        </I18nProvider>
      </ThemeProvider>
    );

    // Open dropdown
    const button = screen.getByRole('button', { name: /select theme/i });
    fireEvent.click(button);

    // Select dark theme
    const darkOption = screen.getByRole('option', { name: /dark/i });
    fireEvent.click(darkOption);

    // Check if dark theme is selected
    expect(button).toHaveTextContent('Dark');
    expect(screen.getByRole('img', { name: 'Dark' })).toBeInTheDocument();
    expect(localStorage.getItem('preferred_theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Dropdown should be closed
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    render(
      <ThemeProvider>
        <I18nProvider>
          <ThemeSwitcher />
        </I18nProvider>
      </ThemeProvider>
    );

    // Open dropdown
    const button = screen.getByRole('button', { name: /select theme/i });
    fireEvent.click(button);

    // Get all options
    const options = screen.getAllByRole('option');
    const darkOption = options[1]; // Dark theme is the second option

    // Focus the dark option
    fireEvent.focus(darkOption);

    // Select with Enter key
    fireEvent.keyDown(darkOption, { key: 'Enter' });

    // Check if dark theme is selected
    expect(button).toHaveTextContent('Dark');
    expect(localStorage.getItem('preferred_theme')).toBe('dark');
  });

  it('closes dropdown when clicking outside', () => {
    render(
      <ThemeProvider>
        <I18nProvider>
          <ThemeSwitcher />
        </I18nProvider>
      </ThemeProvider>
    );

    // Open dropdown
    const button = screen.getByRole('button', { name: /select theme/i });
    fireEvent.click(button);

    // Verify dropdown is open
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(document.body);

    // Dropdown should be closed
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('persists theme preference', () => {
    localStorage.setItem('preferred_theme', 'dark');

    render(
      <ThemeProvider>
        <I18nProvider>
          <ThemeSwitcher />
        </I18nProvider>
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: /select theme/i });
    expect(button).toHaveTextContent('Dark');
    expect(screen.getByRole('img', { name: 'Dark' })).toBeInTheDocument();
  });

  it('responds to system theme changes', async () => {
    // Mock matchMedia
    const mockMatchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const originalMatchMedia = window.matchMedia;
    window.matchMedia = mockMatchMedia;

    render(
      <ThemeProvider>
        <I18nProvider>
          <ThemeSwitcher />
        </I18nProvider>
      </ThemeProvider>
    );

    // Select system theme
    const button = screen.getByRole('button', { name: /select theme/i });
    fireEvent.click(button);
    const systemOption = screen.getByRole('option', { name: /system/i });
    fireEvent.click(systemOption);

    // Simulate dark mode preference
    mockMatchMedia.mockImplementation(query => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Trigger media query change
    window.dispatchEvent(new Event('change-preferred-scheme'));
    
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    // Cleanup
    window.matchMedia = originalMatchMedia;
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ThemeProvider>
        <I18nProvider>
          <ThemeSwitcher />
        </I18nProvider>
      </ThemeProvider>
    );

    // Open dropdown for testing
    const button = screen.getByRole('button', { name: /select theme/i });
    fireEvent.click(button);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
}); 