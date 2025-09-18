import { useState } from "react";
import Router from "next/router";
import InputField from "./InputField";
import { validateForm } from "../utils/validation";

export default function TenantForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    room: "",
    rent_amount: "",
    due_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      let phone = form.phone.trim();
      if (phone.startsWith("0")) phone = "62" + phone.slice(1);
      if (!phone.startsWith("62")) phone = "62" + phone;

      const body = { ...form, phone, rent_amount: Number(form.rent_amount) };

      const res = await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const j = await res.json();
      setLoading(false);

      if (j.success) {
        alert("🎉 Data berhasil disimpan!");
        Router.push("/tenants");
      } else {
        alert("❌ Error: " + (j.message || "Gagal menyimpan data"));
      }
    } catch (err) {
      setLoading(false);
      alert("Terjadi kesalahan: " + err.message);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <InputField
        label="Nama Penghuni 📝"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Masukkan nama lengkap"
        error={errors.name}
      />
      <InputField
        label="Nomor WhatsApp 📱"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="08123456789"
        error={errors.phone}
      />
      <InputField
        label="Nomor Kamar 🛏️"
        name="room"
        value={form.room}
        onChange={handleChange}
        placeholder="Misal: A1, B2, atau 301"
      />
      <InputField
        label="Harga Sewa (Rp) 💰"
        name="rent_amount"
        value={form.rent_amount}
        onChange={handleChange}
        placeholder="1.500.000"
        error={errors.rent_amount}
      />
      <InputField
        label="Tanggal Jatuh Tempo 📅"
        name="due_date"
        type="date"
        value={form.due_date}
        onChange={handleChange}
        error={errors.due_date}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: "#3498db",
          color: "white",
          padding: "14px",
          border: "none",
          borderRadius: "8px",
          fontSize: "1.1rem",
          fontWeight: "600",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background-color 0.3s",
          marginTop: "12px",
        }}
        onMouseOver={(e) => {
          if (!loading) e.target.style.backgroundColor = "#2980b9";
        }}
        onMouseOut={(e) => {
          if (!loading) e.target.style.backgroundColor = "#3498db";
        }}
      >
        {loading ? "🔄 Menyimpan..." : "✅ Simpan Data"}
      </button>
    </form>
  );
}
