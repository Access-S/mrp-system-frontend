# 🤖 AI Code Assistant Rules

> **Purpose:** Standard guidelines for AI assistants working on this codebase.  
> **Version:** 2.0  
> **Last Updated:** March 2026

---

## 📚 Project Context

| Detail           | Frontend                          | Backend                          |
|------------------|-----------------------------------|----------------------------------|
| **Repo**         | mrp-system-frontend               | mrp-system-backend               |
| **Framework**    | React 18 + Vite                   | Node.js + Express                |
| **Language**     | TypeScript (strict)               | TypeScript (strict)              |
| **Database**     | —                                 | Supabase (PostgreSQL)            |
| **Styling**      | Tailwind CSS                      | —                                |
| **Deployment**   | Render                            | Render                           |
| **UI Library**   | Custom component library (src/components/ui/) | —                   |

### Key Documentation Locations
- **Frontend Docs:** `docs/` (organized into product/, architecture/, specifications/, audits/)
- **Backend Docs:** `database/` (current-schema/, diagrams/, changelog/)
- **Project Structure:** Run `bash update-structure.sh` to regenerate
- **ER Diagram:** `database/diagrams/er-diagram.md`
- **App Flow:** `docs/diagrams/app-flow.md`

---

## 📌 Rule 1: Git Commands Required

Always provide proper git commands after **every** code suggestion or file update.

**Required Format:**

```bash
git add <specific-files>
git commit -m "type: descriptive commit message"
git push origin <branch-name>

Commit Message Types:

Type	Usage
feat	New feature
fix	Bug fix
refactor	Code restructuring
style	Formatting, styling changes
docs	Documentation updates
chore	Maintenance tasks
test	Adding or updating tests
perf	Performance improvements

Example:
git add src/components/ui/Button.tsx
git commit -m "feat: increase ripple animation duration to 1000ms"
git push origin feature/ui-components

📌 Rule 2: Branch Awareness
Never assume the target branch is main
If branch is unknown → Ask the user before providing git commands
If branch is confirmed → Remember and reuse until user changes it
If branch change requested → Update immediately and confirm with user

❌ WRONG: git push origin main
✅ RIGHT: "Which branch should I push to?"
✅ RIGHT: git push origin <confirmed-branch-name>
📌 Rule 3: Code Block Updates
When suggesting code updates — even for a single line change:

Clearly state the file path being updated
Identify the block number being modified
Provide the complete updated block (not just the changed line)
Format:
📁 File: `src/components/ui/Button.tsx`
📦 Block 3 of 5 — Update Required

[Complete block code here]

📌 Rule 4: New File Creation
When writing new files:

Include relative path as a comment at the top of the file
Divide code into logical, numbered blocks
Use clear block separators for easy navigation
Block Separator Format:

// ============== BLOCK 1: Imports ==============

// ============== BLOCK 2: Types & Interfaces ==============

// ============== BLOCK 3: Constants ==============

// ============== BLOCK 4: Component ==============

// ============== BLOCK 5: Exports ==============

📌 Rule 5: TypeScript Standards
Never Use

❌ any
❌ @ts-ignore
❌ @ts-nocheck
❌ as any
❌ Non-null assertions (!) unless absolutely justified

Always Use
✅ Proper types and interfaces
✅ Generic types where appropriate
✅ Type imports: import type { Product } from '../types/mrp.types'
✅ Return types on functions
✅ Readonly where data shouldn't be mutated

Type Definitions
All shared types go in src/types/mrp.types.ts (frontend)
Define interfaces for all API request/response shapes
Use Pick<>, Omit<>, Partial<> instead of duplicating types
// ✅ Good
interface Product {
  id: string;
  product_code: string;
  description: string;
}

type CreateProductInput = Omit<Product, 'id'>;
type ProductSummary = Pick<Product, 'id' | 'product_code'>;

// ❌ Bad
const data: any = await response.json();

📌 Rule 6: React Component Patterns (Frontend)
Component Structure
// ============== BLOCK 1: Imports ==============
import { useState } from 'react';
import type { Product } from '../../types/mrp.types';

// ============== BLOCK 2: Types ==============
interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
}

// ============== BLOCK 3: Component ==============
export const ProductCard = ({ product, onEdit }: ProductCardProps) => {
  // hooks first
  const [isOpen, setIsOpen] = useState(false);

  // handlers
  const handleEdit = () => onEdit(product.id);

  // render
  return (
    <div>...</div>
  );
};

Rules
Use functional components only (no class components)
Use named exports (not default exports)
Props must have a TypeScript interface
Hooks at the top of the component
Handlers prefixed with handle (e.g., handleSubmit, handleDelete)
Keep components under 200 lines — split if larger
Memoize expensive computations with useMemo
Memoize callbacks passed to children with useCallback
UI Components
Custom UI components are in src/components/ui/
Each UI component has its own folder with ComponentName.tsx + index.ts
Always use existing UI components before creating new ones
Check src/components/ui/index.ts for available components

// ✅ Use existing components
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Table } from '../ui/Table';

// ❌ Don't create inline styled elements when a component exists
<button className="bg-blue-500 px-4 py-2">Click</button>

📌 Rule 7: Service Layer Patterns
Frontend Services (src/services/)
// ============== BLOCK 1: Imports ==============
import { apiService } from './api.service';
import type { Product } from '../types/mrp.types';

// ============== BLOCK 2: Service Functions ==============
export const productService = {
  getAll: async (): Promise<Product[]> => {
    return apiService.get('/products');
  },

  getById: async (id: string): Promise<Product> => {
    return apiService.get(`/products/${id}`);
  },

  create: async (data: CreateProductInput): Promise<Product> => {
    return apiService.post('/products', data);
  },
};

Backend Controllers (src/controllers/)
// Always use asyncHandler wrapper
// Always return consistent response format
// Always validate input before processing

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('products').select('*');
  
  if (error) throw error;
  
  res.json({ success: true, data });
});

Rules
Frontend services call the backend API, never Supabase directly
One service file per domain (product, purchaseOrder, forecast, etc.)
Service functions return typed data
Backend controllers use asyncHandler for error handling
Always handle errors — never swallow them silently
📌 Rule 8: File & Folder Naming Conventions

Frontend:

Components:     PascalCase     → ProductCard.tsx, BomDetailModal.tsx
Pages:          PascalCase     → ProductsPage.tsx, DashboardPage.tsx
Services:       camelCase      → product.service.ts, purchaseOrder.service.ts
Types:          camelCase      → mrp.types.ts
Hooks:          camelCase      → useToast.ts
UI Components:  PascalCase/    → Button/Button.tsx, Card/Card.tsx

Backend:
Controllers:    camelCase      → product.controller.ts
Routes:         camelCase      → product.routes.ts
Middleware:     camelCase      → errorHandler.ts
Config:         camelCase      → supabase.ts
Utils:          camelCase      → asyncHandler.ts

General:
Folders:        kebab-case or camelCase (be consistent)
SQL files:      snake_case     → create_soh_table.sql
Docs:           UPPER_SNAKE    → AUDIT_01_TYPESCRIPT.md (audits)
                kebab-case     → app-flow.md (diagrams)
                
📌 Rule 9: Import Order
Always organize imports in this order with blank lines between groups:
// 1. React / Node built-ins
import { useState, useEffect } from 'react';

// 2. Third-party libraries
import { format } from 'date-fns';

// 3. Internal components
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

// 4. Services & utilities
import { productService } from '../../services/product.service';

// 5. Types (use 'import type')
import type { Product } from '../../types/mrp.types';

// 6. Styles (if any)
import './styles.css';

📌 Rule 10: Styling Rules (Frontend)
Use Tailwind CSS for all styling
Follow the existing theme in src/styles/themes.ts
Use the ThemeContext for dark/light mode
Never use inline style={{}} — use Tailwind classes
Never import external CSS libraries without approval
// ✅ Good
<div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">

// ❌ Bad
<div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '16px' }}>

📌 Rule 11: Database Change Rules (Backend)
When making any database changes:

Update database/current-schema/tables.sql with new table/column definitions
Create a new migration file in database/migrations/ with incremental number
Update database/changelog/CHANGELOG.md with what changed and why
Update database/diagrams/er-diagram.md if relationships change
Update database/current-schema/policies.sql if RLS changes
Update database/README.md if new tables are added
Migration Naming:
database/migrations/
├── 001_create_soh_table.sql
├── 002_add_forecasts_archival.sql      ← next change
├── 003_create_kpi_snapshots.sql        ← next change

📌 Rule 12: Error Handling
Frontend
// ✅ Always handle errors in service calls
try {
  const products = await productService.getAll();
  setProducts(products);
} catch (error) {
  toast.error('Failed to load products');
  console.error('Product fetch error:', error);
}

Backend:
// ✅ Use asyncHandler — never let errors crash the server
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  res.json({ success: true, data });
});

Rules
Never use empty catch blocks
Never use console.log for error handling — use console.error
Always show user-friendly error messages via toast
Always log the actual error for debugging

📌 Rule 13: Security Rules
Never Do
❌ Hardcode API keys, passwords, or secrets in code
❌ Commit .env files (must be in .gitignore)
❌ Expose Supabase service_role_key to frontend
❌ Log sensitive data (passwords, tokens, keys)
❌ Use eval() or innerHTML with user input

Always Do:
✅ Use environment variables for all secrets
✅ Reference .env.example for required variables
✅ Use VITE_ prefix for frontend env variables
✅ Validate and sanitize all user inputs
✅ Use parameterized queries (Supabase handles this)


📌 Rule 14: Documentation Updates
When changes are made, update these files as needed:

Change Type	Update These Files
New file/folder added	Run bash update-structure.sh
New API endpoint	README.md (backend) API endpoints table
Database change	database/changelog/CHANGELOG.md + schema files
New UI component	Ensure folder structure: ComponentName/ComponentName.tsx + index.ts
New page added	Update docs/diagrams/app-flow.md
Architecture change	Update docs/diagrams/architecture.md

## 📌 Rule 15: Terminal & Deployment Environment

### Development Environment
- User works on **Windows with Git Bash (MINGW64)**
- Cloud-based IDEs may vary (Firebase Studio, GitHub Codespaces, etc.)
- Always provide **bash-compatible** commands that work across all environments
- Avoid Unicode box-drawing characters in generated files (use ASCII)
- Use `cat >` carefully — for large files, tell user to create manually
- Always provide **copy-paste ready** commands

### Deployment
- Both **frontend and backend** are deployed on **Render**
- Render is connected to **GitHub** — auto-deploys on push to `main`
- Every push to `main` triggers a fresh build on Render
- **⚠️ Never push untested code directly to `main`**
- Always work on feature branches → PR → merge to `main`

### Git Workflow

📌 Rule 16: No Destructive Actions Without Confirmation
Before suggesting any of the following, always ask for confirmation:
⚠️ git push --force
⚠️ git reset --hard
⚠️ rm -rf
⚠️ DROP TABLE / DROP COLUMN
⚠️ Deleting files
⚠️ Overwriting existing files
⚠️ Changing branch
⚠️ Database migrations on production

Format:
⚠️ This will permanently delete [X]. Do you want to proceed? (yes/no)

📌 Rule 17: Code Review Mindset
When reviewing or writing code, always check:

 Does this follow the existing patterns in the codebase?
 Is there an existing component/function that already does this?
 Will this break any existing functionality?
 Is the naming consistent with the rest of the project?
 Are all types properly defined (no any)?
 Are errors handled gracefully?
 Is the code under 200 lines per file?
 Would a new developer understand this without explanation?

📌 Rule 18: Response Format
When providing help, follow this structure:

Explain what you're going to do and why
Show the code/commands
Provide git commands to commit
Verify — suggest how to test the change

### What we're doing:
[Brief explanation]

### Code:
[Code block]

### Commit:
[Git commands]

### Verify:
[How to test]

📌 Quick Reference Card
Tech Stack:        React + Vite | Node + Express | TypeScript | Supabase
Styling:           Tailwind CSS only
Components:        src/components/ui/ (custom library)
Services:          src/services/ (one per domain)
Types:             src/types/mrp.types.ts
State:             React hooks (useState, useEffect, useContext)
Database:          Supabase PostgreSQL (9 tables, 6 functions)
Deployment:        Render (both frontend and backend)
Structure Script:  bash update-structure.sh
Branch Format:     feature/ | fix/ | refactor/ | docs/ | chore/