/**
 * Accessibility utilities for the MarocTransit frontend
 */

import React from 'react';

/**
 * Adds accessibility properties to elements
 */
export const a11y = {
  /**
   * Creates an aria-label
   */
  label: (label: string) => ({ 'aria-label': label }),

  /**
   * Sets aria-hidden
   */
  hidden: (hidden: boolean = true) => ({ 'aria-hidden': hidden }),

  /**
   * Sets role attribute
   */
  role: (role: string) => ({ role }),

  /**
   * Marks element as a live region
   */
  live: (mode: 'off' | 'polite' | 'assertive' = 'polite') => ({ 'aria-live': mode }),

  /**
   * Combines multiple a11y helpers
   */
  combine: (...args: Record<string, any>[]) => 
    args.reduce((acc, obj) => ({ ...acc, ...obj }), {}),
};

/**
 * Skip to content link for keyboard navigation
 */
export const SkipToContent: React.FC = () => (
  <a 
    href="#main-content" 
    className="skip-to-content"
    {...a11y.label('Skip to main content')}
  >
    Skip to content
  </a>
);

/**
 * Hook to manage focus trapping within a component
 */
export function useTrapFocus(containerRef: React.RefObject<HTMLElement>) {
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Find all focusable elements
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus the first element when mounted
    firstElement.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      // Loop focus inside the container
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef]);
}

/**
 * Accessible icon component
 */
export const AccessibleIcon: React.FC<{
  icon: React.ReactNode;
  label: string;
  className?: string;
}> = ({ icon, label, className }) => (
  <span className={`accessible-icon ${className || ''}`} role="img" aria-label={label}>
    {icon}
  </span>
);

/**
 * Visually hidden text (for screen readers only)
 */
export const VisuallyHidden: React.FC<{
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}> = ({ children, as: Component = 'span' }) => (
  <Component
    style={{
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: '1px',
      margin: '-1px',
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      width: '1px',
      whiteSpace: 'nowrap',
      wordWrap: 'normal',
    }}
  >
    {children}
  </Component>
);

/**
 * Keyboard focus indicator
 */
export function setupKeyboardFocusIndicator() {
  const handleFirstTab = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  };
  
  window.addEventListener('keydown', handleFirstTab);
  return () => {
    window.removeEventListener('keydown', handleFirstTab);
  };
}

/**
 * Color contrast checker
 */
export function checkColorContrast(foreground: string, background: string): number {
  // Function to convert hex color to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Function to calculate relative luminance
  const calculateLuminance = (rgb: { r: number; g: number; b: number }) => {
    const { r, g, b } = rgb;
    const sRGB = [r / 255, g / 255, b / 255].map(val => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  // Convert hex colors to RGB
  const rgbForeground = hexToRgb(foreground);
  const rgbBackground = hexToRgb(background);

  if (!rgbForeground || !rgbBackground) {
    throw new Error('Invalid color format. Please use valid hex colors.');
  }

  // Calculate luminance
  const luminance1 = calculateLuminance(rgbForeground);
  const luminance2 = calculateLuminance(rgbBackground);

  // Determine lighter and darker luminance
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  // Calculate contrast ratio
  return (lighter + 0.05) / (darker + 0.05);
}
/accessibility.tsx