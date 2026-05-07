// Sticky product nav — 52px, light/blurred, blue Buy pill
function LocalNav() {
  const links = ["Overview", "Switch from Android", "Tech Specs", "Compare"];
  return (
    <nav style={{
      height: 52, position: "sticky", top: 44, zIndex: 9998,
      background: "rgba(245,245,247,0.72)",
      backdropFilter: "saturate(180%) blur(20px)",
      WebkitBackdropFilter: "saturate(180%) blur(20px)",
      borderBottom: "1px solid rgba(0,0,0,0.08)",
      display: "flex", alignItems: "center",
    }}>
      <div style={{
        width: "100%", maxWidth: 1024, margin: "0 auto",
        padding: "0 22px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{
          fontFamily: "var(--sk-font-display)", fontSize: 21,
          fontWeight: 600, letterSpacing: "0.231px",
          color: "#1D1D1F",
        }}>iPhone 17 Pro</span>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {links.map(l => (
            <a key={l} href="#" style={{
              fontFamily: "var(--sk-font-text)", fontSize: 12,
              color: "#1D1D1F", textDecoration: "none",
              opacity: 0.88,
            }}>{l}</a>
          ))}
          <button className="sk-btn-buy">Buy</button>
        </div>
      </div>
    </nav>
  );
}
window.LocalNav = LocalNav;
