import { NextRequest } from 'next/server';
import { POST as createInvoiceHandler, GET as listInvoicesHandler } from './route';
import { GET as getInvoiceByIdHandler } from './[id]/route';
import { db as prismaDb } from '@/lib/db';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

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
    invoice: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(), // Added for pagination in GET list
    },
  },
}));

const mockedCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockedVerify = verify as jest.MockedFunction<typeof verify>;
const mockedPrismaUserFindUnique = prismaDb.user.findUnique as jest.MockedFunction<any>;
const mockedPrismaInvoiceCreate = prismaDb.invoice.create as jest.MockedFunction<any>;
const mockedPrismaInvoiceFindMany = prismaDb.invoice.findMany as jest.MockedFunction<any>;
const mockedPrismaInvoiceFindUnique = prismaDb.invoice.findUnique as jest.MockedFunction<any>;
const mockedPrismaInvoiceCount = prismaDb.invoice.count as jest.MockedFunction<any>;


describe('Invoice API Security and Functionality', () => {
  let mockRequest: Partial<NextRequest>;
  const mockAdminUser = { id: 'admin-user-id', role: 'ADMIN', name: 'Admin' };
  const mockCompanyUser = { id: 'company-user-id', role: 'COMPANY', name: 'Company Inc.' };
  const mockIndividualUser = { id: 'individual-user-id', role: 'INDIVIDUAL', name: 'Individual R.' };

  const setupMocksForUser = (user: {id: string, role: string} | null) => {
    if (user) {
      const mockCookieStore = new Map<string, { value: string }>();
      mockCookieStore.set('session', { value: 'valid-token' });
      mockedCookies.mockReturnValue({ get: (name: string) => mockCookieStore.get(name) } as any);
      mockedVerify.mockReturnValue({ userId: user.id } as any);
      mockedPrismaUserFindUnique.mockResolvedValue(user);
    } else {
      // Unauthenticated
      mockedCookies.mockReturnValue({ get: () => undefined } as any);
      mockedVerify.mockReset();
      mockedPrismaUserFindUnique.mockReset();
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      json: jest.fn(),
      nextUrl: new URL('http://localhost/api/invoices'), // Default for list/create
    };
  });

  describe('POST /api/invoices (Create Invoice)', () => {
    const validInvoiceData = {
      userId: 'target-user-id',
      amount: 100.50,
      currency: 'MAD',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      invoiceNumber: 'INV-2024-001',
    };

    it('should allow ADMIN to create an invoice', async () => {
      setupMocksForUser(mockAdminUser);
      (mockRequest.json as jest.Mock).mockResolvedValue(validInvoiceData);
      mockedPrismaInvoiceCreate.mockResolvedValue({ ...validInvoiceData, id: 'inv-123', status: 'DRAFT', issueDate: new Date() });

      const response = await createInvoiceHandler(mockRequest as NextRequest);
      expect(response.status).toBe(201);
      expect(mockedPrismaInvoiceCreate).toHaveBeenCalledWith({ data: expect.objectContaining(validInvoiceData) });
    });

    it('should allow COMPANY to create an invoice', async () => {
      setupMocksForUser(mockCompanyUser);
      (mockRequest.json as jest.Mock).mockResolvedValue(validInvoiceData);
      mockedPrismaInvoiceCreate.mockResolvedValue({ ...validInvoiceData, id: 'inv-124', status: 'DRAFT', issueDate: new Date() });

      const response = await createInvoiceHandler(mockRequest as NextRequest);
      expect(response.status).toBe(201);
    });

    it('should forbid INDIVIDUAL from creating an invoice (403)', async () => {
      setupMocksForUser(mockIndividualUser);
      (mockRequest.json as jest.Mock).mockResolvedValue(validInvoiceData);

      const response = await createInvoiceHandler(mockRequest as NextRequest);
      expect(response.status).toBe(403);
      expect(await response.json()).toHaveProperty('error', 'Forbidden: Insufficient permissions');
    });

    it('should forbid unauthenticated access (401)', async () => {
      setupMocksForUser(null);
      (mockRequest.json as jest.Mock).mockResolvedValue(validInvoiceData);

      const response = await createInvoiceHandler(mockRequest as NextRequest);
      expect(response.status).toBe(401);
    });

    it('should return 400 for missing required fields (e.g., amount)', async () => {
      setupMocksForUser(mockAdminUser);
      const invalidData = { ...validInvoiceData, amount: undefined };
      (mockRequest.json as jest.Mock).mockResolvedValue(invalidData);

      const response = await createInvoiceHandler(mockRequest as NextRequest);
      expect(response.status).toBe(400);
      expect(await response.json()).toHaveProperty('error', 'Invalid input');
    });
  });

  describe('GET /api/invoices (List Invoices)', () => {
    it('should allow ADMIN to list all invoices (conceptual - no data check here, just access)', async () => {
      setupMocksForUser(mockAdminUser);
      mockedPrismaInvoiceFindMany.mockResolvedValue([]); // No specific data check, just that it's called
      mockedPrismaInvoiceCount.mockResolvedValue(0);


      const response = await listInvoicesHandler(mockRequest as NextRequest);
      expect(response.status).toBe(200);
      expect(mockedPrismaInvoiceFindMany).toHaveBeenCalledWith(expect.objectContaining({
        where: {}, // Admin has empty where clause (sees all)
      }));
    });

    it('should allow INDIVIDUAL to list only their own invoices', async () => {
      setupMocksForUser(mockIndividualUser);
      mockedPrismaInvoiceFindMany.mockResolvedValue([]);
      mockedPrismaInvoiceCount.mockResolvedValue(0);

      const response = await listInvoicesHandler(mockRequest as NextRequest);
      expect(response.status).toBe(200);
      expect(mockedPrismaInvoiceFindMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { userId: mockIndividualUser.id }, // Key check
      }));
    });

    it('should forbid unauthenticated access (401)', async () => {
      setupMocksForUser(null);
      const response = await listInvoicesHandler(mockRequest as NextRequest);
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/invoices/[id] (Get Specific Invoice)', () => {
    const invoiceId = 'inv-test-123';
    const sampleInvoice = { id: invoiceId, userId: mockIndividualUser.id, amount: 100, currency: 'MAD' };

    it('should allow ADMIN to get any invoice by ID', async () => {
      setupMocksForUser(mockAdminUser);
      mockedPrismaInvoiceFindUnique.mockResolvedValue(sampleInvoice); // Admin can see this invoice

      const response = await getInvoiceByIdHandler(mockRequest as NextRequest, { params: { id: invoiceId } });
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(sampleInvoice);
    });

    it('should allow INDIVIDUAL to get their own invoice by ID', async () => {
      setupMocksForUser(mockIndividualUser);
      mockedPrismaInvoiceFindUnique.mockResolvedValue(sampleInvoice); // This invoice belongs to the individual

      const response = await getInvoiceByIdHandler(mockRequest as NextRequest, { params: { id: invoiceId } });
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(sampleInvoice);
    });

    it('should forbid INDIVIDUAL from getting another user\'s invoice (403)', async () => {
      setupMocksForUser(mockIndividualUser);
      const anotherUsersInvoice = { id: invoiceId, userId: 'another-user-id', amount: 200, currency: 'USD' };
      mockedPrismaInvoiceFindUnique.mockResolvedValue(anotherUsersInvoice);

      const response = await getInvoiceByIdHandler(mockRequest as NextRequest, { params: { id: invoiceId } });
      expect(response.status).toBe(403);
    });

    it('should forbid unauthenticated access (401)', async () => {
      setupMocksForUser(null);
      const response = await getInvoiceByIdHandler(mockRequest as NextRequest, { params: { id: invoiceId } });
      expect(response.status).toBe(401);
    });

    it('should return 404 if invoice ID does not exist', async () => {
      setupMocksForUser(mockAdminUser); // Admin can try to fetch any ID
      mockedPrismaInvoiceFindUnique.mockResolvedValue(null); // Invoice not found

      const response = await getInvoiceByIdHandler(mockRequest as NextRequest, { params: { id: 'non-existent-id' } });
      expect(response.status).toBe(404);
    });
  });
});
