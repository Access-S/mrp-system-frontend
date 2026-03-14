# 🏭 MRP System — Frontend

A modern Material Requirements Planning (MRP) web application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

---

## 🛠️ Tech Stack

| Technology     | Purpose                      |
|---------------|------------------------------|
| React 18       | UI framework                 |
| TypeScript     | Type-safe development        |
| Vite           | Build tool & dev server      |
| Tailwind CSS   | Utility-first styling        |
| Supabase       | Backend API integration      |
| Render         | Deployment platform          |

---

## 📁 Project Structure

See [`project-structure.txt`](project-structure.txt) for the full project tree.

src/
├── components/
│ ├── dashboard/ → Dashboard charts and KPI cards
│ ├── dialogs/ → Confirmation and alert dialogs
│ ├── forms/ → PO and product forms
│ ├── modals/ → BOM, PO, and import modals
│ ├── pages/ → All application pages
│ ├── tabs/ → Tab components (BOM, Product Info)
│ └── ui/ → Reusable UI component library
├── contexts/ → Theme context provider
├── services/ → API service layer
├── styles/ → Theme configuration
└── types/ → TypeScript type definitions


### 🔄 Update Project Structure

Anytime you add or remove files, regenerate the structure file:

```bash
bash update-structure.sh

🚀 Getting Started
Prerequisites
Node.js (v18+)
npm

Installation
# Clone the repository
git clone https://github.com/Access-S/mrp-system-frontend.git
cd mrp-system-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

📄 Pages
Page	Route	Description
Dashboard	/	KPI cards, charts, and overview
Products	/products	Product catalog listing
Product Dashboard	/products/:id	Single product detail with tabs
Purchase Orders	/purchase-orders	PO listing and management
Create PO	/create-po	New purchase order form
Forecasts	/forecasts	Demand forecast data
SOH	/soh	Stock On Hand overview
Inventory	/inventory	Inventory management
Import	/import	Excel data import

🧩 UI Component Library
Custom reusable components in src/components/ui/:

Component	Description
Accordion	Collapsible content sections
Avatar	User/entity avatar
Badge	Status and category labels
Breadcrumb	Navigation breadcrumbs
Button	Primary, secondary, ghost variants
Card	Content container
DatePicker	Date selection input
Dialog	Modal dialog
Divider	Horizontal separator
Drawer	Slide-out panel
EmptyState	Empty data placeholder
Input	Text input field
Menu	Dropdown menu
Pagination	Page navigation controls
ScrollArea	Custom scrollable container
Select	Dropdown select input
Skeleton	Loading placeholder
Spinner	Loading spinner
StatusBadge	Order/item status indicator
Table	Data table with context
Tabs	Tabbed content navigation
Toast	Notification messages
Tooltip	Hover tooltip
WidgetCard	Dashboard widget container
🔌 Service Layer
API services in src/services/:

Service	Purpose
api.service	Base HTTP client configuration
product.service	Product CRUD operations
purchaseOrder.service	PO management
bom.service	Bill of Materials operations
component.service	Component/parts operations
forecast.service	Forecast data operations
soh.service	Stock On Hand operations
dashboard.service	Dashboard KPI data
dashboard.api	Dashboard API calls
import.service	Excel import operations
export.service	Data export operations
mrp.service	MRP calculation operations
📚 Documentation
All documentation is organized in the docs/ folder:

Folder	Contents
docs/product/	Product Requirements Document
docs/architecture/	System design and simulation docs
docs/specifications/	Feature-level specifications
docs/audits/	Code quality audits and reports
docs/diagrams/	App flow and architecture diagrams
docs/ai-instructions/	AI code assistant guidelines
docs/guides/	Developer guides (coming soon)
See docs/README.md for the full documentation index.

🔗 Related Repositories
Repository	Description
mrp-system-backend	Node.js REST API

📄 License
Private — Internal use only.

