import { useState } from "react";
import { useStore } from "../../store/useStore";
import { applyFilters, fmt, fmtDate, exportCSV, exportJSON } from "../../utils/helpers";
import type { Transaction, Category, SortField } from "../../types";
import { CATEGORIES, CAT_COLORS_DARK, CAT_COLORS_LIGHT } from "../../data/mockData";

interface EditModalProps {
  tx: Transaction | null;
  onSave: (t: Transaction) => void;
  onClose: () => void;
  theme: "dark" | "light";
}

function EditModal({ tx, onSave, onClose, theme }: EditModalProps) {
  const isNew = !tx;
  const [label,    setLabel]    = useState(tx?.label    ?? "");
  const [amount,   setAmount]   = useState(tx?.amount   ? String(tx.amount) : "");
  const [type,     setType]     = useState<"income"|"expense">(tx?.type ?? "expense");
  const [category, setCategory] = useState<Category>(tx?.category ?? "Food");
  const [date,     setDate]     = useState(tx?.date ?? new Date().toISOString().slice(0,10));

  const isDark = theme === "dark";
  const T = isDark
    ? { surface: "#112720", surface2: "#1a3d35", border: "#234d43", text: "#F7E7CE", textDim: "#c9b89a", primary: "#C9A96E", income: "#4fa882", expense: "#C9A96E", btnText: "#0d1f1b" }
    : { surface: "#fffaf2", surface2: "#f1e4cf", border: "#d8c8a8", text: "#1a2420", textDim: "#5a6e68", primary: "#b08030", income: "#2e7d5a", expense: "#b0893d", btnText: "#fffaf2" };

  const submit = () => {
    const val = parseFloat(amount);
    if (!label.trim() || isNaN(val) || val <= 0 || !date) return;
    onSave({ id: tx?.id ?? Date.now().toString(), label: label.trim(), amount: val, type, category, date });
    onClose();
  };

  const inp: React.CSSProperties = {
    background: T.surface2, border: `1px solid ${T.border}`,
    borderRadius: 8, color: T.text, padding: "9px 12px",
    fontSize: 13, fontFamily: "'DM Mono', monospace", outline: "none",
    width: "100%", boxSizing: "border-box",
  };

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 18, padding: 30, width: 360,
        boxShadow: "0 32px 80px rgba(0,0,0,.4)", fontFamily: "'DM Mono', monospace" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ color: T.text, fontSize: 16, fontWeight: 700,
            fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {isNew ? "New Entry" : "Edit Entry"}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        {/* Type toggle */}
        <div style={{ display: "flex", gap: 6, marginBottom: 14, background: T.surface2, padding: 4, borderRadius: 10 }}>
          {(["expense","income"] as const).map((v) => (
            <button key={v} onClick={() => setType(v)} style={{
              flex: 1, padding: "8px 0", borderRadius: 7, border: "none", cursor: "pointer",
              background: type === v ? (v === "income" ? T.income : T.expense) : T.surface2,
              color: type === v ? T.btnText : T.textDim,
              fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.06em", textTransform: "capitalize", transition: "all .15s",
            }}>{v}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <input placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} style={inp} />
          <input placeholder="Amount" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} style={inp} />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inp} />
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)}
            style={{ ...inp, appearance: "none" as const }}>
            {CATEGORIES.map((c) => <option key={c} value={c} style={{ background: T.surface, color: T.text }}>{c}</option>)}
          </select>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px 0", borderRadius: 10, border: `1px solid ${T.border}`,
            background: "transparent", color: T.textDim, fontFamily: "'DM Mono', monospace",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>Cancel</button>
          <button onClick={submit} style={{
            flex: 2, padding: "10px 0", borderRadius: 10, border: "none",
            background: T.primary, color: T.btnText,
            fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700,
            cursor: "pointer", letterSpacing: "0.05em",
          }}>{isNew ? "Add Entry →" : "Save Changes →"}</button>
        </div>
      </div>
    </div>
  );
}

export default function TransactionList() {
  const {
    transactions, addTransaction, updateTransaction, deleteTransaction,
    filters, setFilterType, setFilterCategory, setFilterSearch,
    setSortField, setSortDir, resetFilters,
    role, theme,
  } = useStore();

  const [editTx, setEditTx]       = useState<Transaction | null | undefined>(undefined); // undefined=closed, null=new
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const isDark    = theme === "dark";
  const catColors = isDark ? CAT_COLORS_DARK : CAT_COLORS_LIGHT;
  const T = isDark
    ? { surface: "#112720", surface2: "#1a3d35", border: "#234d43", text: "#F7E7CE", textDim: "#c9b89a",
        textHint: "#8aaa9a", primary: "#C9A96E", income: "#4fa882", expense: "#C9A96E", red: "#d96a6a",
        filterBg: "#C9A96E", filterText: "#0d1f1b", btnText: "#0d1f1b" }
    : { surface: "#fffaf2", surface2: "#f1e4cf", border: "#d8c8a8", text: "#1a2420", textDim: "#5a6e68",
        textHint: "#8a9e98", primary: "#b08030", income: "#2e7d5a", expense: "#b0893d", red: "#c04040",
        filterBg: "#b08030", filterText: "#fffaf2", btnText: "#fffaf2" };

  const filtered = applyFilters(transactions, filters);
  const isAdmin  = role === "admin";

  const SORT_FIELDS: { field: SortField; label: string }[] = [
    { field: "date",     label: "Date"     },
    { field: "amount",   label: "Amount"   },
    { field: "label",    label: "Label"    },
    { field: "category", label: "Category" },
  ];

  const inp: React.CSSProperties = {
    background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8,
    color: T.text, padding: "8px 12px", fontSize: 12,
    fontFamily: "'DM Mono', monospace", outline: "none",
  };

  return (
    <div style={{ fontFamily: "'DM Mono', monospace" }}>

      {/* ── Toolbar ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, alignItems: "center" }}>

        {/* Search */}
        <input
          placeholder="Search transactions…"
          value={filters.search}
          onChange={(e) => setFilterSearch(e.target.value)}
          style={{ ...inp, flex: "1 1 180px", minWidth: 160 }}
        />

        {/* Type filter */}
        <div style={{ display: "flex", background: T.surface2, borderRadius: 9, padding: "3px", gap: 2 }}>
          {(["all","income","expense"] as const).map((v) => (
            <button key={v} onClick={() => setFilterType(v)} style={{
              padding: "5px 11px", borderRadius: 7, border: "none", cursor: "pointer",
              background: filters.type === v ? T.filterBg : "transparent",
              color: filters.type === v ? T.filterText : T.textDim,
              fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.07em", textTransform: "capitalize", transition: "all .15s",
            }}>
              {v === "all" ? "All" : v === "income" ? "In" : "Out"}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <select value={filters.category} onChange={(e) => setFilterCategory(e.target.value as Category | "all")}
          style={{ ...inp, appearance: "none" as const }}>
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Sort field */}
        <select value={filters.sortField} onChange={(e) => setSortField(e.target.value as SortField)}
          style={{ ...inp, appearance: "none" as const }}>
          {SORT_FIELDS.map(({ field, label }) => (
            <option key={field} value={field}>Sort: {label}</option>
          ))}
        </select>

        {/* Sort direction */}
        <button onClick={() => setSortDir(filters.sortDir === "asc" ? "desc" : "asc")} style={{
          ...inp, cursor: "pointer", padding: "8px 11px", fontSize: 13,
        }} title={filters.sortDir === "asc" ? "Ascending" : "Descending"}>
          {filters.sortDir === "asc" ? "↑" : "↓"}
        </button>

        {/* Reset */}
        <button onClick={resetFilters} style={{
          background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8,
          color: T.textDim, padding: "8px 11px", cursor: "pointer",
          fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600,
        }}>Reset</button>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Export */}
        <button onClick={() => exportCSV(filtered)} style={{
          background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8,
          color: T.textDim, padding: "8px 12px", cursor: "pointer",
          fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600,
        }}>↓ CSV</button>
        <button onClick={() => exportJSON(filtered)} style={{
          background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8,
          color: T.textDim, padding: "8px 12px", cursor: "pointer",
          fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600,
        }}>↓ JSON</button>

        {/* Add — admin only */}
        {isAdmin && (
          <button onClick={() => setEditTx(null)} style={{
            background: T.primary, border: "none", borderRadius: 8,
            color: T.btnText, padding: "8px 16px", cursor: "pointer",
            fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.06em",
          }}>+ Add</button>
        )}
      </div>

      {/* ── Result count ── */}
      <div style={{ fontSize: 10, color: T.textHint, marginBottom: 10, letterSpacing: "0.08em" }}>
        {filtered.length} transaction{filtered.length !== 1 ? "s" : ""} found
      </div>

      {/* ── List ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: T.textHint, fontSize: 13 }}>
          No transactions match your filters
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {filtered.map((t) => (
            <div key={t.id}
              style={{
                display: "flex", alignItems: "center", padding: "10px 14px",
                borderRadius: 10, background: T.surface2, border: `1px solid ${T.surface2}`,
                transition: "border-color .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.border)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.surface2)}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%",
                background: catColors[t.category] ?? T.textDim, flexShrink: 0, marginRight: 12 }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, color: T.text, fontWeight: 600,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {t.label}
                </p>
                <p style={{ fontSize: 9, color: T.textDim, marginTop: 2, letterSpacing: "0.06em" }}>
                  {t.category} · {fmtDate(t.date)}
                </p>
              </div>

              {/* Amount */}
              <span style={{ fontSize: 14, fontWeight: 700, marginLeft: 12,
                color: t.type === "income" ? T.income : T.expense }}>
                {t.type === "income" ? "+" : "−"}{fmt(t.amount)}
              </span>

              {/* Admin actions */}
              {isAdmin && (
                <div style={{ display: "flex", gap: 4, marginLeft: 10 }}>
                  <button onClick={() => setEditTx(t)} style={{
                    background: "none", border: "none", color: T.textDim, cursor: "pointer",
                    fontSize: 11, padding: "2px 5px", borderRadius: 5,
                    transition: "color .15s",
                  }} title="Edit">✎</button>
                  <button onClick={() => setConfirmId(t.id)} style={{
                    background: "none", border: "none", color: T.textDim, cursor: "pointer",
                    fontSize: 11, padding: "2px 5px", borderRadius: 5,
                    transition: "color .15s",
                  }} title="Delete">✕</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Edit / Add modal ── */}
      {editTx !== undefined && (
        <EditModal
          tx={editTx}
          theme={theme}
          onClose={() => setEditTx(undefined)}
          onSave={(t) => editTx ? updateTransaction(t) : addTransaction(t)}
        />
      )}

      {/* ── Delete confirm ── */}
      {confirmId && (
        <div onClick={() => setConfirmId(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16,
            padding: "28px 32px", maxWidth: 320, textAlign: "center",
          }}>
            <p style={{ color: T.text, fontSize: 15, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif", marginBottom: 8 }}>
              Delete transaction?
            </p>
            <p style={{ color: T.textDim, fontSize: 12, fontFamily: "'DM Mono', monospace", marginBottom: 20 }}>
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setConfirmId(null)} style={{
                flex: 1, padding: "9px 0", borderRadius: 9, border: `1px solid ${T.border}`,
                background: "transparent", color: T.textDim, fontFamily: "'DM Mono', monospace",
                fontSize: 12, cursor: "pointer",
              }}>Cancel</button>
              <button onClick={() => { deleteTransaction(confirmId); setConfirmId(null); }} style={{
                flex: 1, padding: "9px 0", borderRadius: 9, border: "none",
                background: isDark ? "#d96a6a" : "#c04040", color: "#fff",
                fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}