# Expense Tracker

A minimal full-stack personal expense tracker application with a backend API and frontend UI.

## Features

- **Create expenses** with amount, category, description, and date
- **View expenses** in a sortable, filterable list
- **Filter by category** to see specific expense types
- **Sort by date** (newest first by default)
- **Total calculation** for currently visible expenses
- **Category summary** showing totals per category
- **Idempotent submissions** - safe to retry on network failures

## Tech Stack

### Backend
- **Node.js + Express** - Simple, well-documented, widely adopted
- **TypeScript** - Type safety and better developer experience
- **MongoDB** - Document database with flexible schema and excellent scalability
- **Jest** - Testing framework


## Deployment

- **Live Application:**  
  <a href="https://e11333.netlify.app/" target="_blank">Click here</a>




  
### Frontend
- **Next.js (Pages Router)** - React framework with SSR capabilities
- **TypeScript** - Consistent typing across the stack
- **Tailwind CSS** - Utility-first styling for rapid development

## Key Design Decisions

### 1. Money Handling (Integer Storage)
Amounts are stored as integers (paise/cents) in the database to avoid floating-point precision issues common with financial calculations. The API converts between decimal input/output and integer storage:

```
User enters: ₹100.50
Stored as: 10050 (paise)
Displayed as: ₹100.50
```

### 2. Idempotency for Safe Retries
The POST /expenses endpoint supports an optional `idempotency_key` parameter. If a client retries the same request (due to network timeout, page refresh, double-click), the server returns the existing expense instead of creating a duplicate.

The frontend generates a unique key per form submission and reuses it for retries, ensuring:
- Double-clicking submit won't create duplicates
- Refreshing after a slow submission won't create duplicates
- Network retry logic won't create duplicates

### 3. MongoDB as Database
Chose MongoDB because:
- Flexible document schema fits expense data well
- Excellent scalability for growing datasets
- Rich query capabilities for filtering and aggregation
- Easy to set up locally or use managed services (MongoDB Atlas)
- Good support for indexing on idempotency keys and categories

### 4. Validation Strategy
- **Server-side validation** is authoritative (never trust client data)
- **Client-side validation** provides immediate feedback
- Categories are restricted to a predefined list (prevents data inconsistency)
- Date format validated as ISO 8601 (YYYY-MM-DD)
- Amount limited to 2 decimal places (currency precision)

### 5. API Design
- RESTful endpoints with clear semantics
- Query parameters for filtering/sorting (not request body for GET)
- Consistent error response format with `error` and optional `details` array
- HTTP status codes used appropriately (201 for create, 200 for idempotent return, 400 for validation errors)

## Trade-offs Made

### What I Chose Not to Do

1. **No user authentication** - For a personal single-user tool, authentication adds complexity without benefit. Would add for multi-user deployment.

2. **No pagination** - With a personal expense tracker, the dataset is typically small enough to load fully. Would add for larger datasets.

3. **No expense editing/deletion** - Kept scope to core requirements. Would be straightforward to add with PUT/DELETE endpoints.

4. **No real-time updates** - Polling/manual refresh is sufficient for single-user use. Would add WebSockets for multi-user.

5. **No offline support** - Would require service workers and IndexedDB for offline-first architecture.

6. **Simple styling** - Focused on functionality over aesthetics. Production app would benefit from design system.

## Running Locally

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017 (or set `MONGODB_URI` environment variable)

### Backend

```bash
cd backend
npm install
npm run dev
```

Server runs at http://localhost:3001

**Environment Variables:**
- `MONGODB_URI` - MongoDB connection string (default: `mongodb://localhost:27017`)
- `DB_NAME` - Database name (default: `expense_tracker`)
- `PORT` - Server port (default: `3001`)

### Frontend

```bash
cd my-next-app
npm install
npm run dev
```

Application runs at http://localhost:3000

### Running Tests

```bash
cd backend
npm test
```

## API Endpoints

### POST /expenses
Create a new expense.

**Request Body:**
```json
{
  "amount": 100.50,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2024-01-15",
  "idempotency_key": "optional-unique-key"
}
```

**Response:** `201 Created` (or `200 OK` if idempotent retry)
```json
{
  "id": "uuid",
  "amount": 100.50,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2024-01-15",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

### GET /expenses
Get list of expenses.

**Query Parameters:**
- `category` (optional) - Filter by category (e.g., "Food", "Transport")
- `sort` (optional) - Sort order: `date_desc` (default) or `date_asc`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "amount": 100.50,
    "category": "Food",
    "description": "Lunch at restaurant",
    "date": "2024-01-15",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### GET /categories
Get list of valid categories.

**Response:** `200 OK`
```json
["Food", "Transport", "Entertainment", "Shopping", "Bills", "Healthcare", "Education", "Other"]
```

### GET /health
Health check endpoint.

**Response:** `200 OK`
```json
{"status": "ok", "timestamp": "2024-01-15T10:30:00.000Z"}
```

## Project Structure

```
expense-tracker/
├── backend/
│   ├── src/
│   │   ├── index.ts        # Express server and routes
│   │   ├── database.ts     # MongoDB database layer
│   │   ├── types.ts        # TypeScript types
│   │   ├── validation.ts   # Input validation
│   │   └── validation.test.ts  # Unit tests
│   ├── package.json
│   └── tsconfig.json
├── my-next-app/
│   ├── components/
│   │   ├── ExpenseForm.tsx   # Add expense form
│   │   └── ExpenseList.tsx   # Expense list with filters
│   ├── lib/
│   │   ├── api.ts            # API client
│   │   └── types.ts          # Shared types
│   ├── pages/
│   │   └── index.tsx         # Main page
│   └── package.json
└── README.md
```

