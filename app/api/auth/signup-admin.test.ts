import { NextRequest, NextResponse } from 'next/server';
import { POST as signupApiHandler } from './signup/route'; // Adjust path if signup route is elsewhere
import { db as prismaDb } from '@/lib/db';
import { hash } from 'bcryptjs'; // For verifying password hashing if needed, though not primary focus

// --- Mocking Dependencies ---
jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// bcryptjs.hash is a real function, usually not mocked unless specific scenarios
// For this test, we are more interested in the role assignment logic than bcrypt output.

const mockedPrismaUserFindUnique = prismaDb.user.findUnique as jest.MockedFunction<typeof prismaDb.user.findUnique>;
const mockedPrismaUserCount = prismaDb.user.count as jest.MockedFunction<typeof prismaDb.user.count>;
const mockedPrismaUserCreate = prismaDb.user.create as jest.MockedFunction<typeof prismaDb.user.create>;

describe('Signup API - ADMIN Assignment Logic', () => {
  let mockRequest: Partial<NextRequest>;
  const defaultSignupData = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    role: 'individual', // Default role requested by user
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      json: jest.fn().mockResolvedValue(defaultSignupData),
    };
  });

  it('should assign ADMIN role to the first user signing up', async () => {
    mockedPrismaUserFindUnique.mockResolvedValue(null); // No existing user with this email
    mockedPrismaUserCount.mockResolvedValue(0); // No users in the database
    mockedPrismaUserCreate.mockImplementation(async (args) => {
      // Simulate user creation and return data including the assigned role
      return {
        id: 'user-123',
        email: args.data.email,
        name: args.data.name,
        role: args.data.role, // This will be what the API passes
        company: args.data.company,
        phone: args.data.phone,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: 'hashedpassword', // Not used in response
      } as any;
    });

    const response = await signupApiHandler(mockRequest as Request);
    const responseJson = await response.json();

    expect(response.status).toBe(201);
    expect(mockedPrismaUserCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        role: 'ADMIN', // Verify ADMIN role was set
      })
    );
    expect(responseJson.user.role).toBe('ADMIN');
  });

  it('should assign the requested role (e.g., INDIVIDUAL) to a subsequent user', async () => {
    mockedPrismaUserFindUnique.mockResolvedValue(null); // No existing user with this email
    mockedPrismaUserCount.mockResolvedValue(1); // One or more users already exist

    const requestedRole = 'individual';
    const expectedDbRole = 'INDIVIDUAL'; // Uppercase as per logic in signup route
    mockRequest.json = jest.fn().mockResolvedValue({ ...defaultSignupData, role: requestedRole });

    mockedPrismaUserCreate.mockImplementation(async (args) => {
      return {
        id: 'user-456',
        email: args.data.email,
        name: args.data.name,
        role: args.data.role,
        company: args.data.company,
        phone: args.data.phone,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: 'hashedpassword',
      } as any;
    });

    const response = await signupApiHandler(mockRequest as Request);
    const responseJson = await response.json();

    expect(response.status).toBe(201);
    expect(mockedPrismaUserCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        role: expectedDbRole, // Verify correct uppercase role was set
      })
    );
    expect(responseJson.user.role).toBe(expectedDbRole);
  });

  it('should assign CARRIER role to a subsequent user if requested', async () => {
    mockedPrismaUserFindUnique.mockResolvedValue(null);
    mockedPrismaUserCount.mockResolvedValue(1);
    const requestedRole = 'carrier';
    const expectedDbRole = 'CARRIER';
    mockRequest.json = jest.fn().mockResolvedValue({ ...defaultSignupData, role: requestedRole });
    mockedPrismaUserCreate.mockImplementation(async (args) => ({ id: 'user-789', ...args.data } as any));

    const response = await signupApiHandler(mockRequest as Request);
    const responseJson = await response.json();

    expect(response.status).toBe(201);
    expect(mockedPrismaUserCreate).toHaveBeenCalledWith(expect.objectContaining({ role: expectedDbRole }));
    expect(responseJson.user.role).toBe(expectedDbRole);
  });

  it('should assign COMPANY role to a subsequent user if requested', async () => {
    mockedPrismaUserFindUnique.mockResolvedValue(null);
    mockedPrismaUserCount.mockResolvedValue(1);
    const requestedRole = 'company';
    const expectedDbRole = 'COMPANY';
    mockRequest.json = jest.fn().mockResolvedValue({ ...defaultSignupData, role: requestedRole });
    mockedPrismaUserCreate.mockImplementation(async (args) => ({ id: 'user-101', ...args.data } as any));

    const response = await signupApiHandler(mockRequest as Request);
    const responseJson = await response.json();

    expect(response.status).toBe(201);
    expect(mockedPrismaUserCreate).toHaveBeenCalledWith(expect.objectContaining({ role: expectedDbRole }));
    expect(responseJson.user.role).toBe(expectedDbRole);
  });

  it('should return 400 if an invalid role string is provided for subsequent user', async () => {
    mockedPrismaUserFindUnique.mockResolvedValue(null);
    mockedPrismaUserCount.mockResolvedValue(1);
    const requestedRole = 'superadmin_invalid'; // Invalid role based on Zod schema in signup
    mockRequest.json = jest.fn().mockResolvedValue({ ...defaultSignupData, role: requestedRole });

    const response = await signupApiHandler(mockRequest as Request);
    const responseJson = await response.json();

    expect(response.status).toBe(400);
    expect(responseJson.error).toContain("Invalid role. Must be one of: individual, carrier, company.");
    expect(mockedPrismaUserCreate).not.toHaveBeenCalled();
  });

  // Note: Testing app/actions/auth.ts signup is harder due to its direct `executeQuery` use
  // and lack of clear input for role (it hardcodes 'user').
  // A conceptual test would involve mocking executeQuery for `SELECT id FROM users LIMIT 1`
  // and then verifying the `roleToAssign` in the subsequent INSERT query.
  // This is omitted here as the primary focus is the API route used by the JWT system.
});
