# CogWorks Frontend

Welcome to the CogWorks Workshop Management System frontend! This project is built using Next.js and React, providing a modern and efficient user interface for managing workshops.

## Getting Started

To get started with the CogWorks frontend, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
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

## Features

- User-friendly interface for managing workshops.
- Responsive design for accessibility on various devices.
- Integration with the backend for data fetching and management.
- UI styling powered by [Bootstrap](https://getbootstrap.com/).

## Bootstrap Integration

Bootstrap is used for global UI styling. The CSS is loaded via a provider in `src/components/BootstrapProvider.jsx` and is available throughout the app.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.