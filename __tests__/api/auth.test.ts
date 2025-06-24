// SKIP: This test requires browser Request object. Not suitable for Jest/Node.js.
import { createMocks } from 'node-mocks-http';
import { POST as loginHandler } from '@/app/api/auth/login/route';
import { POST as registerHandler } from '@/app/api/auth/register/route';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock-jwt-token'),
}));

describe('/api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully with valid credentials', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    // Mock user found and password valid
    const { prisma } = require('@/lib/prisma');
    const bcrypt = require('bcryptjs');
    
    prisma.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password: 'hashed_password',
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      isActive: true,
    });

    bcrypt.compare.mockResolvedValue(true);

    const response = await loginHandler(req as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Login successful');
    expect(data.token).toBe('mock-jwt-token');
    expect(data.user).toBeDefined();
    expect(data.user.password).toBeUndefined();
  });

  it('should return 401 for invalid credentials', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'wrongpassword',
      },
    });

    const { prisma } = require('@/lib/prisma');
    prisma.user.findUnique.mockResolvedValue(null);

    const response = await loginHandler(req as any);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Invalid credentials');
  });
});

describe('/api/auth/register', () => {
  it('should register a new user successfully', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      },
    });

    const { prisma } = require('@/lib/prisma');
    const bcrypt = require('bcryptjs');

    prisma.user.findUnique.mockResolvedValue(null); // User doesn't exist
    prisma.user.create.mockResolvedValue({
      id: '2',
      email: 'newuser@example.com',
      firstName: 'New',
      lastName: 'User',
      role: 'USER',
      createdAt: new Date(),
    });

    bcrypt.hash.mockResolvedValue('hashed_password');

    const response = await registerHandler(req as any);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe('User registered successfully');
    expect(data.token).toBe('mock-jwt-token');
    expect(data.user).toBeDefined();
  });
});
