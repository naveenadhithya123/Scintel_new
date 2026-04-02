import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import {API_BASE} from '../config/api';
/* ─── Toast ─────────────────────────────────────────────────────────────── */
function Toast({ toasts, removeToast }) {
  return (
    <div style={{ position: 'fixed', top: 24, right: 28, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          backgroundColor: '#fff', borderRadius: 14, padding: '16px 20px',
          minWidth: 320, maxWidth: 420,
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          borderLeft: `4px solid ${t.type === 'success' ? '#22c55e' : t.type === 'error' ? '#ef4444' : '#f59e0b'}`,
          animation: 'toastIn 0.3s ease',
        }}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : '⚠️'}
          </span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#023347' }}>{t.title}</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b', lineHeight: 1.4 }}>{t.message}</p>
          </div>
          <button onClick={() => removeToast(t.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
        </div>
      ))}
      <style>{`@keyframes toastIn { from { opacity:0; transform:translateX(30px); } to { opacity:1; transform:translateX(0); } }`}</style>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const showToast = (type, title, message, duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
  return { toasts, removeToast, showToast };
}

/* ─── Delete Modal ───────────────────────────────────────────────────────── */
function DeleteModal({ open, yearLabel, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      backgroundColor: 'rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '36px 32px 28px',
        width: 400, boxShadow: '0 12px 40px rgba(0,0,0,0.2)', textAlign: 'center',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', backgroundColor: '#fef2f2',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0d2233', marginBottom: 8 }}>Delete Batch?</h3>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 6, lineHeight: 1.5 }}>
          You are about to permanently delete all activities for
        </p>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#023347', marginBottom: 20 }}>{yearLabel}</p>
        <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 24, fontWeight: 600 }}>
          ⚠ This action cannot be undone.
        </p>
        <button onClick={onConfirm} style={{
          width: '100%', padding: '12px 0', borderRadius: 10,
          backgroundColor: '#ef4444', color: '#fff',
          border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginBottom: 10,
        }}>
          Yes, Delete Permanently
        </button>
        <button onClick={onCancel} style={{
          width: '100%', padding: '11px 0', borderRadius: 10,
          backgroundColor: '#fff', color: '#374151',
          border: '1.5px solid #e2e8f0', fontWeight: 500, fontSize: 14, cursor: 'pointer',
        }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function ActivitiesAdmin() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toasts, removeToast, showToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/activities/batches`);
      const data = await response.json();
      const result = data.data || data;
      const mappedData = result.map((item, index) => ({
        id: item.id || index,
        year: item.batch || item.year,
        count: item.activity_count || 0,
      }));
      setRows(mappedData);
    } catch (error) {
      console.error('Fetch error:', error);
      showToast('error', 'Fetch Failed', 'Unable to load activity batches. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDeleteConfirm = async () => {
    const year = deleteTarget?.year;
    setDeleteTarget(null);
    try {
      const response = await fetch(`${API_BASE}/admin/activities/batch/${encodeURIComponent(year)}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        showToast('success', 'Batch Deleted', `All activities for batch "${year}" have been permanently deleted.`);
        fetchData();
      } else {
        showToast('error', 'Delete Failed', 'Failed to delete the batch. Please try again.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast('error', 'Delete Failed', 'A network error occurred. Please check your connection.');
    }
  };

  return (
    <AdminSidebar>
      <Toast toasts={toasts} removeToast={removeToast} />

      <DeleteModal
        open={deleteTarget !== null}
        yearLabel={deleteTarget?.year}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex-1 overflow-y-auto h-screen custom-scrollbar">
        <div className="flex flex-col py-8 px-4 md:px-12">

          {/* Header */}
          <header className="mb-8 flex-shrink-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#023347]">Activities</h2>
              {/* ✅ CHANGED: styled to match Edit button */}
              <button
                onClick={() => navigate('/admin/activities/add-new-year')}
                className="bg-[#023347] text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 hover:bg-[#2A8E9E]"
              >
                + Add Batch
              </button>
            </div>
            <div className="border-b border-gray-200"></div>
          </header>

          {/* Table Card */}
          <div className="mx-2 md:mx-4 bg-white rounded-2xl shadow-sm border border-[#2A8E9E]/20 overflow-hidden mb-12">
            <div className="overflow-auto flex-1 no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[700px]">

                <thead className="sticky top-0 z-10 bg-[#2A8E9E]">
                  <tr className="text-white">
                    <th className="px-6 py-4 font-semibold text-center">Year</th>
                    <th className="px-6 py-4 font-semibold text-center">No. of Activities</th>
                    <th className="px-6 py-4 font-semibold text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="py-20 text-center text-gray-400 italic">
                        <div className="flex flex-col items-center gap-2">
                          <span className="animate-pulse">Loading records...</span>
                        </div>
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-20 text-center text-gray-400 font-medium">No data found.</td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr key={row.id} className="hover:bg-[#f4fafb] transition-colors duration-200">
                        <td className="px-6 py-5 text-[#023347] font-bold text-center">{row.year}</td>
                        <td className="px-6 py-5 text-center text-gray-600 text-sm">{row.count}</td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={() => navigate(`/admin/activities/${row.year}`)}
                              className="bg-[#023347] text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 hover:bg-[#2A8E9E]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ year: row.year })}
                              className="bg-[#023347] text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>
          </div>

        </div>
      </div>
    </AdminSidebar>
  );
}