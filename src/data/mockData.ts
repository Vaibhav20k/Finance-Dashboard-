import type { Transaction } from "../types";

export const MOCK_TRANSACTIONS: Transaction[] = [
  // ── April 2025 ──
  { id: "a1",  label: "Freelance Project",  amount: 2800, type: "income",  category: "Work",          date: "2025-04-02" },
  { id: "a2",  label: "Grocery Run",        amount: 134,  type: "expense", category: "Food",          date: "2025-04-03" },
  { id: "a3",  label: "Spotify",            amount: 11,   type: "expense", category: "Subscriptions", date: "2025-04-04" },
  { id: "a4",  label: "Uber",               amount: 22,   type: "expense", category: "Transport",     date: "2025-04-05" },
  { id: "a5",  label: "Rent",               amount: 1400, type: "expense", category: "Housing",       date: "2025-04-06" },
  { id: "a6",  label: "Gym membership",     amount: 45,   type: "expense", category: "Health",        date: "2025-04-07" },
  { id: "a7",  label: "Netflix",            amount: 18,   type: "expense", category: "Subscriptions", date: "2025-04-09" },
  { id: "a8",  label: "Dinner out",         amount: 64,   type: "expense", category: "Food",          date: "2025-04-11" },
  { id: "a9",  label: "Pharmacy",           amount: 28,   type: "expense", category: "Health",        date: "2025-04-14" },
  { id: "a10", label: "Metro card",         amount: 32,   type: "expense", category: "Transport",     date: "2025-04-15" },
  { id: "a11", label: "Side hustle",        amount: 600,  type: "income",  category: "Work",          date: "2025-04-18" },
  { id: "a12", label: "Coffee",             amount: 38,   type: "expense", category: "Food",          date: "2025-04-21" },

  // ── May 2025 ──
  { id: "b1",  label: "Salary",             amount: 3200, type: "income",  category: "Work",          date: "2025-05-01" },
  { id: "b2",  label: "Grocery Run",        amount: 152,  type: "expense", category: "Food",          date: "2025-05-03" },
  { id: "b3",  label: "Spotify",            amount: 11,   type: "expense", category: "Subscriptions", date: "2025-05-04" },
  { id: "b4",  label: "Rent",               amount: 1400, type: "expense", category: "Housing",       date: "2025-05-05" },
  { id: "b5",  label: "Cinema tickets",     amount: 34,   type: "expense", category: "Entertainment", date: "2025-05-07" },
  { id: "b6",  label: "Gym membership",     amount: 45,   type: "expense", category: "Health",        date: "2025-05-08" },
  { id: "b7",  label: "Netflix",            amount: 18,   type: "expense", category: "Subscriptions", date: "2025-05-09" },
  { id: "b8",  label: "Restaurant",         amount: 89,   type: "expense", category: "Food",          date: "2025-05-12" },
  { id: "b9",  label: "Uber",               amount: 18,   type: "expense", category: "Transport",     date: "2025-05-14" },
  { id: "b10", label: "Online course",      amount: 79,   type: "expense", category: "Other",         date: "2025-05-16" },
  { id: "b11", label: "Freelance bonus",    amount: 500,  type: "income",  category: "Work",          date: "2025-05-20" },
  { id: "b12", label: "Pharmacy",           amount: 42,   type: "expense", category: "Health",        date: "2025-05-23" },
  { id: "b13", label: "Coffee",             amount: 44,   type: "expense", category: "Food",          date: "2025-05-27" },

  // ── June 2025 ──
  { id: "c1",  label: "Salary",             amount: 3200, type: "income",  category: "Work",          date: "2025-06-01" },
  { id: "c2",  label: "Grocery Run",        amount: 148,  type: "expense", category: "Food",          date: "2025-06-02" },
  { id: "c3",  label: "Spotify",            amount: 11,   type: "expense", category: "Subscriptions", date: "2025-06-03" },
  { id: "c4",  label: "Dinner out",         amount: 72,   type: "expense", category: "Food",          date: "2025-06-04" },
  { id: "c5",  label: "Rent",               amount: 1400, type: "expense", category: "Housing",       date: "2025-06-05" },
  { id: "c6",  label: "Side hustle",        amount: 850,  type: "income",  category: "Work",          date: "2025-06-06" },
  { id: "c7",  label: "Gym membership",     amount: 45,   type: "expense", category: "Health",        date: "2025-06-07" },
  { id: "c8",  label: "Netflix",            amount: 18,   type: "expense", category: "Subscriptions", date: "2025-06-08" },
  { id: "c9",  label: "Pharmacy",           amount: 34,   type: "expense", category: "Health",        date: "2025-06-09" },
  { id: "c10", label: "Metro card",         amount: 32,   type: "expense", category: "Transport",     date: "2025-06-11" },
  { id: "c11", label: "Concert ticket",     amount: 55,   type: "expense", category: "Entertainment", date: "2025-06-14" },
  { id: "c12", label: "Coffee",             amount: 41,   type: "expense", category: "Food",          date: "2025-06-17" },
];

export const CATEGORIES = [
  "Food", "Housing", "Health", "Subscriptions",
  "Work", "Transport", "Entertainment", "Other",
] as const;

export const CAT_COLORS_DARK: Record<string, string> = {
  Food:          "#4fa882",
  Housing:       "#C9A96E",
  Health:        "#7B9EBC",
  Subscriptions: "#C47C7C",
  Work:          "#A8C47B",
  Transport:     "#9B88C0",
  Entertainment: "#E0A060",
  Other:         "#7AABB8",
};

export const CAT_COLORS_LIGHT: Record<string, string> = {
  Food:          "#2e7d5a",
  Housing:       "#b08030",
  Health:        "#4a7aaa",
  Subscriptions: "#b05555",
  Work:          "#5a8a30",
  Transport:     "#7055b0",
  Entertainment: "#b07030",
  Other:         "#3a7a88",
};