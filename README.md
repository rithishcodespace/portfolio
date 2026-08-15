# Anonymous Visitor & Page View Tracking System

## Overview
This feature implements privacy-preserving, anonymous visitor tracking for the portfolio application. It tracks unique visitors using browser cookies (`visitor_id` UUIDs) and records total page views in a PostgreSQL database without requiring user registration or capturing personal identifying information.

---

## Architecture & Database Schema

The tracking system operates using two main PostgreSQL tables defined in `server/schema.sql`:

### 1. `visitors` Table
Tracks unique anonymous browser sessions based on a generated UUID.
```sql
CREATE TABLE visitors (
    id SERIAL PRIMARY KEY,
    visitor_id UUID NOT NULL UNIQUE,
    first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. `page_views` Table
Records every single page navigation event for analytics.
```sql
CREATE TABLE page_views (
    id SERIAL PRIMARY KEY,
    visitor_id UUID NOT NULL,
    page VARCHAR(255) NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## How It Works

### 1. Client-Side Tracking
- When a user navigates through the portfolio, the `PageViewTracker` component (`client/src/App.jsx`) detects route changes using `useLocation()`.
- It automatically calls `trackingApi.trackPageView(pathname)` to send the current page route to the Express backend with `credentials: 'include'`.

### 2. Backend Processing (`POST /api/track`)
When a request is received at `/api/track`:
1. **Cookie Check**: The server checks for the `visitor_id` cookie using `cookie-parser`.
2. **New Visitor**:
   - If `visitor_id` is missing, the server generates a new UUID via `crypto.randomUUID()`.
   - Stores the UUID in the browser as an HTTP cookie (`maxAge`: 1 year, `sameSite`: 'lax').
   - Inserts the new UUID into the `visitors` table.
   - Records the visit in the `page_views` table.
3. **Returning Visitor**:
   - Uses the existing `visitor_id` from the cookie.
   - Updates the visitor's `last_seen` timestamp in the `visitors` table.
   - Records the new page visit in the `page_views` table.

---

## API Documentation

### `POST /api/track`
Record a page view and update or create an anonymous visitor session.

**Request Body**:
```json
{
  "page": "/projects"
}
```

**Response**:
```json
{
  "success": true,
  "visitor_id": "c20653b1-5750-439e-9e5a-ac0b77455076",
  "page": "/projects",
  "isNewVisitor": false
}
```

### `GET /api/track/stats`
Fetch aggregated unique visitor counts and total page views.

**Response**:
```json
{
  "totalViews": 42,
  "uniqueVisitors": 8
}
```

---

## Admin Dashboard Integration

The visitor metrics are displayed in the Portfolio Admin Console (`client/src/components/admin/AdminMessages.jsx`):
- **Unique Visitors**: Count of distinct visitor IDs (`COUNT(DISTINCT visitor_id)`).
- **Total Page Views**: Total logged rows in `page_views` (`COUNT(*)`).
- **Message Filtering**: Displays contact messages ordered by **Unseen**, **Seen**, and **All Messages** with `Unseen` set as default.
