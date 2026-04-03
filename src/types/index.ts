export type TxType = "income" | "expense";

export type Role = "admin" | "viewer";

export type Category =
  | "Food"
  | "Housing"
  | "Health"
  | "Subscriptions"
  | "Work"
  | "Transport"
  | "Entertainment"
  | "Other";

export interface Transaction {
  id: string;
  label: string;
  amount: number;
  type: TxType;
  category: Category;
  date: string; // ISO yyyy-mm-dd
}

export type SortField = "date" | "amount" | "label" | "category";
export type SortDir = "asc" | "desc";

export interface Filters {
  type: "all" | TxType;
  category: Category | "all";
  search: string;
  sortField: SortField;
  sortDir: SortDir;
}