# Dev@Deakin Frontend

Welcome to the Dev@Deakin frontend! This project is built using Next.js and React, providing a modern and efficient user interface for connecting with staff and students at Deakin University.

## Getting Started

To get started with the CogWorks frontend, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone git@github.com:charliejhorn/Dev-at-Deakin.git
   cd CogWorks/apps/frontend
   ```

2. **Install dependencies**:
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Run the development server**:
   Start the Next.js development server with:
   ```bash
   npm run dev
   ```
   You can now view the application in your browser at `http://localhost:3000`.

## Project Structure

- **src/app**: Contains the main layout and entry point for the application.
- **src/components**: Contains reusable React components.
- **src/lib**: Contains utility functions for API calls and data management.

## Environment Variables
- `NEXT_PUBLIC_API_BASE` (backend URL root)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Features

- User-friendly interface.
- Responsive design for accessibility on various devices.
- Integration with the backend for data fetching and management.
- UI styling powered by [Bootstrap](https://getbootstrap.com/).

## Bootstrap Integration

Bootstrap is used for global UI styling. The CSS framework is loaded via an import in `src/app/custom.scss`, which is integrated into the app via an import in `src/app/layout.jsx`. Bootstrap styling is available throughout the app.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.