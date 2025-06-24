import { getAuthUser, isAuthenticated, hasRole } from './auth'; // Assuming AuthUser is exported for type usage
import { cookies } from 'next/headers'; // Will be mocked

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

// Helper to get the mocked cookies function
const mockedCookies = cookies as jest.MockedFunction<typeof cookies>;

type AuthUser = { id: string; email: string; role: string };

describe('Auth utility functions', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockedCookies.mockReset();
    (global as unknown as { __mockedCookies: undefined }).__mockedCookies = undefined;
  });

  describe('getAuthUser', () => {
    it('should return user data if "user" cookie exists and is valid JSON', () => {
      const mockUserData: AuthUser = { id: '1', email: 'test@example.com', role: 'user' };
      const mockCookieStore = new Map<string, { value: string }>();
      mockCookieStore.set('user', { value: JSON.stringify(mockUserData) });
      (global as unknown as { __mockedCookies: Map<string, { value: string }> }).__mockedCookies = mockCookieStore;

      const user = getAuthUser();
      expect(user).toEqual(mockUserData);
    });

    it('should return null if "user" cookie does not exist', () => {
      const mockCookieStore = new Map<string, { value: string }>();
      (global as unknown as { __mockedCookies: Map<string, { value: string }> }).__mockedCookies = mockCookieStore;

      const user = getAuthUser();
      expect(user).toBeNull();
    });

    it('should return null and log an error if "user" cookie is malformed JSON', () => {
      const mockCookieStore = new Map<string, { value: string }>();
      mockCookieStore.set('user', { value: 'not-json' });
      (global as unknown as { __mockedCookies: Map<string, { value: string }> }).__mockedCookies = mockCookieStore;

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const user = getAuthUser();
      expect(user).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith("Auth error:", expect.any(SyntaxError));

      consoleErrorSpy.mockRestore();
    });

    it('should return user data with defaults for missing fields in cookie JSON', () => {
      const mockCookieStore = new Map<string, { value: string }>();
      mockCookieStore.set('user', { value: JSON.stringify({ id: '2' }) });
      (global as unknown as { __mockedCookies: Map<string, { value: string }> }).__mockedCookies = mockCookieStore;

      const user = getAuthUser();
      expect(user).toEqual({ id: '2', email: '', role: 'user' });
    });

    it('should handle request object for cookie retrieval (server components)', () => {
      const mockUserData: AuthUser = { id: '3', email: 'server@example.com', role: 'admin' };
      const mockRequest = {
        cookies: {
          get: (name: string) => name === 'user' ? { value: JSON.stringify(mockUserData) } : undefined,
        },
      };
      const user = getAuthUser(mockRequest);
      expect(user).toEqual(mockUserData);
    });

    it('should return null if request object has no "user" cookie', () => {
      const mockRequest = {
        cookies: {
          get: jest.fn().mockReturnValue(undefined)
        }
      } as unknown;

      const user = getAuthUser(mockRequest);
      expect(user).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if getAuthUser returns a user', () => {
      const mockUserData: AuthUser = { id: '1', email: 'test@example.com', role: 'user' };
      const mockCookieStore = new Map<string, { value: string }>();
      mockCookieStore.set('user', { value: JSON.stringify(mockUserData) });
      (global as unknown as { __mockedCookies: Map<string, { value: string }> }).__mockedCookies = mockCookieStore;
      expect(isAuthenticated()).toBe(true);
    });

    it('should return false if getAuthUser returns null', () => {
      const mockCookieStore = new Map<string, { value: string }>();
      (global as unknown as { __mockedCookies: Map<string, { value: string }> }).__mockedCookies = mockCookieStore;
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('hasRole', () => {
    beforeEach(() => {
      const mockUserData: AuthUser = { id: '1', email: 'test@example.com', role: 'admin' };
      const mockCookieStore = new Map<string, { value: string }>();
      mockCookieStore.set('user', { value: JSON.stringify(mockUserData) });
      (global as unknown as { __mockedCookies: Map<string, { value: string }> }).__mockedCookies = mockCookieStore;
    });

    it('should return true if user has the specified role (string)', () => {
      expect(hasRole('admin')).toBe(true);
    });

    it('should return false if user does not have the specified role (string)', () => {
      expect(hasRole('user')).toBe(false);
    });

    it('should return true if user has one of the specified roles (array)', () => {
      expect(hasRole(['admin', 'editor'])).toBe(true);
    });

    it('should return false if user does not have any of the specified roles (array)', () => {
      expect(hasRole(['user', 'guest'])).toBe(false);
    });

    it('should return false if no user is authenticated', () => {
      (global as unknown as { __mockedCookies: Map<string, { value: string }> }).__mockedCookies = new Map();
      expect(hasRole('admin')).toBe(false);
    });
  });
});
