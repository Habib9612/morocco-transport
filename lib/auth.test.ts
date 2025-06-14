import { getAuthUser, isAuthenticated, hasRole, AuthUser } from './auth'; // Assuming AuthUser is exported for type usage
import { cookies } from 'next/headers'; // Will be mocked

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

// Helper to get the mocked cookies function
const mockedCookies = cookies as jest.MockedFunction<typeof cookies>;

describe('Auth utility functions', () => {
  describe('getAuthUser', () => {
    beforeEach(() => {
      // Reset mocks before each test
      mockedCookies.mockReset();
    });

    it('should return user data if "user" cookie exists and is valid JSON', () => {
      const mockUserData: AuthUser = { id: '1', email: 'test@example.com', role: 'user' };
      const mockCookieStore = new Map<string, { value: string }>();
      mockCookieStore.set('user', { value: JSON.stringify(mockUserData) });

      mockedCookies.mockReturnValue({
        get: (name: string) => mockCookieStore.get(name),
        // Add other methods like `set`, `delete` if needed for other tests,
        // but getAuthUser only uses `get`.
      } as any); // Use `as any` to simplify mock for `cookies()` return type

      const user = getAuthUser();
      expect(user).toEqual(mockUserData);
    });

    it('should return null if "user" cookie does not exist', () => {
      const mockCookieStore = new Map<string, { value: string }>();
      mockedCookies.mockReturnValue({
        get: (name: string) => mockCookieStore.get(name),
      } as any);

      const user = getAuthUser();
      expect(user).toBeNull();
    });

    it('should return null and log an error if "user" cookie is malformed JSON', () => {
      const mockCookieStore = new Map<string, { value: string }>();
      mockCookieStore.set('user', { value: 'not-json' });
      mockedCookies.mockReturnValue({
        get: (name: string) => mockCookieStore.get(name),
      } as any);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const user = getAuthUser();
      expect(user).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith("Auth error:", expect.any(SyntaxError));

      consoleErrorSpy.mockRestore();
    });

    it('should return user data with defaults for missing fields in cookie JSON', () => {
      const incompleteUserData = { id: '2' }; // Missing email and role
      const mockCookieStore = new Map<string, { value: string }>();
      mockCookieStore.set('user', { value: JSON.stringify(incompleteUserData) });
      mockedCookies.mockReturnValue({
        get: (name: string) => mockCookieStore.get(name),
      } as any);

      const user = getAuthUser();
      expect(user).toEqual({ id: '2', email: '', role: 'user' });
    });

    it('should handle request object for cookie retrieval (server components)', () => {
      const mockUserData: AuthUser = { id: '3', email: 'server@example.com', role: 'admin' };
      const mockRequest = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: JSON.stringify(mockUserData) })
        }
      } as any; // Mock NextRequest

      const user = getAuthUser(mockRequest);
      expect(user).toEqual(mockUserData);
      expect(mockRequest.cookies.get).toHaveBeenCalledWith('user');
    });

     it('should return null if request object has no "user" cookie', () => {
      const mockRequest = {
        cookies: {
          get: jest.fn().mockReturnValue(undefined)
        }
      } as any;

      const user = getAuthUser(mockRequest);
      expect(user).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if getAuthUser returns a user', () => {
      const mockUserData: AuthUser = { id: '1', email: 'test@example.com', role: 'user' };
      const mockCookieStore = new Map<string, { value: string }>();
      mockCookieStore.set('user', { value: JSON.stringify(mockUserData) });
       mockedCookies.mockReturnValue({
        get: (name: string) => mockCookieStore.get(name),
      } as any);
      expect(isAuthenticated()).toBe(true);
    });

    it('should return false if getAuthUser returns null', () => {
       const mockCookieStore = new Map<string, { value: string }>();
       mockedCookies.mockReturnValue({
        get: (name: string) => mockCookieStore.get(name),
      } as any);
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('hasRole', () => {
    beforeEach(() => {
      const mockUserData: AuthUser = { id: '1', email: 'test@example.com', role: 'admin' };
      const mockCookieStore = new Map<string, { value: string }>();
      mockCookieStore.set('user', { value: JSON.stringify(mockUserData) });
      mockedCookies.mockReturnValue({
        get: (name: string) => mockCookieStore.get(name),
      } as any);
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
      const mockCookieStore = new Map<string, { value: string }>();
      mockedCookies.mockReturnValue({
        get: (name: string) => mockCookieStore.get(name),
      } as any);
      expect(hasRole('admin')).toBe(false);
    });
  });
});
