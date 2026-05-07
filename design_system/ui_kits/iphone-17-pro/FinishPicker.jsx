// Titanium finish picker — colored circles + headline crossfade
function FinishPicker() {
  const finishes = [
    { name: "Desert Titanium", color: "radial-gradient(circle at 30% 30%, #fbb37e, #f77e2d 60%, #c95a17)" },
    { name: "Black Titanium",  color: "radial-gradient(circle at 30% 30%, #5a5f72, #32374a 55%, #1a1d28)" },
    { name: "Natural Titanium",color: "radial-gradient(circle at 30% 30%, #ffffff, #f5f5f5 60%, #c8c8c8)" },
  ];
  const [i, setI] = React.useState(0);
  const f = finishes[i];

  return (
    <section style={{ background: "#000", color: "#fff", padding: "120px 22px", textAlign: "center" }}>
      <div style={{
        fontFamily: "var(--sk-font-display)", fontSize: 21, fontWeight: 600,
        letterSpacing: "0.231px", color: "rgba(255,255,255,0.6)", marginBottom: 12,
      }}>Finish</div>
      <h2 style={{
        fontFamily: "var(--sk-font-display)", fontSize: 56, lineHeight: "60px",
        fontWeight: 600, margin: "0 auto 60px", maxWidth: 700,
        transition: "color 1s var(--ease-apple)",
      }}>Three finishes. Each one unmistakably titanium. <span style={{ display: "block", fontSize: 28, marginTop: 12, opacity: 0.8 }}>{f.name}.</span></h2>

      <div style={{
        height: 380, display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 48,
      }}>
        <div style={{
          width: 180, height: 360, borderRadius: 44,
          background: f.color,
          boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
          transition: "background 250ms var(--ease-apple)",
        }} />
      </div>

      <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
        {finishes.map((fi, idx) => (
          <button key={fi.name} onClick={() => setI(idx)}
            aria-label={fi.name}
            style={{
              width: 28, height: 28, borderRadius: "50%",
              background: fi.color,
              border: idx === i ? "2px solid #2997FF" : "2px solid transparent",
              outline: "none",
              boxShadow: "inset 0 0 .5px rgba(0,0,0,0.11), 0 0 0 1px rgba(255,255,255,0.05)",
              cursor: "pointer", padding: 0,
              transition: "border 0.32s var(--ease-apple)",
            }} />
        ))}
      </div>
    </section>
  );
}
window.FinishPicker = FinishPicker;
