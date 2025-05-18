import { render, screen, fireEvent } from '@testing-library/react';
import { MessageReactions } from './message-reactions';
import { I18nProvider } from '@/lib/i18n-context';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('MessageReactions', () => {
  const mockReactions = [
    { emoji: '👍', count: 2, users: ['user1', 'user2'] },
    { emoji: '❤️', count: 1, users: ['user1'] }
  ];

  const defaultProps = {
    messageId: '123',
    reactions: mockReactions,
    onAddReaction: jest.fn(),
    onRemoveReaction: jest.fn(),
    currentUserId: 'user1'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders existing reactions', () => {
    render(
      <I18nProvider>
        <MessageReactions {...defaultProps} />
      </I18nProvider>
    );

    expect(screen.getByText('👍')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('❤️')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows emoji picker when add button is clicked', () => {
    render(
      <I18nProvider>
        <MessageReactions {...defaultProps} />
      </I18nProvider>
    );

    const addButton = screen.getByLabelText(/add reaction/i);
    fireEvent.click(addButton);

    expect(screen.getByText('😂')).toBeInTheDocument();
    expect(screen.getByText('😮')).toBeInTheDocument();
    expect(screen.getByText('😢')).toBeInTheDocument();
    expect(screen.getByText('🙏')).toBeInTheDocument();
  });

  it('adds reaction when clicking an emoji', () => {
    render(
      <I18nProvider>
        <MessageReactions {...defaultProps} />
      </I18nProvider>
    );

    const addButton = screen.getByLabelText(/add reaction/i);
    fireEvent.click(addButton);

    const emojiButton = screen.getByText('😂');
    fireEvent.click(emojiButton);

    expect(defaultProps.onAddReaction).toHaveBeenCalledWith('123', '😂');
  });

  it('removes reaction when clicking an existing reaction', () => {
    render(
      <I18nProvider>
        <MessageReactions {...defaultProps} />
      </I18nProvider>
    );

    const reactionButton = screen.getByText('👍').closest('button');
    fireEvent.click(reactionButton!);

    expect(defaultProps.onRemoveReaction).toHaveBeenCalledWith('123', '👍');
  });

  it('closes emoji picker when clicking outside', () => {
    render(
      <I18nProvider>
        <MessageReactions {...defaultProps} />
      </I18nProvider>
    );

    const addButton = screen.getByLabelText(/add reaction/i);
    fireEvent.click(addButton);

    expect(screen.getByText('😂')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText('😂')).not.toBeInTheDocument();
  });

  it('shows user names in tooltip', () => {
    render(
      <I18nProvider>
        <MessageReactions {...defaultProps} />
      </I18nProvider>
    );

    const reactionButton = screen.getByText('👍').closest('button');
    expect(reactionButton).toHaveAttribute('title', 'user1, user2');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <I18nProvider>
        <MessageReactions {...defaultProps} />
      </I18nProvider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
}); 