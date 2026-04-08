import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import {API_BASE} from '../config/api';

/* ─── Toast ─────────────────────────────────────────────────────────────── */
function Toast({ toasts, removeToast }) {
  return (
    <div style={{ position: 'fixed', top: 28, right: 32, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          backgroundColor: '#023347', color: '#fff',
          padding: '14px 22px', borderRadius: 12,
          minWidth: 300, maxWidth: 420,
          boxShadow: '0 8px 32px rgba(2,51,71,0.25)',
          animation: 'toastIn 0.3s ease',
          fontFamily: "'Poppins', sans-serif",
        }}>
          <span style={{
            width: 26, height: 26, borderRadius: '50%',
            backgroundColor: t.type === 'error' ? '#ef4444' : t.type === 'warning' ? '#f59e0b' : '#2A8E9E',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              {t.type === 'error'
                ? <path d="M18 6 6 18M6 6l12 12" />
                : t.type === 'warning'
                  ? <path d="M12 8v5m0 4h.01" />
                  : <polyline points="20 6 9 17 4 12" />}
            </svg>
          </span>
          <div style={{ flex: 1 }}>
            {t.title ? <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#fff' }}>{t.title}</p> : null}
            {t.message ? <p style={{ margin: t.title ? '4px 0 0' : 0, fontSize: 13, color: '#d7e7ec', lineHeight: 1.4 }}>{t.message}</p> : null}
          </div>
          <button
            onClick={() => removeToast(t.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9bd3e0', fontSize: 20, lineHeight: 1, marginLeft: 6, padding: 0 }}
          >
            ×
          </button>
        </div>
      ))}
      <style>{`@keyframes toastIn { from { opacity:0; transform:translateY(-16px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
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
        fontFamily: "'Poppins', sans-serif",
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
          transition: 'all 0.2s', fontFamily: "'Poppins', sans-serif",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,68,68,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
          onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
        >
          Yes, Delete Permanently
        </button>
        <button onClick={onCancel} style={{
          width: '100%', padding: '11px 0', borderRadius: 10,
          backgroundColor: '#fff', color: '#374151',
          border: '1.5px solid #e2e8f0', fontWeight: 500, fontSize: 14, cursor: 'pointer',
          transition: 'all 0.2s', fontFamily: "'Poppins', sans-serif",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
          onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
        >
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
  const [isVisible, setIsVisible] = useState(false);   // ← NEW
  const sectionRef = useRef(null);                      // ← NEW

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

  // ← NEW: IntersectionObserver for title entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

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
      {/* ← NEW: Poppins font for all text */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        *, *::before, *::after { font-family: 'Poppins', sans-serif !important; }
      `}</style>

      <Toast toasts={toasts} removeToast={removeToast} />

      <DeleteModal
        open={deleteTarget !== null}
        yearLabel={deleteTarget?.year}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex-1 overflow-y-auto h-screen custom-scrollbar">
        <div ref={sectionRef} className="flex flex-col py-8 px-4 md:px-12">  {/* ← ref added */}

          {/* Header */}
          <header className="mb-8 flex-shrink-0">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
              {/* ← UPDATED: matches Announcement title style exactly */}
              <h2 className={`text-3xl font-extrabold text-[#023347] transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                Activities
              </h2>
              <button
                onClick={() => navigate('/admin/activities/add-new-year')}
                className="inline-flex items-center gap-2 bg-[#023347] text-white px-5 py-2.5 rounded-[10px] text-sm font-semibold transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md hover:bg-[#2A8E9E] active:scale-95"
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
                              className="bg-[#023347] text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md hover:bg-[#2A8E9E] active:scale-95"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ year: row.year })}
                              className="bg-[#023347] text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md hover:bg-red-700 active:scale-95"
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