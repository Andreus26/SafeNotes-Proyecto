export default function TarjetaNota({ nota }) {
  return (
    <article
      style={{
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        padding: "14px 16px",
        marginBottom: "12px",
        backgroundColor: nota.importante ? "#fffbeb" : "#ffffff",
        color: "#111827",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <strong>{nota.categoria || "General"}</strong>
        <span>{nota.importante ? "⭐ Importante" : "Normal"}</span>
      </div>
      <p style={{ margin: 0 }}>{nota.texto}</p>
    </article>
  );
}