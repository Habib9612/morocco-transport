import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { db as prismaDb } from '@/lib/db';

// Mock the actual route handlers
import { GET as getAllDrivers, POST as createDriver } from './route';
import { GET as getDriverById, PUT as updateDriver, DELETE as deleteDriver } from './[id]/route';

// --- Mocking Dependencies ---
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
    },
  },
  executeQuery: jest.fn().mockResolvedValue([]), // Default mock for original handlers
}));

const mockedCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockedVerify = verify as jest.MockedFunction<typeof verify>;
const mockedPrismaUserFindUnique = prismaDb.user.findUnique as jest.MockedFunction<typeof prismaDb.user.findUnique>;
const mockedExecuteQuery = (prismaDb as any).executeQuery as jest.MockedFunction<any>;

// --- Test Suite ---
describe('Drivers API Security (Authentication & Authorization)', () => {
  const mockUserCompany = { id: 'user-company-123', role: 'COMPANY', email: 'comp@test.com', name: 'Company User' };
  const mockUserCarrier = { id: 'user-carrier-456', role: 'CARRIER', email: 'carr@test.com', name: 'Carrier User' };
  const mockUserIndividual = { id: 'user-individual-789', role: 'INDIVIDUAL', email: 'ind@test.com', name: 'Individual User' };
  const mockUserAdmin = { id: 'user-admin-001', role: 'ADMIN', email: 'admin@test.com', name: 'Admin User' };
  let mockRequest: Partial<NextRequest>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      method: 'GET',
      json: jest.fn().mockResolvedValue({}),
      nextUrl: new URL('http://localhost/api/drivers'),
    };
  });

  const setupMockCookies = (tokenValue?: string) => {
    const mockCookieStore = new Map<string, { value: string }>();
    if (tokenValue) {
      mockCookieStore.set('session', { value: tokenValue });
    }
    mockedCookies.mockReturnValue({ get: (name: string) => mockCookieStore.get(name) } as any);
  };

  describe('Authentication Tests - Common for all Driver endpoints', () => {
    it('should return 401 if no session cookie for GET /api/drivers', async () => {
      setupMockCookies();
      const response = await getAllDrivers(mockRequest as NextRequest);
      expect(response.status).toBe(401);
    });

    it('should return 401 if JWT is invalid for GET /api/drivers/[id]', async () => {
      setupMockCookies('invalid-token');
      mockedVerify.mockImplementation(() => {
        const error = new Error('Invalid token') as any;
        error.name = 'JsonWebTokenError';
        throw error;
      });
      const response = await getDriverById(mockRequest as NextRequest, { params: { id: 'driver1' } });
      expect(response.status).toBe(401);
    });
  });

  describe('Authorization Tests - Drivers API', () => {
    // POST /api/drivers (Create Driver) - Allowed for COMPANY, CARRIER
    it('should allow COMPANY to POST /api/drivers (create driver)', async () => {
      setupMockCookies('valid-token-company');
      mockedVerify.mockReturnValue({ userId: mockUserCompany.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserCompany as any);
      mockRequest.method = 'POST';
      mockRequest.json = jest.fn().mockResolvedValue({ user_id: 'someuser', license_number: 'LIC123', license_expiry_date: '2025-12-31', phone_number: '12345' });
      // Mock sequence: existingUser (empty), existingDriver (empty), INSERT driver, SELECT user details
      mockedExecuteQuery.mockResolvedValueOnce([])
                        .mockResolvedValueOnce([])
                        .mockResolvedValueOnce([{ id: 'new-driver-id', user_id: 'someuser' }])
                        .mockResolvedValueOnce([{ name: 'Driver Name', email: 'driver@test.com'}]);

      const response = await createDriver(mockRequest as NextRequest);
      expect(response.status).toBe(201);
    });

    it('should forbid INDIVIDUAL from POST /api/drivers (403)', async () => {
      setupMockCookies('valid-token-individual');
      mockedVerify.mockReturnValue({ userId: mockUserIndividual.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserIndividual as any);
      mockRequest.method = 'POST';
      mockRequest.json = jest.fn().mockResolvedValue({ user_id: 'anotheruser', license_number: 'LIC456', license_expiry_date: '2026-12-31', phone_number: '67890' });

      const response = await createDriver(mockRequest as NextRequest);
      expect(response.status).toBe(403);
    });

    // GET /api/drivers (List Drivers) - Allowed for COMPANY, CARRIER
    it('should allow CARRIER to GET /api/drivers', async () => {
      setupMockCookies('valid-token-carrier');
      mockedVerify.mockReturnValue({ userId: mockUserCarrier.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserCarrier as any);
      mockedExecuteQuery.mockResolvedValueOnce([]);

      const response = await getAllDrivers(mockRequest as NextRequest);
      expect(response.status).toBe(200);
    });

    it('should forbid INDIVIDUAL from GET /api/drivers (403)', async () => {
      setupMockCookies('valid-token-individual');
      mockedVerify.mockReturnValue({ userId: mockUserIndividual.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserIndividual as any);

      const response = await getAllDrivers(mockRequest as NextRequest);
      expect(response.status).toBe(403);
    });

    // GET /api/drivers/[id] (Specific Driver) - Allowed for COMPANY, CARRIER
    it('should allow COMPANY to GET /api/drivers/[id]', async () => {
        setupMockCookies('valid-token-company');
        mockedVerify.mockReturnValue({ userId: mockUserCompany.id } as any);
        mockedPrismaUserFindUnique.mockResolvedValue(mockUserCompany as any);
        mockedExecuteQuery.mockResolvedValueOnce([{ id: 'driver123' }]);

        const response = await getDriverById(mockRequest as NextRequest, { params: { id: 'driver123' } });
        expect(response.status).toBe(200);
      });

    // PUT /api/drivers/[id] (Update Driver) - Allowed for COMPANY, CARRIER
    it('should forbid INDIVIDUAL from PUT /api/drivers/[id] (403)', async () => {
      setupMockCookies('valid-token-individual');
      mockedVerify.mockReturnValue({ userId: mockUserIndividual.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserIndividual as any);
      mockRequest.method = 'PUT';
      mockRequest.json = jest.fn().mockResolvedValue({ status: 'unavailable' });

      const response = await updateDriver(mockRequest as NextRequest, { params: { id: 'driver123' } });
      expect(response.status).toBe(403);
    });

    // DELETE /api/drivers/[id] - Allowed for COMPANY, CARRIER
     it('should allow COMPANY to DELETE /api/drivers/[id]', async () => {
      setupMockCookies('valid-token-company');
      mockedVerify.mockReturnValue({ userId: mockUserCompany.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserCompany as any);
      mockRequest.method = 'DELETE';
      // Mock sequence: find driver, find active routes (empty), delete driver
      mockedExecuteQuery.mockResolvedValueOnce([{ id: 'driver123' }])
                        .mockResolvedValueOnce([])
                        .mockResolvedValueOnce(undefined);

      const response = await deleteDriver(mockRequest as NextRequest, { params: { id: 'driver123' } });
      expect(response.status).toBe(200);
      expect(await response.json()).toHaveProperty('success', true);
    });

    // ADMIN Role Tests for Drivers API
    it('ADMIN should be allowed to POST /api/drivers (create driver)', async () => {
      setupMockCookies('valid-token-admin');
      mockedVerify.mockReturnValue({ userId: mockUserAdmin.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserAdmin as any);
      mockRequest.method = 'POST';
      mockRequest.json = jest.fn().mockResolvedValue({ user_id: 'admin-driver-user', license_number: 'ADMDRV', license_expiry_date: '2027-01-01', phone_number: '00000' });
      mockedExecuteQuery.mockResolvedValueOnce([])
                        .mockResolvedValueOnce([])
                        .mockResolvedValueOnce([{ id: 'new-admin-driver-id', user_id: 'admin-driver-user' }])
                        .mockResolvedValueOnce([{ name: 'Admin Driver', email: 'admindriver@test.com'}]);
      const response = await createDriver(mockRequest as NextRequest);
      expect(response.status).toBe(201);
    });

    it('ADMIN should be allowed to GET /api/drivers (list drivers)', async () => {
      setupMockCookies('valid-token-admin');
      mockedVerify.mockReturnValue({ userId: mockUserAdmin.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserAdmin as any);
      mockedExecuteQuery.mockResolvedValueOnce([]);

      const response = await getAllDrivers(mockRequest as NextRequest);
      expect(response.status).toBe(200);
    });

    it('ADMIN should be allowed to GET /api/drivers/[id]', async () => {
      setupMockCookies('valid-token-admin');
      mockedVerify.mockReturnValue({ userId: mockUserAdmin.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserAdmin as any);
      mockedExecuteQuery.mockResolvedValueOnce([{ id: 'driverAdminView' }]);

      const response = await getDriverById(mockRequest as NextRequest, { params: { id: 'driverAdminView' } });
      expect(response.status).toBe(200);
    });

    it('ADMIN should be allowed to PUT /api/drivers/[id]', async () => {
      setupMockCookies('valid-token-admin');
      mockedVerify.mockReturnValue({ userId: mockUserAdmin.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserAdmin as any);
      mockRequest.method = 'PUT';
      mockRequest.json = jest.fn().mockResolvedValue({ status: 'admin_managed' });
      mockedExecuteQuery.mockResolvedValueOnce([{ id: 'driver123' }])
                        .mockResolvedValueOnce([{ id: 'driver123', status: 'admin_managed', user_id: 'someuser' }])
                        .mockResolvedValueOnce([{ name: 'Driver Name', email: 'driver@test.com'}]);


      const response = await updateDriver(mockRequest as NextRequest, { params: { id: 'driver123' } });
      expect(response.status).toBe(200);
    });

    it('ADMIN should be allowed to DELETE /api/drivers/[id]', async () => {
      setupMockCookies('valid-token-admin');
      mockedVerify.mockReturnValue({ userId: mockUserAdmin.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserAdmin as any);
      mockRequest.method = 'DELETE';
      mockedExecuteQuery.mockResolvedValueOnce([{ id: 'driverAdminDelete' }])
                        .mockResolvedValueOnce([])
                        .mockResolvedValueOnce(undefined);

      const response = await deleteDriver(mockRequest as NextRequest, { params: { id: 'driverAdminDelete' } });
      expect(response.status).toBe(200);
      expect(await response.json()).toHaveProperty('success', true);
    });
  });
});
