# AUDIT 08: Dependency Audit

**Audit Date:** 2024-07-25
**Auditor:** Senior Principal Engineer (Gemini)
**Standard:** "Would this pass code review at Google/Microsoft?"

## Executive Summary

This audit identifies significant dependency bloat, security risks, and maintenance concerns. The project has **17 dependencies** and **17 devDependencies**. Several packages are either completely unused or have better, lighter alternatives. Critical vulnerabilities exist in packages like `xlsx` and `react-router-dom` (even though it's unused). The heavy `@material-tailwind/react` library is a major contributor to bundle size and should be removed.

Immediate action is required to remove unused packages, update vulnerable ones, and replace heavy libraries with more performant, modern alternatives. This will drastically reduce bundle size, improve security posture, and increase maintainability.

---

## Dependency Audit Findings

### Production Dependencies

| Package | Version | Used? | Latest? | Maintained? | Duplicates? | Bundle Impact | Security | Action |
|---|---|---|---|---|---|---|---|---|
| **@floating-ui/react** | `^0.27.15` | **Yes** | 0.26.16 | ✅ Yes | No | Medium | ✅ None | **KEEP** (but will be removed with Material Tailwind) |
| **@heroicons/react** | `2.2.0` | **Yes** | 2.1.3 | ✅ Yes | No | Low | ✅ None | **KEEP** |
| **@material-tailwind/react** | `2.1.10` | **Yes** | 2.1.9 | ⚠️ Questionable | Yes (custom UI) | **Very High** | ✅ None | **REMOVE**. Being replaced by custom UI components. |
| **@supabase/supabase-js** | `^2.55.0` | **Yes** | 2.43.4 | ✅ Yes | No | Medium | ✅ None | **KEEP** |
| **apexcharts** | `^5.6.0` | **Yes** | 3.49.1 | ✅ Yes | No | High | ✅ None | **KEEP** |
| **clsx** | `^2.1.1` | **Yes** | 2.1.1 | ✅ Yes | No | Low | ✅ None | **KEEP** |
| **file-saver** | `^2.0.5` | **Yes** | 2.0.5 | ⚠️ No (8 yrs) | No | Low | ✅ None | **REPLACE** with native browser APIs. |
| **jspdf** | `^4.2.0` | **Yes** | 2.5.1 | ✅ Yes | No | High | ✅ None | **KEEP** |
| **jspdf-autotable** | `^5.0.7` | **Yes** | 3.8.2 | ✅ Yes | No | Medium | ✅ None | **KEEP** |
| **react** | `^19.0.0` | **Yes** | 19.0.0-beta | ✅ Yes | No | Core | ✅ None | **DOWNGRADE** to latest stable (18.3.1). |
| **react-apexcharts** | `^2.0.1` | **Yes** | 1.4.1 | ✅ Yes | No | Low | ✅ None | **KEEP** |
| **react-dom** | `^19.0.0` | **Yes** | 19.0.0-beta | ✅ Yes | No | Core | ✅ None | **DOWNGRADE** to latest stable (18.3.1). |
| **react-flatpickr** | `^4.0.11` | ⛔️ **No** | 3.10.13 | ✅ Yes | Yes (DatePicker) | Medium | ✅ None | **REMOVE** |
| **react-hot-toast** | `^2.5.2` | ⚠️ **Yes (legacy)** | 2.4.1 | ✅ Yes | Yes (custom Toast) | Medium | ✅ None | **REMOVE**. Being replaced by custom Toast system. |
| **react-router-dom** | `^7.11.0` | ⛔️ **No** | 6.23.1 | ✅ Yes | No | High | 🔴 **Yes (XSS)** | **REMOVE** |
| **use-debounce** | `^10.0.5` | **Yes** | 10.0.1 | ✅ Yes | No | Low | ✅ None | **KEEP** |
| **xlsx** | `^0.18.5` | **Yes** | 0.18.5 | ⚠️ **No** | No | **Very High** | 🔴 **Yes (CVEs)** | **REPLACE**. Community edition is not maintained. |

### Development Dependencies

All devDependencies appear to be correctly categorized and are standard for a Vite + TypeScript + React project. No major issues found, aside from `@types/react-flatpickr` which can be removed.

| Package | Version | Correctly Placed? | Notes | Action |
|---|---|---|---|---|
| **@types/file-saver** | `^2.0.7` | ✅ Yes | Type definitions for `file-saver`. | Remove when `file-saver` is replaced. |
| **@types/react** | `^19.1.8` | ✅ Yes | Type definitions for React. | Downgrade with React. |
| **@types/react-dom** | `^19.1.6` | ✅ Yes | Type definitions for React DOM. | Downgrade with React DOM. |
| **@types/react-flatpickr** | `^3.8.11` | ✅ Yes | Type definitions for `react-flatpickr`. | **REMOVE**. |
| **... (other dev deps)** | | ✅ Yes | Standard build/linting tools. | **KEEP**. |

---

## Analysis & Recommendations

*   **Total Dependency Count:** 34 (17 prod, 17 dev)
*   **Estimated Unused Dependency Weight:** ~500KB+ (uncompressed)
*   **Top 5 Heaviest Dependencies by Bundle Size:**
    1.  `xlsx` (~2MB)
    2.  `apexcharts` (~1.5MB)
    3.  `@material-tailwind/react` (~500KB)
    4.  `react-router-dom` (~100KB)
    5.  `jspdf` (~200KB)

### Recommended Removals (High Priority)
1.  **`react-router-dom`**: Not used. Manual routing is handled in `App.tsx`. **Immediate removal.**
2.  **`react-flatpickr` & `@types/react-flatpickr`**: Not imported anywhere. **Immediate removal.**
3.  **`react-hot-toast`**: A custom `Toast` system has been built. The legacy `react-hot-toast` implementation should be fully migrated and this package removed.
4.  **`@material-tailwind/react`**: This is a heavy library and a custom component library is already in progress. Prioritize full migration to custom components and remove this dependency.
5.  **`file-saver`**: This can be replaced with a few lines of code using native Blob/<a> tag download functionality, removing a dependency that has not been updated in years.

### Recommended Upgrades & Replacements
1.  **`xlsx`**: **CRITICAL SECURITY RISK.** The community edition (`xlsx`) has known vulnerabilities (CVEs) and is not receiving security patches. Replace immediately with a maintained fork like `sheetjs-style` or a modern alternative like `exceljs`.
2.  **`react` / `react-dom`**: Currently on a beta version (`19.0.0`). This is unstable for production. Downgrade to the latest stable version (`^18.3.1`).

### Dependency Swaps
- **Dependencies in devDependencies:** None found.
- **devDependencies in Dependencies:** None found.

### Native Browser API Replacements
- **`file-saver`**: Can be replaced with a simple utility function:
  ```typescript
  function saveAs(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  ```
