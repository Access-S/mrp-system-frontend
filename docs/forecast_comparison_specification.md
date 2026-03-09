📋 Forecast Management & Variance Analysis System
Comprehensive Business Requirements & Technical Specification
Executive Summary
This document outlines a comprehensive Forecast Management System designed to address critical business challenges in demand planning, forecast accuracy tracking, and customer communication. The system will enable proactive identification of forecast variances, automated comparison between forecasted and actual demand, and provide audit-ready historical data retention for regulatory compliance.

Key Business Outcomes:

Early detection of demand fluctuations to prevent shortages and obsolescence
Data-driven customer conversations backed by historical evidence
Automated forecast accuracy reporting
5-year audit trail for regulatory compliance
Reduced manual effort in forecast analysis
Table of Contents
Business Context & Problem Statement
Current State Analysis
Proposed Solution Overview
Detailed Use Cases with Examples
User Interface Specification
Data Storage Strategy
Technical Implementation
Business Benefits & ROI
Risk Mitigation
Implementation Roadmap
Success Metrics
Appendix
1. Business Context & Problem Statement
1.1 The Forecast Lifecycle
In our business, we receive weekly sales forecasts from customers that drive critical operational decisions:

text

┌─────────────────────────────────────────────────────────────────────────────┐
│                         FORECAST LIFECYCLE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Customer Sends     →    We Plan      →    We Purchase    →    We Produce │
│   Weekly Forecast         Production        Raw Materials       & Deliver  │
│                                                                             │
│   📊 75 SKUs              �icing             📦 Components       🚚 Ship    │
│   📅 52 Weeks Ahead       Resources          Lead Times          On Time   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
1.2 The Core Problem
Forecasts change. Every week.

When a customer sends a new forecast, the numbers for future weeks often differ from what they previously told us. These changes, if undetected, create serious business problems:

Scenario A: Undetected Demand Increase
text

Week 1: Customer forecasts 100 shippers for Week 10
Week 2: Customer forecasts 250 shippers for Week 10 (we don't notice the change)
Week 8: We realize we only have materials for 100 shippers
Result: ❌ Shortage, missed delivery, unhappy customer
Scenario B: Undetected Demand Decrease
text

Week 1: Customer forecasts 500 shippers for Week 10
Week 2: Customer forecasts 100 shippers for Week 10 (we don't notice the change)
Week 8: We have materials for 500 shippers sitting in warehouse
Result: ❌ Excess inventory, potential obsolescence, wasted capital
1.3 Why This Problem Exists Today
Currently, our system:

✅ Imports weekly forecasts
✅ Stores forecast data
✅ Displays current forecast
But it cannot:

❌ Compare this week's forecast to last week's forecast
❌ Identify which SKUs changed and by how much
❌ Flag significant variances that need attention
❌ Show historical forecast accuracy
❌ Compare what customer forecasted vs. what they actually ordered
1.4 Business Impact
Impact Area	Current Risk	Annual Cost Estimate
Material Shortages	Production delays, expedited shipping	£50,000 - £150,000
Excess Inventory	Storage costs, obsolescence write-offs	£30,000 - £100,000
Customer Relations	Reactive conversations, blame games	Relationship damage
Planning Efficiency	Manual comparison in spreadsheets	10+ hours/week
Compliance Risk	No audit trail for forecast changes	Regulatory penalties
2. Current State Analysis
2.1 Current Workflow
text

┌─────────────────────────────────────────────────────────────────────────────┐
│                         CURRENT MANUAL PROCESS                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. Receive Excel       2. Import to         3. Manual Compare             │
│     from Customer          System               (if remembered)             │
│                                                                             │
│     📧 Email               💾 Upload            📊 Open 2 Excel files      │
│     📎 Attachment          ✓ Success            👀 Visually scan           │
│                                                 ⏱️ Takes 2+ hours          │
│                                                 ❌ Error-prone             │
│                                                 ❌ Often skipped           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
2.2 Data Volume
Metric	Value
Number of SKUs	75
Forecast Horizon	52 weeks
Import Frequency	Weekly (every Monday)
Data Points per Import	75 × 52 = 3,900
Annual Imports	52
5-Year Data Points	10,140,000 (current approach)
2.3 Current System Limitations
Limitation	Business Impact
No comparison feature	Changes go unnoticed
No variance flagging	No prioritization of issues
No historical snapshots	Cannot prove what customer said
No accuracy tracking	Cannot measure forecast quality
Slow import (5+ minutes)	User frustration, errors
3. Proposed Solution Overview
3.1 Solution Vision
A unified Forecast Comparison & Analysis System that automatically:

Detects changes between forecast versions
Flags significant variances for action
Compares forecasted demand to actual orders
Provides audit-ready historical records
Generates customer-ready reports
3.2 Key Capabilities
text

┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROPOSED SYSTEM CAPABILITIES                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   IMPORT    │    │   COMPARE   │    │   ANALYSE   │    │   REPORT    │  │
│  ├─────────────┤    ├─────────────┤    ├─────────────┤    ├─────────────┤  │
│  │ Fast import │    │ Side-by-side│    │ FC vs Actual│    │ Export to   │  │
│  │ (seconds)   │    │ comparison  │    │ accuracy    │    │ Excel/CSV   │  │
│  │             │    │             │    │             │    │             │  │
│  │ Auto-archive│    │ Variance    │    │ Trend graphs│    │ Customer    │  │
│  │ previous    │    │ flags       │    │             │    │ ready       │  │
│  │             │    │             │    │             │    │             │  │
│  │ Batch       │    │ Search/Sort │    │ RCCP Hours  │    │ Audit       │  │
│  │ storage     │    │ /Filter     │    │ analysis    │    │ compliant   │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
4. Detailed Use Cases with Examples
4.1 Use Case 1: Weekly Forecast Comparison
Business Scenario
It's Monday, 09 March 2026. The planning team receives the weekly forecast from the customer and imports it into the system. They need to quickly identify what changed from last week's forecast.

Step-by-Step Example
Last Week's Import (02/03/2026):

SKU	Description	Week 16 Mar	Week 23 Mar	Week 30 Mar
43020062	Zyrtec Nasal Spray	45	50	60
43607074	Nicorette Gum 4mg	300	250	200
43606072	Nicorette QuickMist	0	75	80
This Week's Import (09/03/2026):

SKU	Description	Week 16 Mar	Week 23 Mar	Week 30 Mar
43020062	Zyrtec Nasal Spray	100	50	60
43607074	Nicorette Gum 4mg	150	250	200
43606072	Nicorette QuickMist	50	75	80
System Comparison Output
text

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  FORECAST COMPARISON: 02/03/2026 vs 09/03/2026                                                   │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                       │        Week 16 Mar 2026       │        Week 23 Mar 2026       │         │
│ SKU        │ Desc     │  FC A  │  FC B  │   Variance  │  FC A  │  FC B  │   Variance  │  ...    │
├────────────┼──────────┼────────┼────────┼─────────────┼────────┼────────┼─────────────┼─────────┤
│ 43020062   │ Zyrtec   │   45   │  100   │ 🔴 +122%    │   50   │   50   │ 🟢 0%       │         │
│ 43607074   │ Nicorette│  300   │  150   │ 🔴 -50%     │  250   │  250   │ 🟢 0%       │         │
│ 43606072   │ QuickMist│    0   │   50   │ 🔴 NEW      │   75   │   75   │ 🟢 0%       │         │
├────────────┼──────────┼────────┼────────┼─────────────┼────────┼────────┼─────────────┼─────────┤
│ TOTAL      │          │  345   │  300   │ 🟡 -13%     │  375   │  375   │ 🟢 0%       │         │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
Actions Triggered
SKU	Variance	Required Action
43020062	+122% increase	⚠️ Contact customer to confirm. Check material availability for 55 extra shippers.
43607074	-50% decrease	⚠️ Contact customer to confirm. Review open POs for potential cancellation.
43606072	NEW demand	⚠️ Previously zero, now 50. Confirm this is intentional new demand.
4.2 Use Case 2: Forecast vs. Actual Orders
Business Scenario
It's Monday, 16 March 2026. The week of 09 March has now passed. The planning team wants to compare:

What the customer forecasted for week 09 March
What the customer actually ordered in week 09 March
This reveals forecast accuracy - are we planning based on reliable forecasts?

Step-by-Step Example
Forecast Imported on 02/03/2026 (for week 09 Mar):

SKU	Description	Week 09 Mar (Forecasted)
43020062	Zyrtec Nasal Spray	45 shippers
43607074	Nicorette Gum 4mg	300 shippers
Actual Orders Received in Week 09 Mar (from Purchase Orders):

SKU	Description	Week 09 Mar (Actual Orders)
43020062	Zyrtec Nasal Spray	42 shippers
43607074	Nicorette Gum 4mg	180 shippers
System Comparison Output
text

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  FORECAST vs ACTUAL: Week 09 Mar 2026                                                            │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                       │        Week 09 Mar 2026       │                                         │
│ SKU        │ Desc     │ Forecast │ 📦 Actual│ Accuracy │  Notes                                 │
├────────────┼──────────┼──────────┼──────────┼──────────┼─────────────────────────────────────────┤
│ 43020062   │ Zyrtec   │    45    │    42    │ 🟢 93%   │  Within acceptable range               │
│ 43607074   │ Nicorette│   300    │   180    │ 🔴 60%   │  Customer ordered 40% less than FC     │
├────────────┼──────────┼──────────┼──────────┼──────────┼─────────────────────────────────────────┤
│ TOTAL      │          │   345    │   222    │ 🔴 64%   │  Overall forecast accuracy: 64%        │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

📦 = Actual orders (sourced from Purchase Orders received during week 09 Mar)
Business Value
This data enables powerful customer conversations:

"Over the past 12 weeks, your forecast accuracy has averaged 68%. Specifically, SKU 43607074 (Nicorette Gum 4mg) has been consistently over-forecasted by 40%. This has resulted in £15,000 of excess inventory. Can we work together to improve the forecast for this SKU?"

4.3 Use Case 3: Handling Missing Data
Scenario A: SKU Not in Previous Forecast
Situation: A new SKU appears in this week's forecast that wasn't in last week's.

Example:

FC A (02/03/2026): SKU 99999999 = Not present (0)
FC B (09/03/2026): SKU 99999999 = 150 shippers
System Handling:

text

│ 99999999   │ New Item │    0     │   150    │ 🔴 NEW   │
Action: Flag as NEW for user to confirm with customer.

Scenario B: SKU Removed from Current Forecast
Situation: A SKU that was in last week's forecast is missing from this week's.

Example:

FC A (02/03/2026): SKU 88888888 = 200 shippers
FC B (09/03/2026): SKU 88888888 = Not present (0)
System Handling:

text

│ 88888888   │ Old Item │   200    │    0     │ 🔴 -100% │
Action: Flag as REMOVED for user to verify with customer.

Scenario C: Week in Past (Forecast vs. Actual)
Situation: Comparing FC A (02/03/2026) with FC B (16/03/2026). Week 09 Mar exists in FC A but is in the past for FC B.

System Handling:

For FC B, week 09 Mar → Pull Actual Orders from Purchase Orders
Mark cell with 📦 indicator to show it's actual data, not forecast
text

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                       │    09 Mar 2026 (Past)   │      16 Mar 2026      │      23 Mar 2026│
│ SKU        │ Desc     │  FC A  │  FC B  │  Var  │  FC A  │  FC B  │  Var │  ...            │
├────────────┼──────────┼────────┼────────┼───────┼────────┼────────┼──────┼─────────────────┤
│ 43020062   │ Zyrtec   │   45   │ 📦 42  │ 🟢-7% │   50   │   55   │🟡+10%│                 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

Legend:
📦 = Actual Orders (from Purchase Orders where order_date falls within week 09 Mar)
4.4 Use Case 4: RCCP Capacity Analysis
Business Scenario
Beyond comparing unit quantities, the planning team needs to understand the production hours required. This is critical for:

Resource planning (staffing, shifts)
Capacity constraint identification
Make vs. buy decisions
Calculation Logic
text

Production Hours = Shippers × Minutes per Shipper ÷ 60

Example:
SKU 43020062 has:
- Forecast: 100 shippers
- Minutes per Shipper: 45 mins

Production Hours = 100 × 45 ÷ 60 = 75 hours
Visual Output: Capacity Comparison Chart
text

┌─────────────────────────────────────────────────────────────────────────────┐
│  WEEKLY CAPACITY COMPARISON (Hours)                                          │
│                                                                              │
│  250 │                                                                       │
│      │     ████                                                              │
│  200 │     ████ ░░░░                                                         │
│      │     ████ ░░░░      ████                                               │
│  150 │     ████ ░░░░      ████ ░░░░      ████                                │
│      │     ████ ░░░░      ████ ░░░░      ████ ░░░░                           │
│  100 │     ████ ░░░░      ████ ░░░░      ████ ░░░░      ████                 │
│      │     ████ ░░░░      ████ ░░░░      ████ ░░░░      ████ ░░░░            │
│   50 │     ████ ░░░░      ████ ░░░░      ████ ░░░░      ████ ░░░░            │
│      │     ████ ░░░░      ████ ░░░░      ████ ░░░░      ████ ░░░░            │
│    0 └─────────────────────────────────────────────────────────────────────  │
│           Week 16       Week 23        Week 30        Week 37                │
│                                                                              │
│  Legend: ████ FC A (02/03)    ░░░░ FC B (09/03)                              │
│                                                                              │
│  Capacity Line: ─── 180 hours/week                                           │
└─────────────────────────────────────────────────────────────────────────────┘
Insights Generated
Week	FC A Hours	FC B Hours	Change	Capacity	Status
Week 16	180 hrs	220 hrs	+22%	180 hrs	🔴 Over capacity
Week 23	150 hrs	165 hrs	+10%	180 hrs	🟢 Within capacity
Week 30	140 hrs	140 hrs	0%	180 hrs	🟢 Within capacity
4.5 Use Case 5: Audit Trail & Compliance
Business Scenario
An auditor (internal or external) asks:

"Show me the forecast you received for SKU 43607074 for the week of 16 March 2026, and how it changed over time."

System Capability
The system stores every forecast import as a complete snapshot, enabling:

text

┌─────────────────────────────────────────────────────────────────────────────┐
│  FORECAST HISTORY: SKU 43607074 - Week 16 Mar 2026                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  Import Date    │  Forecasted Qty  │  Change from Previous                  │
├─────────────────┼──────────────────┼────────────────────────────────────────┤
│  02/03/2026     │  300 shippers    │  - (first forecast)                    │
│  09/03/2026     │  150 shippers    │  -50% ⚠️                               │
│  16/03/2026     │  📦 180 actual   │  Actual orders received                │
├─────────────────┼──────────────────┼────────────────────────────────────────┤
│  ACCURACY       │  FC: 300 → ACT: 180  │  60% accuracy                      │
└─────────────────────────────────────────────────────────────────────────────┘
Compliance Benefits
Requirement	How System Meets It
Data Retention	5-year storage of all forecast imports
Traceability	Each import has unique batch ID and timestamp
Immutability	Historical forecasts cannot be modified
Accessibility	Any historical forecast retrievable in seconds
5. User Interface Specification
5.1 Comparison Page Layout
text

┌─────────────────────────────────────────────────────────────────────────────────┐
│  📊 Compare Forecasts                                                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────┐  ┌─────────┐            │
│  │ Forecast A  ▼  │  │ Forecast B  ▼  │  │ Weeks   ▼  │  │ Compare │            │
│  │ 02/03/2026     │  │ 09/03/2026     │  │ 4 Weeks    │  │         │            │
│  └────────────────┘  └────────────────┘  └────────────┘  └─────────┘            │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ 🔍 Search products...              │ Filter: [All ▼] │ Sort: [Variance ▼]│   │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ Toggle: [Percentage ○] [Absolute + % ●]                                 │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
5.2 Comparison Table
text

┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                     │       16 Mar 2026        │       23 Mar 2026        │       30 Mar 2026      │
│ SKU       │ Desc    │  FC A │  FC B │   Var    │  FC A │  FC B │   Var    │  FC A │  FC B │  Var   │
├───────────┼─────────┼───────┼───────┼──────────┼───────┼───────┼──────────┼───────┼───────┼────────┤
│ 43020062  │ Zyrtec  │   45  │  100  │🔴+55(+122%)│  50  │   50  │ 🟢 0%    │   60  │   60  │ 🟢 0%│
│ 43607074  │ Nicor.  │  300  │  150  │🔴-150(-50%)│ 250  │  250  │ 🟢 0%    │  200  │  200  │ 🟢 0%│
│ 43606072  │ Quick   │    0  │   50  │ 🔴 NEW    │   75  │   75  │ 🟢 0%    │   80  │   80  │ 🟢 0%│
├───────────┼─────────┼───────┼───────┼──────────┼───────┼───────┼──────────┼───────┼───────┼────────┤
│ TOTAL     │         │  345  │  300  │🟡-45(-13%)│  375  │  375  │ 🟢 0%    │  340  │  340  │ 🟢 0%│
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                    ◄──── Horizontal Scroll ────►
5.3 Variance Indicators
Indicator	Threshold	Meaning	Visual
🟢 OK	< 10% change	Acceptable variance	Green
🟡 Watch	10-25% change	Monitor closely	Yellow/Amber
🔴 Alert	> 25% change	Action required	Red
🔴 NEW	0 → Any value	New demand appeared	Red with "NEW"
📦 Actual	Past week	Actual orders, not forecast	Blue/Purple
5.4 Charts Section
Two side-by-side charts showing:

Chart 1: Demand in Shippers

text

Weekly demand comparison in shipper quantities
Chart 2: Demand in Hours (RCCP)

text

Weekly capacity requirements comparison in production hours
5.5 User Controls Summary
Control	Purpose
Forecast A Dropdown	Select first forecast by import date
Forecast B Dropdown	Select second forecast by import date
Week Filter	4, 6, 8, 12 weeks or All
Search	Find specific SKU by code or description
Filter	All / Red flags only / Yellow flags only
Sort	By variance (highest first) / By SKU
Toggle	Percentage only / Absolute + Percentage
Export	Download comparison as Excel/CSV
6. Data Storage Strategy
6.1 Current vs. Proposed Approach
Aspect	Current Approach	Proposed Approach
Storage Model	Individual rows per SKU/week	Batch storage (JSON per import)
Rows per Import	3,900	1
5-Year Total Rows	~1,000,000	~260
Storage Size (5yr)	~300 MB	~25 MB
Query Performance	Degrades over time	Constant
Comparison Speed	Slow (join millions)	Fast (compare 2 JSON docs)
6.2 Proposed Database Schema
SQL

-- Main table: One row per forecast import
CREATE TABLE forecast_imports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    imported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    import_date DATE NOT NULL,  -- The date shown in dropdown (e.g., 09/03/2026)
    import_sequence INTEGER DEFAULT 1,  -- For multiple imports same day: (1), (2)
    file_name TEXT,  -- Original file name
    data JSONB NOT NULL,  -- Full forecast data
    summary JSONB,  -- Quick stats (total qty, SKU count, etc.)
    is_current BOOLEAN DEFAULT TRUE,  -- Is this the latest import?
    created_by UUID,  -- User who imported
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for fast dropdown population
CREATE INDEX idx_forecast_imports_date ON forecast_imports(import_date DESC);

-- Index for current forecast lookup
CREATE INDEX idx_forecast_imports_current ON forecast_imports(is_current) WHERE is_current = TRUE;
6.3 Data Structure Example
JSON

{
  "import_date": "2026-03-09",
  "data": {
    "43020062": {
      "description": "Zyrtec Nasal Spray 10mL",
      "weeks": {
        "2026-03-16": 100,
        "2026-03-23": 50,
        "2026-03-30": 60,
        "2026-04-06": 45
      }
    },
    "43607074": {
      "description": "Nicorette Gum 4mg 150",
      "weeks": {
        "2026-03-16": 150,
        "2026-03-23": 250,
        "2026-03-30": 200,
        "2026-04-06": 180
      }
    }
  },
  "summary": {
    "total_skus": 75,
    "total_weeks": 52,
    "total_quantity": 45000,
    "date_range": {
      "start": "2026-03-16",
      "end": "2027-03-08"
    }
  }
}
6.4 Multiple Imports Same Day
When a user imports multiple forecasts on the same day:

Import	Display Label
First import on 09/03/2026	"09/03/2026"
Second import on 09/03/2026	"09/03/2026 (2)"
Third import on 09/03/2026	"09/03/2026 (3)"
7. Technical Implementation
7.1 System Architecture
text

┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Forecast   │  │  Compare    │  │   Charts    │  │   Export    │         │
│  │  Import     │  │  Page       │  │  Component  │  │   Service   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘         │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │ API Calls
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND (Node.js)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Import     │  │  Compare    │  │  Actuals    │  │   Export    │         │
│  │  Controller │  │  Controller │  │  Service    │  │   Controller│         │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘         │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │ Database Queries
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE (Supabase)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │ forecast_imports │  │ purchase_orders │  │    products     │              │
│  │ (JSON batches)   │  │ (actual orders) │  │ (mins/shipper)  │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────────────┘
7.2 API Endpoints
Endpoint	Method	Purpose
/api/forecasts/upload	POST	Import new forecast
/api/forecasts/imports	GET	List all import dates for dropdown
/api/forecasts/compare	POST	Compare two forecasts
/api/forecasts/actuals	GET	Get actual orders for a week
/api/forecasts/export	POST	Export comparison to Excel/CSV
7.3 Comparison Algorithm
text

FUNCTION compareForecast(fcA_id, fcB_id, weekFilter):
    
    1. Fetch FC A data (JSON)
    2. Fetch FC B data (JSON)
    3. Fetch Product data (for mins/shipper)
    4. Get all unique SKUs from both FCs
    5. Get all unique weeks from both FCs (limited by weekFilter)
    
    FOR each week:
        IF week < today AND FC B imported after week:
            FC B value = Fetch actual orders from Purchase Orders
            Mark as "ACTUAL"
        ELSE:
            FC B value = FC B data (or 0 if missing)
    
    FOR each SKU:
        FOR each week:
            Calculate variance = (FC_B - FC_A) / FC_A * 100
            Assign flag based on variance threshold
            Calculate hours = shippers × minsPerShipper / 60
    
    Calculate totals row
    
    RETURN comparison_table, charts_data
7.4 Week Definition
Week Start: Monday 00:00:00
Week End: Sunday 23:59:59
Week Identifier: Date of Monday (e.g., "2026-03-09" = week starting Monday 9 March)
Actual Orders Query:

SQL

SELECT product_code, SUM(quantity) as total_shippers
FROM purchase_orders
WHERE order_date >= '2026-03-09'  -- Monday
  AND order_date < '2026-03-16'   -- Next Monday
GROUP BY product_code
8. Business Benefits & ROI
8.1 Quantifiable Benefits
Benefit	Current State	Future State	Annual Savings
Shortage Prevention	5-10 per year	0-2 per year	£40,000 - £80,000
Obsolescence Reduction	£50,000/year	£15,000/year	£35,000
Manual Analysis Time	10 hrs/week	1 hr/week	£23,400 (@ £50/hr)
Customer Disputes	10 per year	2 per year	£20,000
TOTAL ANNUAL BENEFIT			£118,400 - £158,400
8.2 Qualitative Benefits
Benefit	Description
Proactive Planning	Identify issues before they become problems
Customer Trust	Data-driven conversations improve relationships
Audit Readiness	Complete history available instantly
Decision Speed	Minutes instead of hours to analyse changes
Forecast Accountability	Track customer forecast accuracy over time
9. Risk Mitigation
9.1 Data Integrity
Risk	Mitigation
Import errors	Validation on upload, preview before commit
Data loss	Immutable storage, no delete capability
Incorrect comparison	Clear labeling of FC A vs FC B, actual vs forecast
9.2 Performance
Risk	Mitigation
Slow queries	JSON batch storage, indexed lookups
Large exports	Chunked processing, background jobs
UI lag	Pagination, lazy loading, week filters
9.3 User Adoption
Risk	Mitigation
Complexity	Intuitive UI matching existing pages
Training	In-app tooltips, documentation
Resistance	Demonstrate time savings immediately
10. Implementation Roadmap
Phase 1: Foundation (Week 1-2)
Task	Duration	Deliverable
Database schema migration	2 days	New forecast_imports table
Update import flow	3 days	Store as JSON batches
Migrate existing data	1 day	Convert current data to new format
API endpoints	2 days	List imports, get import
Phase 2: Comparison Feature (Week 3-4)
Task	Duration	Deliverable
Comparison API	3 days	Compare two forecasts
Comparison UI	4 days	Table with variance flags
Filters & Sort	2 days	Search, filter by flag, sort
Toggle views	1 day	Percentage vs absolute
Phase 3: Forecast vs Actual (Week 5)
Task	Duration	Deliverable
Actuals integration	2 days	Pull from Purchase Orders
Past week handling	2 days	Auto-fill actuals for past weeks
Visual indicators	1 day	📦 badges for actual data
Phase 4: Charts & Export (Week 6)
Task	Duration	Deliverable
Comparison charts	2 days	Side-by-side demand charts
RCCP hours chart	2 days	Capacity comparison
Excel/CSV export	1 day	Download comparison
Phase 5: Testing & Launch (Week 7)
Task	Duration	Deliverable
UAT testing	3 days	User acceptance
Bug fixes	2 days	Issue resolution
Documentation	1 day	User guide
Production deployment	1 day	Live system
Total Timeline: 7 weeks

11. Success Metrics
11.1 System Performance
Metric	Target	Measurement
Import time	< 10 seconds	Timer from upload to complete
Comparison load	< 3 seconds	Timer from click to display
Export generation	< 5 seconds	Timer for Excel download
Historical query	< 2 seconds	Retrieve any 5-year-old forecast
11.2 Business Outcomes
Metric	Target	Measurement
Variance detection rate	100%	All changes > 10% flagged
Weekly analysis time	< 30 mins	Time from import to review complete
Shortage incidents	-80%	Year-over-year comparison
Obsolescence cost	-70%	Year-over-year comparison
Forecast accuracy tracking	100%	All past weeks have actual data
11.3 User Adoption
Metric	Target	Measurement
Comparison feature usage	100% of imports	Tracking in analytics
Export downloads	4+ per month	Download counter
User satisfaction	> 8/10	Survey after 1 month
12. Appendix
12.1 Glossary
Term	Definition
Forecast (FC)	Customer's prediction of future demand
Shipper	Unit of packaging (e.g., a box of 36 units)
Variance	Difference between two forecasts, expressed as %
RCCP	Rough Cut Capacity Planning - high-level capacity check
Import Batch	One complete forecast file import
Actual Orders	Real purchase orders received from customer
12.2 Variance Calculation
text

Variance % = ((New Value - Old Value) / Old Value) × 100

Examples:
- Old: 100, New: 150 → +50%
- Old: 100, New: 75 → -25%
- Old: 0, New: 50 → "NEW" (infinite %)
- Old: 50, New: 0 → -100%
12.3 Hours Calculation
text

Production Hours = Shippers × Minutes per Shipper ÷ 60

Example:
- Shippers: 100
- Minutes per Shipper: 45
- Hours = 100 × 45 ÷ 60 = 75 hours
12.4 Week Boundaries
text

Week is defined as Monday 00:00:00 to Sunday 23:59:59

Example: Week "09/03/2026"
- Start: Monday 9 March 2026, 00:00:00
- End: Sunday 15 March 2026, 23:59:59
Document Version: 2.0
Status: Ready for Stakeholder Review
Prepared: March 2026
Author: Development Team