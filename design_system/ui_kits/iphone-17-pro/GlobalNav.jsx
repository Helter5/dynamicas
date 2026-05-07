// Global Apple nav — 44px tall, dark, full-bleed
function GlobalNav() {
  const links = ["Store", "Mac", "iPad", "iPhone", "Watch", "AirPods", "TV & Home", "Entertainment", "Accessories", "Support"];
  return (
    <nav style={{
      height: 44, background: "rgba(0,0,0,0.8)",
      backdropFilter: "saturate(180%) blur(20px)",
      WebkitBackdropFilter: "saturate(180%) blur(20px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "sticky", top: 0, zIndex: 9999,
      color: "rgba(255,255,255,0.8)",
      fontFamily: "var(--sk-font-text)", fontSize: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 36, width: "100%", maxWidth: 1024, padding: "0 22px" }}>
        <img src="../../assets/apple-logo.svg" alt="Apple" style={{ width: 14, height: 18, filter: "invert(1)" }} />
        {links.map(l => (
          <a key={l} href="#" style={{
            color: "rgba(255,255,255,0.8)", textDecoration: "none",
            transition: "color 0.32s var(--ease-apple)",
          }}
            onMouseOver={e => e.currentTarget.style.color = "#fff"}
            onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}>
            {l}
          </a>
        ))}
        <span style={{ flex: 1 }}></span>
        <img src="../../assets/search.svg" alt="Search" style={{ width: 15, height: 15, filter: "invert(1)", opacity: 0.8 }} />
        <img src="../../assets/cart.svg" alt="Cart" style={{ width: 15, height: 15, filter: "invert(1)", opacity: 0.8 }} />
      </div>
    </nav>
  );
}
window.GlobalNav = GlobalNav;
