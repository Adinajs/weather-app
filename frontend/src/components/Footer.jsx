export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="scanline-divider" />
      <div style={styles.content}>
        <div>
          <strong style={{ color: "var(--text-primary)" }}>Adina Saif Ullah</strong>
          <span style={{ color: "var(--text-faint)" }}> — AI Engineer Intern Technical Assessment</span>
        </div>
        <p style={styles.blurb}>
          Built for the Product Manager Accelerator AI Engineer Intern assessment.
          The Product Manager Accelerator Program supports PM professionals at every
          career stage, from students to VPs of Product, through 1:1 coaching, hands-on
          training, and real-world projects.{" "}
          <a
            href="https://www.linkedin.com/company/product-manager-accelerator/"
            target="_blank"
            rel="noreferrer"
          >
            PM Accelerator on LinkedIn ↗
          </a>
        </p>
      </div>
    </footer>
  );
}

const styles = {
  footer: { marginTop: 48, paddingBottom: 24 },
  content: { padding: "20px 32px", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 },
  blurb: { maxWidth: 720, marginTop: 6 },
};
