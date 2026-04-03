# Finance Dashboard

A clean, interactive personal finance dashboard built with React, TypeScript, Tailwind CSS, and Zustand.

## Tech Stack

| Layer          | Choice                        |
|----------------|-------------------------------|
| Framework      | React 18 + TypeScript         |
| Styling        | Tailwind CSS + inline styles  |
| State          | Zustand (with localStorage)   |
| Build Tool     | Vite                          |
| Fonts          | Cormorant Garamond + DM Mono  |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

The app runs at `http://localhost:5173` by default.

---

## Features

### Dashboard Overview
- **Summary cards** — Total Balance, Income, Expenses, Savings Rate
- **Balance trend** — cumulative running balance plotted as an SVG line chart across all transactions
- **Spending breakdown** — interactive donut chart grouped by category with hover highlights
- **Monthly comparison** — grouped bar chart showing income vs expenses per month
- **Insights panel** — top spending category, avg expense, month-over-month comparison, monthly savings bar

### Transactions
- **Full transaction list** — date, label, category, type, amount
- **Search** — live keyword search across label and category
- **Filter** — by type (All / Income / Expense) and by category
- **Sort** — by date, amount, label, or category with ascending/descending toggle
- **Add / Edit** — modal form with label, amount, date, type, category (Admin only)
- **Delete** — with confirmation dialog (Admin only)
- **Export** — download filtered transactions as CSV or JSON

### Role-Based UI
Roles are switched via the **Role Switcher** in the top-right header.

| Feature           | Admin | Viewer |
|-------------------|-------|--------|
| View all data     | ✓     | ✓      |
| Add transaction   | ✓     | ✗      |
| Edit transaction  | ✓     | ✗      |
| Delete transaction| ✓     | ✗      |
| Export data       | ✓     | ✓      |

### Insights Page
- Month-over-month expense comparison with progress bars
- Category ranking with percentage of total spend
- Key financial stats grid (income, expenses, balance, savings rate, transaction count)

### Optional Enhancements Implemented
- ✅ **Dark / Light mode** — toggled from the sidebar, persisted to localStorage
- ✅ **Data persistence** — transactions and role/theme survive page refreshes via Zustand `persist`
- ✅ **Animations** — fade-up page transitions, bar chart height animations, smooth hover states
- ✅ **Export CSV / JSON** — filters-aware, exports exactly what is currently shown
- ✅ **Advanced filtering** — search + type filter + category filter + multi-field sort

---

## Project Structure

```
src/
├── components/
│   ├── charts/
│   │   └── CategoryChart.tsx     # Donut + monthly bars
│   ├── common/
│   │   ├── RoleSwitcher.tsx      # Admin / Viewer toggle
│   │   └── Sidebar.tsx           # Navigation + theme toggle
│   └── transactions/
│       └── TransactionList.tsx   # Full CRUD list with filters
├── data/
│   └── mockData.ts               # Seed transactions (3 months) + category colors
├── pages/
│   └── Dashboard.tsx             # Overview page
├── store/
│   └── useStore.ts               # Zustand store (transactions, filters, role, theme)
├── types/
│   └── index.ts                  # TypeScript types
├── utils/
│   └── helpers.ts                # Pure functions: totals, trend, filtering, export
├── App.tsx                       # Root layout + routing
└── main.tsx                      # Entry point
```

---

## State Management

All application state lives in a single **Zustand store** (`src/store/useStore.ts`):

- `transactions` — array of transaction objects, persisted to `localStorage`
- `role` — `"admin"` or `"viewer"`, persisted
- `theme` — `"dark"` or `"light"`, persisted
- `filters` — search, type, category, sortField, sortDir (session only — resets on reload)

The `persist` middleware from Zustand handles serialisation automatically. Filters are intentionally excluded from persistence so the list always starts unfiltered.

---

## Design Decisions

- **No external chart library** — SVG charts are hand-rolled to keep the bundle small and match the design system exactly
- **Inline styles over Tailwind for dynamic values** — colour tokens depend on the active theme object, so inline styles are cleaner than generating Tailwind class names at runtime
- **Role simulation is frontend-only** — no backend; roles simply gate UI elements in React. In a real app this would be enforced server-side
- **Mock data spans 3 months** (April–June 2025) to demonstrate the monthly comparison and trend features meaningfully
