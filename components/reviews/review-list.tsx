'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  shipment: {
    id: string;
    trackingNumber: string;
    origin: string;
    destination: string;
    status: string;
  };
  driver?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface ReviewListProps {
  shipmentId?: string;
  driverId?: string;
  userId?: string;
  limit?: number;
}

export function ReviewList({ shipmentId, driverId, userId, limit = 10 }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const params = new URLSearchParams();
        if (shipmentId) params.append('shipmentId', shipmentId);
        if (driverId) params.append('driverId', driverId);
        if (userId) params.append('userId', userId);
        params.append('limit', limit.toString());

        const response = await fetch(`/api/reviews?${params}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        setReviews(data.reviews);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [shipmentId, driverId, userId, limit]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No reviews found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">
                    {review.user.firstName} {review.user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <Badge variant="outline">
                {review.shipment.trackingNumber}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {renderStars(review.rating)}
              
              {review.comment && (
                <p className="text-gray-700">{review.comment}</p>
              )}
              
              <div className="text-sm text-gray-500">
                <p>
                  <span className="font-medium">Route:</span> {review.shipment.origin} → {review.shipment.destination}
                </p>
                {review.driver && (
                  <p>
                    <span className="font-medium">Driver:</span> {review.driver.firstName} {review.driver.lastName}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
