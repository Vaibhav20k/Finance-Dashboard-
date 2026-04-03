import { useStore } from "../store/useStore";
import {
  getTotals, getCategoryBreakdown, getMonthlyBreakdown,
  getBalanceTrend, fmt,
} from "../utils/helpers";
import CategoryChart from "../components/charts/CategoryChart";

export default function Dashboard() {
  const { transactions, theme, role } = useStore();

  const isDark    = theme === "dark";

  const T = isDark
    ? { surface: "#112720", surface2: "#1a3d35", border: "#234d43", text: "#F7E7CE",
        textDim: "#c9b89a", textHint: "#8aaa9a", primary: "#C9A96E",
        income: "#4fa882", expense: "#C9A96E", red: "#d96a6a" }
    : { surface: "#fffaf2", surface2: "#f1e4cf", border: "#d8c8a8", text: "#1a2420",
        textDim: "#5a6e68", textHint: "#8a9e98", primary: "#b08030",
        income: "#2e7d5a", expense: "#b0893d", red: "#c04040" };

  const { income, expense, balance } = getTotals(transactions);
  const catData     = getCategoryBreakdown(transactions);
  const months      = getMonthlyBreakdown(transactions);
  const trend       = getBalanceTrend(transactions);
  const highestCat  = catData[0] ?? null;

  const expenseTxs  = transactions.filter((t) => t.type === "expense");
  const avgExpense  = expenseTxs.length ? expense / expenseTxs.length : 0;

  // Monthly comparison: last two months
  const lastTwo = months.slice(-2);
  const prevMonth = lastTwo[0];
  const currMonth = lastTwo[1];
  const expenseDiff = currMonth && prevMonth
    ? currMonth.expense - prevMonth.expense
    : null;

  // Balance trend SVG path
  const trendW = 400, trendH = 90;
  const trendMin = Math.min(...trend.map((p) => p.balance), 0);
  const trendMax = Math.max(...trend.map((p) => p.balance), 1);
  const trendRange = trendMax - trendMin || 1;
  const trendPts = trend.map((p, i) => {
    const x = (i / Math.max(trend.length - 1, 1)) * trendW;
    const y = trendH - ((p.balance - trendMin) / trendRange) * (trendH - 12) - 6;
    return `${x},${y}`;
  });
  const pathD = trendPts.length > 0 ? `M ${trendPts.join(" L ")}` : "";
  const fillD = pathD ? `${pathD} L ${trendW},${trendH} L 0,${trendH} Z` : "";

  const card: React.CSSProperties = {
    background: T.surface, border: `1px solid ${T.border}`,
    borderRadius: 14, padding: "18px 20px",
  };

  const StatCard = ({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) => (
    <div style={{ ...card, flex: 1, minWidth: 140 }}>
      <p style={{ margin: 0, fontSize: 10, color: T.textDim, fontFamily: "'DM Mono', monospace",
        letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</p>
      <p style={{ margin: "10px 0 0", fontSize: 26, fontWeight: 700, color,
        fontFamily: "'DM Mono', monospace", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ margin: "6px 0 0", fontSize: 10, color: T.textHint, fontFamily: "'DM Mono', monospace" }}>{sub}</p>}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Viewer notice ── */}
      {role === "viewer" && (
        <div style={{
          background: isDark ? "#1a3020" : "#e8f5ee",
          border: `1px solid ${isDark ? "#2a5040" : "#b0d8c0"}`,
          borderRadius: 10, padding: "10px 16px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 12 }}>👁</span>
          <span style={{ fontSize: 11, color: isDark ? "#4fa882" : "#2e7d5a",
            fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em" }}>
            Viewer mode — data is read-only. Switch to Admin to add or edit transactions.
          </span>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <StatCard label="Balance"  value={fmt(Math.abs(balance))}  color={balance >= 0 ? T.text : T.red}
          sub={balance < 0 ? "Overspent this period" : undefined} />
        <StatCard label="Income"   value={fmt(income)}   color={T.income}  sub={`${transactions.filter(t=>t.type==="income").length} entries`} />
        <StatCard label="Expenses" value={fmt(expense)}  color={T.expense} sub={`${expenseTxs.length} entries`} />
        <StatCard label="Savings Rate"
          value={income > 0 ? `${Math.round((balance / income) * 100)}%` : "—"}
          color={T.primary} sub="of total income saved" />
      </div>

      {/* ── Balance Trend ── */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 10, color: T.textDim, fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.1em", textTransform: "uppercase" }}>Balance Trend</span>
          <span style={{ fontSize: 11, color: T.textHint, fontFamily: "'DM Mono', monospace" }}>
            Cumulative · {trend.length} entries
          </span>
        </div>
        {trend.length > 1 ? (
          <svg viewBox={`0 0 ${trendW} ${trendH}`} width="100%" height={trendH} style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={T.primary} stopOpacity="0.25" />
                <stop offset="100%" stopColor={T.primary} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {/* Zero line */}
            {trendMin < 0 && trendMax > 0 && (
              <line
                x1="0" x2={trendW}
                y1={trendH - ((-trendMin) / trendRange) * (trendH - 12) - 6}
                y2={trendH - ((-trendMin) / trendRange) * (trendH - 12) - 6}
                stroke={T.border} strokeWidth={1} strokeDasharray="4 3"
              />
            )}
            <path d={fillD} fill="url(#trendFill)" />
            <path d={pathD} fill="none" stroke={T.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            {/* Last point dot */}
            {trendPts.length > 0 && (() => {
              const last = trendPts[trendPts.length - 1].split(",");
              return <circle cx={last[0]} cy={last[1]} r={4} fill={T.primary} />;
            })()}
          </svg>
        ) : (
          <p style={{ color: T.textHint, fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
            Add more transactions to see a trend
          </p>
        )}
      </div>

      {/* ── Breakdown + Insights ── */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>

        {/* Spending Breakdown */}
        <div style={{ ...card, flex: 2, minWidth: 240 }}>
          <span style={{ fontSize: 10, color: T.textDim, fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.1em", textTransform: "uppercase" }}>Spending Breakdown</span>
          <div style={{ marginTop: 18 }}>
            <CategoryChart transactions={transactions} theme={theme} />
          </div>
        </div>

        {/* Insights */}
        <div style={{ ...card, flex: 1, minWidth: 180, display: "flex", flexDirection: "column", gap: 16 }}>
          <span style={{ fontSize: 10, color: T.textDim, fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.1em", textTransform: "uppercase" }}>Insights</span>

          {transactions.length === 0 ? (
            <p style={{ color: T.textHint, fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
              No data yet — add your first transaction.
            </p>
          ) : (
            <>
              {[
                { lbl: "Total Entries",  val: String(transactions.length) },
                { lbl: "Top Category",   val: highestCat?.name ?? "—" },
                { lbl: "Avg Expense",    val: avgExpense ? fmt(avgExpense) : "—" },
                {
                  lbl: "vs Last Month",
                  val: expenseDiff !== null
                    ? `${expenseDiff >= 0 ? "+" : ""}${fmt(expenseDiff)}`
                    : "—",
                  color: expenseDiff !== null
                    ? expenseDiff > 0 ? T.red : T.income
                    : T.text,
                },
              ].map(({ lbl, val, color }) => (
                <div key={lbl}>
                  <p style={{ fontSize: 9, color: T.textDim, fontFamily: "'DM Mono', monospace",
                    letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{lbl}</p>
                  <p style={{ fontSize: 17, fontWeight: 700, color: color ?? T.text,
                    fontFamily: "'DM Mono', monospace" }}>{val}</p>
                </div>
              ))}

              {/* Monthly savings insight */}
              {currMonth && (
                <div style={{ background: T.surface2, borderRadius: 10, padding: "10px 12px", marginTop: 4 }}>
                  <p style={{ fontSize: 9, color: T.textHint, fontFamily: "'DM Mono', monospace",
                    letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                    {currMonth.label} Snapshot
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 10, color: T.income, fontFamily: "'DM Mono', monospace" }}>
                      ↑ {fmt(currMonth.income)}
                    </span>
                    <span style={{ fontSize: 10, color: T.expense, fontFamily: "'DM Mono', monospace" }}>
                      ↓ {fmt(currMonth.expense)}
                    </span>
                  </div>
                  <div style={{ marginTop: 6, height: 4, background: T.border, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 4,
                      background: currMonth.balance >= 0 ? T.income : T.red,
                      width: `${Math.min(100, Math.abs(currMonth.balance / currMonth.income) * 100)}%`,
                      transition: "width .5s",
                    }} />
                  </div>
                  <p style={{ fontSize: 9, color: T.textHint, fontFamily: "'DM Mono', monospace", marginTop: 4 }}>
                    Saved {currMonth.income > 0 ? Math.round((currMonth.balance / currMonth.income) * 100) : 0}% of income
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}