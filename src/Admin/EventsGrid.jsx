import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

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
function DeleteModal({ open, eventTitle, onConfirm, onCancel }) {
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
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0d2233', marginBottom: 8 }}>Delete Event?</h3>
        {eventTitle && (
          <p style={{ fontSize: 14, fontWeight: 700, color: '#023347', marginBottom: 8 }}>"{eventTitle}"</p>
        )}
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8, lineHeight: 1.5 }}>
          Are you sure you want to delete this event?
        </p>
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

/* ─── Back Button ────────────────────────────────────────────────────────── */
const StyledBackButton = ({ onClick }) => (
  <button onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#083A4B',
    color: 'white', padding: '8px 20px', borderRadius: '10px', fontSize: '12px',
    fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s ease',
  }}
    onMouseOver={e => e.currentTarget.style.backgroundColor = '#388E9C'}
    onMouseOut={e => e.currentTarget.style.backgroundColor = '#083A4B'}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M5 12l7 7M5 12l7-7" />
    </svg>
    Back
  </button>
);

/* ─── Event Card ─────────────────────────────────────────────────────────── */
function EventCard({ event, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [editHovered, setEditHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden',
        border: '1px solid #e2e8ec',
        boxShadow: hovered ? '0 12px 28px -4px rgba(0,0,0,0.18)' : '0 4px 6px -1px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
      }}
    >
      <div style={{
        width: '100%', height: 180, backgroundColor: '#e2e8f0',
        backgroundImage: `url(${event.thumbnail})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        transition: 'transform 0.3s ease', transformOrigin: 'center',
        transform: hovered ? 'scale(1.03)' : 'scale(1)',
      }} />
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0d2233', marginBottom: 10 }}>{event.title}</h3>
        <p style={{
          fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 20, flex: 1,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {event.description}
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            onMouseEnter={() => setEditHovered(true)}
            onMouseLeave={() => setEditHovered(false)}
            onClick={onEdit}
            style={{
              flex: 1, height: 44,
              backgroundColor: editHovered ? '#2A8E9E' : '#023347',
              color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 600,
              border: 'none', cursor: 'pointer',
              boxShadow: editHovered ? '0 6px 16px rgba(0,0,0,0.18)' : '0 2px 6px rgba(0,0,0,0.12)',
              transform: editHovered ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'all 0.2s ease',
            }}
          >Edit</button>
          <button
            onMouseEnter={() => setDeleteHovered(true)}
            onMouseLeave={() => setDeleteHovered(false)}
            onClick={onDelete}
            style={{
              flex: 1, height: 44,
              backgroundColor: deleteHovered ? '#b91c1c' : '#023347',
              color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 600,
              border: 'none', cursor: 'pointer',
              boxShadow: deleteHovered ? '0 6px 16px rgba(0,0,0,0.18)' : '0 2px 6px rgba(0,0,0,0.12)',
              transform: deleteHovered ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'all 0.2s ease',
            }}
          >Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function EventsGrid() {
  const { year } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title }
  const [addHovered, setAddHovered] = useState(false);
  const { toasts, removeToast, showToast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/admin/activities/${encodeURIComponent(year)}`);
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setEvents(result.data.map(item => ({
          id: item.activity_id,
          title: item.title,
          description: item.description,
          thumbnail: item.brochure_url || item.event_image_url?.split(',')[0]?.trim() || '',
        })));
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      showToast('error', 'Fetch Failed', 'Unable to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (year) fetchEvents(); }, [year]);

  const handleDeleteConfirm = async () => {
    const { id, title } = deleteTarget;
    setDeleteTarget(null);
    try {
      const response = await fetch(`http://localhost:3000/api/admin/activities/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setEvents(prev => prev.filter(e => e.id !== id));
        showToast('success', 'Event Deleted', `"${title}" has been permanently deleted.`);
      } else {
        showToast('error', 'Delete Failed', 'Failed to delete the event. Please try again.');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Delete Failed', 'A network error occurred. Please check your connection.');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Toast toasts={toasts} removeToast={removeToast} />

      <DeleteModal
        open={deleteTarget !== null}
        eventTitle={deleteTarget?.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px 36px', backgroundColor: '#F5F9FA', minHeight: '100vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0d2233' }}>
            Batch {decodeURIComponent(year || '')}
          </h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <StyledBackButton onClick={() => navigate('/admin/activities')} />
            <button
              onMouseEnter={() => setAddHovered(true)}
              onMouseLeave={() => setAddHovered(false)}
              onClick={() => navigate(`/admin/activities/${year}/add-event`)}
              style={{
                padding: '9px 20px', borderRadius: 8, border: 'none',
                backgroundColor: addHovered ? '#2A8E9E' : '#0d2233',
                color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                transition: 'background-color 0.2s ease, transform 0.2s ease',
                transform: addHovered ? 'translateY(-2px)' : 'translateY(0)',
              }}
            >+ Add Event</button>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b', marginTop: '50px' }}>Loading events...</p>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <p style={{ color: '#64748b' }}>No events found for this batch.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24, maxWidth: '1200px' }}>
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={() => navigate(`/admin/activities/${year}/edit-event/${event.id}`)}
                onDelete={() => setDeleteTarget({ id: event.id, title: event.title })}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}