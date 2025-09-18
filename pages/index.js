import TenantForm from "../component/TenantForm";

export default function Home() {
  return (
    <main
      style={{
        padding: "40px 20px",
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "500px",
          padding: "32px",
          border: "1px solid #e0e0e0",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "600",
              color: "#2c3e50",
              marginBottom: "8px",
            }}
          >
            🏠 Tambah Penghuni Kost
          </h1>
          <p style={{ color: "#7f8c8d", fontSize: "0.95rem" }}>
            Isi formulir di bawah untuk menambahkan penghuni baru
          </p>
        </div>

        <TenantForm />

        <p style={{ marginTop: "24px", textAlign: "center" }}>
          <a
            href="/tenants"
            style={{
              color: "#3498db",
              textDecoration: "none",
              fontWeight: "500",
              fontSize: "0.95rem",
            }}
          >
            👁️‍🗨️ Lihat Daftar Penghuni
          </a>
        </p>
      </div>
    </main>
  );
}
