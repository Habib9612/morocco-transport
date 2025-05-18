import { render, screen } from '@/lib/test-utils';
import { Loading } from './loading';

describe('Loading', () => {
  it('renders with default props', () => {
    render(<Loading />);
    const loader = screen.getByRole('status');
    expect(loader).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    const text = 'Loading data...';
    render(<Loading text={text} />);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('renders in fullscreen mode', () => {
    render(<Loading fullScreen />);
    const container = screen.getByRole('status');
    expect(container).toHaveClass('fixed inset-0');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Loading size="sm" />);
    let loader = screen.getByRole('status').querySelector('svg');
    expect(loader).toHaveClass('h-4 w-4');

    rerender(<Loading size="md" />);
    loader = screen.getByRole('status').querySelector('svg');
    expect(loader).toHaveClass('h-8 w-8');

    rerender(<Loading size="lg" />);
    loader = screen.getByRole('status').querySelector('svg');
    expect(loader).toHaveClass('h-12 w-12');
  });
}); 