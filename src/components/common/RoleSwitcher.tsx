import { useStore } from "../../store/useStore";
import type { Role } from "../../types";

export default function RoleSwitcher() {
  const { role, setRole, theme } = useStore();

  const T = theme === "dark"
    ? { surface: "#112720", border: "#234d43", text: "#F7E7CE", textDim: "#c9b89a", primary: "#C9A96E", btnText: "#0d1f1b" }
    : { surface: "#fffaf2", border: "#d8c8a8", text: "#1a2420", textDim: "#5a6e68", primary: "#b08030", btnText: "#fffaf2" };

  const roles: { value: Role; label: string; desc: string }[] = [
    { value: "admin",  label: "Admin",  desc: "Full access — add, edit, delete" },
    { value: "viewer", label: "Viewer", desc: "Read-only — no modifications" },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
        Role
      </span>
      <div style={{ display: "flex", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 3, gap: 3 }}>
        {roles.map((r) => {
          const active = role === r.value;
          return (
            <button
              key={r.value}
              title={r.desc}
              onClick={() => setRole(r.value)}
              style={{
                padding: "5px 13px", borderRadius: 7, border: "none", cursor: "pointer",
                background: active ? T.primary : "transparent",
                color: active ? T.btnText : T.textDim,
                fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.06em", transition: "all .15s",
              }}
            >
              {r.label}
            </button>
          );
        })}
      </div>
      {/* Visual badge showing current permissions */}
      <span style={{
        fontSize: 9, padding: "3px 8px", borderRadius: 20,
        background: role === "admin" ? (theme === "dark" ? "#1a3d35" : "#e8f5ee") : (theme === "dark" ? "#2a2020" : "#f5e8e8"),
        color: role === "admin" ? T.primary : (theme === "dark" ? "#d96a6a" : "#c04040"),
        fontFamily: "'DM Mono', monospace", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
      }}>
        {role === "admin" ? "Full Access" : "Read Only"}
      </span>
    </div>
  );
}