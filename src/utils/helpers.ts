import type { Transaction, Filters } from "../types";

export const fmt = (n: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export const fmtDate = (iso: string): string => {
  const [y, m, d] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
};

export const monthKey = (iso: string): string => iso.slice(0, 7); // "2025-06"

export const monthLabel = (key: string): string => {
  const [y, m] = key.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m) - 1]} ${y}`;
};

export interface Totals {
  income: number;
  expense: number;
  balance: number;
}

export function getTotals(txs: Transaction[]): Totals {
  let income = 0, expense = 0;
  txs.forEach((t) => (t.type === "income" ? (income += t.amount) : (expense += t.amount)));
  return { income, expense, balance: income - expense };
}

export function getCategoryBreakdown(txs: Transaction[]) {
  const map: Record<string, number> = {};
  txs.filter((t) => t.type === "expense").forEach((t) => {
    map[t.category] = (map[t.category] ?? 0) + t.amount;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export interface MonthSummary {
  key: string;
  label: string;
  income: number;
  expense: number;
  balance: number;
}

export function getMonthlyBreakdown(txs: Transaction[]): MonthSummary[] {
  const map: Record<string, { income: number; expense: number }> = {};
  txs.forEach((t) => {
    const k = monthKey(t.date);
    if (!map[k]) map[k] = { income: 0, expense: 0 };
    if (t.type === "income") map[k].income += t.amount;
    else map[k].expense += t.amount;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, v]) => ({
      key,
      label: monthLabel(key),
      income: v.income,
      expense: v.expense,
      balance: v.income - v.expense,
    }));
}

/** Running cumulative balance — used for the trend line */
export function getBalanceTrend(txs: Transaction[]): { date: string; balance: number }[] {
  const sorted = [...txs].sort((a, b) => a.date.localeCompare(b.date));
  let running = 0;
  return sorted.map((t) => {
    running += t.type === "income" ? t.amount : -t.amount;
    return { date: t.date, balance: running };
  });
}

export function applyFilters(txs: Transaction[], filters: Filters): Transaction[] {
  let result = [...txs];

  if (filters.type !== "all") result = result.filter((t) => t.type === filters.type);
  if (filters.category !== "all") result = result.filter((t) => t.category === filters.category);
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.label.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }

  result.sort((a, b) => {
    let cmp = 0;
    if (filters.sortField === "date")     cmp = a.date.localeCompare(b.date);
    if (filters.sortField === "amount")   cmp = a.amount - b.amount;
    if (filters.sortField === "label")    cmp = a.label.localeCompare(b.label);
    if (filters.sortField === "category") cmp = a.category.localeCompare(b.category);
    return filters.sortDir === "asc" ? cmp : -cmp;
  });

  return result;
}

export function exportCSV(txs: Transaction[]): void {
  const headers = ["Date", "Label", "Category", "Type", "Amount"];
  const rows = txs.map((t) =>
    [t.date, t.label, t.category, t.type, t.amount].join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function exportJSON(txs: Transaction[]): void {
  const json = JSON.stringify(txs, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "transactions.json";
  a.click();
  URL.revokeObjectURL(url);
}