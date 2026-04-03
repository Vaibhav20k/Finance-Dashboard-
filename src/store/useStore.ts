import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Transaction, Role, Filters, SortField, SortDir, Category, TxType } from "../types";
import { MOCK_TRANSACTIONS } from "../data/mockData";

interface StoreState {
  // ── Data ──
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
  updateTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;

  // ── Role ──
  role: Role;
  setRole: (r: Role) => void;

  // ── Filters ──
  filters: Filters;
  setFilterType: (v: "all" | TxType) => void;
  setFilterCategory: (v: Category | "all") => void;
  setFilterSearch: (v: string) => void;
  setSortField: (f: SortField) => void;
  setSortDir: (d: SortDir) => void;
  resetFilters: () => void;

  // ── Theme ──
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const DEFAULT_FILTERS: Filters = {
  type: "all",
  category: "all",
  search: "",
  sortField: "date",
  sortDir: "desc",
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // ── Data ──
      transactions: MOCK_TRANSACTIONS,
      addTransaction: (t) =>
        set((s) => ({ transactions: [t, ...s.transactions] })),
      updateTransaction: (t) =>
        set((s) => ({
          transactions: s.transactions.map((x) => (x.id === t.id ? t : x)),
        })),
      deleteTransaction: (id) =>
        set((s) => ({ transactions: s.transactions.filter((x) => x.id !== id) })),

      // ── Role ──
      role: "admin",
      setRole: (role) => set({ role }),

      // ── Filters ──
      filters: DEFAULT_FILTERS,
      setFilterType:     (type)     => set((s) => ({ filters: { ...s.filters, type } })),
      setFilterCategory: (category) => set((s) => ({ filters: { ...s.filters, category } })),
      setFilterSearch:   (search)   => set((s) => ({ filters: { ...s.filters, search } })),
      setSortField:      (sortField) => set((s) => ({ filters: { ...s.filters, sortField } })),
      setSortDir:        (sortDir)   => set((s) => ({ filters: { ...s.filters, sortDir } })),
      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      // ── Theme ──
      theme: "dark",
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
    }),
    {
      name: "finance-dashboard-store",
      // only persist transactions + theme; reset filters each session
      partialize: (s) => ({
        transactions: s.transactions,
        theme: s.theme,
        role: s.role,
      }),
    }
  )
);