// Highlight tiles — alternating dark/light, eyebrow + headline + body
function HighlightTile({ eyebrow, headline, body, dark, accent }) {
  const fg = dark ? "#fff" : "#1D1D1F";
  const sub = dark ? "rgba(255,255,255,0.7)" : "#6E6E73";
  return (
    <div style={{
      background: dark ? "#1D1D1F" : "#F5F5F7",
      borderRadius: 28,
      padding: "76px 56px",
      color: fg,
      flex: 1,
      minHeight: 460,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
    }}>
      <div style={{
        fontFamily: "var(--sk-font-text)", fontSize: 21,
        fontWeight: 600, letterSpacing: "0.231px",
        color: accent || sub,
      }}>{eyebrow}</div>
      <div>
        <div style={{
          fontFamily: "var(--sk-font-display)", fontSize: 40, lineHeight: "44px",
          fontWeight: 600, marginBottom: 16, maxWidth: 380,
        }}>{headline}</div>
        <div style={{
          fontFamily: "var(--sk-font-text)", fontSize: 17, lineHeight: "25px",
          color: sub, maxWidth: 380,
        }}>{body}</div>
      </div>
    </div>
  );
}

function Highlights() {
  return (
    <section style={{
      background: "#F5F5F7",
      padding: "76px 22px",
    }}>
      <div style={{ maxWidth: 1260, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", gap: 14 }}>
          <HighlightTile
            dark
            eyebrow="A19 Pro"
            headline="The fastest chip ever in iPhone."
            body="A new 3-nanometer architecture delivers desktop-class performance with all-day efficiency."
          />
          <HighlightTile
            eyebrow="Camera"
            headline="48MP Fusion. New 5× telephoto."
            body="Studio-quality video and a redesigned optical system, engineered for low light."
          />
        </div>
        <HighlightTile
          dark
          eyebrow="Design"
          headline="Forged in titanium."
          body="An aerospace-grade titanium frame, contoured edges, and a refined matte finish — built to last."
        />
        <div style={{ display: "flex", gap: 14 }}>
          <HighlightTile
            eyebrow="Battery"
            headline="All-day battery. And then some."
            body="Up to 33 hours of video playback. The longest battery life ever in iPhone."
          />
          <HighlightTile
            dark
            eyebrow="Apple Intelligence"
            headline="Built for the personal."
            body="Powerful generative models, run privately on-device. Smart in every app."
          />
        </div>
      </div>
    </section>
  );
}
window.Highlights = Highlights;
window.HighlightTile = HighlightTile;
