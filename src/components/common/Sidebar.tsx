import { useStore } from "../../store/useStore";

type Page = "dashboard" | "transactions" | "insights";

interface Props {
  activePage: Page;
  onNavigate: (p: Page) => void;
}

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: "dashboard",    label: "Dashboard",    icon: "▦" },
  { id: "transactions", label: "Transactions", icon: "↕" },
  { id: "insights",     label: "Insights",     icon: "◈" },
];

export default function Sidebar({ activePage, onNavigate }: Props) {
  const { theme, toggleTheme } = useStore();
  const T = theme === "dark"
    ? { bg: "#0a1a16", border: "#234d43", text: "#F7E7CE", textDim: "#8aaa9a", primary: "#C9A96E", surface: "#112720", activeBg: "#1a3d35" }
    : { bg: "#f5ede0", border: "#d8c8a8", text: "#1a2420", textDim: "#5a6e68", primary: "#b08030", surface: "#fffaf2", activeBg: "#e8d8bc" };

  return (
    <aside style={{
      width: 200, minHeight: "100vh", flexShrink: 0,
      background: T.bg, borderRight: `1px solid ${T.border}`,
      display: "flex", flexDirection: "column",
      fontFamily: "'DM Mono', monospace", transition: "background .3s",
    }}>
      {/* Logo */}
      <div style={{ padding: "28px 20px 24px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.primary, boxShadow: `0 0 8px ${T.primary}88` }} />
          <span style={{ fontSize: 9, color: T.textDim, letterSpacing: "0.18em", textTransform: "uppercase" }}>Finance OS</span>
        </div>
        <span style={{ fontSize: 18, fontWeight: 700, color: T.text, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "-0.01em" }}>
          Dashboard
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV_ITEMS.map((item) => {
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 9, border: "none", cursor: "pointer",
                background: active ? T.activeBg : "transparent",
                color: active ? T.primary : T.textDim,
                fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: active ? 700 : 400,
                letterSpacing: "0.06em", transition: "all .15s", textAlign: "left",
                borderLeft: active ? `2px solid ${T.primary}` : "2px solid transparent",
              }}
            >
              <span style={{ fontSize: 13 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Theme toggle at bottom */}
      <div style={{ padding: "16px 10px", borderTop: `1px solid ${T.border}` }}>
        <button
          onClick={toggleTheme}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 8,
            padding: "8px 12px", borderRadius: 9, border: `1px solid ${T.border}`,
            background: T.surface, color: T.textDim, cursor: "pointer",
            fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600,
            letterSpacing: "0.07em", transition: "all .2s",
          }}
        >
          <span style={{ fontSize: 13 }}>{theme === "dark" ? "☀" : "🌙"}</span>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </aside>
  );
}