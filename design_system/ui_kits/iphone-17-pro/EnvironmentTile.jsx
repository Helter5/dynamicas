// Environment tile row — colored accents (recycling / electricity / packaging)
function EnvBlock({ accent, eyebrow, head }) {
  return (
    <div style={{
      flex: 1,
      background: "#fff",
      borderRadius: 20,
      padding: "40px 32px",
      minHeight: 220,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
    }}>
      <div style={{
        fontFamily: "var(--sk-font-text)", fontSize: 14,
        fontWeight: 600, letterSpacing: "-0.224px",
        color: accent,
      }}>{eyebrow}</div>
      <div style={{
        fontFamily: "var(--sk-font-display)", fontSize: 25.5, lineHeight: "31.5px",
        fontWeight: 600, color: "#1D1D1F",
      }}>{head}</div>
    </div>
  );
}

function EnvironmentTile() {
  return (
    <section style={{ background: "#F5F5F7", padding: "76px 22px" }}>
      <div style={{ maxWidth: 1260, margin: "0 auto" }}>
        <div style={{
          fontFamily: "var(--sk-font-display)", fontSize: 21, fontWeight: 600,
          letterSpacing: "0.231px", color: "#00D959", marginBottom: 20,
        }}>Environment</div>
        <h2 style={{
          fontFamily: "var(--sk-font-display)", fontSize: 40, lineHeight: "44px",
          fontWeight: 600, color: "#1D1D1F", margin: 0, marginBottom: 40,
          maxWidth: 720,
        }}>Designed to leave the world better than we found it.</h2>
        <div style={{ display: "flex", gap: 14 }}>
          <EnvBlock accent="#8664FF" eyebrow="RECYCLING" head="More than 30% recycled content by weight." />
          <EnvBlock accent="#ED6300" eyebrow="ELECTRICITY" head="100% clean energy used in final assembly." />
          <EnvBlock accent="#00A1B3" eyebrow="PACKAGING" head="Fiber-based packaging, no outer plastic wrap." />
        </div>
      </div>
    </section>
  );
}
window.EnvironmentTile = EnvironmentTile;
