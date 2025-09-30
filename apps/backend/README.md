# Dev@Deakin Backend

Express + Firestore Admin backend for Dev@Deakin. Implements REST endpoints and JWT auth.

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

- `PORT`
- `CORS_ORIGIN`
- `FIRESTORE_PROJECT_ID`
- `FIREBASE_SERVICE_ACCOUNT` (base64 of service account json)
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- `ACCESS_TOKEN_TTL` (seconds), `REFRESH_TOKEN_TTL` (seconds)
- `STRIPE_SECRET_KEY`
- `GMAIL_APP_PASSWORD`, and corresponding `GMAIL_USER`
- `IMGBB_API_KEY`
 

## API Overview

Base path: `/api`

- Auth
  - POST `/auth/login` { email, password }
  - POST `/auth/refresh`
  - POST `/auth/logout`
  - GET `/auth/me`
- Users
  - POST `/users`
- Posts
  - GET / POST `/posts`
- Subscriptions
  - PATCH `/subscriptions`
  - GET `/subscriptions`
- Newsletter
  - POST `/newsletter/subscribe` { email }
- Checkout
  - POST `/checkout`
  - POST `/checkout/confirm`

All write endpoints validate payloads and ignore unknown fields.

## Notes

- Firestore and Stripe are lazily initialized. If credentials are missing, resource routes will return 503.

## Folder Structure

```
apps/backend
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