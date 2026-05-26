// ───────────────── STYLES ─────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(to bottom right, #eff6ff, #f0fdf4)",
    padding: "30px",
    fontFamily: "Segoe UI",
    color: "#1e293b",
  },

  header: {
    textAlign: "center",
    marginBottom: "35px",
  },

  heading: {
    fontSize: "46px",
    color: "#0f172a",
    margin: 0,
    fontWeight: "700",
    letterSpacing: "1px",
  },

  subheading: {
    color: "#475569",
    marginTop: "10px",
    fontSize: "17px",
  },

  stats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "22px",
    marginBottom: "30px",
  },

  statCard: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "20px",
    textAlign: "center",
    border: "1px solid #dbeafe",
    boxShadow:
      "0 6px 18px rgba(59,130,246,0.08)",
    transition: "0.3s",
  },

  card: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "20px",
    marginBottom: "28px",
    border: "1px solid #dcfce7",
    boxShadow:
      "0 6px 18px rgba(34,197,94,0.08)",
  },

  sectionTitle: {
    textAlign: "center",
    marginBottom: "24px",
    color: "#0f172a",
    fontSize: "26px",
    fontWeight: "700",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",
    gap: "16px",
    marginBottom: "22px",
  },

  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #bfdbfe",
    fontSize: "14px",
    background: "#f8fafc",
    color: "#0f172a",
    outline: "none",
  },

  doctorBox: {
    background:
      "linear-gradient(to right, #dbeafe, #dcfce7)",
    color: "#0f172a",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "20px",
    textAlign: "center",
    fontWeight: "600",
    border: "1px solid #bfdbfe",
  },

  buttonGroup: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
  },

  primaryButton: {
    background:
      "linear-gradient(to right, #2563eb, #0ea5e9)",
    color: "white",
    border: "none",
    padding: "13px 22px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "0.3s",
  },

  dangerButton: {
    background:
      "linear-gradient(to right, #16a34a, #22c55e)",
    color: "white",
    border: "none",
    padding: "13px 22px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    overflow: "hidden",
    borderRadius: "14px",
    background: "#ffffff",
  },

  tableHeader: {
    background: "#dbeafe",
    color: "#0f172a",
  },

  dischargeButton: {
    background:
      "linear-gradient(to right, #0ea5e9, #2563eb)",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "10px",
    marginRight: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  prescribeButton: {
    background:
      "linear-gradient(to right, #16a34a, #22c55e)",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  outputBox: {
    background:
      "linear-gradient(to bottom right, #0f172a, #1e293b)",
    color: "#f8fafc",
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid #334155",
    boxShadow:
      "0 6px 18px rgba(15,23,42,0.25)",
  },

  pre: {
    whiteSpace: "pre-wrap",
    lineHeight: "1.8",
    color: "#e2e8f0",
    fontSize: "14px",
  },
};