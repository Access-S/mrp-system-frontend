# Security Audit — MRP System Frontend

**Standard:** "Would this pass a security review at Google/Microsoft?"  
**Scope:** `src/services`, `src/components`, `src/supabase.config.ts`, `index.html`, `vite.config.ts`, `package.json`, `render.yaml`  
**Assumption:** Attacker has found the application URL.

---

## Summary Table

| # | Severity | Category | Finding | File:Line | Recommendation |
|---|----------|----------|---------|-----------|----------------|
| 1 | 🔴 | Sensitive Data Exposure | **No authentication** — All API calls are unauthenticated. Anyone with the URL can read/update/delete POs, products, forecasts, SOH, and export all data. | `src/services/*.ts`, `api.service.ts` | Implement auth (e.g. Supabase Auth), send Bearer/API key in `Authorization` header; protect backend and enforce RLS. |
| 2 | 🔴 | Authentication & Authorization | **No route protection** — App uses internal page state, not URL-based routing with guards. Every "page" (dashboard, POs, forecasts, export, etc.) is reachable without login. | `App.tsx`, no `ProtectedRoute` | Add auth provider, wrap app or routes with auth check; redirect unauthenticated users to login. |
| 3 | 🔴 | Dependency Security | **12 known vulnerabilities** including **react-router** (XSS via Open Redirects, CSRF in Action processing, SSR XSS in ScrollRestoration), **xlsx** (Prototype Pollution, ReDoS — **no fix available**), **vite**, **rollup**, **minimatch**, **glob**, **ajv**, **diff**, **js-yaml**, **flatted**, **dompurify**. | `package.json`, `package-lock.json` | Run `npm audit`; apply `npm audit fix` where possible; replace or pin `xlsx` (e.g. use maintained fork or alternative); upgrade react-router to patched version; re-audit. |
| 4 | 🔴 | Sensitive Data Exposure | **Console logging of business and operational data** — API base URL, file names, PO numbers, customer names, amounts, search terms, record counts, import batch IDs, and error details are logged in production. | `api.service.ts:37`, `supabase.config.ts:20`, `purchaseOrder.service.ts` (multiple), `soh.service.ts`, `forecast.service.ts`, `dashboard.service.ts`, `ExcelImportModal.tsx:399`, `BarChart.tsx:39`, etc. | Remove or guard all `console.log`/`warn`/`error` with `import.meta.env.DEV`; never log PII, tokens, or internal IDs in production. |
| 5 | 🟠 | Sensitive Data Exposure | **Hardcoded production API URL** in source — `https://mrp-1.onrender.com/api` appears in `forecast.service.ts` and `dashboard.service.ts`. Bypasses env, leaks backend endpoint, and blocks env-based configuration. | `forecast.service.ts:55`, `dashboard.service.ts:38,50,58,186` | Use `import.meta.env.VITE_API_URL` (and apiClient) everywhere; remove all hardcoded backend URLs. |
| 6 | 🟠 | Content Security | **No CSP or security headers** — No Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, or similar headers configured in app or in `render.yaml`. | `index.html`, `render.yaml` | Configure CSP (e.g. via Render headers or meta); set X-Frame-Options: DENY, X-Content-Type-Options: nosniff; consider HSTS. |
| 7 | 🟠 | Supabase / Auth | **Supabase anon key in frontend** — Key is loaded via `VITE_SUPABASE_ANON_KEY`. This is standard for client apps but **security depends entirely on RLS**. No evidence of RLS policy review in frontend repo; if RLS is missing or permissive, data is exposed. | `supabase.config.ts:4-5,13` | Document and verify RLS on all Supabase tables; ensure no table is publicly readable/writable without auth; consider service role only on backend. |
| 8 | 🟠 | Input Validation | **Forecast file import has no client-side file type or size validation** before parsing with `XLSX.read()`. Malicious or huge files can cause DoS or unexpected behavior. | `forecast.service.ts:65-71` | Validate extension (.xlsx, .xls, .csv) and max size (e.g. 10MB) before `file.arrayBuffer()`/XLSX; align with SOH and ExcelImportModal. |
| 9 | 🟠 | Deployment / Config | **Production API URL committed in repo** — `render.yaml` contains `value: https://mrp-1.onrender.com/api`. Not a secret but ties deployment to that backend and can leak architecture. | `render.yaml:14-15` | Prefer Render dashboard env vars for secrets and URLs; use placeholder in YAML or document that this is intentional. |
| 10 | 🟠 | Dev / Debug | **Debug log in API client** — `console.log('🔗 API Base URL:', API_BASE_URL)` runs in all environments. Exposes backend URL to anyone with devtools. | `api.service.ts:37` | Remove or wrap in `if (import.meta.env.DEV)`. |
| 11 | 🟡 | XSS / DOM | **`innerHTML` used for theme styles** — `ThemeContext.tsx` sets `styleTag.innerHTML` from theme config (not user input). Low risk but violates "no innerHTML" defense-in-depth. | `ThemeContext.tsx:49` | Prefer injecting only sanitized/static CSS (e.g. CSSOM, or known-safe strings); avoid innerHTML when possible. |
| 12 | 🟡 | XSS / Open Redirect | **Breadcrumb accepts `href` from props** — If any parent passes user- or URL-controlled `item.href`, it could be `javascript:` or off-site redirect. | `Breadcrumb.tsx:125,207` | Validate/sanitize `href` (e.g. same-origin or allowlist); use `onClick` + navigation instead of raw `<a href={}>` for dynamic links. |
| 13 | 🟡 | Input Validation | **URL/search params sent to API** — `page`, `limit`, `search`, `status` in api.service are passed to backend. Frontend does not enforce bounds (e.g. max `limit`, max `search` length). | `api.service.ts:136-141` | Add client-side bounds and length limits; ensure backend validates and rate-limits to prevent abuse. |
| 14 | 🟡 | Data Handling | **Export is client-side and unauthenticated** — Any user who can load the app can call export (CSV/Excel/PDF) with whatever data the API returns. No access control on "who can export." | `export.service.ts`, pages that call it | Enforce auth and authorization; consider server-side export or signed URLs so only authorized roles can export bulk data. |
| 15 | 🟡 | Deployment | **Vite dev server exposes `0.0.0.0` and `secure: false` proxy** — Acceptable for local/Gitpod dev only; if ever used in production-like env, could increase attack surface. | `vite.config.ts:9,20` | Ensure this config is never used in production build; document dev-only; consider env-based server config. |
| 16 | 🟢 | Sensitive Data Exposure | **No credentials in repo** — `.env`, `.env.local`, `.env.production` are gitignored; no API keys or secrets in committed source. | `.gitignore` | Keep env files out of repo; use `.env.example` (no secrets) for documentation. |
| 17 | 🟢 | Sensitive Data Exposure | **No sensitive data in localStorage/sessionStorage** — No use of local/session storage for tokens or PII in audited code. | N/A | If auth is added, prefer httpOnly cookies or secure session storage with clear lifecycle. |
| 18 | 🟢 | XSS | **No `dangerouslySetInnerHTML`** — User-supplied content (e.g. search, PO number, customer name) is rendered via React; default escaping reduces XSS risk. | Components (e.g. POs, SOH, Forecasts) | Continue to avoid dangerouslySetInnerHTML for user input; sanitize if rich content is ever required. |
| 19 | 🟢 | Deployment | **Source maps** — Vite production build does not emit source maps by default (`build.sourcemap` is false). Reduces exposure of source in production. | `vite.config.ts` (default) | Explicitly set `build: { sourcemap: false }` if desired for clarity. |
| 20 | 🟢 | Transport | **API URL is HTTPS** — Production API base URL uses `https://`. Protects data in transit if backend enforces TLS. | `render.yaml`, hardcoded URLs | Ensure backend redirects HTTP to HTTPS and uses strong TLS. |

---

## 1. Sensitive Data Exposure

- **API keys / secrets:** None in source; Supabase URL and anon key come from env. Anon key in frontend is by design; security depends on RLS (see finding 7).
- **Credentials in config:** `.env*` are gitignored; `render.yaml` only sets `VITE_API_URL` (no secrets).
- **Console:** Extensive logging of API URL, file names, PO numbers, amounts, search terms, counts, and `import_batch_id` (findings 4, 10).
- **localStorage/sessionStorage:** Not used for secrets or PII (finding 17).
- **Supabase anon key:** Exposed to client; RLS must enforce access (finding 7).

---

## 2. XSS

- **dangerouslySetInnerHTML:** Not used (finding 18).
- **innerHTML:** Only in `ThemeContext` for theme CSS from code, not user input (finding 11).
- **URL parameters:** Search/params are built with `URLSearchParams`/`encodeURIComponent` and passed to API; React escapes when rendered (finding 13).
- **Breadcrumb href:** Accepts `href` from props; if ever user-controlled, could be open redirect or `javascript:` (finding 12).

---

## 3. Input Validation

- **API payloads:** `createPo` and `validatePoData` enforce required fields and basic rules; other endpoints rely on backend.
- **File uploads:** SOH validates extension (xlsx/xls/csv); ExcelImportModal validates extension and 10MB limit; **forecast import has no client-side type/size check** (finding 8).
- **Numeric/bounds:** No explicit client-side bounds (e.g. max `limit`, max `search` length) in api.service (finding 13).
- **SQL injection:** Not directly in frontend; backend must validate and parameterize.

---

## 4. Authentication & Authorization

- **Current state:** No login, no auth headers, no protected routes (findings 1, 2).
- **To add auth:** Introduce Supabase Auth (or equivalent); store session; send Bearer token in `Authorization` for API and Supabase; wrap app or routes with auth check and redirect to login; enforce RLS and backend checks.
- **Route protection:** App uses internal `activePage` state; all views are reachable without auth.
- **API:** No `Authorization` or `X-API-Key` in any service.
- **Supabase RLS:** Must be verified on backend/Supabase; frontend repo does not define policies.

---

## 5. Dependency Security

- **npm audit:** 12 vulnerabilities (1 low, 5 moderate, 6 high). Notable: **react-router** (XSS, CSRF), **xlsx** (Prototype Pollution, ReDoS — no fix), **vite**, **rollup**, **minimatch**, **glob**, **ajv**, **diff**, **js-yaml**, **flatted**, **dompurify** (finding 3).
- **Action:** Run `npm audit` and `npm audit fix`; replace or isolate `xlsx`; upgrade react-router; re-run audit and CI checks.

---

## 6. Content Security

- **CSP:** Not configured in `index.html` or `render.yaml` (finding 6).
- **Inline scripts:** Only `<script type="module" src="/src/main.tsx">` in index.html; no inline script bodies.
- **External resources:** Supabase and backend API; no CSP to restrict.
- **CORS:** Handled by backend; not configured in frontend.

---

## 7. Data Handling

- **Business/financial data:** POs, amounts, customer names, forecasts, SOH are sent over HTTPS but **without authentication**; anyone with the app URL can read/change data (findings 1, 14).
- **Export:** Client-side CSV/Excel/PDF; any user who can load data can export it; no role-based export control (finding 14).
- **Retention/deletion:** Not implemented in frontend; backend/DB policy.

---

## 8. Deployment Security

- **Source maps:** Not emitted in production by default (finding 19).
- **Environment variables:** `VITE_API_URL` in render.yaml; Supabase vars must be set in Render dashboard for production.
- **HTTPS:** Production API URL is HTTPS (finding 20); ensure backend enforces TLS.
- **Security headers:** Not set in app or in `render.yaml` (finding 6).
- **Vite dev server:** `host: '0.0.0.0'`, `secure: false` in proxy — dev only (finding 15).

---

## Priority Recommendations

1. **Critical:** Add authentication and authorization; protect all API calls and routes; verify Supabase RLS.
2. **Critical:** Remove or gate all production console logging; fix dependency vulnerabilities (especially react-router and xlsx).
3. **High:** Remove hardcoded API URLs; use `VITE_API_URL` everywhere; add CSP and security headers.
4. **High:** Add client-side file type and size validation for forecast import; validate and bound API query parameters.
5. **Medium:** Harden Breadcrumb href usage; avoid innerHTML in ThemeContext; document and enforce RLS and export access control.

---

*Audit date: 2025-03-14. Re-audit after auth, dependency updates, and header/CSP deployment.*
