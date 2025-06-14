import { NextRequest } from 'next/server';
import { POST as requestResetHandler } from './request/route';
import { POST as confirmResetHandler } from './confirm/route';
import { db as prismaDb } from '@/lib/db';
import crypto from 'crypto';
import { hash, compare } from 'bcryptjs';

// --- Mocking Dependencies ---
jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    passwordResetToken: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Mock crypto for predictable token generation
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'), // Import and retain default behavior
  randomBytes: jest.fn().mockReturnValue(Buffer.from('fixedpredefinedrawtokenstringfixedpredefinedrawtokenstring')), // 32 bytes
}));


// bcryptjs.hash and bcryptjs.compare are real functions, usually not mocked
// unless specific scenarios require controlling their output or execution time.
// For these tests, we'll use the actual functions.

const mockedPrismaUserFindUnique = prismaDb.user.findUnique as jest.MockedFunction<any>;
const mockedPrismaPasswordResetTokenCreate = prismaDb.passwordResetToken.create as jest.MockedFunction<any>;
const mockedPrismaPasswordResetTokenFindMany = prismaDb.passwordResetToken.findMany as jest.MockedFunction<any>;
const mockedPrismaUserUpdate = prismaDb.user.update as jest.MockedFunction<any>;
const mockedPrismaPasswordResetTokenDelete = prismaDb.passwordResetToken.delete as jest.MockedFunction<any>;

const fixedRawToken = '6669786564707265646566696e6564726177746f6b656e737472696e676669786564707265646566696e6564726177746f6b656e737472696e67'; // crypto.randomBytes(32).toString('hex') of the mock

describe('Password Reset API', () => {
  let mockRequest: Partial<NextRequest>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/reset-password/request', () => {
    it('should create a reset token if user exists and return 200', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ email: 'user@example.com' }),
      };
      mockedPrismaUserFindUnique.mockResolvedValue({ id: 'user-123', email: 'user@example.com', name: 'Test User' });
      mockedPrismaPasswordResetTokenCreate.mockResolvedValue({
        id: 'token-id',
        token: await hash(fixedRawToken, 10), // ensure we expect the hashed version
        userId: 'user-123',
        expiresAt: new Date(Date.now() + 3600000),
      });

      const response = await requestResetHandler(mockRequest as Request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.message).toContain('If your email is registered');
      expect(mockedPrismaPasswordResetTokenCreate).toHaveBeenCalledTimes(1);
      const createCallArgs = mockedPrismaPasswordResetTokenCreate.mock.calls[0][0].data;
      expect(createCallArgs.userId).toBe('user-123');
      expect(createCallArgs.token).not.toBe(fixedRawToken); // Ensure stored token is not raw
      expect(await compare(fixedRawToken, createCallArgs.token)).toBe(true); // Check if stored token matches raw token after hashing
      expect(createCallArgs.expiresAt.getTime()).toBeGreaterThan(Date.now());
      expect(createCallArgs.expiresAt.getTime()).toBeLessThanOrEqual(Date.now() + 3600000 + 1000); // ~1hr
    });

    it('should return 200 even if user does not exist (to prevent enumeration)', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ email: 'nouser@example.com' }),
      };
      mockedPrismaUserFindUnique.mockResolvedValue(null);

      const response = await requestResetHandler(mockRequest as Request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.message).toContain('If your email is registered');
      expect(mockedPrismaPasswordResetTokenCreate).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid email format', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ email: 'invalid-email' }),
      };
      const response = await requestResetHandler(mockRequest as Request);
      const json = await response.json();
      expect(response.status).toBe(400);
      expect(json.error).toContain('Invalid email address');
    });
  });

  describe('POST /api/auth/reset-password/confirm', () => {
    const validNewPassword = 'newSecurePassword123';
    let validHashedToken: string;

    beforeAll(async () => {
        validHashedToken = await hash(fixedRawToken, 10);
    });

    it('should reset password if token is valid and not expired', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ token: fixedRawToken, newPassword: validNewPassword }),
      };
      const mockTokenRecord = {
        id: 'token-id-123',
        token: validHashedToken,
        userId: 'user-123',
        expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
      };
      mockedPrismaPasswordResetTokenFindMany.mockResolvedValue([mockTokenRecord]);
      mockedPrismaUserUpdate.mockResolvedValue({ id: 'user-123' }); // Simulate successful update
      mockedPrismaPasswordResetTokenDelete.mockResolvedValue({}); // Simulate successful delete

      const response = await confirmResetHandler(mockRequest as Request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.message).toContain('Password has been reset successfully');
      expect(mockedPrismaUserUpdate).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'user-123' },
        data: { password: expect.any(String) }, // Check that password field is being updated
      }));
      // Check if the new password was hashed
      const newHashedPassArgument = mockedPrismaUserUpdate.mock.calls[0][0].data.password;
      expect(await compare(validNewPassword, newHashedPassArgument)).toBe(true);
      expect(newHashedPassArgument).not.toBe(validNewPassword);

      expect(mockedPrismaPasswordResetTokenDelete).toHaveBeenCalledWith({ where: { id: mockTokenRecord.id } });
    });

    it('should return 400 if token is invalid (not found or hash mismatch)', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ token: 'invalidOrMismatchedRawToken', newPassword: validNewPassword }),
      };
      // Simulate findMany returning other tokens, or an empty array
      mockedPrismaPasswordResetTokenFindMany.mockResolvedValue([
        { id: 'other-token', token: await hash('anotherTokenValue',10), userId: 'user-456', expiresAt: new Date(Date.now() + 3600000) }
      ]);

      const response = await confirmResetHandler(mockRequest as Request);
      const json = await response.json();
      expect(response.status).toBe(400);
      expect(json.error).toContain('Invalid or expired reset token');
    });

    it('should return 400 if token is expired', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ token: fixedRawToken, newPassword: validNewPassword }),
      };
      const mockTokenRecord = {
        id: 'token-id-expired',
        token: validHashedToken,
        userId: 'user-123',
        expiresAt: new Date(Date.now() - 10000), // Expired 10 seconds ago
      };
      // findMany will return this, but the iteration logic should find it "expired"
      // because the query in confirm route is for expiresAt > now.
      // So, to test this path correctly, we mock findMany to return empty, as if it was already filtered by DB.
      mockedPrismaPasswordResetTokenFindMany.mockResolvedValue([]);


      const response = await confirmResetHandler(mockRequest as Request);
      const json = await response.json();
      expect(response.status).toBe(400);
      expect(json.error).toContain('Invalid or expired reset token');
    });

    it('should return 400 for invalid input (e.g., password too short)', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({ token: fixedRawToken, newPassword: 'short' }),
      };
      const response = await confirmResetHandler(mockRequest as Request);
      const json = await response.json();
      expect(response.status).toBe(400);
      expect(json.error).toContain('Password must be at least 8 characters');
    });
  });
});
