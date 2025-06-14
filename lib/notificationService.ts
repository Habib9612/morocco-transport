import { db as prismaDb } from '@/lib/db'; // Assuming Prisma client is exported as db or prismaDb
import type { Notification, NotificationType } from '@prisma/client'; // Import Prisma generated types

interface CreateNotificationData {
  userId: string;
  type: NotificationType; // Use the enum from Prisma
  message: string;
}

/**
 * Creates a new notification in the database.
 * @param data - The data for the notification.
 * @returns The created notification.
 * @throws Will throw an error if the database operation fails.
 */
export async function createNotification(data: CreateNotificationData): Promise<Notification> {
  try {
    const notification = await prismaDb.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        message: data.message,
        // 'read' defaults to false as per schema
      },
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    // Depending on error handling strategy, you might re-throw,
    // or return a custom error object/null. For a utility, re-throwing is often fine.
    throw new Error('Failed to create notification in database.');
  }
}

/**
 * Marks a specific notification as read.
 * @param notificationId - The ID of the notification to mark as read.
 * @param userId - The ID of the user who owns the notification (for authorization).
 * @returns The updated notification.
 * @throws Will throw an error if not found, not authorized, or DB operation fails.
 */
export async function markNotificationAsRead(notificationId: string, userId: string): Promise<Notification | null> {
  try {
    const notification = await prismaDb.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return null; // Or throw new Error('Notification not found');
    }

    if (notification.userId !== userId) {
      // This check should ideally be done in the API route before calling this service
      throw new Error('User not authorized to mark this notification as read.');
    }

    if (notification.read) {
      return notification; // Already read, no update needed
    }

    const updatedNotification = await prismaDb.notification.update({
      where: { id: notificationId },
      data: { read: true, updatedAt: new Date() }, // Explicitly set updatedAt if not auto-updated by Prisma on every change
    });
    return updatedNotification;
  } catch (error) {
    console.error(`Error marking notification ${notificationId} as read:`, error);
    if (error instanceof Error && error.message.includes('authorized')) throw error;
    throw new Error('Failed to mark notification as read.');
  }
}

/**
 * Gets notifications for a user with optional read status filtering and pagination.
 * @param userId - The ID of the user.
 * @param readStatus - Optional: true for read, false for unread, undefined for all.
 * @param page - The page number for pagination.
 * @param limit - The number of items per page.
 * @returns Paginated list of notifications and total count.
 */
export async function getUserNotifications(
  userId: string,
  readStatus: boolean | undefined,
  page: number = 1,
  limit: number = 10
) {
  try {
    const skip = (page - 1) * limit;
    const whereClause: any = { userId };

    if (readStatus !== undefined) {
      whereClause.read = readStatus;
    }

    const notifications = await prismaDb.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      skip: skip,
      take: limit,
    });

    const totalNotifications = await prismaDb.notification.count({ where: whereClause });

    return {
      data: notifications,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalNotifications / limit),
        totalResults: totalNotifications,
      },
    };
  } catch (error) {
    console.error(`Error fetching notifications for user ${userId}:`, error);
    throw new Error('Failed to fetch notifications.');
  }
}
