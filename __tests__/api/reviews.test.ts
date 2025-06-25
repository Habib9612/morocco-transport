import { describe, it, expect, beforeEach } from '@jest/globals';
import { NextRequest } from 'next/server';
import { GET as reviewsGet, POST as reviewsPost } from '@/app/api/reviews/route';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth-middleware';

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    review: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    shipment: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('@/lib/auth-middleware', () => ({
  withAuth: jest.fn(),
}));

describe('Reviews API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/reviews', () => {
    it('should fetch reviews successfully', async () => {
      const mockReviews = [
        {
          id: 'review-1',
          rating: 5,
          comment: 'Great service!',
          createdAt: new Date(),
          user: {
            id: 'user-1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
          },
          shipment: {
            id: 'shipment-1',
            origin: 'Casablanca',
            destination: 'Rabat',
            status: 'DELIVERED',
          },
          driver: {
            id: 'driver-1',
            firstName: 'Ahmed',
            lastName: 'Hassan',
          },
        },
      ];

      (prisma.review.findMany as jest.Mock).mockResolvedValue(mockReviews);
      (prisma.review.count as jest.Mock).mockResolvedValue(1);

      const request = new NextRequest('http://localhost:3000/api/reviews');
      const response = await reviewsGet(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.reviews).toHaveLength(1);
      expect(data.pagination).toBeDefined();
    });
  });

  describe('POST /api/reviews', () => {
    it('should create review successfully', async () => {
      const mockUser = { id: 'user-1', role: 'USER' };
      const mockShipment = {
        id: 'shipment-1',
        userId: 'user-1',
        driverId: 'driver-1',
        status: 'DELIVERED',
        user: { id: 'user-1' },
        driver: { id: 'driver-1' },
      };
      const mockReview = {
        id: 'review-1',
        rating: 5,
        comment: 'Excellent service!',
        user: mockUser,
        shipment: mockShipment,
        driver: { id: 'driver-1', firstName: 'Ahmed', lastName: 'Hassan' },
      };

      (withAuth as jest.Mock).mockImplementation((roles) => {
        return async (request: NextRequest) => ({ user: mockUser });
      });
      (prisma.shipment.findUnique as jest.Mock).mockResolvedValue(mockShipment);
      (prisma.review.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.review.create as jest.Mock).mockResolvedValue(mockReview);

      const request = new NextRequest('http://localhost:3000/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          shipmentId: 'shipment-1',
          rating: 5,
          comment: 'Excellent service!',
        }),
      });

      const response = await reviewsPost(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toBe('Review created successfully');
      expect(data.review).toBeDefined();
    });

    it('should fail when shipment not found', async () => {
      const mockUser = { id: 'user-1', role: 'USER' };

      (withAuth as jest.Mock).mockImplementation((roles) => {
        return async (request: NextRequest) => ({ user: mockUser });
      });
      (prisma.shipment.findUnique as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          shipmentId: 'nonexistent-shipment',
          rating: 5,
          comment: 'Great!',
        }),
      });

      const response = await reviewsPost(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Shipment not found');
    });
  });
});
