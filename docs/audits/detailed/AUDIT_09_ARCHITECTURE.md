    # AUDIT 09: Enterprise Architecture & State Management Audit

    **Audit Date:** 2024-07-26
    **Auditor:** Senior Principal Engineer (Gemini)
    **Standard:** "Would this pass architecture review at Google/Microsoft?"

    ## Executive Summary

    The application exhibits characteristics of a rapidly developed prototype. While functional for a small dataset, the core architecture presents significant scalability, maintainability, and user experience issues that would prevent it from passing a formal enterprise architecture review.

    Key findings include:
    1.  **Manual Routing:** The absence of a proper routing library like `react-router-dom` cripples core browser functionality (back button, deep linking, URL sharing).
    2.  **Naive State Management:** Exclusive reliance on local `useState` with constant re-fetching on every navigation creates severe performance bottlenecks and a poor user experience.
    3.  **Inconsistent Service Layer:** Service responsibilities are blurred, with logic for single domains (like BOMs) spread across multiple files.
    4.  **No Testing Infrastructure:** The complete lack of automated tests introduces an unacceptably high risk of regressions.
    5.  **Client-Side Burden:** The architecture is not prepared for complex calculations (like MRP) or scaling data, placing the performance burden entirely on the user's browser.

    **Overall Recommendation:** A foundational refactoring is required. The highest priority is to implement `react-router-dom` for routing and a dedicated server state management library like `React Query` (TanStack Query). These two changes will resolve the most critical architectural deficiencies and provide a solid foundation for future growth.

    ---

    ### 1. ROUTING ARCHITECTURE
    **Current State:** Manual routing is handled via an `activePage` string state in `App.tsx`. Page components are conditionally rendered based on this state. `react-router-dom` is an installed dependency but is completely unused.
    **Enterprise Standard:** A declarative routing library (`react-router-dom`) is the standard for any multi-page React application. It manages browser history, enables shareable and bookmarkable URLs, and provides a clear structure for navigation and route protection.
    **Gap:** The application lacks declarative routing, deep linking, browser back/forward button integration, and a coherent URL structure.
    **Impact:**
    - **Business:** Pages cannot be shared or bookmarked, hindering collaboration. SEO is non-existent.
    - **Technical:** In-memory state is lost on refresh. It's impossible to link a user directly to a specific product or purchase order. Route protection for authentication is difficult to implement.
    **Recommendation:** Immediately refactor the application to use `react-router-dom`. Replace the `activePage` state management with a router configuration (`<BrowserRouter>`, `<Routes>`, `<Route>`). Convert page-linkage components to use the `<Link>` component.
    **Effort:** **L** (Large)

    ### 2. STATE MANAGEMENT
    **Current State:** All application state is managed via local `useState` within components. Data is fetched using `useEffect` on every component mount. There is no caching or shared state, except for a `ThemeContext`.
    **Enterprise Standard:** A robust state management solution that differentiates between server state and client state. Server state (API data) should be managed by a dedicated data-fetching and caching library like React Query. Global client state (UI state, user settings) can be managed by Zustand, Jotai, or React Context.
    **Gap:** No data caching, leading to redundant API calls on every navigation. No mechanism for sharing state between pages (e.g., navigating from a product list to a detail page loses all context). Optimistic updates are not possible.
    **Impact:**
    - **Performance:** Extremely slow page loads and high network traffic. The app feels sluggish.
    - **User Experience:** UI state is not preserved. Data disappears and reloads constantly.
    - **Scalability:** The application will not scale as data volume grows.
    **Recommendation:** Integrate `React Query` (TanStack Query). Refactor all `useEffect`-based data fetching into `useQuery` and `useMutation` hooks. This will provide caching, background refetching, and cache invalidation out-of-the-box, solving the largest performance and state issues.
    **Effort:** **XL** (Extra Large)

    ### 3. DATA FLOW
    **Current State:** The data flow is generally API Service → Component. However, the responsibility for data transformation (e.g., `snake_case` from the API to `camelCase` for the UI) is inconsistent. Some services transform the data, while others pass it through raw.
    **Enterprise Standard:** Data transformation should occur at a single, predictable layer—ideally, right after the data is fetched from the API. The rest of the application should operate on a consistent, well-defined domain model (e.g., always `camelCase`).
    **Gap:** There is no single source of truth for data transformation rules. Developers must remember which service provides which data shape.
    **Impact:** High cognitive overhead, increased risk of bugs (e.g., `product.product_id` vs `product.productId`), and difficult debugging.
    **Recommendation:** Enforce a strict policy: all API services are responsible for transforming incoming `snake_case` data into the application's `camelCase` domain model. No component or utility outside the service layer should ever have to handle `snake_case` properties.
    **Effort:** **M** (Medium)

    ### 4. SERVICE LAYER ARCHITECTURE
    **Current State:** The service layer has mixed responsibilities and inconsistent patterns. BOM data is handled by three different files (`api.service`, `product.service`, `bom.service`). Dashboard data is split between `dashboard.service` and `dashboard.api`. Some services are classes, others are plain functions.
    **Enterprise Standard:** Services must adhere to the Single Responsibility Principle (SRP). Each service should own a single business domain (e.g., `productService`, `purchaseOrderService`). A central API client can handle raw requests, but domain-specific logic belongs in its own service.
    **Gap:** Violation of SRP. Code is hard to locate. The mix of class and function patterns creates inconsistency. There is a high risk of future circular dependencies.
    **Impact:** Low maintainability and high complexity. Refactoring one part of the code can have unforeseen side effects in another. Onboarding new developers is difficult.
    **Recommendation:**
    1.  Consolidate all BOM-related logic into `bom.service.ts`.
    2.  Consolidate all Dashboard data logic into `dashboard.service.ts`.
    3.  Standardize on a single pattern, preferably simple function-based services for tree-shakability and ease of testing.
    4.  Abstract the core `fetch` logic into a reusable `apiClient` that services can import.
    **Effort:** **L** (Large)

    ### 5. COMPONENT ARCHITECTURE
    **Current State:** A good separation exists between "smart" page components and "dumb" UI components in `src/components/ui`. However, logic is often duplicated across pages (e.g., data fetching, loading, and error state management in `useEffect`). Custom hooks for reusable logic are absent.
    **Enterprise Standard:** Reusable component logic should be extracted into custom hooks (e.g., `useProducts`, `useForm`, etc.). Smart components compose these hooks and pass data down to dumb presentational components.
    **Gap:** Lack of custom hooks leads to significant code duplication, especially for data fetching and state management. The form patterns are ad-hoc for each form.
    **Impact:** Violates the DRY (Don't Repeat Yourself) principle. Fixing a bug in one page's data fetching logic likely means it needs to be fixed in 10 other places.
    **Recommendation:** Once a server state library is introduced, create domain-specific custom hooks (`useProducts`, `usePurchaseOrders`) that encapsulate all fetching logic. For forms, create a standardized `useForm` hook or adopt a library like `react-hook-form` to manage form state, validation, and submission consistently.
    **Effort:** **M** (Medium)

    ### 6. ERROR HANDLING STRATEGY
    **Current State:** There is no global error boundary to prevent the entire app from crashing. Error handling is managed on a per-component basis within `try...catch` blocks inside `useEffect`. User-facing error messages are generic, and there are no recovery mechanisms like a "retry" button.
    **Enterprise Standard:** A multi-layered error handling strategy:
    1.  A global React Error Boundary to catch fatal rendering errors and display a fallback UI.
    2.  Service-layer handling to standardize API and network errors.
    3.  Component-level error states that are user-friendly and provide recovery options.
    **Gap:** The app is fragile and can easily crash. Users are given little information or recourse when something goes wrong.
    **Impact:** Poor user experience and low application resilience. A single failed API call on a dashboard could crash the entire application.
    **Recommendation:**
    1.  Implement a global Error Boundary in `App.tsx` or `main.tsx`.
    2.  Leverage the built-in error handling of a server state library to standardize handling of data-fetching errors.
    3.  Improve the `FormAlert` and other error UIs to display more contextual messages and, where appropriate, a retry button.
    **Effort:** **M** (Medium)

    ### 7. TYPE ARCHITECTURE
    **Current State:** All TypeScript types are located in a single, monolithic file: `src/types/mrp.types.ts`.
    **Enterprise Standard:** Types should be organized by domain, often co-located with the features they belong to. A clear distinction should be made between the shape of data received from the API (DTOs) and the shape of data used within the application (domain model).
    **Gap:** The monolithic type file is not scalable. It creates a high potential for merge conflicts and makes it difficult to understand the data model for a specific feature.
    **Impact:** As the application grows, this file will become a major source of friction and developer confusion. Refactoring will be difficult and risky.
    **Recommendation:** Decompose `mrp.types.ts`. Create domain-specific type files (e.g., `src/services/product.types.ts`). Within these files, explicitly define API DTOs (e.g., `ProductDTO`) and map them to the internal domain models (`Product`) within the service layer.
    **Effort:** **M** (Medium)

    ### 8. TESTING ARCHITECTURE
    **Current State:** Non-existent. There is no testing infrastructure, no test runner, no test files, and no clear strategy.
    **Enterprise Standard:** A balanced testing pyramid: a large base of unit tests (using Vitest/Jest + React Testing Library), a smaller layer of integration tests, and a few critical end-to-end tests (using Cypress/Playwright).
    **Gap:** 100% of the application is untested.
    **Impact:** CRITICAL RISK. Every change, no matter how small, has the potential to break the entire application. There is no way to refactor with confidence. The cost of manual testing will grow exponentially.
    **Recommendation:**
    1.  **Setup:** Add `vitest` and `@testing-library/react` to the project. Configure it within `vite.config.ts`.
    2.  **Prioritize:** Start by writing unit tests for critical services (data transformation logic) and complex UI components.
    3.  **Strategy:** Aim for unit tests on all new logic. Write integration tests for custom hooks created with a server state library (`useProducts`, etc.) to ensure they behave correctly.
    **Effort:** **L** (Large)

    ### 9. BUILD & DEPLOYMENT
    **Current State:** A basic Vite config is present. There is no evidence of environment management (dev vs. prod), no CI/CD pipeline for automated deployments, and no pre-commit hooks to enforce code quality.
    **Enterprise Standard:** A robust DevOps process including:
    -   Environment variable management (`.env` files) for configuration.
    -   A CI/CD pipeline (e.g., GitHub Actions) to automate linting, testing, building, and deploying.
    -   Pre-commit hooks (`husky` + `lint-staged`) to enforce code style and quality before code is even committed.
    **Gap:** The entire build, test, and deploy process is manual, slow, and error-prone.
    **Impact:** Inconsistent code quality, risky deployments, and a slow development cycle.
    **Recommendation:**
    1.  Implement a CI/CD pipeline using GitHub Actions.
    2.  Add `husky` and `lint-staged` to run ESLint on commit.
    3.  Use `.env` files to manage API endpoints and other environment-specific configurations.
    **Effort:** **L** (Large)

    ### 10. SCALABILITY ASSESSMENT
    **Current State:** The current architecture will not scale. Performing complex MRP calculations in the browser is a non-starter. Fetching the entire dataset for every page will quickly become unusable as product and PO counts grow beyond a few hundred.
    **Enterprise Standard:** Heavy computations are offloaded to a backend server. Data is fetched in paginated chunks. The frontend is kept as lean as possible, primarily focused on rendering UI state.
    **Gap:** The architecture is fundamentally designed for small-scale, client-side operation.
    **Impact:** The application will fail under a moderate load. Performance will degrade rapidly as data grows, leading to browser crashes and an unusable product.
    **Recommendation:**
    1.  **Backend MRP:** Any and all MRP calculations must be performed on the backend via an API call. The browser should only be responsible for displaying the results.
    2.  **Pagination:** Implement pagination for all lists (Products, POs, etc.). The API must support this, and the frontend should use a server state library feature like `useInfiniteQuery` or a paginated query to manage the data.
    3.  **Code Splitting:** Use `React.lazy()` with `react-router-dom` to split the application code by route, so users only download the JavaScript needed for the current page.
    **Effort:** **XL** (Extra Large)