# SIT313 - 6.1HD - Dev@Deakin Application

# Github

[https://github.com/charliejhorn/Dev-at-Deakin](https://github.com/charliejhorn/Dev-at-Deakin)

# Live Deployment

[https://dev-at-deakin-smoky.vercel.app/](https://dev-at-deakin-smoky.vercel.app/)

# Overview

This document outlines the advanced features and React concepts implemented in the Dev@Deakin web application that demonstrate excellent achievement of the unit learning outcomes. The application is a comprehensive full-stack developer community platform built with Next.js 15 and React 19, featuring advanced React patterns learned beyond class content including useActionState/useTransition/useSWR integration, Server and Client Components architecture, Data Access Layer pattern, ErrorBoundary/Suspense error handling, and sophisticated JWT authentication with middleware-based token validation.

# Unit Learning Outcomes Achievement

**ULO1 - Research and Application:** Implemented new React patterns including useActionState, useTransition, and Server Components based on current recommended best practices and Next.js documentation.

**ULO2 - Full-Stack Development:** Built a complete application spanning React frontend, Express.js backend, Firestore database, and Stripe API integration with comprehensive authentication and payment systems.

**ULO3 - Communication:** This document and the application architecture demonstrate clear articulation of complex technical solutions including DAL patterns, server actions, and modern authentication flows.

**ULO4 - Learning Reflection:** Advanced implementation goes beyond the provided content in the unit, showcasing self-directed learning of React hooks, Next.js App Router, and advanced authentication patterns.

# Features

### 1. JWT Authentication System with Refresh Token Rotation

- Dual-token JWT authentication (access tokens: 15min TTL, refresh tokens: 30d TTL)
- Automatic refresh token rotation with jti (JWT ID) tracking in Firestore
- Token reuse detection that triggers hard revocation of all user tokens
- Middleware-based token validation with automatic session checking
- Protected routes (/account, /checkout, /posts/create) with authentication enforcement
- Password hashing with bcrypt and comprehensive input validation
- Server-side session validation

### 2. Questions and Articles Platform

- CodeMirror integration for syntax-highlighted code editing
- Markdown support with live preview using react-markdown
- Image upload via ImgBB API with base64 client-side encoding

### 3. Subscription Management with Stripe Integration

- Full Stripe Checkout integration for premium subscriptions
- Session-based checkout flow with confirmation handling
- Subscription status tracking in Firestore (active, canceled)
- Protected checkout route that redirects active subscribers to account page
- Account management page with subscription controls

### 4. Newsletter System with Email Confirmation

- Email subscription storage in Firestore
- Automated confirmation emails via Nodemailer with Gmail SMTP

### 5. Error Handling and Loading States

- ErrorBoundary components wrapping data fetching operations
- Suspense integration for loading states with custom skeleton components
- Fallback UI for error states with retry functionality
- Server action error handling with structured error objects
- Client and server-side validation with merged error display

### 6. Dedicated Backend Architecture

- Express REST API with modular route structure
- Firestore database with five collections (users, posts, subscriptions, refresh_tokens, newsletter)
- Lazy initialization of Firebase and Stripe services
- Centralized error handling with httpError helper

# Advanced React Concepts

### 1. useActionState, useTransition, and useSWR Integration (Self-Directed Learning)

Implemented React 19's concurrent features combined with SWR for optimal data fetching patterns not covered in class:

**useActionState for Form State Management:**
- Implementation: [LoginPage.jsx](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/app/login/page.jsx)
- Server Action: [loginAction](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/app/lib/actions/auth.js)

**useTransition for Non-Blocking UI Updates:**
- Implementation: [CreatePostForm.jsx](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/app/posts/create/_components/CreatePostForm.jsx)
- Server Action: [createPostAction](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/app/lib/actions/posts.js)

**useSWR with Suspense and ErrorBoundary:**
- Implementation: [QuestionsPage](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/app/posts/questions/page.jsx)
- API Route: [Questions Route Handler](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/app/api/posts/questions/route.js)

This demonstrates my understanding of:
- React 19's concurrent features
- Automatic pending states and error handling
- Non-blocking UI updates during async operations
- SWR integration with React Suspense for declarative data fetching
- These patterns were self-learned from Next.js and React documentation

### 2. Server and Client Components Architecture (Self-Directed Learning)

Implemented sophisticated separation of Server and Client Components utilizing Next.js 15 App Router patterns not covered in class. For example:

**Server Components (Zero JavaScript to Client):**
- [NavBar.jsx](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/components/NavBar.jsx) - Server-side authentication checking
- [AccountPage](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/app/account/page.jsx) - Direct database queries without client JavaScript
- [Footer.jsx](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/components/Footer.jsx) - Static content with zero client JS

**Client Components (Interactive UI):**
- [CreatePostForm.jsx](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/app/posts/create/_components/CreatePostForm.jsx) - Complex form state with file uploads
- [CheckoutFlow.jsx](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/app/checkout/_components/CheckoutFlow.jsx) - Stripe payment processing
- [QuestionModal.jsx](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/app/posts/questions/_components/QuestionModal.jsx) - Interactive modal with SWR

**Key Benefits:**
- Server Components fetch data with cookies() without client-side JavaScript
- Client Components only for interactive features
- Better performance with reduced JavaScript payload

### 3. Data Access Layer (DAL) Pattern (Self-Directed Learning)

Implemented a comprehensive DAL pattern to separate data fetching from UI components, an architectural pattern not demonstrated in class:

**DAL Implementation Files:**
- [auth.js](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/app/lib/dal/auth.js) - Session validation with server-only enforcement
- [posts.js](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/app/lib/dal/posts.js) - Post creation and fetching with authentication headers
- [user.js](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/app/lib/dal/user.js) - User data retrieval
- [subscriptions.js](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/app/lib/dal/subscriptions.js) - Subscription management
- [checkout.js](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/app/lib/dal/checkout.js) - Stripe checkout session handling

**DAL Architecture Benefits:**
- Separation of concerns: UI components never directly call fetch()
- Reusability: DAL functions used by both Server Components and Server Actions
- Consistent error handling with status and info properties
- Centralized authentication header management

### 4. Suspense and ErrorBoundary Integration (Self-Directed Learning)

Implemented error handling and loading patterns not covered in class:

**Implementation Files:**
- [ErrorBoundary.jsx](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/components/ErrorBoundary.jsx) - Custom ErrorBoundary component with reset functionality
- [QuestionsPage](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/app/posts/questions/page.jsx) - ErrorBoundary and Suspense integration
- [QuestionsSkeleton.jsx](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/app/posts/questions/_components/QuestionsSkeleton.jsx) - Custom loading skeleton

**Pattern Benefits:**
- Better error recovery with retry functionality
- Loading states via Suspense with custom skeleton components (Find Question page)
- Error isolation preventing full page crashes with user-friendly error messages
- Automatic revalidation with SWR integration

### 5. Authentication Middleware with Token Validation (Self-Directed Learning)

Created middleware for route protection with JWT token validation:

**Implementation Files:**
- [middleware.js](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/frontend/src/middleware.js) - Route protection and session validation
- [auth.js (backend)](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/backend/src/routes/auth.js) - JWT token generation and refresh logic
- [auth.js (middleware)](https://github.com/charliejhorn/Dev-at-Deakin/tree/main/apps/backend/src/middleware/auth.js) - JWT verification middleware

**Middleware Features:**
- Route-based authentication enforcement for `/account`, `/checkout`, `/posts/create`
- Server-side JWT token validation via validateSession()
- Subscription gating that redirects active subscribers from checkout
- Automatic logout handling with cookie clearing
- Runs before page render for better performance

## Conclusion

This Dev@Deakin application demonstrates advanced competency in React development practices, server-client architecture, and full-stack integration that goes significantly beyond what was covered in class. The implementation achieves excellent mastery of all ULOs through:

1. **Self-Directed Learning of Advanced React Concepts**: useActionState and useTransition for concurrent form handling, useSWR with Suspense integration, Server and Client Component architecture, Data Access Layer pattern, ErrorBoundary for error handling, and authentication middleware with JWT token validation—all researched and implemented independently beyond class content.

2. **Full-Stack Architecture**: Comprehensive DAL pattern with server-only enforcement, Next.js middleware for route protection, server actions for progressive enhancement, Express backend with Firestore, and integration with multiple third-party APIs (Stripe, ImgBB, Nodemailer).

3. **Security Implementation**: JWT authentication with refresh token rotation and reuse detection (not covered in class), token jti tracking in Firestore, automatic revocation on security violations, middleware-based session validation.

The application represents extensive self-directed learning of React 19 patterns and architectural patterns not demonstrated in lectures or seminars. All features are fully functional and production-ready, deployed live at https://dev-at-deakin-smoky.vercel.app/.