import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { LoadingSpinner } from './loading-spinner';

expect.extend(toHaveNoViolations);

describe('LoadingSpinner', () => {
  it('renders with default label', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<LoadingSpinner label="Custom loading text" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Custom loading text');
    expect(screen.getByText('Custom loading text')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    expect(screen.getByRole('status').querySelector('svg')).toHaveClass('h-4 w-4');

    rerender(<LoadingSpinner size="md" />);
    expect(screen.getByRole('status').querySelector('svg')).toHaveClass('h-5 w-5');

    rerender(<LoadingSpinner size="lg" />);
    expect(screen.getByRole('status').querySelector('svg')).toHaveClass('h-6 w-6');
  });

  it('renders with different colors', () => {
    const { rerender } = render(<LoadingSpinner color="white" />);
    expect(screen.getByRole('status').querySelector('svg')).toHaveClass('text-white');

    rerender(<LoadingSpinner color="blue" />);
    expect(screen.getByRole('status').querySelector('svg')).toHaveClass('text-blue-600');

    rerender(<LoadingSpinner color="red" />);
    expect(screen.getByRole('status').querySelector('svg')).toHaveClass('text-red-600');
  });

  it('accepts custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    expect(screen.getByRole('status')).toHaveClass('custom-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<LoadingSpinner />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
}); 