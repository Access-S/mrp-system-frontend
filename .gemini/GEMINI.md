# MRP System Frontend

## Project Context
This is a Manufacturing Resource Planning (MRP) system frontend.
See docs/prd.md for full product requirements.
See docs/audits/ for audit reports.

## Skills
Load skills from: ~/.gemini/antigravity/skills/

## Coding Standards
- TypeScript strict mode — no `any` types
- React functional components only
- TailwindCSS for styling — use theme tokens, never hardcode colors
- All API calls through apiClient in src/services/api.service.ts
- All types defined in src/types/mrp.types.ts
- Import UI components from src/components/ui/
