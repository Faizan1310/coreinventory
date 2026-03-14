import { useState, useEffect, useRef } from "react";

// ─── FONTS ───────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=Barlow:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
document.head.appendChild(fontLink);

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const globalStyle = document.createElement("style");
globalStyle.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #080A0F;
    --surface: #0F1218;
    --card: #161B24;
    --card2: #1C222E;
    --border: #252B38;
    --border2: #2E3545;
    --amber: #F59E0B;
    --amber2: #FBBF24;
    --amber-dim: rgba(245,158,11,0.12);
    --blue: #3B82F6;
    --blue-dim: rgba(59,130,246,0.12);
    --green: #10B981;
    --green-dim: rgba(16,185,129,0.12);
    --red: #EF4444;
    --red-dim: rgba(239,68,68,0.12);
    --purple: #8B5CF6;
    --purple-dim: rgba(139,92,246,0.12);
    --text: #E8EDF5;
    --text2: #8B95A8;
    --text3: #55606F;
    --ff-head: 'Barlow Condensed', sans-serif;
    --ff-body: 'Barlow', sans-serif;
    --ff-mono: 'IBM Plex Mono', monospace;
    --r: 8px;
    --r2: 12px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
    --shadow2: 0 8px 40px rgba(0,0,0,0.6);
  }
  body { background: var(--bg); color: var(--text); font-family: var(--ff-body); }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
  input, select, textarea {
    background: var(--card2); border: 1px solid var(--border2);
    color: var(--text); border-radius: var(--r); padding: 10px 14px;
    font-family: var(--ff-body); font-size: 14px; outline: none; width: 100%;
    transition: border-color 0.2s;
  }
  input:focus, select:focus, textarea:focus { border-color: var(--amber); }
  input::placeholder { color: var(--text3); }
  select option { background: var(--card2); }
  button { cursor: pointer; font-family: var(--ff-body); border: none; outline: none; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fade-in { animation: fadeIn 0.3s ease forwards; }
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 20px; font-size: 11px;
    font-family: var(--ff-mono); font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase;
  }
  .badge-green { background: var(--green-dim); color: var(--green); }
  .badge-amber { background: var(--amber-dim); color: var(--amber); }
  .badge-red { background: var(--red-dim); color: var(--red); }
  .badge-blue { background: var(--blue-dim); color: var(--blue); }
  .badge-purple { background: var(--purple-dim); color: var(--purple); }
  .badge-grey { background: rgba(139,149,168,0.12); color: var(--text2); }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; padding: 10px 16px; font-family: var(--ff-mono); font-size: 11px;
       font-weight: 500; color: var(--text3); text-transform: uppercase; letter-spacing: 1px;
       border-bottom: 1px solid var(--border); background: var(--surface); }
  td { padding: 13px 16px; font-size: 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.02); }
  .tag { display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 11px;
         font-family: var(--ff-mono); background: var(--card2); color: var(--text2); }
`;
document.head.appendChild(globalStyle);

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const WAREHOUSES_INIT = [
  { id: "wh1", name: "Main Warehouse", location: "Building A, Floor 1", capacity: 5000 },
  { id: "wh2", name: "Production Floor", location: "Building B, Floor 2", capacity: 2000 },
  { id: "wh3", name: "Cold Storage", location: "Building C, Unit 3", capacity: 800 },
];
const CATEGORIES_INIT = ["Raw Materials","Finished Goods","Packaging","Tools & Equipment","Spare Parts","Office Supplies"];
const UNITS_INIT = ["kg","pcs","liters","meters","boxes","rolls","pallets","sets"];

const PRODUCTS_INIT = [
  { id: "p1", name: "Steel Rods", sku: "SR-001", category: "Raw Materials", unit: "kg", reorderQty: 50, reorderPoint: 100,
    stock: { wh1: 247, wh2: 30, wh3: 0 } },
  { id: "p2", name: "Office Chairs", sku: "OC-204", category: "Finished Goods", unit: "pcs", reorderQty: 20, reorderPoint: 15,
    stock: { wh1: 8, wh2: 0, wh3: 0 } },
  { id: "p3", name: "Cardboard Boxes", sku: "CB-050", category: "Packaging", unit: "pcs", reorderQty: 200, reorderPoint: 100,
    stock: { wh1: 340, wh2: 60, wh3: 0 } },
  { id: "p4", name: "Hydraulic Oil", sku: "HO-12L", category: "Tools & Equipment", unit: "liters", reorderQty: 30, reorderPoint: 20,
    stock: { wh1: 5, wh2: 0, wh3: 18 } },
  { id: "p5", name: "Aluminium Sheets", sku: "AS-200", category: "Raw Materials", unit: "kg", reorderQty: 100, reorderPoint: 80,
    stock: { wh1: 0, wh2: 0, wh3: 0 } },
  { id: "p6", name: "Packing Tape Rolls", sku: "PT-33", category: "Packaging", unit: "rolls", reorderQty: 50, reorderPoint: 30,
    stock: { wh1: 92, wh2: 12, wh3: 0 } },
];

const RECEIPTS_INIT = [
  { id: "REC-001", supplier: "SteelCo Ltd", date: "2025-03-10", status: "done", warehouse: "wh1",
    lines: [{ productId: "p1", qty: 100, received: 100 }] },
  { id: "REC-002", supplier: "PackMaster", date: "2025-03-12", status: "pending", warehouse: "wh1",
    lines: [{ productId: "p3", qty: 200, received: 0 }, { productId: "p6", qty: 50, received: 0 }] },
  { id: "REC-003", supplier: "ChemSupply", date: "2025-03-13", status: "done", warehouse: "wh3",
    lines: [{ productId: "p4", qty: 18, received: 18 }] },
];

const DELIVERIES_INIT = [
  { id: "DEL-001", customer: "Acme Corp", date: "2025-03-11", status: "done", warehouse: "wh1",
    lines: [{ productId: "p1", qty: 20, picked: 20 }] },
  { id: "DEL-002", customer: "Globex Inc", date: "2025-03-13", status: "pending", warehouse: "wh1",
    lines: [{ productId: "p2", qty: 5, picked: 0 }, { productId: "p3", qty: 30, picked: 0 }] },
];

const TRANSFERS_INIT = [
  { id: "TRF-001", fromWh: "wh1", toWh: "wh2", date: "2025-03-11", status: "done",
    lines: [{ productId: "p1", qty: 30 }] },
  { id: "TRF-002", fromWh: "wh1", toWh: "wh2", date: "2025-03-14", status: "pending",
    lines: [{ productId: "p3", qty: 50 }] },
];

const ADJUSTMENTS_INIT = [
  { id: "ADJ-001", warehouse: "wh1", date: "2025-03-10", reason: "Damage", note: "3 kg steel rods damaged",
    lines: [{ productId: "p1", oldQty: 250, newQty: 247, delta: -3 }], status: "done" },
  { id: "ADJ-002", warehouse: "wh1", date: "2025-03-12", reason: "Count Correction", note: "Physical count mismatch",
    lines: [{ productId: "p2", oldQty: 6, newQty: 8, delta: 2 }], status: "done" },
];

function genId(prefix) {
  return `${prefix}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
}
function today() {
  return new Date().toISOString().split("T")[0];
}
function totalStock(product) {
  return Object.values(product.stock).reduce((a, b) => a + b, 0);
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const icons = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    box: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
    truck: <><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    arrowLeft: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    transfer: <><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></>,
    sliders: <><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></>,
    history: <><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.88"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    warehouse: <><path d="M22 9V7H2v2l10 5 10-5z"/><path d="M2 9v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9"/><path d="M12 14v4"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></>,
    alert: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    inbox: <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    chevronDown: <><polyline points="6 9 12 15 18 9"/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6"/></>,
    package: <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ─── BUTTON ───────────────────────────────────────────────────────────────────
const Btn = ({ children, variant = "primary", size = "md", onClick, disabled, style = {}, icon }) => {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    borderRadius: "var(--r)", fontFamily: "var(--ff-body)", fontWeight: 500,
    transition: "all 0.18s", cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    ...(size === "sm" ? { padding: "6px 12px", fontSize: 13 } : size === "lg" ? { padding: "12px 24px", fontSize: 15 } : { padding: "9px 18px", fontSize: 14 }),
    ...(variant === "primary" ? { background: "var(--amber)", color: "#000", fontWeight: 600 }
      : variant === "ghost" ? { background: "transparent", color: "var(--text2)", border: "1px solid var(--border2)" }
      : variant === "danger" ? { background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(239,68,68,0.3)" }
      : variant === "success" ? { background: "var(--green-dim)", color: "var(--green)", border: "1px solid rgba(16,185,129,0.3)" }
      : { background: "var(--card2)", color: "var(--text)", border: "1px solid var(--border2)" }),
    ...style,
  };
  return <button style={base} onClick={onClick} disabled={disabled}>{icon && <Icon name={icon} size={14}/>}{children}</button>;
};

// ─── MODAL ────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, width = 540 }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
    <div style={{ background: "var(--card)", border: "1px solid var(--border2)", borderRadius: 14, width, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "var(--shadow2)", animation: "fadeIn 0.2s ease" }} onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
        <h3 style={{ fontFamily: "var(--ff-head)", fontSize: 20, fontWeight: 700, letterSpacing: 0.5 }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", color: "var(--text2)", padding: 4 }}><Icon name="x" size={18}/></button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

// ─── FIELD ────────────────────────────────────────────────────────────────────
const Field = ({ label, children, style = {} }) => (
  <div style={{ marginBottom: 16, ...style }}>
    {label && <label style={{ display: "block", fontSize: 12, fontFamily: "var(--ff-mono)", color: "var(--text2)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</label>}
    {children}
  </div>
);

// ─── KPI CARD ─────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, icon, color = "var(--amber)", sub, onClick }) => (
  <div onClick={onClick} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px", cursor: onClick ? "pointer" : "default", transition: "border-color 0.2s", display: "flex", flexDirection: "column", gap: 10 }}
    onMouseEnter={e => onClick && (e.currentTarget.style.borderColor = color)}
    onMouseLeave={e => onClick && (e.currentTarget.style.borderColor = "var(--border)")}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 12, fontFamily: "var(--ff-mono)", color: "var(--text2)", textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center", color }}><Icon name={icon} size={15}/></div>
    </div>
    <div style={{ fontFamily: "var(--ff-head)", fontSize: 34, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: "var(--text3)" }}>{sub}</div>}
  </div>
);

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────
const PageHeader = ({ title, sub, actions }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
    <div>
      <h1 style={{ fontFamily: "var(--ff-head)", fontSize: 28, fontWeight: 800, letterSpacing: 0.5 }}>{title}</h1>
      {sub && <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 3 }}>{sub}</p>}
    </div>
    <div style={{ display: "flex", gap: 8 }}>{actions}</div>
  </div>
);

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = { done: ["green","DONE"], pending: ["amber","PENDING"], draft: ["grey","DRAFT"], cancelled: ["red","CANCELLED"] };
  const [cls, label] = map[status] || ["grey", status];
  return <span className={`badge badge-${cls}`}>{label}</span>;
};

// ─── SEARCH BAR ───────────────────────────────────────────────────────────────
const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div style={{ position: "relative", flex: 1 }}>
    <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }}><Icon name="search" size={14}/></div>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ paddingLeft: 36 }}/>
  </div>
);

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
const Empty = ({ message = "No records found" }) => (
  <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--text3)" }}>
    <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
    <div style={{ fontFamily: "var(--ff-mono)", fontSize: 13 }}>{message}</div>
  </div>
);

// ─── AUTH SCREENS ─────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | signup | forgot | otp | reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["","","","","",""]);
  const [newPass, setNewPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const otpRefs = useRef([]);

  const fakeLoad = (cb) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); cb(); }, 900);
  };

  const handleOtp = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) otpRefs.current[i+1]?.focus();
  };

  const handleOtpKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i-1]?.focus();
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      {/* bg decoration */}
      <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)", pointerEvents: "none" }}/>
      <div style={{ position: "absolute", bottom: -150, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)", pointerEvents: "none" }}/>
      {/* grid pattern */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }}/>

      <div style={{ width: 420, animation: "fadeIn 0.4s ease" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, background: "var(--amber)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="warehouse" size={20} color="#000"/>
            </div>
            <span style={{ fontFamily: "var(--ff-head)", fontSize: 28, fontWeight: 800, letterSpacing: 2 }}>CORE<span style={{ color: "var(--amber)" }}>INVENTORY</span></span>
          </div>
          <p style={{ color: "var(--text3)", fontSize: 13, fontFamily: "var(--ff-mono)" }}>Warehouse · Operations · Tracking</p>
        </div>

        <div style={{ background: "var(--card)", border: "1px solid var(--border2)", borderRadius: 16, padding: "32px 36px", boxShadow: "var(--shadow2)" }}>
          {msg && <div style={{ background: msg.type === "error" ? "var(--red-dim)" : "var(--green-dim)", border: `1px solid ${msg.type === "error" ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`, color: msg.type === "error" ? "var(--red)" : "var(--green)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, fontSize: 13 }}>{msg.text}</div>}

          {mode === "login" && <>
            <h2 style={{ fontFamily: "var(--ff-head)", fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Sign In</h2>
            <Field label="Email"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com"/></Field>
            <Field label="Password"><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/></Field>
            <div style={{ textAlign: "right", marginBottom: 20 }}>
              <button onClick={()=>{setMode("forgot");setMsg(null)}} style={{ background:"none", color:"var(--amber)", fontSize:13, fontFamily:"var(--ff-body)" }}>Forgot password?</button>
            </div>
            <Btn variant="primary" size="lg" style={{ width:"100%", justifyContent:"center" }} onClick={() => fakeLoad(()=>onAuth({ name: name || "Alex Manager", email, role: "Inventory Manager" }))} disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Btn>
            <div style={{ textAlign:"center", marginTop: 20, color:"var(--text3)", fontSize:13 }}>
              No account? <button onClick={()=>{setMode("signup");setMsg(null)}} style={{ background:"none", color:"var(--amber)", fontFamily:"var(--ff-body)" }}>Create one</button>
            </div>
          </>}

          {mode === "signup" && <>
            <h2 style={{ fontFamily: "var(--ff-head)", fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Create Account</h2>
            <Field label="Full Name"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Alex Johnson"/></Field>
            <Field label="Work Email"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="alex@company.com"/></Field>
            <Field label="Password"><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 8 characters"/></Field>
            <Btn variant="primary" size="lg" style={{ width:"100%", justifyContent:"center", marginTop: 8 }} onClick={() => fakeLoad(()=>onAuth({ name: name || "Alex Manager", email, role: "Inventory Manager" }))} disabled={loading}>
              {loading ? "Creating…" : "Create Account"}
            </Btn>
            <div style={{ textAlign:"center", marginTop: 20, color:"var(--text3)", fontSize:13 }}>
              Have an account? <button onClick={()=>{setMode("login");setMsg(null)}} style={{ background:"none", color:"var(--amber)", fontFamily:"var(--ff-body)" }}>Sign in</button>
            </div>
          </>}

          {mode === "forgot" && <>
            <h2 style={{ fontFamily: "var(--ff-head)", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Reset Password</h2>
            <p style={{ color:"var(--text2)", fontSize:13, marginBottom: 24 }}>Enter your email and we'll send a 6-digit OTP.</p>
            <Field label="Email"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com"/></Field>
            <Btn variant="primary" size="lg" style={{ width:"100%", justifyContent:"center" }} onClick={() => fakeLoad(()=>{setMode("otp");setMsg({type:"success",text:"OTP sent to "+email})})} disabled={loading}>
              {loading ? "Sending…" : "Send OTP"}
            </Btn>
            <div style={{ textAlign:"center", marginTop: 20 }}>
              <button onClick={()=>{setMode("login");setMsg(null)}} style={{ background:"none", color:"var(--text2)", fontSize:13, fontFamily:"var(--ff-body)", display:"inline-flex", alignItems:"center", gap:4 }}><Icon name="arrowLeft" size={12}/>Back to sign in</button>
            </div>
          </>}

          {mode === "otp" && <>
            <h2 style={{ fontFamily: "var(--ff-head)", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Verify OTP</h2>
            <p style={{ color:"var(--text2)", fontSize:13, marginBottom: 28 }}>Enter the 6-digit code sent to <strong style={{color:"var(--text)"}}>{email}</strong></p>
            <div style={{ display:"flex", gap: 8, marginBottom: 28, justifyContent:"center" }}>
              {otp.map((d,i) => (
                <input key={i} ref={el=>otpRefs.current[i]=el} value={d} onChange={e=>handleOtp(i,e.target.value)} onKeyDown={e=>handleOtpKey(i,e)} maxLength={1}
                  style={{ width:44, height:52, textAlign:"center", fontSize:22, fontFamily:"var(--ff-mono)", fontWeight:600, background:"var(--card2)", border:`2px solid ${d?"var(--amber)":"var(--border2)"}`, borderRadius:10 }}/>
              ))}
            </div>
            <Btn variant="primary" size="lg" style={{ width:"100%", justifyContent:"center" }} onClick={() => fakeLoad(()=>setMode("reset"))} disabled={loading}>
              {loading ? "Verifying…" : "Verify Code"}
            </Btn>
          </>}

          {mode === "reset" && <>
            <h2 style={{ fontFamily: "var(--ff-head)", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>New Password</h2>
            <p style={{ color:"var(--text2)", fontSize:13, marginBottom: 24 }}>Choose a strong new password.</p>
            <Field label="New Password"><input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="Min. 8 characters"/></Field>
            <Btn variant="primary" size="lg" style={{ width:"100%", justifyContent:"center" }} onClick={() => fakeLoad(()=>{setMode("login");setMsg({type:"success",text:"Password reset! Sign in with your new password."});})} disabled={loading}>
              {loading ? "Resetting…" : "Reset Password"}
            </Btn>
          </>}
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, user, onLogout }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "products", label: "Products", icon: "box" },
    { id: "receipts", label: "Receipts", icon: "inbox" },
    { id: "deliveries", label: "Deliveries", icon: "truck" },
    { id: "transfers", label: "Transfers", icon: "transfer" },
    { id: "adjustments", label: "Adjustments", icon: "sliders" },
    { id: "history", label: "Move History", icon: "history" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  return (
    <div style={{ width: 220, background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", height: "100vh", position: "fixed", left: 0, top: 0, zIndex: 100 }}>
      {/* Logo */}
      <div style={{ padding: "22px 20px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap: 9 }}>
          <div style={{ width:34, height:34, background:"var(--amber)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Icon name="warehouse" size={17} color="#000"/>
          </div>
          <div>
            <div style={{ fontFamily:"var(--ff-head)", fontSize:17, fontWeight:800, letterSpacing:1, lineHeight:1 }}>CORE<span style={{color:"var(--amber)"}}>INV</span></div>
            <div style={{ fontFamily:"var(--ff-mono)", fontSize:9, color:"var(--text3)", letterSpacing:1 }}>IMS v2.5</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, overflowY:"auto", padding: "12px 10px" }}>
        <div style={{ fontSize:10, fontFamily:"var(--ff-mono)", color:"var(--text3)", textTransform:"uppercase", letterSpacing:1.5, padding:"8px 10px 6px" }}>Operations</div>
        {navItems.slice(0,7).map(item => {
          const active = page === item.id;
          return (
            <button key={item.id} onClick={()=>setPage(item.id)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:"var(--r)", background: active ? "var(--amber-dim)" : "transparent",
                color: active ? "var(--amber)" : "var(--text2)", border: active ? "1px solid rgba(245,158,11,0.2)" : "1px solid transparent",
                fontSize:14, fontWeight: active ? 600 : 400, fontFamily:"var(--ff-body)", marginBottom:2, transition:"all 0.15s", textAlign:"left" }}>
              <Icon name={item.icon} size={15}/>
              {item.label}
            </button>
          );
        })}
        <div style={{ fontSize:10, fontFamily:"var(--ff-mono)", color:"var(--text3)", textTransform:"uppercase", letterSpacing:1.5, padding:"14px 10px 6px" }}>System</div>
        {navItems.slice(7).map(item => {
          const active = page === item.id;
          return (
            <button key={item.id} onClick={()=>setPage(item.id)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:"var(--r)", background: active ? "var(--amber-dim)" : "transparent",
                color: active ? "var(--amber)" : "var(--text2)", border: active ? "1px solid rgba(245,158,11,0.2)" : "1px solid transparent",
                fontSize:14, fontWeight: active ? 600 : 400, fontFamily:"var(--ff-body)", marginBottom:2, transition:"all 0.15s", textAlign:"left" }}>
              <Icon name={item.icon} size={15}/>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Profile */}
      <div style={{ borderTop:"1px solid var(--border)", padding:"14px 14px" }}>
        <button onClick={()=>setPage("profile")} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:"var(--r)", background: page==="profile" ? "var(--amber-dim)" : "transparent", border: page==="profile" ? "1px solid rgba(245,158,11,0.2)" : "1px solid transparent", textAlign:"left", transition:"all 0.15s" }}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg, var(--amber), #b45309)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <span style={{ fontFamily:"var(--ff-head)", fontSize:14, fontWeight:700, color:"#000" }}>{user.name[0]}</span>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:"var(--text)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user.name}</div>
            <div style={{ fontSize:10, fontFamily:"var(--ff-mono)", color:"var(--text3)" }}>{user.role}</div>
          </div>
        </button>
        <button onClick={onLogout} style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:"var(--r)", background:"none", color:"var(--text3)", fontSize:13, fontFamily:"var(--ff-body)", marginTop:4, transition:"color 0.15s", textAlign:"left" }}
          onMouseEnter={e=>e.currentTarget.style.color="var(--red)"}
          onMouseLeave={e=>e.currentTarget.style.color="var(--text3)"}>
          <Icon name="logout" size={14}/>Logout
        </button>
      </div>
    </div>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
function Topbar({ title, products }) {
  const lowStock = products.filter(p => totalStock(p) > 0 && totalStock(p) <= p.reorderPoint).length;
  const outOfStock = products.filter(p => totalStock(p) === 0).length;
  const alerts = lowStock + outOfStock;
  return (
    <div style={{ height:56, background:"var(--surface)", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", position:"sticky", top:0, zIndex:50 }}>
      <div style={{ fontFamily:"var(--ff-head)", fontSize:16, fontWeight:600, color:"var(--text2)", letterSpacing:1, textTransform:"uppercase" }}>{title}</div>
      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ position:"relative" }}>
          <div style={{ color:"var(--text3)" }}><Icon name="bell" size={18}/></div>
          {alerts > 0 && <div style={{ position:"absolute", top:-4, right:-4, width:16, height:16, background:"var(--red)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#fff" }}>{alerts}</div>}
        </div>
        <div style={{ width:1, height:20, background:"var(--border)" }}/>
        <div style={{ fontFamily:"var(--ff-mono)", fontSize:12, color:"var(--text3)" }}>{new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ products, receipts, deliveries, transfers, adjustments, setPage }) {
  const totalProducts = products.length;
  const lowStock = products.filter(p => { const s = totalStock(p); return s > 0 && s <= p.reorderPoint; });
  const outOfStock = products.filter(p => totalStock(p) === 0);
  const pendingReceipts = receipts.filter(r => r.status === "pending").length;
  const pendingDeliveries = deliveries.filter(d => d.status === "pending").length;
  const pendingTransfers = transfers.filter(t => t.status === "pending").length;

  const recentMoves = [
    ...receipts.filter(r=>r.status==="done").map(r=>({ id:r.id, type:"Receipt", party:r.supplier, date:r.date, color:"var(--green)" })),
    ...deliveries.filter(d=>d.status==="done").map(d=>({ id:d.id, type:"Delivery", party:d.customer, date:d.date, color:"var(--blue)" })),
    ...adjustments.filter(a=>a.status==="done").map(a=>({ id:a.id, type:"Adjustment", party:a.reason, date:a.date, color:"var(--purple)" })),
  ].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);

  const alertProducts = [...lowStock, ...outOfStock].slice(0,5);

  return (
    <div className="fade-in">
      <PageHeader title="Dashboard" sub="Real-time inventory snapshot"/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:16, marginBottom:28 }}>
        <KpiCard label="Total Products" value={totalProducts} icon="box" color="var(--text)" onClick={()=>setPage("products")}/>
        <KpiCard label="Low Stock" value={lowStock.length} icon="alert" color="var(--amber)" sub={`${outOfStock.length} out of stock`} onClick={()=>setPage("products")}/>
        <KpiCard label="Pending Receipts" value={pendingReceipts} icon="inbox" color="var(--green)" onClick={()=>setPage("receipts")}/>
        <KpiCard label="Pending Deliveries" value={pendingDeliveries} icon="truck" color="var(--blue)" onClick={()=>setPage("deliveries")}/>
        <KpiCard label="Scheduled Transfers" value={pendingTransfers} icon="transfer" color="var(--purple)" onClick={()=>setPage("transfers")}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Recent Activity */}
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12 }}>
          <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <h3 style={{ fontFamily:"var(--ff-head)", fontSize:17, fontWeight:700 }}>Recent Activity</h3>
            <button onClick={()=>setPage("history")} style={{ background:"none", color:"var(--amber)", fontSize:12, fontFamily:"var(--ff-mono)" }}>VIEW ALL →</button>
          </div>
          <div style={{ padding:"0 4px" }}>
            {recentMoves.length === 0 ? <Empty message="No activity yet"/> :
              recentMoves.map((m,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", borderBottom: i<recentMoves.length-1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:m.color, flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:500 }}>{m.party}</div>
                    <div style={{ fontSize:11, color:"var(--text3)", fontFamily:"var(--ff-mono)" }}>{m.id} · {m.date}</div>
                  </div>
                  <span style={{ fontSize:11, fontFamily:"var(--ff-mono)", color:m.color, background:`${m.color}22`, padding:"2px 8px", borderRadius:20 }}>{m.type}</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Stock Alerts */}
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12 }}>
          <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <h3 style={{ fontFamily:"var(--ff-head)", fontSize:17, fontWeight:700 }}>Stock Alerts</h3>
            <span style={{ background:"var(--red-dim)", color:"var(--red)", borderRadius:20, padding:"2px 8px", fontSize:11, fontFamily:"var(--ff-mono)" }}>{alertProducts.length} ITEMS</span>
          </div>
          <div style={{ padding:"0 4px" }}>
            {alertProducts.length === 0
              ? <div style={{ textAlign:"center", padding:"32px", color:"var(--green)", fontFamily:"var(--ff-mono)", fontSize:13 }}>✓ All stock levels healthy</div>
              : alertProducts.map((p,i)=>{
                  const s = totalStock(p);
                  const isOut = s === 0;
                  return (
                    <div key={p.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", borderBottom: i<alertProducts.length-1 ? "1px solid var(--border)" : "none" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:500 }}>{p.name}</div>
                        <div style={{ fontSize:11, fontFamily:"var(--ff-mono)", color:"var(--text3)" }}>{p.sku} · Reorder at {p.reorderPoint} {p.unit}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontFamily:"var(--ff-mono)", fontSize:15, fontWeight:600, color: isOut ? "var(--red)" : "var(--amber)" }}>{s} {p.unit}</div>
                        <span className={`badge badge-${isOut?"red":"amber"}`}>{isOut?"OUT":"LOW"}</span>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
function Products({ products, setProducts, warehouses, categories }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [modal, setModal] = useState(null); // null | 'create' | product obj (edit) | 'stock' (with product)
  const [stockViewProduct, setStockViewProduct] = useState(null);
  const [form, setForm] = useState({ name:"", sku:"", category: categories[0], unit: UNITS_INIT[0], reorderPoint: 50, reorderQty: 20 });

  const filtered = products.filter(p =>
    (catFilter === "All" || p.category === catFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const openCreate = () => { setForm({ name:"", sku:"", category:categories[0], unit:UNITS_INIT[0], reorderPoint:50, reorderQty:20 }); setModal("create"); };
  const openEdit = (p) => { setForm({ ...p }); setModal("edit"); };

  const saveProduct = () => {
    if (!form.name || !form.sku) return;
    if (modal === "create") {
      const initStock = {};
      warehouses.forEach(w => initStock[w.id] = 0);
      setProducts(prev => [...prev, { ...form, id: genId("P"), stock: initStock, reorderPoint: +form.reorderPoint, reorderQty: +form.reorderQty }]);
    } else {
      setProducts(prev => prev.map(p => p.id === form.id ? { ...p, ...form, reorderPoint: +form.reorderPoint, reorderQty: +form.reorderQty } : p));
    }
    setModal(null);
  };

  const deleteProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));

  const stockStatus = (p) => {
    const s = totalStock(p);
    if (s === 0) return ["red", "Out of Stock"];
    if (s <= p.reorderPoint) return ["amber", "Low Stock"];
    return ["green", "In Stock"];
  };

  return (
    <div className="fade-in">
      <PageHeader title="Products" sub={`${products.length} products across ${warehouses.length} warehouses`}
        actions={<Btn icon="plus" onClick={openCreate}>New Product</Btn>}/>

      <div style={{ display:"flex", gap:12, marginBottom:20, alignItems:"center" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or SKU…"/>
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{ width:180 }}>
          <option>All</option>
          {categories.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
        {filtered.length === 0 ? <Empty/> :
          <table>
            <thead><tr>
              <th>Product</th><th>SKU</th><th>Category</th><th>Unit</th><th>Total Stock</th><th>Status</th><th>Reorder At</th><th></th>
            </tr></thead>
            <tbody>{filtered.map(p=>{
              const s = totalStock(p);
              const [sc, sl] = stockStatus(p);
              return (
                <tr key={p.id}>
                  <td style={{ fontWeight:500 }}>{p.name}</td>
                  <td><span className="tag">{p.sku}</span></td>
                  <td style={{ color:"var(--text2)", fontSize:13 }}>{p.category}</td>
                  <td style={{ fontFamily:"var(--ff-mono)", fontSize:13 }}>{p.unit}</td>
                  <td>
                    <button onClick={()=>setStockViewProduct(p)} style={{ background:"none", fontFamily:"var(--ff-mono)", fontSize:14, fontWeight:600, color:"var(--text)", textDecoration:"underline", textDecorationColor:"var(--border2)" }}>
                      {s} {p.unit}
                    </button>
                  </td>
                  <td><span className={`badge badge-${sc}`}>{sl}</span></td>
                  <td style={{ fontFamily:"var(--ff-mono)", fontSize:13, color:"var(--text2)" }}>{p.reorderPoint} {p.unit}</td>
                  <td>
                    <div style={{ display:"flex", gap:6 }}>
                      <Btn variant="ghost" size="sm" onClick={()=>openEdit(p)} icon="edit">Edit</Btn>
                      <Btn variant="danger" size="sm" onClick={()=>deleteProduct(p.id)} icon="trash">Del</Btn>
                    </div>
                  </td>
                </tr>
              );
            })}</tbody>
          </table>
        }
      </div>

      {/* Create/Edit Modal */}
      {(modal === "create" || modal === "edit") && (
        <Modal title={modal === "create" ? "New Product" : "Edit Product"} onClose={()=>setModal(null)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <Field label="Product Name" style={{ gridColumn:"1/-1" }}><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Steel Rods"/></Field>
            <Field label="SKU / Code"><input value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} placeholder="e.g. SR-001"/></Field>
            <Field label="Category">
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                {categories.map(c=><option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Unit of Measure">
              <select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}>
                {UNITS_INIT.map(u=><option key={u}>{u}</option>)}
              </select>
            </Field>
            <Field label="Reorder Point"><input type="number" value={form.reorderPoint} onChange={e=>setForm({...form,reorderPoint:e.target.value})}/></Field>
            <Field label="Reorder Qty" style={{ gridColumn:2 }}><input type="number" value={form.reorderQty} onChange={e=>setForm({...form,reorderQty:e.target.value})}/></Field>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:8 }}>
            <Btn variant="ghost" onClick={()=>setModal(null)}>Cancel</Btn>
            <Btn onClick={saveProduct}>Save Product</Btn>
          </div>
        </Modal>
      )}

      {/* Stock by Warehouse Modal */}
      {stockViewProduct && (
        <Modal title={`Stock — ${stockViewProduct.name}`} onClose={()=>setStockViewProduct(null)} width={420}>
          <table>
            <thead><tr><th>Warehouse</th><th>Qty</th><th>Status</th></tr></thead>
            <tbody>
              {warehouses.map(wh=>{
                const qty = stockViewProduct.stock[wh.id] || 0;
                return (
                  <tr key={wh.id}>
                    <td>{wh.name}</td>
                    <td><span style={{ fontFamily:"var(--ff-mono)", fontWeight:600 }}>{qty} {stockViewProduct.unit}</span></td>
                    <td><span className={`badge badge-${qty===0?"red":qty<=stockViewProduct.reorderPoint?"amber":"green"}`}>{qty===0?"EMPTY":qty<=stockViewProduct.reorderPoint?"LOW":"OK"}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Modal>
      )}
    </div>
  );
}

// ─── RECEIPT FORM ─────────────────────────────────────────────────────────────
function ReceiptForm({ receipt, products, warehouses, onSave, onClose }) {
  const [form, setForm] = useState(receipt || { supplier:"", date:today(), warehouse:warehouses[0]?.id, lines:[] });
  const [lineProduct, setLineProduct] = useState(products[0]?.id || "");
  const [lineQty, setLineQty] = useState("");

  const addLine = () => {
    if (!lineProduct || !lineQty) return;
    const exists = form.lines.findIndex(l=>l.productId===lineProduct);
    if (exists>=0) {
      const lines = [...form.lines]; lines[exists].qty += +lineQty; setForm({...form,lines});
    } else {
      setForm({...form, lines:[...form.lines, { productId:lineProduct, qty:+lineQty, received:0 }]});
    }
    setLineQty("");
  };

  const removeLine = (i) => setForm({...form, lines:form.lines.filter((_,idx)=>idx!==i)});

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:16 }}>
        <Field label="Supplier"><input value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})} placeholder="Vendor name"/></Field>
        <Field label="Date"><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></Field>
        <Field label="Warehouse">
          <select value={form.warehouse} onChange={e=>setForm({...form,warehouse:e.target.value})}>
            {warehouses.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </Field>
      </div>
      <div style={{ borderTop:"1px solid var(--border)", paddingTop:16, marginBottom:12 }}>
        <div style={{ fontSize:12, fontFamily:"var(--ff-mono)", color:"var(--text2)", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Product Lines</div>
        <div style={{ display:"flex", gap:10, marginBottom:12 }}>
          <select value={lineProduct} onChange={e=>setLineProduct(e.target.value)} style={{ flex:2 }}>
            {products.map(p=><option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
          </select>
          <input type="number" value={lineQty} onChange={e=>setLineQty(e.target.value)} placeholder="Qty" style={{ width:100 }}/>
          <Btn onClick={addLine} icon="plus">Add</Btn>
        </div>
        {form.lines.length > 0 && (
          <table>
            <thead><tr><th>Product</th><th>Qty</th><th></th></tr></thead>
            <tbody>{form.lines.map((l,i)=>{
              const p = products.find(x=>x.id===l.productId);
              return <tr key={i}><td>{p?.name}</td><td><span style={{ fontFamily:"var(--ff-mono)" }}>{l.qty} {p?.unit}</span></td>
                <td><button onClick={()=>removeLine(i)} style={{ background:"none", color:"var(--red)" }}><Icon name="x" size={14}/></button></td></tr>;
            })}</tbody>
          </table>
        )}
      </div>
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:16 }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={()=>form.supplier&&form.lines.length>0&&onSave(form)}>Save Draft</Btn>
      </div>
    </div>
  );
}

// ─── RECEIPTS ─────────────────────────────────────────────────────────────────
function Receipts({ receipts, setReceipts, products, setProducts, warehouses }) {
  const [modal, setModal] = useState(null);
  const [viewReceipt, setViewReceipt] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = receipts.filter(r =>
    r.id.includes(search) || r.supplier.toLowerCase().includes(search.toLowerCase())
  );

  const createReceipt = (form) => {
    const newRec = { ...form, id: genId("REC"), status: "pending" };
    setReceipts(prev => [newRec, ...prev]);
    setModal(null);
  };

  const validate = (rec) => {
    setProducts(prev => prev.map(p => {
      const line = rec.lines.find(l => l.productId === p.id);
      if (!line) return p;
      return { ...p, stock: { ...p.stock, [rec.warehouse]: (p.stock[rec.warehouse] || 0) + line.qty } };
    }));
    setReceipts(prev => prev.map(r => r.id === rec.id ? { ...r, status:"done", lines: r.lines.map(l=>({...l,received:l.qty})) } : r));
    setViewReceipt(null);
  };

  const wh = (id) => warehouses.find(w=>w.id===id)?.name || id;

  return (
    <div className="fade-in">
      <PageHeader title="Receipts" sub="Incoming stock from vendors"
        actions={<Btn icon="plus" onClick={()=>setModal("create")}>New Receipt</Btn>}/>
      <div style={{ display:"flex", gap:12, marginBottom:20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search receipts…"/>
      </div>
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
        {filtered.length===0 ? <Empty/> :
          <table>
            <thead><tr><th>Receipt ID</th><th>Supplier</th><th>Date</th><th>Warehouse</th><th>Lines</th><th>Status</th><th></th></tr></thead>
            <tbody>{filtered.map(r=>(
              <tr key={r.id}>
                <td><span className="tag">{r.id}</span></td>
                <td style={{ fontWeight:500 }}>{r.supplier}</td>
                <td style={{ fontFamily:"var(--ff-mono)", fontSize:13 }}>{r.date}</td>
                <td style={{ color:"var(--text2)", fontSize:13 }}>{wh(r.warehouse)}</td>
                <td><span style={{ fontFamily:"var(--ff-mono)", fontSize:13 }}>{r.lines.length} item{r.lines.length!==1?"s":""}</span></td>
                <td><StatusBadge status={r.status}/></td>
                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    <Btn variant="ghost" size="sm" icon="eye" onClick={()=>setViewReceipt(r)}>View</Btn>
                    {r.status==="pending" && <Btn variant="success" size="sm" icon="check" onClick={()=>validate(r)}>Validate</Btn>}
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        }
      </div>
      {modal==="create" && (
        <Modal title="New Receipt" onClose={()=>setModal(null)} width={620}>
          <ReceiptForm products={products} warehouses={warehouses} onSave={createReceipt} onClose={()=>setModal(null)}/>
        </Modal>
      )}
      {viewReceipt && (
        <Modal title={`Receipt — ${viewReceipt.id}`} onClose={()=>setViewReceipt(null)} width={520}>
          <div style={{ marginBottom:16, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
            {[["Supplier",viewReceipt.supplier],["Date",viewReceipt.date],["Warehouse",wh(viewReceipt.warehouse)]].map(([l,v])=>(
              <div key={l} style={{ background:"var(--card2)", borderRadius:8, padding:"10px 14px" }}>
                <div style={{ fontSize:10, fontFamily:"var(--ff-mono)", color:"var(--text3)", textTransform:"uppercase", marginBottom:4 }}>{l}</div>
                <div style={{ fontSize:14, fontWeight:500 }}>{v}</div>
              </div>
            ))}
          </div>
          <table>
            <thead><tr><th>Product</th><th>Ordered</th><th>Received</th></tr></thead>
            <tbody>{viewReceipt.lines.map((l,i)=>{
              const p = products.find(x=>x.id===l.productId);
              return <tr key={i}><td>{p?.name} <span className="tag">{p?.sku}</span></td>
                <td style={{ fontFamily:"var(--ff-mono)" }}>{l.qty} {p?.unit}</td>
                <td style={{ fontFamily:"var(--ff-mono)", color: l.received===l.qty ? "var(--green)" : "var(--amber)" }}>{l.received} {p?.unit}</td></tr>;
            })}</tbody>
          </table>
          {viewReceipt.status==="pending" && (
            <div style={{ marginTop:20, display:"flex", justifyContent:"flex-end" }}>
              <Btn variant="success" icon="check" onClick={()=>validate(viewReceipt)}>Validate Receipt → Add to Stock</Btn>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

// ─── DELIVERIES ───────────────────────────────────────────────────────────────
function Deliveries({ deliveries, setDeliveries, products, setProducts, warehouses }) {
  const [modal, setModal] = useState(null);
  const [viewDel, setViewDel] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ customer:"", date:today(), warehouse:warehouses[0]?.id, lines:[] });
  const [lineProduct, setLineProduct] = useState(products[0]?.id || "");
  const [lineQty, setLineQty] = useState("");

  const filtered = deliveries.filter(d => d.id.includes(search) || d.customer.toLowerCase().includes(search.toLowerCase()));

  const addLine = () => {
    if (!lineProduct || !lineQty) return;
    setForm(f => ({ ...f, lines:[...f.lines, { productId:lineProduct, qty:+lineQty, picked:0 }] }));
    setLineQty("");
  };

  const createDelivery = () => {
    if (!form.customer || !form.lines.length) return;
    setDeliveries(prev => [{ ...form, id:genId("DEL"), status:"pending" }, ...prev]);
    setModal(null);
    setForm({ customer:"", date:today(), warehouse:warehouses[0]?.id, lines:[] });
  };

  const validate = (del) => {
    // Check sufficient stock
    for (const l of del.lines) {
      const p = products.find(x=>x.id===l.productId);
      if (!p || (p.stock[del.warehouse]||0) < l.qty) {
        alert(`Insufficient stock for ${p?.name || l.productId} in ${warehouses.find(w=>w.id===del.warehouse)?.name}`);
        return;
      }
    }
    setProducts(prev => prev.map(p => {
      const line = del.lines.find(l=>l.productId===p.id);
      if (!line) return p;
      return { ...p, stock: { ...p.stock, [del.warehouse]: (p.stock[del.warehouse]||0) - line.qty } };
    }));
    setDeliveries(prev => prev.map(d => d.id===del.id ? {...d, status:"done", lines:d.lines.map(l=>({...l,picked:l.qty}))} : d));
    setViewDel(null);
  };

  const wh = (id) => warehouses.find(w=>w.id===id)?.name || id;

  return (
    <div className="fade-in">
      <PageHeader title="Delivery Orders" sub="Outgoing stock to customers"
        actions={<Btn icon="plus" onClick={()=>setModal("create")}>New Delivery</Btn>}/>
      <div style={{ display:"flex", gap:12, marginBottom:20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search deliveries…"/>
      </div>
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
        {filtered.length===0 ? <Empty/> :
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Warehouse</th><th>Lines</th><th>Status</th><th></th></tr></thead>
            <tbody>{filtered.map(d=>(
              <tr key={d.id}>
                <td><span className="tag">{d.id}</span></td>
                <td style={{ fontWeight:500 }}>{d.customer}</td>
                <td style={{ fontFamily:"var(--ff-mono)", fontSize:13 }}>{d.date}</td>
                <td style={{ color:"var(--text2)", fontSize:13 }}>{wh(d.warehouse)}</td>
                <td><span style={{ fontFamily:"var(--ff-mono)", fontSize:13 }}>{d.lines.length} item{d.lines.length!==1?"s":""}</span></td>
                <td><StatusBadge status={d.status}/></td>
                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    <Btn variant="ghost" size="sm" icon="eye" onClick={()=>setViewDel(d)}>View</Btn>
                    {d.status==="pending" && <Btn variant="primary" size="sm" icon="truck" onClick={()=>validate(d)}>Dispatch</Btn>}
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        }
      </div>
      {modal==="create" && (
        <Modal title="New Delivery Order" onClose={()=>setModal(null)} width={600}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:16 }}>
            <Field label="Customer"><input value={form.customer} onChange={e=>setForm({...form,customer:e.target.value})} placeholder="Customer name"/></Field>
            <Field label="Date"><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></Field>
            <Field label="Warehouse">
              <select value={form.warehouse} onChange={e=>setForm({...form,warehouse:e.target.value})}>
                {warehouses.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </Field>
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:12 }}>
            <select value={lineProduct} onChange={e=>setLineProduct(e.target.value)} style={{ flex:2 }}>
              {products.map(p=><option key={p.id} value={p.id}>{p.name} ({p.sku}) — {p.stock[form.warehouse]||0} {p.unit}</option>)}
            </select>
            <input type="number" value={lineQty} onChange={e=>setLineQty(e.target.value)} placeholder="Qty" style={{ width:100 }}/>
            <Btn onClick={addLine} icon="plus">Add</Btn>
          </div>
          {form.lines.length > 0 && (
            <table style={{ marginBottom:16 }}>
              <thead><tr><th>Product</th><th>Qty</th><th></th></tr></thead>
              <tbody>{form.lines.map((l,i)=>{
                const p = products.find(x=>x.id===l.productId);
                return <tr key={i}><td>{p?.name}</td><td style={{ fontFamily:"var(--ff-mono)" }}>{l.qty}</td>
                  <td><button onClick={()=>setForm(f=>({...f,lines:f.lines.filter((_,j)=>j!==i)}))} style={{ background:"none", color:"var(--red)" }}><Icon name="x" size={14}/></button></td></tr>;
              })}</tbody>
            </table>
          )}
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="ghost" onClick={()=>setModal(null)}>Cancel</Btn>
            <Btn onClick={createDelivery}>Create Delivery</Btn>
          </div>
        </Modal>
      )}
      {viewDel && (
        <Modal title={`Delivery — ${viewDel.id}`} onClose={()=>setViewDel(null)} width={520}>
          <div style={{ marginBottom:16, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
            {[["Customer",viewDel.customer],["Date",viewDel.date],["Warehouse",wh(viewDel.warehouse)]].map(([l,v])=>(
              <div key={l} style={{ background:"var(--card2)", borderRadius:8, padding:"10px 14px" }}>
                <div style={{ fontSize:10, fontFamily:"var(--ff-mono)", color:"var(--text3)", textTransform:"uppercase", marginBottom:4 }}>{l}</div>
                <div style={{ fontSize:14, fontWeight:500 }}>{v}</div>
              </div>
            ))}
          </div>
          <table>
            <thead><tr><th>Product</th><th>Ordered</th><th>Picked</th></tr></thead>
            <tbody>{viewDel.lines.map((l,i)=>{
              const p = products.find(x=>x.id===l.productId);
              return <tr key={i}><td>{p?.name} <span className="tag">{p?.sku}</span></td>
                <td style={{ fontFamily:"var(--ff-mono)" }}>{l.qty} {p?.unit}</td>
                <td style={{ fontFamily:"var(--ff-mono)", color: l.picked===l.qty ? "var(--green)" : "var(--amber)" }}>{l.picked} {p?.unit}</td></tr>;
            })}</tbody>
          </table>
          {viewDel.status==="pending" && (
            <div style={{ marginTop:20, display:"flex", justifyContent:"flex-end" }}>
              <Btn icon="truck" onClick={()=>validate(viewDel)}>Validate & Dispatch → Reduce Stock</Btn>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

// ─── TRANSFERS ────────────────────────────────────────────────────────────────
function Transfers({ transfers, setTransfers, products, setProducts, warehouses }) {
  const [modal, setModal] = useState(false);
  const [viewTrf, setViewTrf] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ fromWh: warehouses[0]?.id, toWh: warehouses[1]?.id || warehouses[0]?.id, date:today(), lines:[] });
  const [lineProduct, setLineProduct] = useState(products[0]?.id || "");
  const [lineQty, setLineQty] = useState("");

  const filtered = transfers.filter(t => t.id.includes(search) || warehouses.find(w=>w.id===t.fromWh)?.name.toLowerCase().includes(search.toLowerCase()));

  const addLine = () => {
    if (!lineProduct || !lineQty) return;
    setForm(f => ({ ...f, lines:[...f.lines, { productId:lineProduct, qty:+lineQty }] }));
    setLineQty("");
  };

  const createTransfer = () => {
    if (!form.lines.length || form.fromWh === form.toWh) return;
    setTransfers(prev => [{ ...form, id:genId("TRF"), status:"pending" }, ...prev]);
    setModal(false);
    setForm({ fromWh:warehouses[0]?.id, toWh:warehouses[1]?.id, date:today(), lines:[] });
  };

  const validate = (trf) => {
    for (const l of trf.lines) {
      const p = products.find(x=>x.id===l.productId);
      if (!p || (p.stock[trf.fromWh]||0) < l.qty) {
        alert(`Insufficient stock for ${p?.name} in source warehouse.`);
        return;
      }
    }
    setProducts(prev => prev.map(p => {
      const line = trf.lines.find(l=>l.productId===p.id);
      if (!line) return p;
      return { ...p, stock: { ...p.stock, [trf.fromWh]: (p.stock[trf.fromWh]||0) - line.qty, [trf.toWh]: (p.stock[trf.toWh]||0) + line.qty } };
    }));
    setTransfers(prev => prev.map(t => t.id===trf.id ? {...t, status:"done"} : t));
    setViewTrf(null);
  };

  const wh = (id) => warehouses.find(w=>w.id===id)?.name || id;

  return (
    <div className="fade-in">
      <PageHeader title="Internal Transfers" sub="Move stock between warehouses and locations"
        actions={<Btn icon="plus" onClick={()=>setModal(true)}>New Transfer</Btn>}/>
      <div style={{ display:"flex", gap:12, marginBottom:20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search transfers…"/>
      </div>
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
        {filtered.length===0 ? <Empty/> :
          <table>
            <thead><tr><th>Transfer ID</th><th>From</th><th>To</th><th>Date</th><th>Lines</th><th>Status</th><th></th></tr></thead>
            <tbody>{filtered.map(t=>(
              <tr key={t.id}>
                <td><span className="tag">{t.id}</span></td>
                <td style={{ color:"var(--text2)", fontSize:13 }}>{wh(t.fromWh)}</td>
                <td style={{ color:"var(--text2)", fontSize:13 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}><Icon name="arrowRight" size={12} color="var(--amber)"/>{wh(t.toWh)}</div>
                </td>
                <td style={{ fontFamily:"var(--ff-mono)", fontSize:13 }}>{t.date}</td>
                <td style={{ fontFamily:"var(--ff-mono)", fontSize:13 }}>{t.lines.length}</td>
                <td><StatusBadge status={t.status}/></td>
                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    <Btn variant="ghost" size="sm" icon="eye" onClick={()=>setViewTrf(t)}>View</Btn>
                    {t.status==="pending" && <Btn variant="primary" size="sm" icon="transfer" onClick={()=>validate(t)}>Execute</Btn>}
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        }
      </div>
      {modal && (
        <Modal title="New Internal Transfer" onClose={()=>setModal(false)} width={600}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:16 }}>
            <Field label="From Warehouse">
              <select value={form.fromWh} onChange={e=>setForm({...form,fromWh:e.target.value})}>
                {warehouses.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </Field>
            <Field label="To Warehouse">
              <select value={form.toWh} onChange={e=>setForm({...form,toWh:e.target.value})}>
                {warehouses.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </Field>
            <Field label="Date"><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></Field>
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:12 }}>
            <select value={lineProduct} onChange={e=>setLineProduct(e.target.value)} style={{ flex:2 }}>
              {products.map(p=><option key={p.id} value={p.id}>{p.name} — {p.stock[form.fromWh]||0} {p.unit} avail.</option>)}
            </select>
            <input type="number" value={lineQty} onChange={e=>setLineQty(e.target.value)} placeholder="Qty" style={{ width:100 }}/>
            <Btn onClick={addLine} icon="plus">Add</Btn>
          </div>
          {form.lines.length > 0 && (
            <table style={{ marginBottom:16 }}>
              <thead><tr><th>Product</th><th>Qty</th><th></th></tr></thead>
              <tbody>{form.lines.map((l,i)=>{
                const p = products.find(x=>x.id===l.productId);
                return <tr key={i}><td>{p?.name}</td><td style={{ fontFamily:"var(--ff-mono)" }}>{l.qty}</td>
                  <td><button onClick={()=>setForm(f=>({...f,lines:f.lines.filter((_,j)=>j!==i)}))} style={{ background:"none", color:"var(--red)" }}><Icon name="x" size={14}/></button></td></tr>;
              })}</tbody>
            </table>
          )}
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="ghost" onClick={()=>setModal(false)}>Cancel</Btn>
            <Btn onClick={createTransfer}>Schedule Transfer</Btn>
          </div>
        </Modal>
      )}
      {viewTrf && (
        <Modal title={`Transfer — ${viewTrf.id}`} onClose={()=>setViewTrf(null)} width={480}>
          <div style={{ background:"var(--card2)", borderRadius:10, padding:"14px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ flex:1 }}><div style={{ fontSize:10, fontFamily:"var(--ff-mono)", color:"var(--text3)", marginBottom:4 }}>FROM</div><div style={{ fontWeight:600 }}>{wh(viewTrf.fromWh)}</div></div>
            <Icon name="arrowRight" size={20} color="var(--amber)"/>
            <div style={{ flex:1 }}><div style={{ fontSize:10, fontFamily:"var(--ff-mono)", color:"var(--text3)", marginBottom:4 }}>TO</div><div style={{ fontWeight:600 }}>{wh(viewTrf.toWh)}</div></div>
          </div>
          <table>
            <thead><tr><th>Product</th><th>Qty</th></tr></thead>
            <tbody>{viewTrf.lines.map((l,i)=>{
              const p = products.find(x=>x.id===l.productId);
              return <tr key={i}><td>{p?.name} <span className="tag">{p?.sku}</span></td><td style={{ fontFamily:"var(--ff-mono)" }}>{l.qty} {p?.unit}</td></tr>;
            })}</tbody>
          </table>
          {viewTrf.status==="pending" && (
            <div style={{ marginTop:20, display:"flex", justifyContent:"flex-end" }}>
              <Btn icon="transfer" onClick={()=>validate(viewTrf)}>Execute Transfer</Btn>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

// ─── ADJUSTMENTS ──────────────────────────────────────────────────────────────
function Adjustments({ adjustments, setAdjustments, products, setProducts, warehouses }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ warehouse:warehouses[0]?.id, reason:"Count Correction", note:"", product:products[0]?.id||"", newQty:"" });

  const reasons = ["Count Correction","Damage","Theft","Expiry","System Error","Other"];

  const saveAdjustment = () => {
    const p = products.find(x=>x.id===form.product);
    if (!p || form.newQty === "") return;
    const oldQty = p.stock[form.warehouse] || 0;
    const newQty = +form.newQty;
    const delta = newQty - oldQty;
    const adj = { id:genId("ADJ"), warehouse:form.warehouse, date:today(), reason:form.reason, note:form.note, status:"done",
      lines:[{ productId:form.product, oldQty, newQty, delta }] };
    setAdjustments(prev => [adj, ...prev]);
    setProducts(prev => prev.map(pr => pr.id===form.product ? { ...pr, stock:{ ...pr.stock, [form.warehouse]:newQty } } : pr));
    setModal(false);
    setForm({ warehouse:warehouses[0]?.id, reason:"Count Correction", note:"", product:products[0]?.id||"", newQty:"" });
  };

  const wh = (id) => warehouses.find(w=>w.id===id)?.name || id;
  const selectedProduct = products.find(p=>p.id===form.product);
  const currentQty = selectedProduct ? (selectedProduct.stock[form.warehouse]||0) : 0;
  const delta = form.newQty !== "" ? +form.newQty - currentQty : null;

  return (
    <div className="fade-in">
      <PageHeader title="Stock Adjustments" sub="Correct discrepancies between recorded and physical stock"
        actions={<Btn icon="sliders" onClick={()=>setModal(true)}>New Adjustment</Btn>}/>
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
        {adjustments.length===0 ? <Empty/> :
          <table>
            <thead><tr><th>Adj. ID</th><th>Date</th><th>Warehouse</th><th>Reason</th><th>Product</th><th>Old Qty</th><th>New Qty</th><th>Delta</th><th>Note</th></tr></thead>
            <tbody>{adjustments.map(a=>(
              a.lines.map((l,i)=>{
                const p = products.find(x=>x.id===l.productId);
                return (
                  <tr key={`${a.id}-${i}`}>
                    {i===0 && <><td rowSpan={a.lines.length}><span className="tag">{a.id}</span></td>
                      <td rowSpan={a.lines.length} style={{ fontFamily:"var(--ff-mono)", fontSize:13 }}>{a.date}</td>
                      <td rowSpan={a.lines.length} style={{ color:"var(--text2)", fontSize:13 }}>{wh(a.warehouse)}</td>
                      <td rowSpan={a.lines.length}><span className="badge badge-purple">{a.reason}</span></td></>}
                    <td style={{ fontWeight:500 }}>{p?.name}</td>
                    <td style={{ fontFamily:"var(--ff-mono)", fontSize:13 }}>{l.oldQty} {p?.unit}</td>
                    <td style={{ fontFamily:"var(--ff-mono)", fontSize:13 }}>{l.newQty} {p?.unit}</td>
                    <td style={{ fontFamily:"var(--ff-mono)", fontSize:13, fontWeight:600, color: l.delta>0?"var(--green)":l.delta<0?"var(--red)":"var(--text2)" }}>
                      {l.delta>0?"+":""}{l.delta}
                    </td>
                    {i===0 && <td rowSpan={a.lines.length} style={{ color:"var(--text3)", fontSize:13 }}>{a.note}</td>}
                  </tr>
                );
              })
            ))}</tbody>
          </table>
        }
      </div>
      {modal && (
        <Modal title="New Stock Adjustment" onClose={()=>setModal(false)} width={500}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:4 }}>
            <Field label="Warehouse" style={{ gridColumn:"1/-1" }}>
              <select value={form.warehouse} onChange={e=>setForm({...form,warehouse:e.target.value})}>
                {warehouses.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </Field>
            <Field label="Product" style={{ gridColumn:"1/-1" }}>
              <select value={form.product} onChange={e=>setForm({...form,product:e.target.value})}>
                {products.map(p=><option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
              </select>
            </Field>
            <Field label="Reason">
              <select value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})}>
                {reasons.map(r=><option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label={`Counted Qty (current: ${currentQty} ${selectedProduct?.unit||""})`}>
              <input type="number" value={form.newQty} onChange={e=>setForm({...form,newQty:e.target.value})} placeholder="Enter physical count"/>
            </Field>
            <Field label="Note" style={{ gridColumn:"1/-1" }}>
              <input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Reason details…"/>
            </Field>
          </div>
          {delta !== null && (
            <div style={{ background: delta>0?"var(--green-dim)":delta<0?"var(--red-dim)":"var(--card2)", border:`1px solid ${delta>0?"rgba(16,185,129,0.3)":delta<0?"rgba(239,68,68,0.3)":"var(--border)"}`, borderRadius:8, padding:"10px 14px", marginBottom:16, fontFamily:"var(--ff-mono)", fontSize:13, color: delta>0?"var(--green)":delta<0?"var(--red)":"var(--text2)" }}>
              {delta===0 ? "No change" : `Stock will ${delta>0?"increase":"decrease"} by ${Math.abs(delta)} ${selectedProduct?.unit||""} (${delta>0?"+":""}${delta})`}
            </div>
          )}
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="ghost" onClick={()=>setModal(false)}>Cancel</Btn>
            <Btn onClick={saveAdjustment}>Apply Adjustment</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
function History({ receipts, deliveries, transfers, adjustments, products, warehouses }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const wh = (id) => warehouses.find(w=>w.id===id)?.name || id;

  const all = [
    ...receipts.filter(r=>r.status==="done").map(r=>({ id:r.id, type:"Receipt", date:r.date, party:r.supplier, warehouse:wh(r.warehouse),
      detail: r.lines.map(l=>{ const p=products.find(x=>x.id===l.productId); return `+${l.qty} ${p?.unit} ${p?.name}`; }).join(", "), color:"var(--green)" })),
    ...deliveries.filter(d=>d.status==="done").map(d=>({ id:d.id, type:"Delivery", date:d.date, party:d.customer, warehouse:wh(d.warehouse),
      detail: d.lines.map(l=>{ const p=products.find(x=>x.id===l.productId); return `-${l.qty} ${p?.unit} ${p?.name}`; }).join(", "), color:"var(--blue)" })),
    ...transfers.filter(t=>t.status==="done").map(t=>({ id:t.id, type:"Transfer", date:t.date, party:`${wh(t.fromWh)} → ${wh(t.toWh)}`, warehouse:wh(t.fromWh),
      detail: t.lines.map(l=>{ const p=products.find(x=>x.id===l.productId); return `${l.qty} ${p?.unit} ${p?.name}`; }).join(", "), color:"var(--amber)" })),
    ...adjustments.filter(a=>a.status==="done").map(a=>({ id:a.id, type:"Adjustment", date:a.date, party:a.reason, warehouse:wh(a.warehouse),
      detail: a.lines.map(l=>{ const p=products.find(x=>x.id===l.productId); return `${l.delta>0?"+":""}${l.delta} ${p?.unit} ${p?.name}`; }).join(", "), color:"var(--purple)" })),
  ].sort((a,b)=>b.date.localeCompare(a.date));

  const filtered = all.filter(m =>
    (filter==="All" || m.type===filter) &&
    (m.id.toLowerCase().includes(search.toLowerCase()) || m.party.toLowerCase().includes(search.toLowerCase()) || m.detail.toLowerCase().includes(search.toLowerCase()))
  );

  const colorMap = { Receipt:"green", Delivery:"blue", Transfer:"amber", Adjustment:"purple" };

  return (
    <div className="fade-in">
      <PageHeader title="Move History" sub="Complete stock ledger of all operations"/>
      <div style={{ display:"flex", gap:12, marginBottom:20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search movements…"/>
        <div style={{ display:"flex", gap:6 }}>
          {["All","Receipt","Delivery","Transfer","Adjustment"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ padding:"8px 14px", borderRadius:"var(--r)", background: filter===f?"var(--amber)":"var(--card2)", color: filter===f?"#000":"var(--text2)", border: filter===f?"none":"1px solid var(--border2)", fontSize:13, fontWeight: filter===f?600:400, fontFamily:"var(--ff-body)", transition:"all 0.15s" }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
        {filtered.length===0 ? <Empty message="No movements match your filter"/> :
          <table>
            <thead><tr><th>ID</th><th>Type</th><th>Date</th><th>Party / Route</th><th>Warehouse</th><th>Detail</th></tr></thead>
            <tbody>{filtered.map((m,i)=>(
              <tr key={i}>
                <td><span className="tag">{m.id}</span></td>
                <td><span className={`badge badge-${colorMap[m.type]}`}>{m.type.toUpperCase()}</span></td>
                <td style={{ fontFamily:"var(--ff-mono)", fontSize:13 }}>{m.date}</td>
                <td style={{ fontWeight:500, fontSize:13 }}>{m.party}</td>
                <td style={{ color:"var(--text2)", fontSize:13 }}>{m.warehouse}</td>
                <td style={{ fontFamily:"var(--ff-mono)", fontSize:12, color:"var(--text2)", maxWidth:280, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.detail}</td>
              </tr>
            ))}</tbody>
          </table>
        }
      </div>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function Settings({ warehouses, setWarehouses, categories, setCategories }) {
  const [modal, setModal] = useState(null);
  const [whForm, setWhForm] = useState({ name:"", location:"", capacity:1000 });
  const [newCat, setNewCat] = useState("");

  const saveWarehouse = () => {
    if (!whForm.name) return;
    if (modal === "createWh") {
      setWarehouses(prev => [...prev, { ...whForm, id:genId("wh"), capacity:+whForm.capacity }]);
    } else {
      setWarehouses(prev => prev.map(w => w.id===whForm.id ? {...w,...whForm, capacity:+whForm.capacity} : w));
    }
    setModal(null);
  };

  const addCategory = () => {
    if (!newCat || categories.includes(newCat)) return;
    setCategories(prev => [...prev, newCat]);
    setNewCat("");
  };

  return (
    <div className="fade-in">
      <PageHeader title="Settings" sub="Manage warehouses, categories, and system config"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Warehouses */}
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
          <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <h3 style={{ fontFamily:"var(--ff-head)", fontSize:18, fontWeight:700 }}>Warehouses</h3>
            <Btn size="sm" icon="plus" onClick={()=>{ setWhForm({name:"",location:"",capacity:1000}); setModal("createWh"); }}>Add</Btn>
          </div>
          {warehouses.map(w=>(
            <div key={w.id} style={{ padding:"14px 20px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:8, background:"var(--amber-dim)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon name="warehouse" size={16} color="var(--amber)"/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{w.name}</div>
                <div style={{ fontSize:12, color:"var(--text3)", fontFamily:"var(--ff-mono)" }}>{w.location} · Cap: {w.capacity.toLocaleString()}</div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <Btn variant="ghost" size="sm" icon="edit" onClick={()=>{ setWhForm({...w}); setModal("editWh"); }}/>
                <Btn variant="danger" size="sm" icon="trash" onClick={()=>setWarehouses(prev=>prev.filter(x=>x.id!==w.id))}/>
              </div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
          <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--border)" }}>
            <h3 style={{ fontFamily:"var(--ff-head)", fontSize:18, fontWeight:700, marginBottom:12 }}>Product Categories</h3>
            <div style={{ display:"flex", gap:8 }}>
              <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="New category name…" onKeyDown={e=>e.key==="Enter"&&addCategory()}/>
              <Btn size="sm" icon="plus" onClick={addCategory}>Add</Btn>
            </div>
          </div>
          <div style={{ padding:"8px 20px 12px" }}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, paddingTop:8 }}>
              {categories.map(c=>(
                <div key={c} style={{ display:"flex", alignItems:"center", gap:6, background:"var(--card2)", border:"1px solid var(--border2)", borderRadius:20, padding:"5px 12px 5px 14px" }}>
                  <span style={{ fontSize:13 }}>{c}</span>
                  <button onClick={()=>setCategories(prev=>prev.filter(x=>x!==c))} style={{ background:"none", color:"var(--text3)", display:"flex" }}><Icon name="x" size={12}/></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {(modal==="createWh"||modal==="editWh") && (
        <Modal title={modal==="createWh" ? "Add Warehouse" : "Edit Warehouse"} onClose={()=>setModal(null)} width={440}>
          <Field label="Warehouse Name"><input value={whForm.name} onChange={e=>setWhForm({...whForm,name:e.target.value})} placeholder="e.g. North Wing Storage"/></Field>
          <Field label="Location"><input value={whForm.location} onChange={e=>setWhForm({...whForm,location:e.target.value})} placeholder="Building / Floor / Unit"/></Field>
          <Field label="Capacity (units)"><input type="number" value={whForm.capacity} onChange={e=>setWhForm({...whForm,capacity:e.target.value})}/></Field>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:8 }}>
            <Btn variant="ghost" onClick={()=>setModal(null)}>Cancel</Btn>
            <Btn onClick={saveWarehouse}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function Profile({ user, setUser }) {
  const [form, setForm] = useState({ ...user });
  const [saved, setSaved] = useState(false);

  const save = () => { setUser(form); setSaved(true); setTimeout(()=>setSaved(false), 2000); };

  return (
    <div className="fade-in" style={{ maxWidth: 560 }}>
      <PageHeader title="My Profile" sub="Manage your account details"/>
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:28 }}>
        <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:28 }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg, var(--amber), #b45309)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <span style={{ fontFamily:"var(--ff-head)", fontSize:32, fontWeight:800, color:"#000" }}>{user.name[0]}</span>
          </div>
          <div>
            <div style={{ fontFamily:"var(--ff-head)", fontSize:24, fontWeight:700 }}>{user.name}</div>
            <div style={{ fontFamily:"var(--ff-mono)", fontSize:13, color:"var(--text3)" }}>{user.role}</div>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <Field label="Full Name"><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></Field>
          <Field label="Email"><input type="email" value={form.email||""} onChange={e=>setForm({...form,email:e.target.value})}/></Field>
          <Field label="Role">
            <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
              <option>Inventory Manager</option>
              <option>Warehouse Staff</option>
              <option>Supervisor</option>
              <option>Admin</option>
            </select>
          </Field>
          <Field label="Department"><input value={form.department||""} onChange={e=>setForm({...form,department:e.target.value})} placeholder="e.g. Operations"/></Field>
        </div>
        <div style={{ marginTop:20, display:"flex", gap:10, alignItems:"center" }}>
          <Btn onClick={save} icon="check">Save Changes</Btn>
          {saved && <span style={{ fontFamily:"var(--ff-mono)", fontSize:12, color:"var(--green)" }}>✓ Saved</span>}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE TITLE MAP ───────────────────────────────────────────────────────────
const PAGE_TITLES = {
  dashboard:"Dashboard", products:"Products", receipts:"Receipts", deliveries:"Delivery Orders",
  transfers:"Internal Transfers", adjustments:"Stock Adjustments", history:"Move History",
  settings:"Settings", profile:"My Profile"
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  const [products, setProducts] = useState(PRODUCTS_INIT);
  const [receipts, setReceipts] = useState(RECEIPTS_INIT);
  const [deliveries, setDeliveries] = useState(DELIVERIES_INIT);
  const [transfers, setTransfers] = useState(TRANSFERS_INIT);
  const [adjustments, setAdjustments] = useState(ADJUSTMENTS_INIT);
  const [warehouses, setWarehouses] = useState(WAREHOUSES_INIT);
  const [categories, setCategories] = useState(CATEGORIES_INIT);

  if (!user) return <AuthScreen onAuth={setUser}/>;

  const renderPage = () => {
    switch(page) {
      case "dashboard": return <Dashboard products={products} receipts={receipts} deliveries={deliveries} transfers={transfers} adjustments={adjustments} setPage={setPage}/>;
      case "products": return <Products products={products} setProducts={setProducts} warehouses={warehouses} categories={categories}/>;
      case "receipts": return <Receipts receipts={receipts} setReceipts={setReceipts} products={products} setProducts={setProducts} warehouses={warehouses}/>;
      case "deliveries": return <Deliveries deliveries={deliveries} setDeliveries={setDeliveries} products={products} setProducts={setProducts} warehouses={warehouses}/>;
      case "transfers": return <Transfers transfers={transfers} setTransfers={setTransfers} products={products} setProducts={setProducts} warehouses={warehouses}/>;
      case "adjustments": return <Adjustments adjustments={adjustments} setAdjustments={setAdjustments} products={products} setProducts={setProducts} warehouses={warehouses}/>;
      case "history": return <History receipts={receipts} deliveries={deliveries} transfers={transfers} adjustments={adjustments} products={products} warehouses={warehouses}/>;
      case "settings": return <Settings warehouses={warehouses} setWarehouses={setWarehouses} categories={categories} setCategories={setCategories}/>;
      case "profile": return <Profile user={user} setUser={setUser}/>;
      default: return null;
    }
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg)" }}>
      <Sidebar page={page} setPage={setPage} user={user} onLogout={()=>setUser(null)}/>
      <div style={{ flex:1, marginLeft:220, display:"flex", flexDirection:"column", minHeight:"100vh" }}>
        <Topbar title={PAGE_TITLES[page]} products={products}/>
        <main style={{ flex:1, padding:"28px 32px", overflowY:"auto" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}