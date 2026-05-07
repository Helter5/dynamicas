// Hero — dark, full-bleed, oversized headline + CTAs + product slot
function Hero() {
  return (
    <section style={{
      background: "#000", color: "#fff",
      paddingTop: 76, paddingBottom: 0,
      textAlign: "center",
      overflow: "hidden",
    }}>
      <div style={{
        fontFamily: "var(--sk-font-text)", fontSize: 14,
        opacity: 0.85, letterSpacing: "-0.224px", marginBottom: 8,
      }}>New</div>
      <h1 style={{
        fontFamily: "var(--sk-font-display)",
        fontSize: 80, lineHeight: "84px", fontWeight: 600,
        letterSpacing: "-0.5px",
        margin: "0 auto", maxWidth: 980,
      }}>iPhone 17 Pro</h1>
      <p style={{
        fontFamily: "var(--sk-font-display)",
        fontSize: 28, lineHeight: "32px", fontWeight: 600,
        margin: "16px auto 28px",
        background: "linear-gradient(90deg,#f77e2d,#fbb37e,#f5f5f5,#7a8aa6,#32374a)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>All titanium. All power. All you.</p>
      <div style={{ display: "flex", gap: 18, justifyContent: "center", marginBottom: 40 }}>
        <a href="#" style={{
          background: "#0071E3", color: "#fff",
          padding: "10px 22px", borderRadius: 980,
          fontFamily: "var(--sk-font-text)", fontSize: 17,
          fontWeight: 400, textDecoration: "none",
        }}>Buy</a>
        <a href="#" style={{
          color: "#2997FF",
          fontFamily: "var(--sk-font-text)", fontSize: 17,
          fontWeight: 400, textDecoration: "none",
          padding: "10px 0",
        }}>Watch the film ›</a>
      </div>
      {/* product render placeholder */}
      <div style={{
        height: 460, maxWidth: 1100, margin: "0 auto",
        background: "radial-gradient(ellipse at 50% 60%, #1a1a1c 0%, #000 70%)",
        position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          width: 220, height: 440,
          borderRadius: 48,
          background: "linear-gradient(135deg, #4a4a52, #32374a 50%, #1a1d28)",
          boxShadow: "0 0 0 2px #1a1d28, 0 60px 120px rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "rgba(255,255,255,0.25)",
          fontFamily: "var(--sk-font-text)", fontSize: 12,
        }}>Product render</div>
      </div>
    </section>
  );
}
window.Hero = Hero;
