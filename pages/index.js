import { useState } from 'react';
import Router from 'next/router';

export default function Home() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    room: '',
    rent_amount: '',
    due_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }

    const phoneRegex = /^0\d{9,12}$/;
    if (!form.phone.trim()) {
      newErrors.phone = 'Nomor WA wajib diisi';
    } else if (!phoneRegex.test(form.phone)) {
      newErrors.phone = 'Format nomor salah (contoh: 08123456789)';
    }

    if (!form.rent_amount.trim()) {
      newErrors.rent_amount = 'Harga sewa wajib diisi';
    } else if (isNaN(form.rent_amount) || Number(form.rent_amount) <= 0) {
      newErrors.rent_amount = 'Harga sewa harus lebih dari 0';
    }

    if (!form.due_date) {
      newErrors.due_date = 'Tanggal jatuh tempo wajib diisi';
    } else {
      const dueDate = new Date(form.due_date);
      const today = new Date();
      if (dueDate < today) {
        newErrors.due_date = 'Tanggal jatuh tempo tidak boleh kurang dari hari ini';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      let phone = form.phone.trim();
      if (phone.startsWith('0')) phone = '62' + phone.slice(1);
      if (!phone.startsWith('62')) phone = '62' + phone;

      const body = {
        ...form,
        phone,
        rent_amount: Number(form.rent_amount),
      };

      const res = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const j = await res.json();
      setLoading(false);

      if (j.success) {
        alert('🎉 Data berhasil disimpan!');
        Router.push('/tenants');
      } else {
        alert('❌ Error: ' + (j.message || 'Gagal menyimpan data'));
      }
    } catch (err) {
      setLoading(false);
      alert('Terjadi kesalahan: ' + err.message);
    }
  };

  return (
    <main
      style={{
        padding: '40px 20px',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        backgroundColor: '#f5f7fa',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '500px',
          padding: '32px',
          border: '1px solid #e0e0e0',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '8px',
            }}
          >
            🏠 Tambah Penghuni Kost
          </h1>
          <p style={{ color: '#7f8c8d', fontSize: '0.95rem' }}>
            Isi formulir di bawah untuk menambahkan penghuni baru
          </p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ position: 'relative' }}>
            <label
              style={{
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#34495e',
                marginBottom: '6px',
                display: 'block',
              }}
            >
              Nama Penghuni 📝
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: errors.name ? '2px solid #e74c3c' : '1px solid #bdc3c7',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
                outline: 'none',
              }}
            />
            {errors.name && (
              <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                {errors.name}
              </span>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <label
              style={{
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#34495e',
                marginBottom: '6px',
                display: 'block',
              }}
            >
              Nomor WhatsApp 📱
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="08123456789"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: errors.phone ? '2px solid #e74c3c' : '1px solid #bdc3c7',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
                outline: 'none',
              }}
            />
            {errors.phone && (
              <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                {errors.phone}
              </span>
            )}
          </div>

          <div>
            <label
              style={{
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#34495e',
                marginBottom: '6px',
                display: 'block',
              }}
            >
              Nomor Kamar 🛏️
            </label>
            <input
              type="text"
              name="room"
              value={form.room}
              onChange={handleChange}
              placeholder="Misal: A1, B2, atau 301"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #bdc3c7',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <label
              style={{
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#34495e',
                marginBottom: '6px',
                display: 'block',
              }}
            >
              Harga Sewa (Rp) 💰
            </label>
            <input
              type="text"
              name="rent_amount"
              value={form.rent_amount}
              onChange={handleChange}
              placeholder="1.500.000"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: errors.rent_amount ? '2px solid #e74c3c' : '1px solid #bdc3c7',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
                outline: 'none',
              }}
            />
            {errors.rent_amount && (
              <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                {errors.rent_amount}
              </span>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <label
              style={{
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#34495e',
                marginBottom: '6px',
                display: 'block',
              }}
            >
              Tanggal Jatuh Tempo 📅
            </label>
            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: errors.due_date ? '2px solid #e74c3c' : '1px solid #bdc3c7',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
                outline: 'none',
              }}
            />
            {errors.due_date && (
              <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                {errors.due_date}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              padding: '14px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
              marginTop: '12px',
            }}
            onMouseOver={(e) => {
              if (!loading) e.target.style.backgroundColor = '#2980b9';
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.backgroundColor = '#3498db';
            }}
          >
            {loading ? (
              <>
                <span style={{ marginRight: '8px' }}>🔄</span>
                Menyimpan...
              </>
            ) : (
              '✅ Simpan Data'
            )}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center' }}>
          <a
            href="/tenants"
            style={{
              color: '#3498db',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '0.95rem',
            }}
          >
            👁️‍🗨️ Lihat Daftar Penghuni
          </a>
        </p>
      </div>
    </main>
  );
}