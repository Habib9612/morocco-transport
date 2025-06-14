# Financial Data Models and API Scaffolding Report

This document details the Prisma schema modifications made to scaffold core financial data models (`Invoice`, `Transaction`), outlines the basic API endpoints created for Invoices, and describes the drafted unit tests for these APIs.

## 1. Prisma Schema for Financial Models

*   **File Modified:** `prisma/schema.prisma`

**a. New `Invoice` Model:**
The `Invoice` model is designed to store details about invoices issued to users, potentially linked to specific shipments.

```prisma
model Invoice {
  id            String    @id @default(cuid())
  invoiceNumber String    @unique // e.g., INV-2023-0001
  userId        String    // The user being invoiced
  user          User      @relation("UserInvoices", fields: [userId], references: [id])
  shipmentId    String?   // Optional: if the invoice is directly for one shipment
  shipment      Shipment? @relation(fields: [shipmentId], references: [id])
  status        InvoiceStatus @default(DRAFT)
  amount        Float
  currency      String    // e.g., "MAD", "USD"
  issueDate     DateTime  @default(now())
  dueDate       DateTime
  paidDate      DateTime?
  notes         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  transactions  Transaction[]
}
```

**b. New `InvoiceStatus` Enum:**
This enum defines the possible statuses for an invoice.

```prisma
enum InvoiceStatus {
  DRAFT     // Invoice created but not yet finalized or sent
  SENT      // Invoice sent to the user
  PAID      // Invoice paid in full
  VOID      // Invoice voided or cancelled
  OVERDUE   // Invoice past its due date and not fully paid
}
```

**c. New `Transaction` Model:**
The `Transaction` model is designed to record payment attempts and outcomes related to invoices.

```prisma
model Transaction {
  id               String    @id @default(cuid())
  invoiceId        String
  invoice          Invoice   @relation(fields: [invoiceId], references: [id])
  amount           Float
  currency         String
  transactionDate  DateTime  @default(now())
  paymentMethod    String?   // e.g., "credit_card", "bank_transfer", "cash", "stripe", "paypal"
  referenceId      String?   // e.g., Stripe charge ID, bank transaction ID
  status           TransactionStatus @default(PENDING)
  notes            String?   // e.g., reason for failure, partial payment details
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}
```

**d. New `TransactionStatus` Enum:**
This enum defines the possible statuses for a transaction.

```prisma
enum TransactionStatus {
  PENDING    // Transaction initiated but not yet confirmed
  SUCCESSFUL // Transaction completed successfully
  FAILED     // Transaction failed
  REFUNDED   // Transaction was refunded
}
```

**e. Updates to Existing Models for Relations:**

*   **`User` Model:**
    A one-to-many relation was added to link users to their invoices.
    ```prisma
    model User {
      // ... existing fields
      invoices Invoice[] @relation("UserInvoices") // Relation to Invoice
      // ... other relations
    }
    ```

*   **`Shipment` Model:**
    A one-to-one optional relation was added to link a shipment to an invoice.
    ```prisma
    model Shipment {
      // ... existing fields
      invoice Invoice? // Optional relation to Invoice
      // ... other relations
    }
    ```

## 2. Important Next Steps (in a Functional Environment)

After these schema changes, the following commands would need to be run in a functional development environment:

1.  **`npx prisma generate`**: This command generates or updates the Prisma Client based on the modified schema. **All API development in this report assumes this step has been conceptually completed, and the Prisma Client (`db` or `prismaDb`) reflects these new models.**
2.  **`npx prisma migrate dev --name add_financial_models`** (or similar): This command creates a new database migration file reflecting the schema changes and applies it to the development database.

---

## 3. Basic Invoice CRUD APIs

Basic API endpoints for creating and retrieving invoices have been scaffolded. These include JWT authentication and basic role-based authorization.

**a. Files Created/Modified:**
*   `app/api/invoices/route.ts` (for `POST` create, `GET` list for user)
*   `app/api/invoices/[id]/route.ts` (for `GET` specific invoice)

**b. Authentication & Authorization:**
*   All invoice endpoints require JWT authentication (verifying 'session' cookie).
*   JWT secret handling ensures the application fails securely if `process.env.JWT_SECRET` is not set.
*   **Authorization Rules:**
    *   **POST `/api/invoices` (Create):** Allowed for `ADMIN` or `COMPANY` roles.
    *   **GET `/api/invoices` (List):**
        *   `ADMIN` can list all invoices (basic pagination example included).
        *   Other roles (`INDIVIDUAL`, `COMPANY`, `CARRIER`) can only list their own invoices (where `invoice.userId` matches authenticated user's ID).
    *   **GET `/api/invoices/[id]` (Specific):**
        *   `ADMIN` can retrieve any invoice by ID.
        *   Other roles can only retrieve the invoice if their `userId` matches `invoice.userId`.

**c. POST `/api/invoices` (Create Invoice)**
*   **Request Body:** Expects `userId`, `shipmentId` (optional), `amount`, `currency`, `dueDate`, `invoiceNumber`, `status` (optional, defaults to `DRAFT`), `notes` (optional). Validated using Zod.
*   **Logic:** After auth/authz, creates an invoice using `prismaDb.invoice.create()`.
*   **Response:** The created invoice object or error.
*   **Key Snippet:**
    ```typescript
    // ... (auth/authz logic) ...
    // if (authUser.role !== 'ADMIN' && authUser.role !== 'COMPANY') {
    //   return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    // }
    // ... (Zod validation) ...
    const newInvoice = await prismaDb.invoice.create({
      data: { /* ... validated data ... */ },
    });
    return NextResponse.json(newInvoice, { status: 201 });
    ```

**d. GET `/api/invoices` (List Invoices for User)**
*   **Request Parameters:** Supports optional `page` and `limit` query parameters for basic pagination. Optional `status` filter.
*   **Logic:** After auth, constructs a `whereClause`. If the user is not `ADMIN`, `whereClause.userId` is set to the authenticated user's ID. Fetches invoices using `prismaDb.invoice.findMany()` with includes for basic user and shipment info.
*   **Response:** Paginated list of invoices.
*   **Key Snippet:**
    ```typescript
    // ... (auth logic resulting in authUser) ...
    let whereClause: any = {};
    if (authUser.role !== 'ADMIN') {
      whereClause.userId = authUser.id;
    }
    // ... (add other filters like status to whereClause) ...
    const invoices = await prismaDb.invoice.findMany({
      where: whereClause,
      include: { /* ... */ },
      orderBy: { createdAt: 'desc' },
      skip: skip,
      take: limit,
    });
    // ... (return paginated response) ...
    ```

**e. GET `/api/invoices/[id]` (Get Specific Invoice)**
*   **Path Parameter:** `id` (invoice ID).
*   **Logic:** After auth, fetches the invoice using `prismaDb.invoice.findUnique()`. Then performs an authorization check: if the user is not `ADMIN` and `invoice.userId` does not match the authenticated `authUser.id`, a 403 error is returned.
*   **Response:** The invoice object or 404/403 error.
*   **Key Snippet:**
    ```typescript
    // ... (auth logic resulting in authUser) ...
    const invoice = await prismaDb.invoice.findUnique({
      where: { id: invoiceId },
      include: { /* ... */ },
    });
    // ... (check if invoice exists) ...
    if (authUser.role !== 'ADMIN' && invoice.userId !== authUser.id) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to view this invoice' }, { status: 403 });
    }
    return NextResponse.json(invoice);
    ```

**f. Assumptions and Limitations for API Endpoints:**
*   **Untested Code:** All new API logic is untested due to environment blockers.
*   **Basic Implementation:** Endpoints for updating or deleting invoices, or for managing invoice lifecycle (e.g., sending, marking as paid based on transactions) are not yet implemented.
*   **Invoice Number Uniqueness:** The create logic relies on Prisma's `@unique` for `invoiceNumber`. A more robust system might involve a dedicated sequence generator or a retry mechanism for collisions.
*   **Error Handling:** Basic error handling is present; more specific error types could be used.

---

## 4. Drafted Tests for Invoice APIs

*   **Test File Created:** `app/api/invoices/invoices-api.test.ts`
*   **Testing Framework Assumed:** Jest, with mocking for `next/headers`, `jsonwebtoken`, and `@/lib/db` (Prisma Client).

*   **Coverage for POST `/api/invoices` (Create Invoice):**
    *   **Authentication:** Unauthenticated access (401).
    *   **Authorization:**
        *   `ADMIN` user successfully creates an invoice (201).
        *   `COMPANY` user successfully creates an invoice (201).
        *   `INDIVIDUAL` user attempts to create (403 Forbidden).
    *   **Input Validation:** Request with missing required fields (e.g., `userId`, `amount`) returns 400.

*   **Coverage for GET `/api/invoices` (List Invoices):**
    *   **Authentication:** Unauthenticated access (401).
    *   **Authorization & Data Access:**
        *   `ADMIN` user retrieves a list of invoices (can be all or filtered, mock checks empty `where` clause for admin).
        *   `INDIVIDUAL` user retrieves only their own invoices (mock checks `where: { userId: individualUserId }`).

*   **Coverage for GET `/api/invoices/[id]` (Get Specific Invoice):**
    *   **Authentication:** Unauthenticated access (401).
    *   **Authorization & Data Access:**
        *   `ADMIN` user retrieves any invoice by ID.
        *   `INDIVIDUAL` user retrieves their own invoice by ID.
        *   `INDIVIDUAL` user attempts to retrieve another user's invoice (403 Forbidden or 404).
    *   **Data Validation:** Request for a non-existent invoice ID returns 404.

*   **Status:** These tests are drafted and rely on mocking. They cannot be executed or validated due to current tooling/environment blockers.

**Conclusion (API & Tests Part):**
Basic API endpoints for creating and retrieving invoices have been scaffolded with JWT authentication and role-based authorization. Corresponding unit tests have been drafted. These form a starting point for the invoicing system. Further development will be needed for update/delete operations, linking transactions, implementing more detailed business logic, and running the drafted tests once the environment is stable.
