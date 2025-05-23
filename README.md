# 📄 Notification System Design Document

## Objective

Design and implement a **lightweight, cost-effective, and scalable notification system** capable of supporting like-based notifications for **10,000+ daily active users** without impacting user-facing application performance.

---

## System Architecture Overview

This system decouples **notification creation** (write-heavy operations) from **notification delivery** (read-heavy operations) using a **BullMQ-based job queue** and a background **worker service**. Notifications are persisted in **MongoDB**, while **Redis** is used for rapid state access, specifically for unread count tracking.

---

## API Specification

### `POST /api/like`

**Purpose:** Queue a like notification

**Request Body:**

```json
{
  "likerId": "string",
  "recipientId": "string"
}
```

**Response:**

```json
{
  "success": true
}
```

* Adds a job to the BullMQ queue.
* The worker processes the job asynchronously.

---

### `GET /api/summary?recipientId=string`

**Purpose:** Retrieve the unread notification count

**Response:**

```json
{
  "unreadCount": 3
}
```

* Reads from Redis key `notifications:unread:<recipientId>`.
* Used to update the notification badge on the UI.

---

### `GET /api/notifications?recipientId=string`

**Purpose:** Retrieve the latest 10 notifications

**Response:**

```json
[
  {
    "_id": "string",
    "recipientId": "string",
    "message": "string",
    "isRead": true,
    "createdAt": "ISODate"
  }
]
```

* Fetches from MongoDB, sorted by `createdAt`, limited to 10 entries.
* Marks any unread notifications as read.
* Resets the unread count in Redis to 0.

---

## Key System Components

### 1. **Notification Queue (BullMQ)**

* Queue name: `notifications`
* Facilitates asynchronous job processing
* Mitigates spikes in write operations

### 2. **Worker Service**

* Listens to the `notifications` queue
* For each job:

  * Creates a new notification document in MongoDB
  * Increments Redis key `notifications:unread:<recipientId>`

### 3. **Socket Connections**
* When users connect via socket, they receive real-time notification updates
* A `join` event is emitted from the frontend to establish the connection
* Socket connections are automatically disconnected when users leave the page

### 4. **MongoDB**

* Collection: `Notification`

```json
{
  "_id": ObjectId,
  "recipientId": "string",
  "message": "string",
  "isRead": "boolean",
  "createdAt": "date"
}
```

* Indexes: `recipientId`, `createdAt`

### 4. **Redis**

* Key format: `notifications:unread:<recipientId>`
* Type: Integer
* Purpose: Fast O(1) access to unread count for UI rendering

---

## Notification Flow

### 1. Liking a Post

* `POST /api/like` is triggered with `likerId` and `recipientId`
* Job is enqueued in the `notifications` queue

### 2. Worker Execution

* Dequeues the job
* Persists notification to MongoDB
* Increments unread count in Redis

### 3. Fetching Notifications

* `GET /api/summary`: Returns unread count from Redis
* `GET /api/notifications`:

  * Fetches the 10 most recent notifications from MongoDB
  * Marks unread ones as read
  * Resets the Redis unread counter


### 4. **Socket Communication Flow**
* A `join` event is emitted from the frontend and a connection is established
* The backend emits a `notification:summary` event every 10 seconds to update unread notification counts from redis.

---

## Scalability Features

| Feature           | Benefit                                  |
| ----------------- | ---------------------------------------- |
| Queue (BullMQ) | Decouples writes, handles traffic spikes |
| Redis Counter  | Instantaneous unread count lookups       |
| DB Indexes     | Fast notification retrieval              |
| MongoDB         | Scalable and flexible document storage   |
| Async Worker   | Improves API response time               |

---

## Future Enhancements

* Implement retry logic in BullMQ for fault tolerance
* Add deduplication to avoid repeated likes from the same user
* Introduce TTL (time-to-live) for automatic cleanup of old notifications

---

## Conclusion

This design delivers a robust, scalable notification system tailored for high user concurrency. It ensures:

* Fast and responsive user interfaces
* Scalable architecture suited for 10k+ daily users
* Efficient separation of responsibilities between services



## How does it work:

* To check User profile Notifications  Go to /user/:RecipientID