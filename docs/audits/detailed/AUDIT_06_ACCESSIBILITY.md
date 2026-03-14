# AUDIT 06: Accessibility (WCAG 2.1 AA)

**Standard:** "Would this pass an accessibility review at Google/Microsoft?"  
**Scope:** Frontend components (ui, pages, forms, modals, dialogs, tabs, Sidebar, dashboard, App.tsx, index.html)  
**Date:** 2025-03-14

---

## Summary

| Severity | Count |
|----------|--------|
| 🔴 Critical | 18 |
| 🟠 High | 24 |
| 🟡 Medium | 22 |
| 🟢 Low | 8 |
| **Total** | **74** |

---

## Findings Table

| # | Severity | Category | Component | Finding | WCAG Criterion | Fix |
|---|----------|----------|-----------|--------|----------------|-----|
| 1 | 🔴 | ARIA & Semantic HTML | **Input** | Label not programmatically associated with input: no `htmlFor` on `<label>` and no `id` on `<input>`. | 1.3.1 Info and Relationships, 4.1.2 Name, Role, Value | Add `id` to input (e.g. `useId()` or prop), set `label htmlFor={id}`. |
| 2 | 🔴 | ARIA & Semantic HTML | **Input** | Error/helper text not associated with input; screen readers won't announce validation state. | 3.3.1 Error Identification, 4.1.2 | Add `aria-describedby` to input pointing to id of helper/error element; use `aria-invalid` when `error` is true. |
| 3 | 🔴 | ARIA & Semantic HTML | **Input** | Required state not exposed: no `aria-required="true"` when required. | 4.1.2 | Pass through `aria-required` or set from `required` prop on the input. |
| 4 | 🔴 | Keyboard | **App** | No skip navigation link; keyboard users must tab through entire sidebar to reach main content. | 2.1.1 Keyboard, 2.4.1 Bypass Blocks | Add a "Skip to main content" link as first focusable element, target `#main` or main content container with `tabIndex={-1}` and focus on skip click. |
| 5 | 🔴 | Keyboard | **Dialog** | Focus not trapped inside dialog when open; Tab can leave the dialog. | 2.1.2 No Keyboard Trap, 2.4.3 Focus Order | Implement focus trap (e.g. focus-trap-react or manual: query focusable nodes, trap Tab/Shift+Tab, focus first on open). |
| 6 | 🔴 | Keyboard | **Dialog** | Focus not returned to trigger element when dialog closes. | 2.4.3 Focus Order | Store `document.activeElement` before open, restore focus in `onClose` after unmount. |
| 7 | 🔴 | Keyboard | **Menu (ui)** | Menu trigger is a `<div>` with `onClick`; not focusable via Tab, not keyboard activatable. | 2.1.1 Keyboard | Use `<button>` for trigger or add `tabIndex={0}`, `role="button"`, and `onKeyDown` (Enter/Space) to open/close. |
| 8 | 🔴 | Keyboard | **Drawer (ui)** | When `customTrigger` is used, a `<div onClick={onToggle}>` is used; not focusable or keyboard operable. | 2.1.1 Keyboard | Use a button for customTrigger or wrap in button; ensure focusable and Enter/Space activate. |
| 9 | 🔴 | Keyboard | **WidgetCard** | Root is a `<div>` with `onClick` when `onClick` prop provided; not focusable, not keyboard accessible. | 2.1.1 Keyboard | Use `<button type="button">` or make div focusable with `tabIndex={0}`, `role="button"`, and Enter/Space handler. |
| 10 | 🔴 | Keyboard | **KPICard** | Card is a clickable `<div>` with `onClick`; not focusable via Tab, no keyboard support. | 2.1.1 Keyboard | If interactive, use button or link; add `tabIndex={0}`, `role="button"`, and keyboard handler, or make non-interactive. |
| 11 | 🔴 | Forms | **Input** | Same as #1–3: label/error/required not programmatically tied to control. | 3.3.2 Labels or Instructions | Apply fixes from #1–3. |
| 12 | 🔴 | Dynamic Content | **App** | `document.title` never updated on page/route change; screen reader users don't hear page changes. | 2.4.2 Page Titled | Update `document.title` when `activePage` (or route) changes (e.g. from `pageTitles` map). |
| 13 | 🔴 | Dynamic Content | **Dialog** | Modal open/close not announced to screen readers. | 4.1.3 Status Messages | Add `aria-live="polite"` region that announces "Dialog opened" / "Dialog closed" or use a live region with `role="status"`. |
| 14 | 🔴 | Dynamic Content | **FormAlert** | Form submission errors shown in Alert are not in a live region; screen readers may miss them. | 3.3.1 Error Identification, 4.1.3 | Ensure Alert has `role="alert"` or is inside an `aria-live="assertive"` region so errors are announced. |
| 15 | 🔴 | Images & Media | **Toast** | Close button is icon-only (X) with no `aria-label`. | 4.1.2 Name, Role, Value | Add `aria-label="Dismiss"` or "Close notification" to the close button. |
| 16 | 🔴 | Images & Media | **DatePicker** | Previous/next month buttons are icon-only with no accessible name. | 1.1.1 Non-text Content, 4.1.2 | Add `aria-label="Previous month"` and `aria-label="Next month"` to the two buttons. |
| 17 | 🔴 | Responsive & Touch | **Pagination** | `sm` size uses `min-w-[28px]` and `h-7` (28px); below 44×44px touch target. | 2.5.5 Target Size | Use minimum 44×44px for touch (e.g. `min-h-[44px] min-w-[44px]` for sm) or provide a control to increase size. |
| 18 | 🔴 | Responsive & Touch | **Sidebar / App** | Many icon buttons (back, hamburger, etc.) are 40×40px (`h-10 w-10`); below 44×44px. | 2.5.5 Target Size | Increase touch target to at least 44×44px (e.g. `min-h-[44px] min-w-[44px]` and padding). |
| 19 | 🟠 | ARIA & Semantic HTML | **Button** | `focus:outline-none` removes focus outline with no visible replacement; focus indicator missing or weak. | 2.4.7 Focus Visible | Add `focus-visible:ring-2 focus-visible:ring-offset-2` (or equivalent) with sufficient contrast; do not rely on outline-none alone. |
| 20 | 🟠 | ARIA & Semantic HTML | **Input** | Same as #19: `focus:outline-none` without guaranteed visible focus ring. | 2.4.7 Focus Visible | Add focus-visible ring with 3:1 contrast against background. |
| 21 | 🟠 | ARIA & Semantic HTML | **Select** | Combobox trigger has no `aria-labelledby` linking to the visible label; label has no `id` for association. | 4.1.2 Name, Role, Value | Add `id` to label (e.g. from useId), set trigger `aria-labelledby={labelId}`. |
| 22 | 🟠 | ARIA & Semantic HTML | **Select** | Listbox options not exposed to AT as focused; no `aria-activedescendant` on combobox for highlighted option. | 4.1.2 | Set `aria-activedescendant={options[highlightedIndex]?.id}` on trigger and add `id` to each option element when open. |
| 23 | 🟠 | ARIA & Semantic HTML | **Accordion** | Content uses `aria-labelledby="accordion-trigger-${id}"` but trigger button has no `id`; reference is broken. | 1.3.1, 4.1.2 | Add `id={\`accordion-trigger-${id}\`}` to the AccordionTrigger button. |
| 24 | 🟠 | ARIA & Semantic HTML | **Tooltip** | Tooltip content uses static `id="tooltip"`; multiple tooltips on page cause duplicate IDs. | 4.1.2 | Use unique id per tooltip instance (e.g. `useId()` or prop) for both tooltip element and trigger `aria-describedby`. |
| 25 | 🟠 | ARIA & Semantic HTML | **Table (TableHead)** | Sortable column uses `<th onClick>`; not a button, no keyboard support, no `aria-sort`. | 4.1.2, 2.1.1 | Use `<button>` inside th or make th focusable with role and keyboard handler; set `aria-sort="ascending"|"descending"|"none"`. |
| 26 | 🟠 | ARIA & Semantic HTML | **Sidebar** | Drawer toggle shows X when open, Bars when closed; single `aria-label="Open sidebar"` is incorrect when open. | 4.1.2 | Use dynamic `aria-label={isDrawerOpen ? "Close sidebar" : "Open sidebar"}`. |
| 27 | 🟠 | ARIA & Semantic HTML | **Sidebar** | Brand image uses `alt="brand"`; not descriptive. | 1.1.1 Non-text Content | Use descriptive alt e.g. "Dashboard logo" or "Company logo". |
| 28 | 🟠 | ARIA & Semantic HTML | **Sidebar** | "Profile", "Log Out", "Privacy" list items: Log Out is interactive but has no role/aria; Profile/Privacy may be non-interactive. | 4.1.2 | Use `<button>` or `<a>` for Log Out with accessible name; clarify Profile/Privacy (link or button with aria-label). |
| 29 | 🟠 | ARIA & Semantic HTML | **App** | Back button (ArrowLeftIcon) in navbar has no `aria-label`. | 4.1.2 | Add `aria-label="Back to [context]"` (e.g. "Back to Products"). |
| 30 | 🟠 | ARIA & Semantic HTML | **App** | Breadcrumb "Products" / "Purchase Orders" are `<span>` with `onClick`; not keyboard focusable or semantic link. | 2.1.1, 4.1.2 | Use `<button>` or `<a>` for clickable breadcrumb segments; ensure focusable and keyboard activatable. |
| 31 | 🟠 | ARIA & Semantic HTML | **DatePicker** | Trigger is `<div role="button">`; native `<button>` preferred for semantics and keyboard. | 4.1.2 | Prefer `<button type="button">` for the trigger; keep tabIndex and keyboard handler if staying with div. |
| 32 | 🟠 | ARIA & Semantic HTML | **DatePicker** | "Today" button has no `aria-label`; context is clear but explicit label improves AT. | 4.1.2 | Add `aria-label="Set to today's date"` (optional but recommended). |
| 33 | 🟠 | ARIA & Semantic HTML | **Select** | Loading spinner in trigger has no `aria-hidden` or `aria-busy`; trigger should expose loading state. | 4.1.2 | Add `aria-busy={loading}` on trigger; mark spinner decorative with `aria-hidden="true"`. |
| 34 | 🟠 | Forms | **Select** | Label and helper text not associated with combobox via ids. | 3.3.2 Labels or Instructions | Same as #21; add id to label and `aria-labelledby`; optionally `aria-describedby` for helper. |
| 35 | 🟠 | Forms | **DatePicker** | Required indicator (*) present but trigger has no `aria-required`; helper/error not `aria-describedby`. | 3.3.2, 4.1.2 | Set `aria-required={required}` on trigger; add `aria-describedby` for helper/error and `aria-invalid` when error. |
| 36 | 🟠 | Forms | **CreateProductForm / EditProductForm etc.** | Material Tailwind Input/Dialog usage: ensure each field has visible label and programmatic association (id/htmlFor); verify from library. | 3.3.2 | Audit MT Input for id/htmlFor and aria-describedby; add wrapper ids if library doesn’t. |
| 37 | 🟠 | Dynamic Content | **ToastContainer** | Toasts use `role="alert"`; ensure container doesn’t interfere (e.g. redundant live region). No explicit `aria-live` on container. | 4.1.3 | Keep role="alert" on each toast; ensure only one toast region or sequential announcements work with AT. |
| 38 | 🟠 | Dynamic Content | **Spinner** | Loading overlay/spinner state not announced when replacing content (e.g. table loading). | 4.1.3 | Add `aria-live="polite"` region that announces "Loading" when spinner is shown, or ensure Spinner has aria-label (already has) and is in a live region. |
| 39 | 🟠 | Images & Media | **Dashboard charts (BarChart, etc.)** | Charts (ApexCharts) have no text alternative (summary or data table) for screen reader users. | 1.1.1 Non-text Content | Add a brief `aria-label` or `role="img"` with `aria-label` describing the chart, or link to/layout a text summary or data table. |
| 40 | 🟠 | Images & Media | **KPICard** | Sparkline (chart) has no text alternative. | 1.1.1 | Provide aria-label on sparkline container or adjacent text that conveys the same info. |
| 41 | 🟠 | Color & Contrast | **Focus indicators** | Multiple components use `focus:ring-2` with gray/blue; contrast of focus ring against all themes (classic, sunset, dark) not verified. | 2.4.7 Focus Visible | Audit focus ring color in all three themes; ensure ≥3:1 against background. |
| 42 | 🟠 | index.html | **Document** | Page title is "Vite + React + Tailwind + TS"; not application name. | 2.4.2 Page Titled | Set `<title>` to application name (e.g. "MRP System" or product name). |
| 43 | 🟡 | ARIA & Semantic HTML | **Dialog** | When `title` is absent, dialog has no `aria-labelledby`; second close button (top-right) has no accessible name in that variant. | 4.1.2 | When no title, require `aria-label` on dialog or add `aria-labelledby` to a hidden heading; ensure close button always has aria-label (already "Close dialog"). |
| 44 | 🟡 | ARIA & Semantic HTML | **Pagination** | Ellipsis ("...") is a `<span>`; should be marked decorative so AT doesn’t read "dot dot dot". | 1.1.1 | Add `aria-hidden="true"` to the ellipsis span. |
| 45 | 🟡 | ARIA & Semantic HTML | **Menu** | Menu content has `role="menu"` but no focus trap; Tab can leave menu. | 2.1.2 | Trap focus within menu when open (roving tabindex or focus trap), and close on Escape (already). |
| 46 | 🟡 | ARIA & Semantic HTML | **Sidebar** | Theme list item (radio-like) uses custom divs; no `role="radio"`, `aria-checked`, or `role="radiogroup"`/`aria-label` on group. | 4.1.2 | Use `role="radiogroup"` on container with `aria-label="Theme"`, and `role="radio"` with `aria-checked` on each option. |
| 47 | 🟡 | Keyboard | **Tabs** | Tab buttons have no visible focus style (focus-visible ring). | 2.4.7 | Add `focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2` or equivalent. |
| 48 | 🟡 | Keyboard | **Pagination** | Buttons use `focus:outline-none focus:ring-2`; ensure ring is visible (focus-visible) and has contrast. | 2.4.7 | Prefer `focus-visible:ring-2` so focus only shows for keyboard; verify contrast. |
| 49 | 🟡 | Keyboard | **DatePicker** | Calendar grid: no Arrow-key navigation between dates; only Enter/Space on trigger and Escape to close. | 2.1.1 | Implement roving tabindex or arrow keys to move between dates and select (e.g. arrow to move, Enter to select). |
| 50 | 🟡 | Forms | **ConfirmationDialog** | Uses Material Tailwind Dialog; verify focus trap and return focus. | 2.1.2, 2.4.3 | Test with keyboard; if MT Dialog doesn’t trap/return focus, wrap with focus-trap and save/restore activeElement. |
| 51 | 🟡 | Forms | **CreateProductForm / EditPoForm etc.** | Form validation errors (e.g. "Product Code is required") not tied to field via `aria-describedby` and `aria-invalid`. | 3.3.1 | On validation error, set `aria-invalid="true"` and `aria-describedby` to the error message id on the relevant input. |
| 52 | 🟡 | Color & Contrast | **StatusBadge** | Status conveyed by color + text; dot is additional. Ensure text is never removed and contrast is sufficient in all themes. | 1.4.1 Use of Color, 1.4.3 Contrast | Audit badge text contrast in classic/sunset/dark; ensure status is not conveyed by color alone. |
| 53 | 🟡 | Dynamic Content | **ProductsPage / Tables** | When switching to "loading" state (Spinner), table content is replaced without announcement. | 4.1.3 | Add `aria-live="polite"` region that announces "Loading" when spinner is visible, or ensure loading state is announced. |
| 54 | 🟡 | Dynamic Content | **PurchaseOrdersPage / Data tables** | Data updates (sort, filter, pagination) not announced to screen readers. | 4.1.3 | After sort/filter/page change, announce briefly via `aria-live="polite"` (e.g. "Sorted by date", "Page 2 of 5"). |
| 55 | 🟡 | Responsive & Touch | **Various** | Icon-only buttons (Dialog close, Toast close, etc.) often use `p-1.5`; touch target may be under 44px. | 2.5.5 Target Size | Use `min-width`/`min-height` 44px and padding to ensure 44×44px touch target. |
| 56 | 🟡 | Responsive & Touch | **Tables** | Horizontal scroll on small screens: ensure scrollable container has focusable element and doesn’t trap focus. | 2.1.1, 2.4.3 | Use `overflow-x-auto` with proper focus order; consider `aria-label` on scroll container if needed. |
| 57 | 🟢 | ARIA & Semantic HTML | **Accordion** | AccordionTrigger is a button with aria-expanded and aria-controls; good. Content region needs correct id on trigger (see #23). | — | Fix #23. |
| 58 | 🟢 | ARIA & Semantic HTML | **Breadcrumb** | Nav has `aria-label="Breadcrumb"`, Home has `aria-label`, ellipsis button has `aria-label`; structure is good. | — | None. |
| 59 | 🟢 | ARIA & Semantic HTML | **Pagination** | Navigation has `aria-label="Pagination"`, buttons have descriptive `aria-label`, current page has `aria-current="page"`. | — | None. |
| 60 | 🟢 | Semantic HTML | **App** | Main content is in `<main>`; good landmark. | — | None. |
| 61 | 🟢 | index.html | **Document** | `lang="en"` is set on `<html>`; good. | — | None. |
| 62 | 🟢 | Forms | **Input** | Label and helper text are present visually; only programmatic association missing (see #1–3). | — | Apply #1–3. |
| 63 | 🟢 | Images & Media | **EmptyState** | Icons are decorative in context of title/description; consider `aria-hidden="true"` on icon container. | 1.1.1 | Add `aria-hidden="true"` to decorative icon wrapper. |
| 64 | 🟢 | Responsive & Touch | **Viewport** | `meta name="viewport"` is present in index.html. | — | None. |
| 65 | 🟡 | ARIA & Semantic HTML | **WidgetCard MiniActionButton** | Optional `aria-label`; when used as icon-only, must be provided by consumer. | 4.1.2 | Document that icon-only MiniActionButton requires `aria-label`; consider requiring it when only icon is passed. |
| 66 | 🟡 | Keyboard | **Select** | Listbox options are not focusable (no tabIndex); focus stays on trigger. Arrow keys change highlightedIndex; ensure AT announces option (aria-activedescendant). | 4.1.2 | Implement aria-activedescendant on trigger (see #22). |
| 67 | 🟡 | Forms | **Material Tailwind Input** | Forms using MT Input: verify each instance has associated label (for/id or aria-labelledby). | 3.3.2 | Audit all MT Input usages; add id/htmlFor or aria-labelledby where missing. |
| 68 | 🟡 | Dynamic Content | **react-hot-toast (ToasterPortal)** | Legacy toaster: ensure toasts are announced (role="alert" or live region). | 4.1.3 | If react-hot-toast doesn’t use role=alert, wrap in aria-live region or migrate to custom Toast (which has role=alert). |
| 69 | 🟢 | ARIA & Semantic HTML | **Tabs** | Uses `role="tablist"`, `role="tab"`, `aria-selected`, `aria-disabled`; structure is correct. | — | Add focus-visible only (#47). |
| 70 | 🟢 | ARIA & Semantic HTML | **Toast** | Single toast has `role="alert"`; good for live announcement. | — | Add close button aria-label (#15). |
| 71 | 🟡 | Responsive & Touch | **Drawer (Material Tailwind)** | Sidebar drawer on mobile: ensure drawer content is scrollable and focus is manageable when open. | 2.1.2 | Verify MT Drawer traps focus and that scroll doesn’t trap keyboard users. |
| 72 | 🟡 | Color & Contrast | **StatusBadge dot** | Dot indicates status with color only; status name text is present so not color-alone, but dot alone is redundant. | 1.4.1 | Optional: add aria-hidden to dot when status text is present. |
| 73 | 🟠 | Images & Media | **PurchaseOrdersPage** | PO row actions menu trigger is icon-only (EllipsisVerticalIcon) with no aria-label. | 4.1.2 | Add aria-label="Open actions menu" to the trigger button. |
| 74 | 🟡 | Images & Media | **UITestPage** | Icon-only buttons (e.g. ghost Button with only EyeIcon) have no aria-label. | 4.1.2 | Add aria-label to all icon-only buttons in test/demo pages. |

---

## Recommendations

1. **Priority 1 (Critical):** Implement skip link, dialog focus trap and return focus, fix all label/input and error/required associations (Input, Select, DatePicker), fix non-focusable interactive elements (Menu trigger, Drawer customTrigger, WidgetCard, KPICard), document.title updates, and touch target minimums (44px).
2. **Priority 2 (High):** Add visible focus indicators (focus-visible) across Button, Input, Tabs, Pagination; fix Select aria-labelledby and aria-activedescendant; fix Accordion trigger id and Tooltip duplicate id; improve Table sort accessibility; fix Sidebar and App navbar labels and semantics; add chart and icon-button accessible names.
3. **Priority 3 (Medium):** Theme radiogroup semantics, Pagination ellipsis aria-hidden, Menu focus trap, DatePicker calendar keyboard nav, form error association, live regions for loading and data updates, contrast audit for focus rings and StatusBadge.
4. **Testing:** Run axe-core (browser extension or jest-axe), NVDA/JAWS on key flows (login, create PO, create product, view tables, modals, toasts). Test with keyboard only and with resize/zoom for touch and responsive.

---

*End of audit.*
