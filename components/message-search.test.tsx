import { render, screen, fireEvent, act } from '@testing-library/react';
import { MessageSearch } from './message-search';
import { I18nProvider } from '@/lib/i18n-context';
import { KeyboardShortcutsProvider } from '@/lib/keyboard-shortcuts';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';

expect.extend(toHaveNoViolations);

const mockT = jest.fn((key) => key);

jest.mock('@/lib/i18n-context', () => ({
  ...jest.requireActual('@/lib/i18n-context'),
  useI18n: () => ({
    t: mockT
  })
}));

const mockMessages = [
  { id: '1', content: 'Hello world', timestamp: new Date().toISOString() },
  { id: '2', content: 'Test message', timestamp: new Date().toISOString() }
];

const mockOnSelectMessage = jest.fn();

const renderWithI18n = (ui: React.ReactElement) => {
  return render(
    <I18nProvider>{ui}</I18nProvider>
  );
};

describe('MessageSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search button when closed', () => {
    renderWithI18n(<MessageSearch messages={mockMessages} onSelectMessage={mockOnSelectMessage} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('search.placeholder');
    expect(screen.getByText('Ctrl + K')).toBeInTheDocument();
  });

  it('opens search input when button is clicked', () => {
    renderWithI18n(<MessageSearch messages={mockMessages} onSelectMessage={mockOnSelectMessage} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('opens search input when Ctrl + K is pressed', () => {
    renderWithI18n(<MessageSearch messages={mockMessages} onSelectMessage={mockOnSelectMessage} />);
    
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('filters messages based on search query', () => {
    renderWithI18n(<MessageSearch messages={mockMessages} onSelectMessage={mockOnSelectMessage} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'hello' } });
    
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('shows no results message when no matches found', () => {
    renderWithI18n(<MessageSearch messages={mockMessages} onSelectMessage={mockOnSelectMessage} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'xyz' } });
    
    expect(screen.getByText('search.no_results')).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    renderWithI18n(<MessageSearch messages={mockMessages} onSelectMessage={mockOnSelectMessage} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'hello' } });
    
    // Press down to highlight first result
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const firstResult = screen.getByText('Hello world');
    expect(firstResult).toHaveClass('bg-blue-100');
    
    // Press enter to select
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockOnSelectMessage).toHaveBeenCalledWith('1');
  });

  it('closes search when Escape is pressed', () => {
    renderWithI18n(<MessageSearch messages={mockMessages} onSelectMessage={mockOnSelectMessage} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByText('Hello world')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <I18nProvider>
        <KeyboardShortcutsProvider>
          <MessageSearch messages={mockMessages} onSelectMessage={mockOnSelectMessage} />
        </KeyboardShortcutsProvider>
      </I18nProvider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
}); 