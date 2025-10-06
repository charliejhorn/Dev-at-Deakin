# Dev@Deakin Backend

Express REST API backend for Dev@Deakin with Firestore, JWT authentication, and Stripe subscriptions.

## Tech Stack

- Express web framework
- Firebase Admin SDK (Firestore)
- JWT (jsonwebtoken) for authentication
- Stripe for payment processing
- bcrypt for password hashing
- Nodemailer for email notifications
- ImgBB API for image hosting

## Getting Started

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and configure:
   - `FIREBASE_SERVICE_ACCOUNT` (base64-encoded service account JSON)
   - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
   - `STRIPE_SECRET_KEY`
   - `IMGBB_API_KEY`
   - `GMAIL_USER`, `GMAIL_APP_PASSWORD` (optional, for newsletter emails)
3. Run development server: `npm run dev`
4. Server starts on http://localhost:4000

## Project Structure

```
src/
├── index.js                     # Express app entry point
├── lib/
│   ├── errors.js                # Error helpers
│   ├── firebase.js              # Firestore initialization
│   ├── imgbb.js                 # Image upload service
│   ├── stripe.js                # Stripe client
│   ├── subscriptionsService.js  # Subscription logic
│   └── validators.js            # Payload validation
├── middleware/
│   ├── auth.js                  # JWT verification
│   └── errorHandler.js          # Error handling
└── routes/
    ├── index.js                 # Route registry
    ├── auth.js                  # Login, refresh, logout
    ├── checkout.js              # Stripe checkout
    ├── newsletter.js            # Newsletter subscriptions
    ├── posts.js                 # Posts CRUD
    ├── subscriptions.js         # Subscription management
    └── users.js                 # User registration
```

## API Overview

Base URL: `http://localhost:4000/api`

### Authentication
- `POST /auth/login` - User login with email/password
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout and revoke tokens

### Users
- `POST /users` - Register new user
- `GET /users/me` - Get current user profile (protected)

### Posts
- `GET /posts` - List posts with optional filters
- `POST /posts` - Create new post (protected)

### Subscriptions
- `GET /subscriptions` - List subscriptions (protected)
- `PATCH /subscriptions/:id` - Update subscription status (protected)

### Checkout
- `POST /checkout` - Create Stripe checkout session
- `POST /checkout/confirm` - Confirm checkout and create subscription

### Newsletter
- `POST /newsletter/subscribe` - Subscribe to newsletter

## Authentication Flow

### Token Lifecycle
1. **Login** issues access token (15min TTL) and refresh token (30d TTL)
2. **API Requests** use access token in Authorization header
3. **Token Refresh** validates refresh token and issues new tokens
4. **Token Reuse Detection** revokes all tokens if replaced token is reused

### Middleware Usage
Protect routes with `auth(requireAuth)` middleware. Set `requireAuth` to `true` for protected routes or `false` to optionally populate `req.user`.

## Firestore Collections

### users
`email`, `passwordHash`, `firstName`, `lastName`, `role`, `createdAt`, `updatedAt`

### posts
`postType`, `title`, `tags[]`, `createdBy{}`, `status`, question/article fields, `image`, `imageMeta`, `createdAt`

### subscriptions
`email`, `stripeSubscriptionId`, `status`, `currentPeriodEnd`, `checkoutSessionId`, `createdAt`

### refresh_tokens
`jti` (document ID), `userId`, `createdAt`, `expiresAt`, `revoked`, `replacedBy`

### newsletter
`email`, `createdAt`

## Error Handling

Backend uses `httpError(status, message, details)` helper to create standardized errors. Centralized error handler middleware catches all errors and returns JSON responses.

## Image Upload Flow

1. Client converts File to base64
2. Frontend sends to server action
3. Backend receives `imageBase64: { data, name, type }`
4. ImgBB service uploads via API
5. Backend stores URL in post document

## Subscription Flow

### Checkout
1. Create checkout session with `POST /checkout`
2. User completes payment on Stripe
3. Confirm session with `POST /checkout/confirm`
4. Subscription created/updated in Firestore

### Management
Update subscription status with `PATCH /subscriptions/:id`. Backend can integrate with Stripe cancellation if needed.

## Newsletter

Newsletter subscription stores email in Firestore and sends confirmation email via Nodemailer if Gmail credentials are configured in environment variables.

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## License

MIT License - see LICENSE file for details.