# Communication Systems Analysis Report

This report details the current state of various communication systems within the MarocTransit platform, including database notifications, real-time messaging (chat), and push notifications, based on a review of the codebase.

## 1. Database Notification System

*   **Schema (`prisma/schema.prisma`):**
    *   A `Notification` model exists with fields: `id`, `type` (enum `NotificationType`), `message` (String), `read` (Boolean, default: `false`), `createdAt`, and `userId` (linking to `User`).
    *   The `NotificationType` enum includes: `SHIPMENT_UPDATE`, `MAINTENANCE_REMINDER`, `PAYMENT`, `SYSTEM`.
*   **Creation and Usage:**
    *   Searches for `prisma.notification.create` and `executeQuery` related to "notification" yielded **no results**.
    *   **Conclusion:** There is currently **no backend logic implemented** to create or manage these database-persisted `Notification` records. While the schema is prepared for various notification types, the mechanisms to trigger and store them upon relevant events (like shipment status changes, payment events, etc.) are missing.
*   **Frontend Display:**
    *   The component `components/notification.tsx` displays UI notifications based on WebSocket messages. These are distinct from the database `Notification` entities and appear to be for immediate, transient alerts rather than persistent, stored notifications.

## 2. Real-Time Messaging (Chat)

*   **WebSocket Infrastructure:**
    *   **Client-Side:** A client-side WebSocket system is implemented via `lib/websocket-context.tsx` (providing `WebSocketProvider` and `useWebSocket` hook) and utilized by `components/chat.tsx`.
    *   The client attempts to connect to a WebSocket server at an address specified by `process.env.NEXT_PUBLIC_WS_URL` (defaulting to `ws://localhost:3001`).
    *   The context handles connection, disconnection (with auto-reconnect), and sending messages.
    *   **Backend WebSocket Server:** The implementation of this WebSocket server (running at `ws://localhost:3001`) is **not present** in the reviewed Next.js codebase. It is likely a separate, standalone service. Its capabilities regarding message broadcasting, room management, or user presence are unknown from this codebase.
*   **Chat Component (`components/chat.tsx`):**
    *   Provides a functional client-side UI for one-on-one chat.
    *   Sends and receives messages via the WebSocket connection.
    *   **No Database Persistence:** Chat messages are stored in **`localStorage`** on the client-side. This means chat history is not centrally stored, will not be available across different browsers or devices for the same user, and will be lost if `localStorage` is cleared.
    *   It handles pending messages if the WebSocket is offline and attempts to resend them upon reconnection.
*   **Messages Dashboard Page (`app/dashboard/messages/page.tsx`):**
    *   This page is currently a **non-functional mockup** using hardcoded data. It does not integrate with the WebSocket chat system or any backend service for messages.
*   **Proposed Models (`ChatRoom`, `Message`):**
    *   As identified in previous analyses, there are no Prisma models for `ChatRoom` or `Message` to persistently store chat conversations in the database.
    *   **Integration:** These models would be crucial for a robust chat system.
        *   `ChatRoom` (or `Conversation`): Would define participants in a chat.
        *   `Message`: Would store individual message content, sender, timestamp, and link to a `ChatRoom`.
        *   The backend WebSocket server would be responsible for receiving messages, storing them using these Prisma models, and then broadcasting them to the appropriate connected clients.

## 3. Push Notification Capabilities

*   **User Preferences:** The settings page (`app/dashboard/settings/page.tsx`) includes UI toggles for "pushNotifications," indicating that this is a planned feature from a user configuration perspective.
*   **Service Worker (`public/sw.js`):**
    *   The existing service worker handles caching of static assets and API responses.
    *   It includes a `sync` event handler for `sync-messages` (related to the chat's outbox functionality, sending messages to `/api/messages`).
    *   **No Push Notification Logic:** The service worker **does not currently implement** any handlers for actual push notification events (e.g., `push` event from a push service, `notificationclick` event) or interaction with browser push services (like `self.registration.showNotification()`).
*   **Backend Integration:** There is no evidence of integration with push notification services like Firebase Cloud Messaging (FCM), Apple Push Notification service (APNs), or Web Push libraries on the backend.

## 4. Gaps and Missing Components for a "Communication Hub"

The README describes a "Communication Hub" with "In-app Messaging," "Push Notifications," and "Customer Support."

1.  **Persistent In-App Messaging:**
    *   **Missing Backend:** A robust backend for the WebSocket server that integrates with Prisma to store and retrieve chat messages (`ChatRoom`, `Message` models) is needed.
    *   **Missing `app/dashboard/messages/page.tsx` Integration:** The messages dashboard needs to be connected to the live chat system and backend.
2.  **Database Notifications:**
    *   **Missing Creation Logic:** Backend logic to create `Notification` records in the database when significant events occur (shipment updates, payments, etc.) needs to be implemented.
    *   **Missing UI for Stored Notifications:** A dedicated "Notification Center" UI that fetches and displays these persistent notifications (and allows marking them as read) is needed, distinct from the transient WebSocket UI alerts.
3.  **Push Notifications:**
    *   **Missing Service Worker Logic:** Service worker needs to be enhanced to handle push events.
    *   **Missing Backend Integration:** Backend needs to integrate with a push service (FCM, Web Push) to send push messages to registered user devices.
    *   **Missing Subscription Management:** Logic for users to subscribe/unsubscribe to push notifications and for the server to manage these subscriptions.
4.  **Integrated Customer Support:**
    *   **Missing `SupportTicket` Model:** No data model exists for managing customer support requests as tickets.
    *   **Missing Support System Logic:** No backend or frontend infrastructure for users to submit support requests, for agents to manage them, or for a ticketing workflow. This feature seems entirely conceptual at this stage.
5.  **Real-time Updates beyond Chat:** While WebSockets are set up, their use for other real-time updates (e.g., live shipment tracking on a map, real-time dashboard updates) is not yet fully integrated into the respective feature modules.

**Conclusion:**
The platform has foundational elements for client-side WebSocket communication (used for a non-persistent chat) and a schema for database notifications. However, the backend logic for persistent chat, creating database notifications, actual push notification delivery, and an integrated customer support system are largely missing. The current "Notification Center" in `components/notification.tsx` is for transient UI alerts via WebSockets, not for stored database notifications.
