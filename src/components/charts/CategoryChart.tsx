import { useState } from "react";
import { getCategoryBreakdown, getMonthlyBreakdown, fmt } from "../../utils/helpers";
import type { Transaction } from "../../types";
import { CAT_COLORS_DARK, CAT_COLORS_LIGHT } from "../../data/mockData";

interface Props {
  transactions: Transaction[];
  theme: "dark" | "light";
}

export default function CategoryChart({ transactions, theme }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const isDark = theme === "dark";
  const catColors = isDark ? CAT_COLORS_DARK : CAT_COLORS_LIGHT;

  const T = isDark
    ? { text: "#F7E7CE", textDim: "#c9b89a", textHint: "#8aaa9a", surface2: "#1a3d35", border: "#234d43" }
    : { text: "#1a2420", textDim: "#5a6e68", textHint: "#8a9e98", surface2: "#f1e4cf", border: "#d8c8a8" };

  const catData = getCategoryBreakdown(transactions);
  const months  = getMonthlyBreakdown(transactions);
  const total   = catData.reduce((s, d) => s + d.value, 0);

  // ── Donut ──
  const r = 54, cx = 68, cy = 68, sw = 13, circ = 2 * Math.PI * r;
  let offset = 0;

  // ── Monthly bar chart ──
  const maxMonthVal = Math.max(...months.flatMap((m) => [m.income, m.expense]), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Donut */}
      {catData.length > 0 ? (
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <svg width={136} height={136} style={{ flexShrink: 0 }}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.surface2} strokeWidth={sw} />
            {catData.map((d) => {
              const pct  = d.value / total;
              const dash = pct * circ;
              const gap  = circ - dash;
              const off  = offset;
              offset += dash;
              const isHov = hovered === d.name;
              return (
                <circle
                  key={d.name}
                  cx={cx} cy={cy} r={r} fill="none"
                  stroke={catColors[d.name] ?? T.textDim}
                  strokeWidth={isHov ? sw + 3 : sw}
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={-off + circ * 0.25}
                  style={{ transition: "stroke-width .2s, opacity .2s", opacity: hovered && !isHov ? 0.25 : 1, cursor: "pointer" }}
                  onMouseEnter={() => setHovered(d.name)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })}
            <text x={cx} y={cy - 7} textAnchor="middle" fill={T.textDim} fontSize={9}
              fontFamily="'Cormorant Garamond', Georgia, serif" letterSpacing="0.12em">TOTAL</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fill={T.text} fontSize={14} fontWeight={700}
              fontFamily="'DM Mono', monospace">{fmt(total)}</text>
          </svg>

          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {catData.map((d) => (
              <div key={d.name}
                style={{ display: "flex", alignItems: "center", gap: 8,
                  opacity: hovered && hovered !== d.name ? 0.3 : 1, transition: "opacity .2s", cursor: "default" }}
                onMouseEnter={() => setHovered(d.name)}
                onMouseLeave={() => setHovered(null)}
              >
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: catColors[d.name] ?? T.textDim, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: T.textDim, fontFamily: "'DM Mono', monospace", minWidth: 110 }}>{d.name}</span>
                <span style={{ fontSize: 11, color: T.text, fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>{fmt(d.value)}</span>
                <span style={{ fontSize: 10, color: T.textHint, fontFamily: "'DM Mono', monospace" }}>
                  {Math.round((d.value / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p style={{ color: T.textHint, fontSize: 12, fontFamily: "'DM Mono', monospace" }}>No expense data yet</p>
      )}

      {/* Monthly comparison bars */}
      {months.length > 1 && (
        <div>
          <p style={{ fontSize: 9, color: T.textHint, fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
            Monthly Comparison
          </p>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
            {months.map((m) => (
              <div key={m.key} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <div style={{ width: "100%", display: "flex", gap: 3, alignItems: "flex-end", height: 70 }}>
                  {/* Income bar */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
                    <div title={`Income: ${fmt(m.income)}`} style={{
                      background: isDark ? "#4fa882" : "#2e7d5a",
                      height: `${(m.income / maxMonthVal) * 100}%`,
                      borderRadius: "3px 3px 0 0", minHeight: 3,
                      transition: "height .5s cubic-bezier(.4,0,.2,1)",
                    }} />
                  </div>
                  {/* Expense bar */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
                    <div title={`Expenses: ${fmt(m.expense)}`} style={{
                      background: isDark ? "#C9A96E" : "#b08030",
                      height: `${(m.expense / maxMonthVal) * 100}%`,
                      borderRadius: "3px 3px 0 0", minHeight: 3,
                      transition: "height .5s cubic-bezier(.4,0,.2,1)",
                    }} />
                  </div>
                </div>
                <span style={{ fontSize: 9, color: T.textHint, fontFamily: "'DM Mono', monospace" }}>{m.label}</span>
                <span style={{
                  fontSize: 9, fontFamily: "'DM Mono', monospace", fontWeight: 600,
                  color: m.balance >= 0 ? (isDark ? "#4fa882" : "#2e7d5a") : (isDark ? "#d96a6a" : "#c04040"),
                }}>
                  {m.balance >= 0 ? "+" : ""}{fmt(m.balance)}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            {([[isDark ? "#4fa882" : "#2e7d5a", "Income"], [isDark ? "#C9A96E" : "#b08030", "Expense"]] as [string, string][]).map(([col, lbl]) => (
              <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: 2, background: col }} />
                <span style={{ fontSize: 9, color: T.textHint, fontFamily: "'DM Mono', monospace" }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}