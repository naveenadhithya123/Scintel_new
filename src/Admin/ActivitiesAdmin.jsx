import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

/* ── Delete Modal ── */
function DeleteModal({ open, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      backgroundColor: 'rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div
        style={{
          background: '#fff', borderRadius: 16, padding: '36px 32px 28px',
          width: 380, boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          textAlign: 'center',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          backgroundColor: '#fef2f2',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0d2233', marginBottom: 8 }}>
          Delete Academic Year?
        </h3>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 28, lineHeight: 1.5 }}>
          Are you sure you want to delete this year?<br />This action cannot be undone.
        </p>
        <button onClick={onConfirm} style={{
          width: '100%', padding: '12px 0', borderRadius: 10,
          backgroundColor: '#ef4444', color: '#fff',
          border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginBottom: 10,
        }}>Delete</button>
        <button onClick={onCancel} style={{
          width: '100%', padding: '11px 0', borderRadius: 10,
          backgroundColor: '#fff', color: '#374151',
          border: '1.5px solid #e2e8f0', fontWeight: 500, fontSize: 14, cursor: 'pointer',
        }}>Cancel</button>
      </div>
    </div>
  );
}

/* ── Add Year Modal ── */
function AddYearModal({ open, onAdd, onCancel, existingYears }) {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 2 + i);
  const [startYear, setStartYear] = useState(currentYear);

  const endYear = startYear + 1;
  const formatted = `${startYear}-${String(endYear).slice(2)}`;
  const alreadyExists = existingYears.includes(formatted);

  if (!open) return null;

  const handleAdd = () => {
    if (alreadyExists) return;
    onAdd(formatted);
    setStartYear(currentYear);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      backgroundColor: 'rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div
        style={{
          background: '#fff', borderRadius: 16, padding: '32px 28px 24px',
          width: 420, boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ fontSize: 19, fontWeight: 700, color: '#0d2233', marginBottom: 6 }}>
          Add Academic Year
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
          Select the starting year — the end year is set automatically.
        </p>

        <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 8 }}>
          Starting Year
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <select
            value={startYear}
            onChange={e => setStartYear(Number(e.target.value))}
            style={{
              flex: 1, padding: '10px 12px', borderRadius: 8,
              border: '1.5px solid #cbd5e1', fontSize: 14, outline: 'none',
              backgroundColor: '#f8fafc', color: '#0f172a', cursor: 'pointer',
            }}
          >
            {yearOptions.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <span style={{ color: '#94a3b8', fontWeight: 700, fontSize: 20 }}>→</span>
          <div style={{
            flex: 1, padding: '10px 12px', borderRadius: 8,
            border: '1.5px solid #e2e8f0', fontSize: 14,
            backgroundColor: '#f1f5f9', color: '#94a3b8', textAlign: 'center',
          }}>
            {endYear}
          </div>
        </div>

        {/* Preview */}
        <div style={{
          padding: '10px 14px', borderRadius: 8,
          backgroundColor: alreadyExists ? '#fef2f2' : '#e0f7fa',
          border: `1px solid ${alreadyExists ? '#fca5a5' : '#b2ebf2'}`,
          fontSize: 13, fontWeight: 600,
          color: alreadyExists ? '#ef4444' : '#0d7a8a',
          marginBottom: 4,
        }}>
          {alreadyExists
            ? `"${formatted}" already exists`
            : `Academic Year: ${formatted}`}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            padding: '9px 22px', borderRadius: 8, border: '1.5px solid #e2e8f0',
            background: '#f1f5f9', color: '#374151', fontWeight: 500, fontSize: 14, cursor: 'pointer',
          }}>Cancel</button>
          <button
            onClick={handleAdd}
            disabled={alreadyExists}
            style={{
              padding: '9px 22px', borderRadius: 8, border: 'none',
              background: alreadyExists ? '#cbd5e1' : '#0d2233',
              color: '#fff', fontWeight: 600, fontSize: 14,
              cursor: alreadyExists ? 'not-allowed' : 'pointer',
            }}
          >Add Year</button>
        </div>
      </div>
    </div>
  );
}

/* ── Activities Page ── */
const initialData = [
  { id: 1, year: '2025-26', count: 10 },
  { id: 2, year: '2024-25', count: 10 },
  { id: 3, year: '2023-24', count: 10 },
  { id: 4, year: '2022-23', count: 10 },
  { id: 5, year: '2021-22', count: 10 },
];

export default function Activities() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(initialData);
  const [deleteId, setDeleteId] = useState(null);
  const [showAddYear, setShowAddYear] = useState(false);

  const existingYears = rows.map(r => r.year);

return (

  <div className="flex h-screen bg-[#f4f7f9]">

    {/* SIDEBAR */}
    <AdminSidebar />

    {/* MAIN CONTENT */}
    <div className="flex-1 p-10 overflow-y-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-semibold text-gray-800">
          Activities
        </h1>

        <button
          onClick={() => setShowAddYear(true)}
          className="bg-[#083A4B] text-white px-5 py-2 rounded-lg"
        >
          + Add Year
        </button>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

        <table className="w-full">

          {/* Header */}
          <thead className="bg-[#3DA6B6] text-white">

            <tr>
              <th className="p-4 text-center">Year</th>
              <th className="p-4 text-center">No. of Activities</th>
              <th className="p-4 text-center">Action</th>
            </tr>

          </thead>

          {/* Body */}
          <tbody>

            {rows.map((row, idx) => (

              <tr key={row.id} className="border-t hover:bg-gray-50">

                <td className="p-4 text-center text-gray-700">
                  {row.year}
                </td>

                <td className="p-4 text-center text-gray-700">
                  {row.count}
                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-3">

                    <button
                      onClick={() => navigate(`/activities/${row.year}`)}
                      className="bg-[#083A4B] text-white px-5 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteId(row.id)}
                      className="bg-[#083A4B] text-white px-5 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

    {/* MODALS */}
    <DeleteModal
      open={deleteId !== null}
      onConfirm={() => {
        setRows(prev => prev.filter(r => r.id !== deleteId));
        setDeleteId(null);
      }}
      onCancel={() => setDeleteId(null)}
    />

    <AddYearModal
      open={showAddYear}
      existingYears={existingYears}
      onAdd={year => {
        setRows(prev => [{ id: Date.now(), year, count: 0 }, ...prev]);
        setShowAddYear(false);
      }}
      onCancel={() => setShowAddYear(false)}
    />

  </div>

);
}