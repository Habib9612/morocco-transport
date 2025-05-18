import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { LanguageSelector } from './language-selector';
import { I18nProvider } from '@/lib/i18n-context';

function renderWithI18n(component: React.ReactNode) {
  return render(<I18nProvider>{component}</I18nProvider>);
}

describe('LanguageSelector', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders with English as default language', () => {
    renderWithI18n(<LanguageSelector />);
    const button = screen.getByRole('button', { name: 'Select language' });
    expect(button).toHaveTextContent('English');
    expect(button.querySelector('[aria-label="United Kingdom"]')).toBeInTheDocument();
  });

  it('changes language when selecting a new option', () => {
    renderWithI18n(<LanguageSelector />);
    const button = screen.getByRole('button', { name: 'Select language' });
    
    fireEvent.click(button);
    const frenchOption = screen.getByRole('option', { name: /france français france/i });
    fireEvent.click(frenchOption);
    
    expect(button).toHaveTextContent('Français');
    expect(button.querySelector('[aria-label="France"]')).toBeInTheDocument();
  });

  it('supports keyboard navigation', () => {
    renderWithI18n(<LanguageSelector />);
    const button = screen.getByRole('button', { name: 'Select language' });
    
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyDown(button, { key: 'ArrowDown' });
    fireEvent.keyDown(button, { key: 'Enter' });
    
    expect(button).toHaveTextContent('Français');
  });

  it('closes dropdown when clicking outside', () => {
    renderWithI18n(<LanguageSelector />);
    const button = screen.getByRole('button', { name: 'Select language' });
    
    fireEvent.click(button);
    expect(screen.getByRole('listbox')).toHaveClass('opacity-100');
    
    fireEvent.mouseDown(document.body);
    expect(screen.getByRole('listbox')).toHaveClass('opacity-0');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderWithI18n(<LanguageSelector />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
}); 