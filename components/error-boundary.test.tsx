import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './error-boundary';

describe('ErrorBoundary', () => {
  it('renders fallback UI when an error is thrown', () => {
    // Component that throws an error
    const ProblemChild = () => {
      throw new Error('Test error');
    };

    const fallback = <div data-testid="fallback">Something went wrong</div>;

    render(
      <ErrorBoundary fallback={fallback}>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });
});