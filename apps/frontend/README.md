# Dev@Deakin Frontend

Next.js 15 frontend for the Dev@Deakin developer community platform. Features server components, server actions, and Bootstrap UI.

## Tech Stack

- Next.js 15 with App Router
- React 19
- Bootstrap 5.3 for styling
- SWR for client-side data fetching
- Stripe React for checkout
- CodeMirror for code editing
- react-markdown for markdown rendering

## Getting Started

1. Install dependencies: `npm install`
2. Configure environment variables in `.env`:
   - `NEXT_PUBLIC_API_BASE` - Backend API URL (http://localhost:4000 in dev)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
3. Run development server: `npm run dev`
4. Open http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── layout.jsx              # Root layout
│   ├── custom.scss             # Bootstrap customization
│   ├── page.jsx                # Home page
│   ├── account/                # Account management
│   ├── checkout/               # Stripe checkout flow
│   ├── login/                  # Login page
│   ├── signup/                 # Registration page
│   ├── plans/                  # Subscription plans
│   ├── posts/                  # Questions and articles
│   └── lib/
│       ├── actions/            # Server actions
│       ├── dal/                # Data access layer
│       ├── client/             # Client utilities
│       └── config/             # Configuration
├── components/
│   ├── NavBar.jsx
│   ├── Footer.jsx
│   ├── ErrorBoundary.jsx
│   └── home/                   # Home page components
└── middleware.js               # Auth middleware

public/                         # Static assets
```

## Architecture Patterns

### Server Components vs Client Components

**Server Components** (default) fetch data directly using DAL functions and access cookies server-side. They cannot use React hooks or event handlers.

**Client Components** (`"use client"`) use React hooks, handle user interactions, and fetch data via SWR or call server actions.

### Server Actions
Server actions handle form submissions and mutations. They validate payloads, call DAL functions, and return standardized responses with success status, errors object, message, and data.

### Data Access Layer (DAL)
DAL functions in `src/app/lib/dal/` make authenticated API requests to the backend. They start with `import "server-only"` to prevent client bundling and use cookies for authentication.

### Protected Routes
Middleware in `src/middleware.js` checks authentication for `/account`, `/checkout`, and `/posts/create`. Unauthenticated users are redirected to `/login`.

### Error Handling
Client components that use SWR are wrapped with ErrorBoundary and Suspense for graceful error handling and loading states.

### Image Uploads
Client encodes File to base64 using `fileToBase64()` helper. Server actions pass to DAL, backend handles ImgBB upload.

### Form Validation
Client components merge server errors with client-side validation errors. Client errors are cleared when users type.

## Bootstrap Integration

Bootstrap CSS is customized in `src/app/custom.scss` and imported in `layout.jsx`. Custom SCSS variables are set before the Bootstrap import.

## Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT License - see LICENSE file for details.