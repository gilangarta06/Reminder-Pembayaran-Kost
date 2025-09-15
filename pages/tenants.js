import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url) => fetch(url).then(r => r.json());

export default function TenantsPage() {
  const { data, mutate } = useSWR('/api/tenants', fetcher);
  const [loadingId, setLoadingId] = useState(null);

  if (!data) {
    return (
      <main style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui', color: '#666' }}>
        <div style={{ fontSize: '1.5em', marginBottom: 10 }}>🔄</div>
        <p>Memuat data penghuni...</p>
      </main>
    );
  }

  const totalTenants = data.data.length;

  async function sendNow(id) {
    setLoadingId(id);
    const res = await fetch('/api/send-now', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId: id }),
    });
    const j = await res.json();
    alert('Result: ' + (j.success ? 'Berhasil dikirim!' : 'Gagal mengirim...'));
    setLoadingId(null);
  }

  async function remove(id) {
    if (!confirm('Yakin ingin menghapus penghuni ini? Tindakan ini tidak bisa dibatalkan.')) return;
    await fetch(`/api/tenants/${id}`, { method: 'DELETE' });
    mutate(); // Refresh data
  }

  return (
    <main style={{ padding: 30, fontFamily: 'system-ui', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: 30, textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.2em', color: '#2563eb', marginBottom: 8 }}>
            🏠 <span style={{ fontWeight: 600 }}>Daftar Penghuni Kost</span>
          </h1>
          <p style={{ color: '#64748b', marginBottom: 20 }}>
            Total: <strong>{totalTenants}</strong> penghuni aktif
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              borderRadius: '12px',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 6px 15px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 10px rgba(16, 185, 129, 0.3)';
            }}
          >
            ✅ Tambah Penghuni Baru
          </a>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          {data.data.map((t) => (
            <div
              key={t._id}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0',
                transition: 'box-shadow 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                },
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.2em' }}>{t.name}</h3>
                <span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '4px 10px', borderRadius: '12px', fontSize: '0.9em' }}>
                  {t.room || '—'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '0.95em' }}>
                <div>
                  <strong>📞 Nomor WA:</strong> <span style={{ color: '#0f172a' }}>{t.phone}</span>
                </div>
                <div>
                  <strong>💰 Sewa:</strong> <span style={{ color: '#16a34a' }}>{t.rent_amount.toLocaleString()} IDR</span>
                </div>
                <div>
                  <strong>📅 Jatuh Tempo:</strong>{' '}
                  <span style={{ color: '#7e22ce' }}>
                    {new Date(t.due_date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <strong>📩 Status:</strong>{' '}
                  <span style={{ color: '#059669', fontWeight: 600 }}>Aktif</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => sendNow(t._id)}
                  disabled={loadingId === t._id}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: loadingId === t._id ? 'wait' : 'pointer',
                    transition: 'background 0.3s',
                    fontSize: '0.95em',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#1d4ed8';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#2563eb';
                  }}
                >
                  {loadingId === t._id ? (
                    <span>
                      🔄 Mengirim...
                    </span>
                  ) : (
                    <span>
                      📨 Kirim Sekarang
                    </span>
                  )}
                </button>

                <button
                  onClick={() => remove(t._id)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.3s',
                    fontSize: '0.95em',
                    minWidth: '100px',
                    boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#dc2626';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#ef4444';
                  }}
                >
                  🔴 Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {data.data.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontStyle: 'italic' }}>
            Belum ada data penghuni.
            <br />
            <a href="/" style={{ color: '#2563eb', fontWeight: 600 }}>
              ➕ Tambahkan penghuni pertama
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
