# CogWorks Backend

Express + Firestore Admin backend for CogWorks. Implements REST endpoints, JWT auth, and SSE updates for job status.

## Prerequisites

- Node 18+
- Firestore project credentials (service account JSON or ADC)

## Setup

1) Install deps
```
npm install
```

2) Configure environment
Copy `.env.example` to `.env` and set values.

3) Run
```
npm run dev
```

Server defaults to `PORT=4000`.

## Environment variables

- PORT
- CORS_ORIGIN
- FIRESTORE_PROJECT_ID
- FIREBASE_SERVICE_ACCOUNT (base64 of service account json) or GOOGLE_APPLICATION_CREDENTIALS
- JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
- ACCESS_TOKEN_TTL (seconds), REFRESH_TOKEN_TTL (seconds)
- SSE_HEARTBEAT_MS (default 15000)
- TIMETABLE_SLOT_MIN (default 60)
 

## API Overview

Base path: `/api`

- Auth
  - POST `/auth/login` { email, password }
  - POST `/auth/refresh`
  - POST `/auth/logout`
- Customers: GET/POST/PATCH `/customers`, GET `/customers/:id`
- Mechanics: GET/POST/PATCH `/mechanics`, GET `/mechanics/:id`
- Inventory: GET/POST/PATCH `/inventory`, GET `/inventory/:id`
- Jobs: GET/POST/PATCH `/jobs`, GET `/jobs/:id`, POST `/jobs/:id/status`
- Timetable: GET `/timetable?date=YYYY-MM-DD`
- SSE: GET `/events`

All write endpoints validate payloads and ignore unknown fields.

## Notes

- Firestore is lazily initialized. If credentials are missing, resource routes will return 503.
- SSE sends a heartbeat comment every `SSE_HEARTBEAT_MS`.

## Folder Structure

```
apps/backend
├── .github
│   └── copilot-instructions.md
├── src
│   ├── index.js
│   ├── lib
│   │   ├── firebase.js
│   │   ├── sse.js
│   │   ├── validators.js
│   │   └── errors.js
│   ├── routes
│   │   ├── index.js
│   │   ├── customers.js
│   │   ├── mechanics.js
│   │   ├── inventory.js
│   │   ├── jobs.js
│   │   └── timetable.js
│   ├── controllers
│   │   └── index.js
│   └── middleware
│       ├── auth.js
│       └── errorHandler.js
├── package.json
└── README.md
```