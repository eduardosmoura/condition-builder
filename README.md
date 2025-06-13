# condition-builder

Condition Builder

## Table of Contents

- [condition-builder](#condition-builder)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Project Description](#project-description)
  - [Code Structure](#code-structure)
  - [Required Libraries \& Tools](#required-libraries--tools)
  - [Setup and Installation](#setup-and-installation)
  - [Compilation and Running](#compilation-and-running)
    - [Development Mode](#development-mode)
    - [Production Mode](#production-mode)
  - [Running the Tests](#running-the-tests)
  - [Live Deployment](#live-deployment)
  - [Additional Notes](#additional-notes)

## Overview

Condition Builder is a lightweight web application built with ReactJS and TypeScript that allows users to load an array of data and layer in and/or conditions to filter the data. Users can navigate through results using pagination (with offset and customizable page size) and apply various filtering options. This project focuses on correct implementation of requirements rather than UI design, and incorporates modern tools and best practices.

## Project Description

This tool allows you to load an array of data and layer in and/or conditions to filter the data. The app supports filtering by any attribute. It also provides pagination controls to change the page size and offset. The focus is on the correct implementation of the functional requirements while leveraging modern React patterns and libraries.

Filtering examples:
<img width="1205" alt="Screenshot 2025-06-13 at 12 07 23 AM" src="https://github.com/user-attachments/assets/ea3eb565-ae78-48cb-9a55-02d73c6580a8" />

<img width="1082" alt="Screenshot 2025-06-13 at 12 08 56 AM" src="https://github.com/user-attachments/assets/44d7f32c-0764-4594-9b7f-48839992c7dd" />

## Code Structure

```text
condition-builder/
├── public/
|   └── assets/
|── src/
|   ├── components/
|   ├── contexts/
|   ├── core/
|   ├── hooks/
|   ├── services/
|   ├── styles/
|   ├── types/
|   └── utils/
└── tests/
    ├── fixtures/
```

## Required Libraries & Tools

- **[Vite](https://vitejs.dev/):** Fast build tool and development server.
- **[ReactJS](https://reactjs.org/):** UI library for building user interfaces.
- **[TypeScript](https://www.typescriptlang.org/):** Typed superset of JavaScript.
- **[Vitest](https://vitest.dev/):** Testing framework for Vite projects.
- **[Testing Library](https://testing-library.com/):** Tools for testing React components.
- **[Material UI](https://mui.com/):** React UI framework.
- **[Eslint](https://eslint.org/):** Linting tool to ensure code quality.
- **[Prettier](https://prettier.io/):** Code formatter for consistent style.

## Setup and Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/eduardosmoura/condition-builder.git
   cd condition-builder
   ```

2. **Install Dependencies Using pnpm:**

   ```bash
   pnpm install --frozen-lockfile
   ```

3. **Environment Configuration:**

   Create environment files for different environments. For example, create a `.env` file in the project root with:

   ```dotenv
   VITE_API_BASE_URL=https://jsonplaceholder.typicode.com/todos
   ```

   (You can also create `.env.development`, `.env.production`, etc.)

## Compilation and Running

### Development Mode

To run the project in development mode with live reload:

```bash
pnpm run dev
```

This will start the Vite development server.

### Production Mode

To build and serve the project in production mode:

1. **Build the Project:**

   ```bash
   pnpm run build
   ```

2. **Preview the Production Build:**

   ```bash
   pnpm run preview
   ```

## Running the Tests

The project uses Vitest for testing.

To run tests, execute:

```bash
pnpm run test
```

To run tests in watch mode:

```bash
pnpm run test:watch
```

## Live Deployment

A live deployment of the Condition Builder is available at:
**[https://condition-builder-green.vercel.app/](https://condition-builder-green.vercel.app/)**

## Additional Notes

- **Cache API Calls with useMemo:**
  The `useCriteriaGroup` and `useCriteriaRow` hooks caches filter responses using the `useMemo` hook to avoid unnecessary re-rendering calls when filter parameters haven't changed improving overall performance.

- **Context API to manage filters state:**
  The `FilterContext` (and `useFilter` hook) encapsulate the `filter state` (both the input filters and the applied filters). The `NotificationContext` exposes a global error handler snackbar component.

- **Lazy Loading:**
  All main components are lazily loaded using `React.lazy` and `Suspense`, which helps to improve the initial load time of the app.

- **Skeleton Loading Effects:**
  The app uses skeleton loading components (similar to Facebook) to provide a smooth loading experience while data is being fetched.

- **Error Handling with Snackbar:**
  The app uses MUI Snackbar to display error notifications and filter updates to the user in a non-intrusive manner.

- **Linting and Formatting:**
  ESLint and Prettier are configured to enforce code quality and consistent formatting throughout the project.

This project is built with modern tools and best practices, ensuring a performant, maintainable, and scalable web application. Enjoy building and extending the Condition Builer app!
condition-builder
