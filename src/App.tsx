import { useState } from "react";
import { useStore } from "./store/useStore";
import Sidebar from "./components/common/Sidebar";
import RoleSwitcher from "./components/common/RoleSwitcher";
import Dashboard from "./pages/Dashboard";
import TransactionList from "./components/transactions/TransactionList";
import { getTotals, getCategoryBreakdown, getMonthlyBreakdown, fmt } from "./utils/helpers";

type Page = "dashboard" | "transactions" | "insights";

// ── Insights Page (inline — no separate file needed) ──
function InsightsPage() {
  const { transactions, theme } = useStore();

  const isDark = theme === "dark";
  const T = isDark
    ? { surface: "#112720", surface2: "#1a3d35", border: "#234d43", text: "#F7E7CE",
        textDim: "#c9b89a", textHint: "#8aaa9a", income: "#4fa882", expense: "#C9A96E",
        primary: "#C9A96E", red: "#d96a6a" }
    : { surface: "#fffaf2", surface2: "#f1e4cf", border: "#d8c8a8", text: "#1a2420",
        textDim: "#5a6e68", textHint: "#8a9e98", income: "#2e7d5a", expense: "#b0893d",
        primary: "#b08030", red: "#c04040" };

  const { income, expense, balance } = getTotals(transactions);
  const catData  = getCategoryBreakdown(transactions);
  const months   = getMonthlyBreakdown(transactions);

  const card: React.CSSProperties = {
    background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 20px",
    fontFamily: "'DM Mono', monospace",
  };

  const maxExp = Math.max(...months.map((m: any) => m.expense), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Monthly expense bars */}
      <div style={card}>
        <p style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
          Month-over-Month Expenses
        </p>
        {months.length === 0 ? (
          <p style={{ color: T.textHint, fontSize: 12 }}>No data yet</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {months.map((m: any) => (
              <div key={m.key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: T.text }}>{m.label}</span>
                  <div style={{ display: "flex", gap: 16 }}>
                    <span style={{ fontSize: 11, color: T.income }}>↑ {fmt(m.income)}</span>
                    <span style={{ fontSize: 11, color: T.expense }}>↓ {fmt(m.expense)}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: m.balance >= 0 ? T.income : T.red }}>
                      {m.balance >= 0 ? "+" : ""}{fmt(m.balance)}
                    </span>
                  </div>
                </div>
                <div style={{ height: 6, background: T.surface2, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 4, background: T.expense,
                    width: `${(m.expense / maxExp) * 100}%`, transition: "width .5s",
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category ranking */}
      <div style={card}>
        <p style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
          Top Spending Categories
        </p>
        {catData.length === 0 ? (
          <p style={{ color: T.textHint, fontSize: 12 }}>No expense data yet</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {catData.map((d: any, i: number) => {
              const total = catData.reduce((s: number, x: any) => s + x.value, 0);
              const pct = Math.round((d.value / total) * 100);
              return (
                <div key={d.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: T.text }}>
                      <span style={{ fontSize: 10, color: T.textHint, marginRight: 8 }}>#{i + 1}</span>
                      {d.name}
                    </span>
                    <span style={{ fontSize: 12, color: T.expense, fontWeight: 600 }}>
                      {fmt(d.value)} <span style={{ color: T.textHint, fontWeight: 400 }}>({pct}%)</span>
                    </span>
                  </div>
                  <div style={{ height: 5, background: T.surface2, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 4, background: T.expense, width: `${pct}%`, transition: "width .5s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Key stats */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[
          { lbl: "Total Income",    val: fmt(income),   color: T.income  },
          { lbl: "Total Expenses",  val: fmt(expense),  color: T.expense },
          { lbl: "Net Balance",     val: fmt(balance),  color: balance >= 0 ? T.income : T.red },
          { lbl: "Savings Rate",    val: income > 0 ? `${Math.round((balance / income) * 100)}%` : "—", color: T.primary },
          { lbl: "Transactions",    val: String(transactions.length), color: T.text },
          { lbl: "Categories Used", val: String(catData.length), color: T.text },
        ].map(({ lbl, val, color }) => (
          <div key={lbl} style={{ ...card, flex: "1 1 140px" }}>
            <p style={{ fontSize: 9, color: T.textDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{lbl}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color, fontFamily: "'DM Mono', monospace" }}>{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const { theme } = useStore();

  const T = theme === "dark"
    ? { bg: "#0d1f1b", text: "#F7E7CE", textDim: "#c9b89a", border: "#234d43" }
    : { bg: "#F0E6D2", text: "#1a2420", textDim: "#5a6e68", border: "#d8c8a8" };

  const PAGE_TITLE: Record<Page, string> = {
    dashboard:    "Dashboard",
    transactions: "Transactions",
    insights:     "Insights",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.bg}; transition: background .3s; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
        input::placeholder { color: ${T.textDim}; opacity: 0.7; }
        select option { background: ${theme === "dark" ? "#112720" : "#fffaf2"}; color: ${T.text}; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .page-content { animation: fadeUp .35s ease both; }

        /* Responsive: collapse sidebar on small screens */
        @media (max-width: 640px) {
          .app-layout { flex-direction: column !important; }
          .app-sidebar { width: 100% !important; min-height: unset !important; flex-direction: row !important; align-items: center; padding: 12px 16px !important; border-right: none !important; border-bottom: 1px solid ${T.border} !important; }
          .app-sidebar nav { flex-direction: row !important; padding: 0 !important; }
          .app-sidebar .logo-block { display: none !important; }
          .app-sidebar .theme-block { display: none !important; }
        }
      `}</style>

      <div className="app-layout" style={{ display: "flex", minHeight: "100vh", background: T.bg }}>
        <Sidebar activePage={page} onNavigate={setPage} />

        <main style={{ flex: 1, padding: "32px 28px", overflow: "auto" }}>
          {/* Page header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: T.text,
              fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "-0.01em" }}>
              {PAGE_TITLE[page]}
            </h1>
            <RoleSwitcher />
          </div>

          <div className="page-content" key={page}>
            {page === "dashboard"    && <Dashboard />}
            {page === "transactions" && <TransactionList />}
            {page === "insights"     && <InsightsPage />}
          </div>
        </main>
      </div>
    </>
  );
}