// Bottom marquee CTA strip
function BuyStrip() {
  return (
    <section style={{ background: "#fff", padding: "76px 22px", textAlign: "center" }}>
      <div style={{
        fontFamily: "var(--sk-font-display)", fontSize: 21, fontWeight: 600,
        letterSpacing: "0.231px", color: "#0066CC", marginBottom: 12,
      }}>iPhone</div>
      <h2 style={{
        fontFamily: "var(--sk-font-display)", fontSize: 48, lineHeight: "52px",
        fontWeight: 600, color: "#1D1D1F", margin: "0 0 28px",
      }}>Make it yours.</h2>
      <a href="#" className="sk-btn-marquee">Order now</a>
      <p style={{
        fontFamily: "var(--sk-font-text)", fontSize: 14, color: "#6E6E73",
        marginTop: 18,
      }}>From $999 or $41.62/mo. for 24 mo.<sup style={{ fontSize: 8 }}>1</sup></p>
    </section>
  );
}
window.BuyStrip = BuyStrip;
