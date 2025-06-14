# Database Notifications Implementation Report

This report details the implementation of a database-backed notification system, including a utility service for notification creation and API endpoints for retrieving and managing notifications.

## 1. Notification Service Utility

*   **File Created:** `lib/notificationService.ts`
*   **Purpose:** To encapsulate the core logic for interacting with the `Notification` Prisma model, providing reusable functions for creating and managing notifications.

**a. `createNotification` Function:**
*   **Signature:** `async function createNotification(data: { userId: string; type: NotificationType; message: string; }): Promise<Notification>`
*   **Logic:**
    *   Takes `userId`, `type` (Prisma `NotificationType` enum), and `message` as input.
    *   Uses `prismaDb.notification.create()` to save a new notification to the database.
    *   The `read` status defaults to `false` as per the Prisma schema.
    *   Includes basic error handling; throws an error if the database operation fails.
*   **Snippet:**
    ```typescript
    export async function createNotification(data: CreateNotificationData): Promise<Notification> {
      try {
        const notification = await prismaDb.notification.create({
          data: {
            userId: data.userId,
            type: data.type,
            message: data.message,
          },
        });
        return notification;
      } catch (error) {
        console.error('Error creating notification:', error);
        throw new Error('Failed to create notification in database.');
      }
    }
    ```

**b. `markNotificationAsRead` Function:**
*   **Signature:** `async function markNotificationAsRead(notificationId: string, userId: string): Promise<Notification | null>`
*   **Logic:**
    *   Finds the notification by `notificationId`.
    *   **Authorization:** Checks if `notification.userId` matches the provided `userId`. Throws an error if not authorized (this check is also expected to be enforced at the API layer before calling the service, but added here for service-level robustness).
    *   If found, authorized, and not already read, updates its `read` status to `true`.
    *   Returns the updated notification or `null` if not found.
*   **Snippet:**
    ```typescript
    export async function markNotificationAsRead(notificationId: string, userId: string): Promise<Notification | null> {
      try {
        const notification = await prismaDb.notification.findUnique({
          where: { id: notificationId },
        });
        if (!notification) { return null; }
        if (notification.userId !== userId) {
          throw new Error('User not authorized to mark this notification as read.');
        }
        if (notification.read) { return notification; }
        return await prismaDb.notification.update({
          where: { id: notificationId },
          data: { read: true, updatedAt: new Date() },
        });
      } // ... error handling ...
    }
    ```

**c. `getUserNotifications` Function:**
*   **Signature:** `async function getUserNotifications(userId: string, readStatus: boolean | undefined, page: number = 1, limit: number = 10)`
*   **Logic:**
    *   Fetches notifications for a specific `userId`.
    *   Allows filtering by `read` status (`true`, `false`, or `undefined` for all).
    *   Implements pagination using `skip` and `take`.
    *   Orders notifications by `createdAt` in descending order.
    *   Returns a paginated list of notifications and the total count.
*   **Snippet:**
    ```typescript
    export async function getUserNotifications(
      userId: string,
      readStatus: boolean | undefined,
      page: number = 1,
      limit: number = 10
    ) {
      // ... logic for whereClause, skip, take ...
      const notifications = await prismaDb.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: skip,
        take: limit,
      });
      const totalNotifications = await prismaDb.notification.count({ where: whereClause });
      // ... return { data, pagination } ...
    }
    ```

## 2. Notification APIs

**a. GET `/api/notifications` (List User's Notifications)**
*   **File Created:** `app/api/notifications/route.ts`
*   **Authentication:** JWT authentication is implemented (verifies 'session' cookie, fetches user).
*   **Authorization:** All authenticated users can access this endpoint to retrieve their *own* notifications. The `userId` from the authenticated session is used in the service call.
*   **Request Parameters:**
    *   `read` (optional query param): Filters notifications by read status (`true`, `false`). If omitted, returns all.
    *   `page` (optional query param): For pagination, defaults to 1.
    *   `limit` (optional query param): For pagination, defaults to 10.
*   **Logic:**
    *   After authentication, calls the `getUserNotifications` service function with the authenticated user's ID and query parameters.
*   **Response:** Paginated list of notification objects belonging to the authenticated user.
*   **Key Snippet:**
    ```typescript
    // ... (JWT authentication logic resulting in authUser) ...
    const notificationsResult = await getUserNotifications(authUser.id, readStatus, page, limit);
    return NextResponse.json(notificationsResult);
    ```

**b. POST `/api/notifications/[id]/mark-read` (Mark Notification as Read)**
*   **File Created:** `app/api/notifications/[id]/mark-read/route.ts`
*   **Authentication:** JWT authentication implemented.
*   **Authorization:**
    *   The `markNotificationAsRead` service function internally checks if the notification's `userId` matches the authenticated user's ID.
    *   The API route passes both `notificationId` (from path) and `authUser.id` to the service.
*   **Path Parameter:** `id` (notification ID to be marked as read).
*   **Logic:**
    *   After authentication, calls the `markNotificationAsRead` service function.
    *   Handles potential errors from the service (e.g., not found, not authorized).
*   **Response:** The updated notification object or an error response (404 if not found, 403 if service throws auth error, 500 for other errors).
*   **Key Snippet:**
    ```typescript
    // ... (JWT authentication logic resulting in authUser) ...
    const { id: notificationId } = params;
    const updatedNotification = await markNotificationAsRead(notificationId, authUser.id);
    if (!updatedNotification) { // If service returns null for not found
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }
    return NextResponse.json(updatedNotification);
    ```

## 3. Assumptions and Limitations

*   **Prisma Client:** Assumes `prismaDb` is a correctly configured Prisma Client instance and that `npx prisma generate` has been run after any schema changes (like adding the `Notification` model if it wasn't perfectly defined before).
*   **Untested Code:** All new code (service functions and API routes) is untested due to the persistent tooling/environment blockers. Linting and functional testing are crucial next steps.
*   **Error Handling:** Basic error handling is in place. More specific error types or a centralized error handling mechanism could be beneficial.
*   **Notification Creation Trigger:** While a `createNotification` service function is implemented, this subtask did not involve identifying and modifying various parts of the codebase (e.g., shipment status updates, payment processing) to *call* this function. That remains a separate integration task.

**Conclusion:**
A utility service for managing notifications in the database and basic API endpoints for listing a user's notifications and marking them as read have been successfully scaffolded. These components provide the backend foundation for a database-backed user notification system.
