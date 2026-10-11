# Spendly Mobile Expense Tracker

Spendly is a tactile, mobile-first personal wealth and daily expense tracker designed with deep emerald teal branding, real-time budget tracking, dynamic weekly and category analytics, and complete local persistence.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The clarifying questions were skipped; recommended sensible defaults will be applied as outlined below. You can easily adjust currency, budgets, or reset data anytime from within the app.

- **Confirmed Decision 1 (Sample Data)**: Launch pre-populated with Sarah's realistic demo data matching the design ($8,450.20 net balance, $4,000 monthly budget, weekly spending distribution, and recent transactions), with instant reset and clear-data options.
- **Confirmed Decision 2 (Currency & Locale)**: Default to USD (`$`) with formatted tabular numerals (`tnum`) across all feeds and metric cards.
- **Confirmed Decision 3 (Budget Cycle)**: Calendar month with automated remaining days calculation, safe spending pace tracker (`~$115.67/day`), and health indicator badges ("Good Health", "Caution", "Exceeded").

---

## 1. Overview & Core Concept

- **What It Does**: Spendly delivers an end-to-end personal finance management experience optimized for handheld touch navigation. Users can monitor net cash balance, visualize daily and weekly spend trends, add expenses with instant calculations, categorize transactions, filter transaction history, analyze spending with category breakdowns, and configure monthly budgets.
- **Target Audience / Persona**: Everyday individuals, mobile users, and budget-conscious professionals who want frictionless, private, zero-lag expense tracking without complicated bank sync setups.
- **Key Value**: 100% offline-capable, zero data leaves the device, lightning-fast numeric entry, and exact fidelity to the Spendly Financial OS tactile design system.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Dashboard (Home Tab)**:
   - Top Bar: Spendly logo, brand typography, notification bell with toggleable notifications drawer, profile avatar.
   - Greeting Section: "Hello, Sarah 👋", dynamic spending status badge ("ON TRACK").
   - Net Balance Hero Card: Dark teal gradient container with radial ambient glows, eye icon to hide/show balance, USD badge, quick insight pills (Income: `+$5,200.00`, Spending: `-$2,380.50`).
   - Monthly Budget Module: Progress track reflecting real percentage spent, remaining budget, days left in current month, and safe daily spending pace.
   - Quick Action Row: Tactile buttons for **Add Spend** (opens bottom sheet), **Transfer** (record transfer or balance adjustment), **Set Budget** (quick edit modal), and **Export** (instant CSV/JSON download).
   - Weekly Spending Interactive Chart: Segmented switch for "This Week" vs. "Last Week", live "Today's Total" badge, interactive 7-day bar chart with hover/tap inspection tooltips.
   - Recent Transactions: Clean tabular feed of latest entries with "See All" linking to the Expenses tab.

2. **Add / Edit Expense (Bottom Sheet & Modal Flow)**:
   - Accessible via the prominent center floating `+` button in the bottom navigation bar or the "Add Spend" quick action.
   - Numeric input with instant calculation, category picker (Food & Dining, Groceries, Transport, Entertainment, Shopping, Bills & Utilities, Healthcare, Other), custom note, date selector, and payment method selector (Cash, Credit Card, Debit Card, Apple Pay, Bank Transfer).
   - Validation with friendly error cues, smooth slide-up bottom sheet transition, and haptic-feel submit button.

3. **Expenses History (Expenses Tab)**:
   - Full transaction ledger with live instant search bar (searches notes, titles, merchants).
   - Filter chips by category and date ranges (All, Today, This Week, This Month).
   - Summary counter of filtered results and total sum.
   - Tap-to-edit expense details or swipe/button to delete with confirmation.
   - Thoughtful empty states when searches yield no matches.

4. **Analytics & Statistics (Analytics Tab)**:
   - Category-wise spending breakdown with visual percentage progress bars, color-coded squircle category icons, and dollar amounts.
   - Monthly spending comparison bars and trend insights.
   - Spending distribution summary (Top category, average daily spend, largest expense).

5. **Budget Settings (Budget Tab / Modal)**:
   - Monthly budget target slider/input.
   - Spending threshold alert indicators (Safe <75%, Caution 75-90%, Over-budget >90%).
   - Reset sample data or wipe all local records option for privacy and testing.

### Visual Identity & Theme Tokens

- **Brand Primary**: Deep Emerald Teal (`#006a64` / `#23847D`) paired with mint highlights (`#9af2e9`).
- **Canvas & Surface**: Crisp off-white base (`#f8f9ff`), elevated pure white containers (`#ffffff`) with subtle ambient shadows and hairline borders (`#e5eeff`).
- **Typography**: Plus Jakarta Sans for geometric clarity and legibility, paired with strict tabular numerals (`font-mono tabular-nums`) on all monetary values.
- **Thumb Ergonomics**: 5-slot bottom navigation bar (`Home`, `Expenses`, elevated center `+`, `Analytics`, `Budget`) with $\ge 48\text{px}$ touch targets and safe area padding (`pb-safe`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Storage with LocalStorage & Reactive State**:
  - *Chosen Approach*: React state initialized from and synchronized with `localStorage` with a robust fallback seed.
  - *Why*: User explicitly requested: "Store all expense data locally on the device / Persist data after closing and reopening the app". Guarantees instant sub-millisecond response times, zero network dependency, and full privacy.
  - *Alternatives Considered*: Cloud Firestore or SQLite backend were ruled out in accordance with offline local-first device persistence requirement.
- **Decision 2: Integrated Bottom Sheet for Adding Expenses**:
  - *Chosen Approach*: A tactile slide-up bottom sheet with a smooth backdrop scrim and touch-friendly controls.
  - *Why*: Follows standard Android and iOS mobile finance app ergonomics where thumb interaction is fastest at the bottom 40% of the screen.
- **Decision 3: Seed Data Fidelity with Reset Capability**:
  - *Chosen Approach*: Initialize with Sarah's exact figures from the provided design while allowing full add, edit, delete, budget update, and reset operations.
  - *Why*: Maintains exact visual consistency with the design mock while providing a 100% functional live app rather than a static prototype.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Spendly Mobile App                            │
├────────────────────────────────────────────────────────────────────────┤
│  Top App Bar (Wordmark, Notification Bell Modal, Avatar Profile)       │
├────────────────────────────────────────────────────────────────────────┤
│  Active Screen Controller                                              │
│   ├── [Dashboard Screen]                                               │
│   │    ├── Hero Net Balance (Visibility toggle, In/Out pills)          │
│   │    ├── Monthly Budget Health (Days left, Daily pace, Progress)    │
│   │    ├── Quick Action Bar (Add, Transfer, Set Budget, Export)       │
│   │    ├── Interactive Weekly Spending Chart (This/Last Week toggle)   │
│   │    └── Recent Transactions Preview                                 │
│   ├── [Expenses Ledger Screen]                                         │
│   │    ├── Search Bar & Category Filter Pills                          │
│   │    ├── Transaction List Rows (Edit & Delete actions)               │
│   │    └── Empty State Fallback                                        │
│   ├── [Analytics / Statistics Screen]                                  │
│   │    ├── Category Breakdown Breakdown Bars & Proportions             │
│   │    ├── Spending Insights & Daily Averages                          │
│   │    └── Monthly Overview                                            │
│   └── [Budget Management Screen]                                       │
│        ├── Monthly Limit Setting & Live Pace Calculator                │
│        ├── Category Budget Allocations                                 │
│        └── Data Management (Export CSV, Reset Demo Data, Clear All)    │
├────────────────────────────────────────────────────────────────────────┤
│  Floating Quick-Add Bottom Sheet (Create & Edit Mode)                  │
├────────────────────────────────────────────────────────────────────────┤
│  Bottom Tab Navigation (Home | Expenses | [+] Add | Analytics | Budget)│
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────┐
        │  Local Storage Repository & State Store                 │
        │  - transactions: Expense[]                              │
        │  - budget: MonthlyBudget                                │
        │  - income: number                                       │
        │  - preferences: Currency, HideBalance                   │
        └─────────────────────────────────────────────────────────┘
```

### Data Model

```typescript
export interface Transaction {
  id: string;
  title: string;
  amount: number; // positive number representing expense or income
  type: 'expense' | 'income' | 'transfer';
  category: ExpenseCategory;
  date: string; // ISO string YYYY-MM-DDTHH:mm:ss
  note?: string;
  paymentMethod: PaymentMethod;
}

export type ExpenseCategory =
  | 'Food & Dining'
  | 'Groceries'
  | 'Transport'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills & Utilities'
  | 'Healthcare'
  | 'Income'
  | 'Transfer'
  | 'Other';

export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'Apple Pay' | 'Bank Transfer';

export interface BudgetConfig {
  monthlyLimit: number;
  month: string; // e.g., '2026-10'
}
```
