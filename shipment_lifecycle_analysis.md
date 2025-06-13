# Shipment Lifecycle Analysis Report

This report details the observed flow for various stages of the shipment lifecycle within the MarocTransit platform, based on a review of the codebase.

## 1. Shipment Creation

**Process:**
*   New shipments can be initiated via:
    *   **API Route:** `POST /api/shipments`
    *   **Server Action:** `createShipment` in `app/actions/shipments.ts`
*   Both methods use raw SQL queries (via `executeQuery`) to insert data into a `shipments` table, rather than Prisma Client.
*   **Required Data (from API route):** `customer_id`, `origin_id`, `destination_id`.
*   **Other Data:** `status` (defaults to "pending"), `priority` (defaults to "medium"), `weight`, `volume`, `scheduled_pickup`, `scheduled_delivery`.
*   A `trackingNumber` is generated automatically during creation (e.g., "SHP-" + timestamp + random number).
*   The Prisma schema (`Shipment` model) defines `shipperId` which links to the `User` model. The API/action layer uses `customer_id`. It's assumed `customer_id` refers to the `shipperId`.

**Frontend:**
*   The `app/dashboard/shipments/page.tsx` has a "New Shipment" button. However, this page currently uses **mock data**, so the UI for creation is likely not fully implemented or connected to the backend.

**User Role Interactions:**
*   The code doesn't explicitly show different creation processes for different user roles (e.g., `INDIVIDUAL` vs. `COMPANY` shippers). It's assumed that any authenticated user identified by `customer_id` (or `shipperId`) can create a shipment.
*   The `UserRole` enum includes `SHIPPER` (implicitly, as `User.shipments` relation points to `ShipperShipments`), `CARRIER`, and `COMPANY`. A `COMPANY` role might represent a larger shipper entity.

**Gaps/Inconsistencies:**
*   **Raw SQL vs. Prisma:** The use of raw SQL for data manipulation instead of Prisma Client is inconsistent with having a Prisma schema defined. This can lead to difficulties in maintaining type safety and schema synchronization.
*   **`customer_id` vs. `shipperId`:** Naming inconsistency between API/action layer and Prisma schema.
*   The frontend for shipment creation is not yet functional with the backend.

## 2. Carrier Matching

**Process:**
*   The actual assignment of a `carrierId` to a `Shipment` (as per the Prisma model) is not explicitly detailed in the Next.js API routes or server actions for shipments. These routes primarily handle CRUD for shipment details but not the matching process itself.
*   **AI-Assisted Matching:** A separate Python-based AI/ML system exists for carrier-shipper matching (`models/carrier_shipper_matching.py` and `models/api.py`).
    *   This system uses a `GradientBoostingClassifier` model.
    *   **Inputs for matching:** `load_size`, `distance` (calculated placeholder), `carrier_reliability_score`, `carrier_cost_efficiency`, `shipper_payment_speed`, `carrier_location`, `destination`.
    *   **Output:** A match score indicating the probability of a successful match.
    *   The Python Flask API (`models/api.py`) exposes endpoints like `/api/matches/shipment/<shipment_id>` to get top carrier matches for a shipment.
*   **Integration with Next.js App:**
    *   It's **not clear** from the reviewed TypeScript files how or if the Next.js application calls this Python matching API. There are no explicit `fetch` calls to `localhost:5000` (where the Python API runs by default) in the shipment actions or API routes.
    *   The Python API itself uses mock functions (`_get_available_carriers`, `_get_available_shipments`) to fetch data for matching, suggesting it's not directly connected to the main application's PostgreSQL database.
*   **Manual Assignment Possibility:** It's possible that carrier assignment is intended to be a manual process (e.g., an admin or a shipper selects a carrier), or this part of the workflow is yet to be implemented in the Next.js app. The `Shipment` model allows `carrierId` to be nullable.

**User Role Interactions:**
*   **Shippers/Companies:** Would initiate the need for a carrier.
*   **Carriers:** Would be the ones matched to shipments.
*   **Admin:** Potentially could oversee or manually assign carriers if the automated system isn't fully integrated or if exceptions occur.

**Gaps/Inconsistencies:**
*   **AI Integration Point:** The connection and data flow between the Next.js application and the Python matching service is missing or not evident. How real shipment/carrier data is fed to the Python API is a major question.
*   **Carrier Assignment Workflow:** The process of how a `carrierId` actually gets updated on a `Shipment` record in the database after a match (either AI or manual) is not defined in the reviewed shipment logic.

## 3. Shipment Tracking

**Process:**
*   The `Tracking` model in `prisma/schema.prisma` is designed for this:
    *   `id`: Unique tracking record ID.
    *   `status`: Enum `TrackingStatus` (`PICKED_UP`, `IN_TRANSIT`, `DELAYED`, `DELIVERED`).
    *   `locationId`: Foreign key to a `Location` record.
    *   `timestamp`: When the status was recorded.
    *   `shipmentId`: Links back to the `Shipment`.
*   **Updating Tracking Information:**
    *   There are no specific API routes or server actions in the reviewed files dedicated to creating or updating `Tracking` records.
    *   It's implied that when a `Shipment.status` is updated (e.g., via `PUT /api/shipments/[id]` or `updateShipment` action), a corresponding `Tracking` entry should ideally be created. However, this logic is not present in the `updateShipment` functions, which only update the `Shipment` table.

**Displaying Tracking Information:**
*   The frontend `app/dashboard/shipments/page.tsx` uses mock data, so live tracking display is not implemented there.
*   The `GET /api/shipments/[id]` route fetches basic shipment data but does not explicitly join or include `Tracking` records. The `getShipmentById` server action is similar.

**User Role Interactions:**
*   **Carriers:** Would be primarily responsible for actions that trigger tracking updates (e.g., picking up, confirming delivery).
*   **Shippers/Companies:** Would view the tracking status.
*   **Admin:** Might have oversight or the ability to manually update tracking if issues arise.

**Gaps/Inconsistencies:**
*   **Creation of Tracking Records:** Logic for creating new entries in the `Tracking` table when shipment events occur is missing from the shipment update flows.
*   **Fetching Tracking Records:** API/actions to fetch detailed tracking history for a shipment are not apparent.
*   Frontend display of tracking history is not implemented.

## 4. Delivery and Review Process

**a. Delivery Confirmation:**
*   **Marking as Delivered:**
    *   A shipment can be marked as `DELIVERED` by updating its `status` field. This can be done via the `PUT /api/shipments/[id]` route or the `updateShipment` server action.
    *   The `updateShipment` functions also allow setting `actual_pickup` and `actual_delivery` timestamps.
*   **Process:** The system relies on an authorized user (likely a carrier or an admin) to update the shipment status to `DELIVERED`.

**b. Review Process:**
*   The `Review` model in `prisma/schema.prisma` allows for:
    *   `rating`: Integer.
    *   `comment`: Optional string.
    *   `shipmentId`: Links to the specific `Shipment`.
    *   `userId`: Links to the `User` who submitted the review.
*   **Submitting Reviews:**
    *   No specific API routes or server actions for creating `Review` records were found in the reviewed files. This functionality seems to be missing from the backend.
*   **Displaying Reviews:**
    *   Similarly, no frontend components or backend logic for displaying reviews associated with a shipment or a carrier were observed.

**User Role Interactions:**
*   **Carriers:** Confirm delivery.
*   **Shippers/Companies:** Submit reviews for completed shipments. Their `userId` would be on the `Review`.
*   The `Review` model's `userId` could also potentially be a carrier reviewing a shipper, but the current context implies shippers review the service.

**Gaps/Inconsistencies:**
*   **Review Submission/Display:** Backend logic (API/actions) for creating and fetching reviews is missing. Frontend components for submitting and displaying reviews are also not apparent.
*   **Digital Documentation (as per README):** While `actual_delivery` can be set, specific features for "Paperless receipt and delivery confirmations" (e.g., signature capture, photo upload) are not present in the models or APIs reviewed.

## Overall User Role Interactions in Shipment Lifecycle

*   **Shippers (or `User` with role `INDIVIDUAL`/`COMPANY` acting as shipper):**
    *   Create shipments (defining origin, destination, cargo details).
    *   View their shipment statuses and tracking (though tracking history fetching is a gap).
    *   Submit reviews after delivery (currently a gap).
*   **Carriers (or `User` with role `CARRIER`):**
    *   Are assigned to shipments (mechanism unclear, AI integration point missing).
    *   Presumably update shipment status (e.g., picked up, in transit, delivered), which would trigger tracking updates (tracking creation logic is a gap).
    *   Their performance could be subject to reviews.
*   **Company Users:**
    *   If a `COMPANY` role represents a larger shipper or carrier entity, they would perform actions similar to individual shippers or carriers but potentially with broader oversight over multiple users/shipments within their company. The current data models don't explicitly detail how a `COMPANY` role aggregates or manages shipments beyond the standard `User` to `Shipment` relations.

## General Gaps and Areas for Improvement

1.  **Prisma Client Usage:** Consistently use Prisma Client for database interactions instead of raw SQL queries (`executeQuery`) to leverage type safety, relations, and easier schema management.
2.  **Frontend-Backend Integration:** The main shipments dashboard relies on mock data. Full integration with backend APIs/actions is needed.
3.  **AI Matching Integration:** Clarify and implement the workflow for how the Next.js application interacts with the Python AI matching service, including data exchange for real-time matching.
4.  **Tracking History:** Implement backend logic to create `Tracking` records upon status changes and APIs/actions to fetch this history. Develop frontend components to display it.
5.  **Review System:** Implement the full CRUD lifecycle for reviews (create, read).
6.  **Role-Based Access Control (RBAC):** While roles are defined in Prisma (`INDIVIDUAL`, `CARRIER`, `COMPANY`), their application in controlling access to specific shipment actions or views is not explicit in the reviewed shipment-specific code. For example, only a shipper should be able to create a shipment they own, only the assigned carrier should update its status to "in_transit", etc. This needs to be enforced.
7.  **Clearer `customer_id` vs. `shipperId`:** Standardize terminology. `shipperId` from Prisma is more descriptive.
8.  **Error Handling & Validation:** Enhance server-side validation for all inputs.
9.  **Real-time Updates:** For a logistics platform, real-time updates on shipment status changes would be valuable (e.g., using WebSockets, which is mentioned in the README but not detailed in shipment logic).
