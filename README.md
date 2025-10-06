# Dev@Deakin

A full-stack developer community platform connecting students and staff at Deakin University. Users can post questions and articles, subscribe to premium features via Stripe, and receive newsletter updates.

## Tech Stack

### Frontend
- Next.js 15 with React 19
- Bootstrap 5.3 for styling
- SWR for data fetching
- Stripe React for payments
- CodeMirror for code editing
- react-markdown for markdown rendering

### Backend
- Express REST API
- Firebase Admin SDK (Firestore)
- JWT authentication with refresh token rotation
- Stripe for subscriptions
- Nodemailer for email notifications
- ImgBB API for image hosting

## Project Structure

```
apps/
├── backend/          # Express API server
│   ├── src/
│   │   ├── lib/      # Firebase, Stripe, ImgBB, utilities
│   │   ├── middleware/
│   │   └── routes/   # Auth, posts, subscriptions, checkout, newsletter
│   └── package.json
└── frontend/         # Next.js 15 application
    ├── src/
    │   ├── app/      # Pages, layouts, server actions
    │   ├── components/
    │   └── lib/      # DAL, actions, utilities
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project with Firestore
- Stripe account
- ImgBB API key

### Installation

1. Clone the repository and install dependencies in both `apps/backend` and `apps/frontend`
2. Configure environment variables (see respective README files in each app)
3. Start development servers:
   - Backend: `cd apps/backend && npm run dev` (port 4000)
   - Frontend: `cd apps/frontend && npm run dev` (port 3000)

## Key Features

- User authentication with JWT tokens and refresh token rotation
- Questions with code snippets and markdown support
- Articles with images and rich text
- Tag-based organization (up to 10 tags per post)
- Stripe subscription management ($10/month)
- Newsletter with email confirmation via Nodemailer

## Architecture

### Data Flow
Server Actions → Data Access Layer (DAL) → Backend API → Firestore/External Services

Frontend server actions call DAL functions, which make authenticated HTTP requests to the backend API. Backend routes handle business logic and interact with Firestore and external services.

### Authentication
- JWT access tokens (15min TTL) and refresh tokens (30d TTL) stored in httpOnly cookies
- Refresh token rotation with jti tracking in Firestore
- Token reuse detection triggers automatic revocation
- Protected routes: `/account`, `/checkout`, `/posts/create`

### Image Handling
Client converts files to base64, backend uploads to ImgBB API, and stores returned URLs in Firestore.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.