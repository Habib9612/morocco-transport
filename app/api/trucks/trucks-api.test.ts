import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { db as prismaDb } from '@/lib/db';

// Mock the actual route handlers
import { GET as getAllTrucks, POST as createTruck } from './route';
import { GET as getTruckById, PUT as updateTruck, DELETE as deleteTruck } from './[id]/route';

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
describe('Trucks API Security (Authentication & Authorization)', () => {
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
      nextUrl: new URL('http://localhost/api/trucks'),
    };
  });

  const setupMockCookies = (tokenValue?: string) => {
    const mockCookieStore = new Map<string, { value: string }>();
    if (tokenValue) {
      mockCookieStore.set('session', { value: tokenValue });
    }
    mockedCookies.mockReturnValue({ get: (name: string) => mockCookieStore.get(name) } as any);
  };

  describe('Authentication Tests - GET /api/trucks', () => {
    it('should return 401 if no session cookie', async () => {
      setupMockCookies();
      const response = await getAllTrucks(mockRequest as NextRequest);
      expect(response.status).toBe(401);
      expect(await response.json()).toHaveProperty('error', 'Unauthorized: No session cookie');
    });

    it('should return 401 if JWT is invalid', async () => {
      setupMockCookies('invalid-token');
      mockedVerify.mockImplementation(() => {
        const error = new Error('Invalid token') as any;
        error.name = 'JsonWebTokenError';
        throw error;
      });
      const response = await getAllTrucks(mockRequest as NextRequest);
      expect(response.status).toBe(401);
      expect(await response.json()).toHaveProperty('error', 'Unauthorized: Invalid or expired token');
    });

    it('should return 401 if user from JWT is not found', async () => {
      setupMockCookies('valid-token-no-user');
      mockedVerify.mockReturnValue({ userId: 'unknown-user' } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(null);
      const response = await getAllTrucks(mockRequest as NextRequest);
      expect(response.status).toBe(401);
      expect(await response.json()).toHaveProperty('error', 'Unauthorized: User not found');
    });
  });

  describe('Authorization Tests - Trucks API', () => {
    // POST /api/trucks (Create Truck)
    it('should allow COMPANY to POST /api/trucks (create truck)', async () => {
      setupMockCookies('valid-token-company');
      mockedVerify.mockReturnValue({ userId: mockUserCompany.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserCompany as any);
      mockRequest.method = 'POST';
      mockRequest.json = jest.fn().mockResolvedValue({ license_plate: 'XYZ123', model: 'Test Truck', capacity: 1000 });
      mockedExecuteQuery.mockResolvedValueOnce([{ id: 'new-truck-id' }]); // Mock INSERT returning value

      const response = await createTruck(mockRequest as NextRequest);
      expect(response.status).toBe(201); // Assuming create returns 201
    });

    it('should allow CARRIER to POST /api/trucks (create truck)', async () => {
      setupMockCookies('valid-token-carrier');
      mockedVerify.mockReturnValue({ userId: mockUserCarrier.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserCarrier as any);
      mockRequest.method = 'POST';
      mockRequest.json = jest.fn().mockResolvedValue({ license_plate: 'XYZ124', model: 'Test Truck 2', capacity: 1500 });
      mockedExecuteQuery.mockResolvedValueOnce([{ id: 'new-truck-id-2' }]);

      const response = await createTruck(mockRequest as NextRequest);
      expect(response.status).toBe(201);
    });

    it('should forbid INDIVIDUAL from POST /api/trucks (403)', async () => {
      setupMockCookies('valid-token-individual');
      mockedVerify.mockReturnValue({ userId: mockUserIndividual.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserIndividual as any);
      mockRequest.method = 'POST';
      mockRequest.json = jest.fn().mockResolvedValue({ license_plate: 'XYZ125', model: 'Test Truck 3', capacity: 1200 });

      const response = await createTruck(mockRequest as NextRequest);
      expect(response.status).toBe(403);
      expect(await response.json()).toHaveProperty('error', 'Forbidden: Insufficient permissions');
    });

    // GET /api/trucks (List Trucks)
    it('should allow COMPANY to GET /api/trucks', async () => {
      setupMockCookies('valid-token-company');
      mockedVerify.mockReturnValue({ userId: mockUserCompany.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserCompany as any);
      mockedExecuteQuery.mockResolvedValueOnce([]); // Mock successful empty list

      const response = await getAllTrucks(mockRequest as NextRequest);
      expect(response.status).toBe(200);
    });

    it('should forbid INDIVIDUAL from GET /api/trucks (403)', async () => {
      setupMockCookies('valid-token-individual');
      mockedVerify.mockReturnValue({ userId: mockUserIndividual.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserIndividual as any);

      const response = await getAllTrucks(mockRequest as NextRequest);
      expect(response.status).toBe(403);
      expect(await response.json()).toHaveProperty('error', 'Forbidden: Insufficient permissions');
    });

    // Example for GET /api/trucks/[id]
    it('should allow COMPANY to GET /api/trucks/[id]', async () => {
      setupMockCookies('valid-token-company');
      mockedVerify.mockReturnValue({ userId: mockUserCompany.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserCompany as any);
      mockedExecuteQuery.mockResolvedValueOnce([{ id: 'truck123' }]); // Mock finding the truck

      const response = await getTruckById(mockRequest as NextRequest, { params: { id: 'truck123' } });
      expect(response.status).toBe(200);
    });

    // Example for PUT /api/trucks/[id]
    it('should forbid INDIVIDUAL from PUT /api/trucks/[id] (403)', async () => {
      setupMockCookies('valid-token-individual');
      mockedVerify.mockReturnValue({ userId: mockUserIndividual.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserIndividual as any);
      mockRequest.method = 'PUT';
      mockRequest.json = jest.fn().mockResolvedValue({ status: 'maintenance' });

      const response = await updateTruck(mockRequest as NextRequest, { params: { id: 'truck123' } });
      expect(response.status).toBe(403);
      expect(await response.json()).toHaveProperty('error', 'Forbidden: Insufficient permissions');
    });

    // Example for DELETE /api/trucks/[id]
    it('should allow CARRIER to DELETE /api/trucks/[id]', async () => {
      setupMockCookies('valid-token-carrier');
      mockedVerify.mockReturnValue({ userId: mockUserCarrier.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserCarrier as any);
      mockRequest.method = 'DELETE';
      // Mock sequence for successful deletion: find truck, find active routes (empty), delete truck
      mockedExecuteQuery.mockResolvedValueOnce([{ id: 'truck123' }])
                        .mockResolvedValueOnce([])
                        .mockResolvedValueOnce(undefined);


      const response = await deleteTruck(mockRequest as NextRequest, { params: { id: 'truck123' } });
      expect(response.status).toBe(200);
      expect(await response.json()).toHaveProperty('success', true);
    });

    // ADMIN Role Tests for Trucks API
    it('ADMIN should be allowed to POST /api/trucks (create truck)', async () => {
      setupMockCookies('valid-token-admin');
      mockedVerify.mockReturnValue({ userId: mockUserAdmin.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserAdmin as any);
      mockRequest.method = 'POST';
      mockRequest.json = jest.fn().mockResolvedValue({ license_plate: 'ADMTRK', model: 'Admin Truck', capacity: 5000 });
      mockedExecuteQuery.mockResolvedValueOnce([{ id: 'new-admin-truck-id' }]);

      const response = await createTruck(mockRequest as NextRequest);
      expect(response.status).toBe(201);
    });

    it('ADMIN should be allowed to GET /api/trucks (list trucks)', async () => {
      setupMockCookies('valid-token-admin');
      mockedVerify.mockReturnValue({ userId: mockUserAdmin.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserAdmin as any);
      mockedExecuteQuery.mockResolvedValueOnce([]);

      const response = await getAllTrucks(mockRequest as NextRequest);
      expect(response.status).toBe(200);
    });

    it('ADMIN should be allowed to GET /api/trucks/[id]', async () => {
      setupMockCookies('valid-token-admin');
      mockedVerify.mockReturnValue({ userId: mockUserAdmin.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserAdmin as any);
      mockedExecuteQuery.mockResolvedValueOnce([{ id: 'truckAdminView' }]);

      const response = await getTruckById(mockRequest as NextRequest, { params: { id: 'truckAdminView' } });
      expect(response.status).toBe(200);
    });

    it('ADMIN should be allowed to PUT /api/trucks/[id]', async () => {
      setupMockCookies('valid-token-admin');
      mockedVerify.mockReturnValue({ userId: mockUserAdmin.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserAdmin as any);
      mockRequest.method = 'PUT';
      mockRequest.json = jest.fn().mockResolvedValue({ status: 'admin_override' });
      mockedExecuteQuery.mockResolvedValueOnce([{ id: 'truck123' }]) // find existing
                        .mockResolvedValueOnce([{ id: 'truck123', status: 'admin_override' }]); // update

      const response = await updateTruck(mockRequest as NextRequest, { params: { id: 'truck123' } });
      expect(response.status).toBe(200);
    });

    it('ADMIN should be allowed to DELETE /api/trucks/[id]', async () => {
      setupMockCookies('valid-token-admin');
      mockedVerify.mockReturnValue({ userId: mockUserAdmin.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserAdmin as any);
      mockRequest.method = 'DELETE';
      mockedExecuteQuery.mockResolvedValueOnce([{ id: 'truckAdminDelete' }])
                        .mockResolvedValueOnce([])
                        .mockResolvedValueOnce(undefined);

      const response = await deleteTruck(mockRequest as NextRequest, { params: { id: 'truckAdminDelete' } });
      expect(response.status).toBe(200);
      expect(await response.json()).toHaveProperty('success', true);
    });
  });
});
