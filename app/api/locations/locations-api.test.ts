import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { db as prismaDb } from '@/lib/db';

// Mock the actual route handlers
import { GET as getAllLocations, POST as createLocation } from './route';
import { GET as getLocationById, PUT as updateLocation, DELETE as deleteLocation } from './[id]/route';

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
describe('Locations API Security (Authentication & Authorization)', () => {
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
      nextUrl: new URL('http://localhost/api/locations'),
    };
  });

  const setupMockCookies = (tokenValue?: string) => {
    const mockCookieStore = new Map<string, { value: string }>();
    if (tokenValue) {
      mockCookieStore.set('session', { value: tokenValue });
    }
    mockedCookies.mockReturnValue({ get: (name: string) => mockCookieStore.get(name) } as any);
  };

  describe('Authentication Tests - Common for all Location endpoints', () => {
    it('should return 401 if no session cookie for GET /api/locations', async () => {
      setupMockCookies();
      const response = await getAllLocations(mockRequest as NextRequest);
      expect(response.status).toBe(401);
    });

    it('should return 401 if JWT is invalid for GET /api/locations/[id]', async () => {
      setupMockCookies('invalid-token');
      mockedVerify.mockImplementation(() => {
        const error = new Error('Invalid token') as any;
        error.name = 'JsonWebTokenError';
        throw error;
      });
      const response = await getLocationById(mockRequest as NextRequest, { params: { id: 'loc1' } });
      expect(response.status).toBe(401);
    });
  });

  describe('Authorization Tests - Locations API', () => {
    // POST /api/locations (Create Location) - Allowed for COMPANY, CARRIER
    it('should allow COMPANY to POST /api/locations (create location)', async () => {
      setupMockCookies('valid-token-company');
      mockedVerify.mockReturnValue({ userId: mockUserCompany.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserCompany as any);
      mockRequest.method = 'POST';
      mockRequest.json = jest.fn().mockResolvedValue({ name: 'Warehouse A', address: '123 Main', city: 'NY', country: 'USA' });
      mockedExecuteQuery.mockResolvedValueOnce([{ id: 'new-loc-id' }]);

      const response = await createLocation(mockRequest as NextRequest);
      expect(response.status).toBe(201);
    });

    it('should forbid INDIVIDUAL from POST /api/locations (403)', async () => {
      setupMockCookies('valid-token-individual');
      mockedVerify.mockReturnValue({ userId: mockUserIndividual.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserIndividual as any);
      mockRequest.method = 'POST';
      mockRequest.json = jest.fn().mockResolvedValue({ name: 'My Place', address: '456 Sub', city: 'CA', country: 'USA' });

      const response = await createLocation(mockRequest as NextRequest);
      expect(response.status).toBe(403);
    });

    // GET /api/locations (List Locations) - Allowed for any authenticated user
    it('should allow INDIVIDUAL to GET /api/locations', async () => {
      setupMockCookies('valid-token-individual');
      mockedVerify.mockReturnValue({ userId: mockUserIndividual.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserIndividual as any);
      mockedExecuteQuery.mockResolvedValueOnce([]);

      const response = await getAllLocations(mockRequest as NextRequest);
      expect(response.status).toBe(200);
    });

    // GET /api/locations/[id] (Specific Location) - Allowed for any authenticated user
    it('should allow CARRIER to GET /api/locations/[id]', async () => {
      setupMockCookies('valid-token-carrier');
      mockedVerify.mockReturnValue({ userId: mockUserCarrier.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserCarrier as any);
      mockedExecuteQuery.mockResolvedValueOnce([{ id: 'loc123' }]);

      const response = await getLocationById(mockRequest as NextRequest, { params: { id: 'loc123' } });
      expect(response.status).toBe(200);
    });

    // PUT /api/locations/[id] (Update Location) - Allowed for COMPANY, CARRIER
    it('should allow COMPANY to PUT /api/locations/[id]', async () => {
        setupMockCookies('valid-token-company');
        mockedVerify.mockReturnValue({ userId: mockUserCompany.id } as any);
        mockedPrismaUserFindUnique.mockResolvedValue(mockUserCompany as any);
        mockRequest.method = 'PUT';
        mockRequest.json = jest.fn().mockResolvedValue({ city: 'New City' });
        mockedExecuteQuery.mockResolvedValueOnce([{ id: 'loc123' }]) // find existing
                          .mockResolvedValueOnce([{ id: 'loc123', city: 'New City' }]); // update

        const response = await updateLocation(mockRequest as NextRequest, { params: {id: 'loc123'}});
        expect(response.status).toBe(200);
    });

    it('should forbid INDIVIDUAL from PUT /api/locations/[id] (403)', async () => {
      setupMockCookies('valid-token-individual');
      mockedVerify.mockReturnValue({ userId: mockUserIndividual.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserIndividual as any);
      mockRequest.method = 'PUT';
      mockRequest.json = jest.fn().mockResolvedValue({ city: 'Another City' });

      const response = await updateLocation(mockRequest as NextRequest, { params: { id: 'loc123' } });
      expect(response.status).toBe(403);
    });

    // DELETE /api/locations/[id] - Allowed for COMPANY, CARRIER
    it('should forbid INDIVIDUAL from DELETE /api/locations/[id] (403)', async () => {
      setupMockCookies('valid-token-individual');
      mockedVerify.mockReturnValue({ userId: mockUserIndividual.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserIndividual as any);
      mockRequest.method = 'DELETE';

      const response = await deleteLocation(mockRequest as NextRequest, { params: { id: 'loc123' } });
      expect(response.status).toBe(403);
    });

    // ADMIN Role Tests for Locations API
    it('ADMIN should be allowed to POST /api/locations (create location)', async () => {
      setupMockCookies('valid-token-admin');
      mockedVerify.mockReturnValue({ userId: mockUserAdmin.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserAdmin as any);
      mockRequest.method = 'POST';
      mockRequest.json = jest.fn().mockResolvedValue({ name: 'Admin Warehouse', address: '1 Admin Rd', city: 'HQ', country: 'ADM' });
      mockedExecuteQuery.mockResolvedValueOnce([{ id: 'new-admin-loc-id' }]);

      const response = await createLocation(mockRequest as NextRequest);
      expect(response.status).toBe(201);
    });

    it('ADMIN should be allowed to GET /api/locations (list locations)', async () => {
      setupMockCookies('valid-token-admin');
      mockedVerify.mockReturnValue({ userId: mockUserAdmin.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserAdmin as any);
      mockedExecuteQuery.mockResolvedValueOnce([]);

      const response = await getAllLocations(mockRequest as NextRequest);
      expect(response.status).toBe(200); // Any authenticated user can list, Admin is authenticated
    });

    it('ADMIN should be allowed to GET /api/locations/[id]', async () => {
      setupMockCookies('valid-token-admin');
      mockedVerify.mockReturnValue({ userId: mockUserAdmin.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserAdmin as any);
      mockedExecuteQuery.mockResolvedValueOnce([{ id: 'locAdminView' }]);

      const response = await getLocationById(mockRequest as NextRequest, { params: { id: 'locAdminView' } });
      expect(response.status).toBe(200); // Any authenticated user can view, Admin is authenticated
    });

    it('ADMIN should be allowed to PUT /api/locations/[id]', async () => {
      setupMockCookies('valid-token-admin');
      mockedVerify.mockReturnValue({ userId: mockUserAdmin.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserAdmin as any);
      mockRequest.method = 'PUT';
      mockRequest.json = jest.fn().mockResolvedValue({ city: 'Admin City' });
      mockedExecuteQuery.mockResolvedValueOnce([{ id: 'loc123' }])
                        .mockResolvedValueOnce([{ id: 'loc123', city: 'Admin City' }]);

      const response = await updateLocation(mockRequest as NextRequest, { params: { id: 'loc123' } });
      expect(response.status).toBe(200);
    });

    it('ADMIN should be allowed to DELETE /api/locations/[id]', async () => {
      setupMockCookies('valid-token-admin');
      mockedVerify.mockReturnValue({ userId: mockUserAdmin.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(mockUserAdmin as any);
      mockRequest.method = 'DELETE';
      mockedExecuteQuery.mockResolvedValueOnce([{ id: 'locAdminDelete' }]) // find existing
                        .mockResolvedValueOnce([]) // no shipments
                        .mockResolvedValueOnce([]) // no waypoints
                        .mockResolvedValueOnce(undefined); // delete

      const response = await deleteLocation(mockRequest as NextRequest, { params: { id: 'locAdminDelete' } });
      expect(response.status).toBe(200);
      expect(await response.json()).toHaveProperty('success', true);
    });
  });
});
