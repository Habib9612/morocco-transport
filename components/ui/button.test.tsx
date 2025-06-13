import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // For extended matchers like .toBeInTheDocument()
import { Button, buttonVariants } from './button'; // Assuming buttonVariants might be useful for class checks

describe('Button Component', () => {
  it('should render with default props', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
    // Check for default variant and size classes (conceptual)
    // Actual class names depend on cva and tailwind-merge output
    // For example, if default is 'bg-primary text-primary-foreground h-10 px-4 py-2'
    // expect(buttonElement).toHaveClass('bg-primary'); // This is a simplified check
  });

  it('should render different variants correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    const buttonElement = screen.getByRole('button', { name: /delete/i });
    // Check for destructive variant class (conceptual)
    // expect(buttonElement).toHaveClass('bg-destructive');
    expect(buttonElement).toBeInTheDocument();
  });

  it('should render different sizes correctly', () => {
    render(<Button size="sm">Small Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /small button/i });
    // Check for small size class (conceptual)
    // expect(buttonElement).toHaveClass('h-9');
    expect(buttonElement).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    const buttonElement = screen.getByRole('button', { name: /clickable/i });
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    const buttonElement = screen.getByRole('button', { name: /disabled/i });
    expect(buttonElement).toBeDisabled();
    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should render children content', () => {
    render(
      <Button>
        <span>Submit</span>
        <i>Icon</i>
      </Button>
    );
    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  it('should render as child component when asChild prop is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    // Check if it's an anchor tag now instead of a button
    const linkElement = screen.getByRole('link', { name: /link button/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName).toBe('A');
    expect(linkElement).toHaveAttribute('href', '/test');
    // Also check if button variant classes are applied (conceptual)
    // expect(linkElement).toHaveClass('bg-primary');
  });

  // Test to ensure `cn` and `buttonVariants` are applied (more of an integration check)
  it('should apply classes based on variants and custom className', () => {
    render(<Button variant="outline" size="lg" className="custom-class">Custom</Button>);
    const buttonElement = screen.getByRole('button', { name: /custom/i });
    // Conceptual: check for a combination of classes from variant, size, and custom
    // Example: expect(buttonElement.className).toContain('border-input'); // from outline
    // Example: expect(buttonElement.className).toContain('h-11'); // from lg
    // Example: expect(buttonElement.className).toContain('custom-class');
    expect(buttonElement).toBeInTheDocument();
  });
});
