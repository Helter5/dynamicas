// Apple footer — dense link grid, light gray bg, micro-type
function FooterCol({ title, links }) {
  return (
    <div style={{ minWidth: 140 }}>
      <div style={{
        fontFamily: "var(--sk-font-text)", fontSize: 12,
        fontWeight: 600, color: "#1D1D1F", marginBottom: 8,
      }}>{title}</div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        {links.map(l => (
          <li key={l}>
            <a href="#" style={{
              fontFamily: "var(--sk-font-text)", fontSize: 12,
              color: "#424245", textDecoration: "none", lineHeight: "16px",
            }}>{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{
      background: "#F5F5F7", color: "#6E6E73",
      padding: "20px 22px 22px",
      borderTop: "1px solid #E8E8ED",
    }}>
      <div style={{ maxWidth: 1024, margin: "0 auto" }}>
        <p style={{
          fontFamily: "var(--sk-font-text)", fontSize: 12, lineHeight: "16px",
          letterSpacing: "-0.12px", color: "#6E6E73",
          margin: "0 0 32px", paddingBottom: 16,
          borderBottom: "1px solid #D2D2D7",
        }}>
          <sup>1</sup> Available on monthly installments. Pricing and offers subject to change. See apple.com for full terms.
        </p>

        <div style={{ display: "flex", gap: 60, flexWrap: "wrap", paddingBottom: 28, borderBottom: "1px solid #D2D2D7", marginBottom: 14 }}>
          <FooterCol title="Shop and Learn" links={["Store", "Mac", "iPad", "iPhone", "Watch", "AirPods", "Accessories", "Gift Cards"]} />
          <FooterCol title="Apple Wallet" links={["Wallet", "Apple Card", "Apple Pay", "Apple Cash"]} />
          <FooterCol title="Account" links={["Manage Your Apple ID", "Apple Store Account", "iCloud.com"]} />
          <FooterCol title="Apple Store" links={["Find a Store", "Genius Bar", "Today at Apple", "Group Reservations"]} />
          <FooterCol title="For Business" links={["Apple and Business", "Shop for Business"]} />
          <FooterCol title="About Apple" links={["Newsroom", "Apple Leadership", "Career Opportunities", "Investors", "Ethics & Compliance", "Events", "Contact Apple"]} />
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontFamily: "var(--sk-font-text)", fontSize: 12, color: "#6E6E73",
        }}>
          <span>Copyright © 2026 Apple Inc. All rights reserved.</span>
          <span style={{ display: "flex", gap: 16 }}>
            <a href="#" style={{ color: "#6E6E73", textDecoration: "none" }}>Privacy Policy</a>
            <a href="#" style={{ color: "#6E6E73", textDecoration: "none" }}>Terms of Use</a>
            <a href="#" style={{ color: "#6E6E73", textDecoration: "none" }}>Sales and Refunds</a>
            <a href="#" style={{ color: "#6E6E73", textDecoration: "none" }}>Site Map</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
