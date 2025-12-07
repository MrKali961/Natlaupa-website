# Project Overview

This is a Next.js web application for "Natlaupa," a luxury travel and hotel booking platform. The application is built with TypeScript and utilizes Tailwind CSS for styling. It features a sophisticated, modern design with a focus on high-quality imagery and a clean user interface.

The backend is powered by a PostgreSQL database managed with Prisma ORM. The application includes a comprehensive data model for hotels, destinations, user reviews, and various contact forms.

A key feature of the application is its AI-powered travel concierge, which uses the Gemini API to provide personalized travel advice to users based on their mood and preferences.

## Key Technologies

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma
- **AI:** Gemini API
- **Animations:** Framer Motion, GSAP

# Building and Running

To build and run this project locally, follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Set Up Environment Variables:**
    Create a `.env.local` file in the root of the project and add the following environment variables:
    ```
    DATABASE_URL="your_postgresql_database_url"
    GEMINI_API_KEY="your_gemini_api_key"
    ```

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the code.
- `npm run db:seed`: Seeds the database with initial data.
- `npm run audit:visual`: Runs a visual audit of the application.

# Development Conventions

## Coding Style

The codebase follows standard TypeScript and React conventions. The code is well-structured and organized into components, services, and lib folders.

## Testing

The project is set up with Playwright for end-to-end testing, although no tests are currently implemented.

## Contribution Guidelines

There are no explicit contribution guidelines in the repository. However, the code is well-documented and easy to follow, which should make it straightforward for new developers to contribute.
