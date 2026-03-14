# AUDIT 10: Dependency & State Management Library Audit

**Audit Date:** 2024-07-25
**Auditor:** Senior Principal Engineer (Gemini)
**Context:** This audit is a follow-up to the main architectural audit (AUDIT_09), focusing specifically on the project's dependencies as listed in `package.json`.

---

### 1. Core Framework & UI

-   **`react`, `react-dom`**: Currently on v19. Good, modern choice.
-   **`tailwindcss`**: Excellent utility-first CSS framework. Good choice for rapid, consistent UI development.
-   **`@material-tailwind/react`**: **[FINDING]** This is a significant dependency that seems to be underutilized or potentially in conflict with a custom-built UI library in `src/components/ui`. The project has 24 of its own UI components (`Button`, `Card`, `Dialog`, etc.) while also including a third-party library that provides the same. This creates confusion, increases bundle size, and leads to inconsistent UI.
    -   **Recommendation:** Choose one path. Either commit fully to `@material-tailwind/react` and remove the custom UI components, or remove `@material-tailwind/react` and build upon the existing custom library. Given the existing custom components, removing the library is the clearer path to a consistent design system.
    -   **Effort:** **M**

### 2. Routing

-   **`react-router-dom`**: **[CRITICAL FINDING]** Installed but completely unused. The application relies on manual string-based routing (`activePage`), which is not scalable or robust. This was detailed in `AUDIT_09_ARCHITECTURE.md`.
    -   **Recommendation:** Implement `react-router-dom` immediately. This is the highest-priority architectural change required.
    -   **Effort:** **L**

### 3. State Management & Data Fetching

-   **`@supabase/supabase-js`**: Used as the data source. This is a solid choice, providing both a database and an API layer.
-   **`@tanstack/react-query`**: **[GAP]** This library is **not installed**. The architecture audit identified the lack of a server state management library as a critical flaw, leading to constant re-fetching and poor performance.
    -   **Recommendation:** Install and integrate `@tanstack/react-query` for all server state management. All data fetching currently done in `useEffect` should be migrated to `useQuery` and `useMutation`. This will introduce caching, background refetching, and a centralized way to manage API data.
    -   **Effort:** **XL** (but can be done incrementally)

### 4. Utility Libraries

-   **`apexcharts`, `react-apexcharts`**: A powerful charting library. Good choice for the dashboard visualizations.
-   **`clsx`**: A simple utility for constructing `className` strings conditionally. Excellent, lightweight choice.
-   **`file-saver`, `jspdf`, `jspdf-autotable`, `xlsx`**: These are for data export functionality (PDF, Excel). This is a reasonable implementation for client-side exports. However, for large datasets, this should be an API-driven, server-side task.
-   **`use-debounce`**: Used for debouncing inputs, which is good practice for search fields to avoid excessive API calls.
-   **`@heroicons/react`**: A popular and extensive icon library. Good choice.
-   **`react-hot-toast`**: For displaying toast notifications. Simple and effective.

### 5. Development & Build Tooling

-   **`vite`**: Modern, fast build tool. Excellent choice.
-   **`typescript`**: The use of TypeScript is a major strength.
-   **`eslint`, `prettier` (via tailwind config)**: The foundation for code quality is present.
-   **`@types/*`**: Proper type definitions for libraries are included.
-   **Testing Libraries**: **[CRITICAL GAP]** As noted in the main audit, there are **no testing libraries installed** (`vitest`, `@testing-library/react`, etc.).

    -   **Recommendation:** Install `vitest` and `@testing-library/react`. Begin writing unit and integration tests, starting with the service layer and critical UI components.
    -   **Effort:** **L**

### Summary of Recommendations & Next Steps

1.  **Highest Priority (State & Routing):**
    -   Install `@tanstack/react-query`.
    -   Begin migrating the first page (e.g., `ProductsPage`) from `useEffect`-based fetching to `useQuery`.
    -   Refactor `App.tsx` to use `<BrowserRouter>` and `<Routes>` to render `ProductsPage` under a `/products` route.

2.  **Medium Priority (UI Consistency):**
    -   Decide whether to keep or remove `@material-tailwind/react`. The recommendation is to **remove it** and standardize on the custom components in `src/components/ui`.

3.  **High Priority (Quality & Safety):**
    -   Install `vitest` and `@testing-library/react`.
    -   Write the first unit test for a service function (e.g., a data transformation function).

Executing these steps will address the most severe architectural problems and set the project on a path toward scalability and maintainability.
