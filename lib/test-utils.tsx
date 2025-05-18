import { render as rtlRender } from '@testing-library/react';
import { AuthProvider } from './__mocks__/auth-context';
import { Toaster } from '@/components/toast';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

function render(ui: React.ReactElement, { ...options } = {}) {
  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    ),
    ...options,
  });
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render }; 