import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, useNavigate, useLocation, useInRouterContext } from "react-router-dom";

/* =========================================
   1. ADMIN SIDEBAR COMPONENTS (Icons & Layout)
========================================= */

const Megaphone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 11 18-5v12L3 13v-2Z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
  </svg>
);
const Calendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);
const Users = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const Trophy = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);
const Lightbulb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.1.7.8 1.3 1.5 1.5 2.4"/><path d="M9 18h6"/><path d="M10 22h4"/>
  </svg>
);
const Message = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

function SidebarInner({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { name: "Announcement", path: "/admin", icon: <Megaphone /> },
    { name: "Activities", path: "/admin/activities", icon: <Calendar /> },
    { name: "Members", path: "/admin/members", icon: <Users /> },
    { name: "Glories", path: "/admin/glories", icon: <Trophy /> },
    { name: "Problems", path: "/admin/problems", icon: <Lightbulb /> },
    { name: "Suggestion", path: "/admin/suggestion", icon: <Message /> },
  ];

  return (
    <div className="flex h-screen bg-[#f0f4f8] font-sans overflow-hidden relative">
      {isMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMenuOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#023347] text-white flex flex-col shadow-xl transition-transform duration-300 transform lg:relative lg:translate-x-0 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">Admin Portal</h1>
          <button className="lg:hidden" onClick={() => setIsMenuOpen(false)}><CloseIcon /></button>
        </div>
        <nav className="flex flex-col gap-2 px-4 mt-2">
          {items.map((item) => (
            <div key={item.name} onClick={() => { setIsMenuOpen(false); navigate(item.path); }} className={`flex items-center gap-4 px-5 py-3 rounded-xl cursor-pointer transition-all duration-300 ${location.pathname === item.path ? "bg-[#2A8E9E] text-white font-medium shadow-sm" : "text-gray-300 hover:bg-[#012535] hover:text-white"}`}>
              <span className="opacity-100">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </div>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button onClick={() => setIsMenuOpen(true)} className="text-[#023347]"><MenuIcon /></button>
          <h1 className="text-lg font-bold text-[#023347]">Admin Portal</h1>
          <div className="w-6" />
        </header>
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

function AdminSidebar({ children }) {
  const inRouter = useInRouterContext();
  if (!inRouter) return <BrowserRouter><SidebarInner>{children}</SidebarInner></BrowserRouter>;
  return <SidebarInner>{children}</SidebarInner>;
}

/* =========================================
   2. ANNOUNCEMENT ADMIN PAGE
========================================= */

const CheckCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2A8E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

/* ── Image upload container styles (matching Glories pattern) ── */
const IMG_UPLOAD_STYLES = `
  .ann-img-upload-container {
    position: relative;
    border: 2px dashed #2A8E9E;
    border-radius: 12px;
    min-height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-bottom: 20px;
    overflow: hidden;
    transition: all 0.3s ease;
    background: #f0fafc;
  }
  .ann-img-upload-container.error {
    border-color: #ef4444;
  }
  .ann-img-upload-container:hover {
    background-color: rgba(42, 142, 158, 0.05);
    border-color: #023347;
  }
  .ann-img-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.42);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    transition: opacity 0.3s;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.3px;
  }
  .ann-img-upload-container:hover .ann-img-overlay {
    opacity: 1;
  }
  .ann-img-upload-container img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
  }
`;

/* ── Shared form styles matching EventForm layout ── */
const formInputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  fontSize: 13,
  marginBottom: 14,
  boxSizing: 'border-box',
  outline: 'none',
};

const formInputErrorStyle = {
  ...formInputStyle,
  border: '1px solid #ef4444',
};

const formLabelStyle = {
  display: 'block',
  fontSize: 12,
  color: '#6b7280',
  marginBottom: 5,
  fontWeight: 500,
};

const sectionTitleStyle = {
  fontSize: 16,
  fontWeight: 700,
  color: '#111827',
  margin: '25px 0 15px',
  borderBottom: '1px solid #f1f5f9',
  paddingBottom: '5px',
};

const AnnouncementAdmin = () => {
  const [view, setView] = useState('grid');
  const [regType, setRegType] = useState('without'); 
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, type: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sectionRef = useRef(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    id: null,
    title: '',
    short_description: '',
    description: '',
    registration_start_date: '',
    registration_end_date: '',
    start_date: '',
    end_date: '',
    faculty_contact: '',
    student_contact: '',
    event_link: '',
    brochure_url: null, 
    thumbnailPreview: null 
  });

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/admin/announcements");
      const result = await res.json();
      if (result.success) setEventList(result.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentSection = sectionRef.current;
    fetchAnnouncements();
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (currentSection) observer.observe(currentSection);
    return () => { if (currentSection) observer.unobserve(currentSection); };
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (errors[name]) setErrors(prev => { const next = { ...prev }; delete next[name]; return next; });
    
    if (name === 'faculty_contact' || name === 'student_contact') {
      if (value !== '' && !/^\d+$/.test(value)) return;
      if (value.length > 10) return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, brochure_url: file, thumbnailPreview: url }));
      if (errors.brochure_url) setErrors(prev => { const next = { ...prev }; delete next.brochure_url; return next; });
    }
  };

  const handleEditClick = async (id, type) => {
    try {
      const res = await fetch(`http://localhost:3000/api/admin/announcement/${id}/${type}`);
      const result = await res.json();
      if (result.success) {
        const d = result.data;
        setRegType(type === 'event' ? 'with' : 'without');
        setFormData({
          id: d.id,
          title: d.title,
          short_description: d.short_description,
          description: d.description,
          start_date: formatDateForInput(d.start_date),
          end_date: formatDateForInput(d.end_date),
          faculty_contact: d.faculty_contact || '',
          student_contact: d.student_contact || '',
          event_link: d.event_link || '',
          registration_start_date: formatDateForInput(d.registration_start_date),
          registration_end_date: formatDateForInput(d.registration_end_date),
          brochure_url: d.brochure_url, 
          thumbnailPreview: d.brochure_url
        });
        setView('edit');
      }
    } catch (err) {
      console.error("Edit fetch error:", err);
    }
  };

  const handleAnnounce = async () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'empty';
    if (!formData.thumbnailPreview) newErrors.brochure_url = 'empty';
    if (regType === 'with' && !formData.event_link.trim()) newErrors.event_link = 'empty';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const typeValue = regType === 'with' ? 'event' : 'celebration';

    const payload = {
      title: formData.title,
      short_description: formData.short_description,
      description: formData.description,
      start_date: formData.start_date,
      end_date: formData.end_date,
      faculty_contact: formData.faculty_contact,
      student_contact: formData.student_contact,
      event_type: typeValue
    };

    if (typeValue === 'event') {
      payload.event_link = formData.event_link;
      payload.registration_start_date = formData.registration_start_date;
      payload.registration_end_date = formData.registration_end_date;
    }

    const url = formData.id
      ? `http://localhost:3000/api/admin/announcementEdit/${formData.id}/${typeValue}`
      : typeValue === 'event'
        ? `http://localhost:3000/api/add-event`
        : `http://localhost:3000/api/add-celebration`;

    try {
      setIsSubmitting(true);
      const method = formData.id ? 'PUT' : 'POST';
      const hasNewFile = formData.brochure_url instanceof File;
      let requestOptions = { method };

      if (hasNewFile || !formData.id) {
        const data = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          data.append(key, value ?? '');
        });
        if (hasNewFile) {
          data.append('file', formData.brochure_url);
        }
        requestOptions.body = data;
      } else {
        requestOptions.headers = { 'Content-Type': 'application/json' };
        requestOptions.body = JSON.stringify(payload);
      }

      const response = await fetch(url, requestOptions);
      const result = await response.json();

      if (response.ok) {
        showToast(formData.id ? 'Updated Successfully!' : 'Announced Successfully!');
        resetFormAndGoHome();
        fetchAnnouncements();
      } else {
        console.error("Server Response Error:", result);
        alert("Error: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Submission network error", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/admin/announcement/${deleteModal.id}/${deleteModal.type}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('Deleted successfully.');
        fetchAnnouncements();
      }
    } catch (err) {
      console.error("Delete error", err);
    } finally {
      setDeleteModal({ isOpen: false, id: null, type: null });
    }
  };

  const resetFormAndGoHome = () => {
    setFormData({ 
      id: null, title: '', short_description: '', description: '', 
      start_date: '', end_date: '', faculty_contact: '', student_contact: '',
      event_link: '', registration_start_date: '', registration_end_date: '',
      brochure_url: null, thumbnailPreview: null 
    });
    setErrors({});
    setView('grid');
  };

  return (
    <AdminSidebar>
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-2xl border-b-4 border-[#2A8E9E] animate-in slide-in-from-bottom-10 fade-in">
          <CheckCircleIcon /><span className="font-bold text-[#023347]">{toast}</span>
        </div>
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border-t-8 border-red-500">
            <h3 className="text-xl font-bold text-[#023347] mb-2 text-center">Confirm Delete</h3>
            <p className="text-gray-600 mb-8 text-center">Are you sure you want to remove this {deleteModal.type}?</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteModal({ isOpen: false })} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div ref={sectionRef} className="max-w-7xl mx-auto w-full h-full flex flex-col">
        {view === 'grid' ? (
          <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <h1 className={`text-3xl font-extrabold text-[#023347] transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>Announcements</h1>
              <button onClick={() => { setView('add'); setRegType('with'); }} className="bg-[#023347] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-[#2A8E9E] transition-all active:scale-95">Add Event</button>
            </header>

            {loading ? (
              <div className="flex-1 flex items-center justify-center text-[#023347] font-bold">Loading feed...</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
                {eventList.map((event, index) => (
                  <div
                    key={`${event.type}-${event.id}`}
                    className={`group flex flex-col sm:flex-row bg-white rounded-[20px] shadow-sm overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="w-full sm:w-2/5 min-h-[180px] bg-gray-200 relative overflow-hidden">
                      <img src={event.brochure_url} alt="event" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="p-8 flex flex-col justify-between flex-1">
                      <div>
                        <span className="text-[10px] font-bold text-[#2A8E9E] uppercase tracking-widest">{event.type}</span>
                        <h3 className="text-xl font-bold text-[#023347] mt-1 mb-2 line-clamp-1">{event.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{event.short_description}</p>
                      </div>
                      <div className="mt-6 flex gap-3">
                        {/* Edit button — dark teal, same as page style */}
                        <button
                          onClick={() => handleEditClick(event.id, event.type)}
                          style={{
                            flex: 1, height: 40,
                            background: '#083A4B', color: '#fff',
                            border: 'none', borderRadius: 8,
                            fontSize: 12, fontWeight: 700,
                            cursor: 'pointer', transition: 'background 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#2A8E9E'}
                          onMouseLeave={e => e.currentTarget.style.background = '#083A4B'}
                        >
                          Edit
                        </button>
                        {/* Delete button — same dark teal, turns red on hover */}
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, id: event.id, type: event.type })}
                          style={{
                            flex: 1, height: 40,
                            background: '#083A4B', color: '#fff',
                            border: 'none', borderRadius: 8,
                            fontSize: 12, fontWeight: 700,
                            cursor: 'pointer', transition: 'background 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
                          onMouseLeave={e => e.currentTarget.style.background = '#083A4B'}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* ── FORM VIEW (Add / Edit) — styled like EventForm ── */
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ background: '#fff', padding: '32px', borderRadius: 12, border: '1px solid #e2e8f0', width: '100%' }}>

              {/* Header */}
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ color: '#083A4B', fontSize: 22, fontWeight: 700, margin: 0 }}>
                  {view === 'add' ? 'New Announcement' : 'Modify Announcement'}
                </h2>
              </div>

              {/* Type tabs — only show on Add */}
              {view === 'add' && (
                <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid #f1f5f9', marginBottom: 20 }}>
                  <button
                    onClick={() => setRegType('with')}
                    style={{
                      paddingBottom: 10, fontSize: 14, fontWeight: regType === 'with' ? 700 : 400,
                      color: regType === 'with' ? '#083A4B' : '#9ca3af',
                      background: 'none', border: 'none', borderBottom: regType === 'with' ? '2px solid #083A4B' : '2px solid transparent',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    Prestige Event (With Reg)
                  </button>
                  <button
                    onClick={() => setRegType('without')}
                    style={{
                      paddingBottom: 10, fontSize: 14, fontWeight: regType === 'without' ? 700 : 400,
                      color: regType === 'without' ? '#083A4B' : '#9ca3af',
                      background: 'none', border: 'none', borderBottom: regType === 'without' ? '2px solid #083A4B' : '2px solid transparent',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    Celebration (No Reg)
                  </button>
                </div>
              )}

              {/* ── Brochure / Thumbnail ── */}
              <h3 style={sectionTitleStyle}>Brochure / Thumbnail</h3>

              <div
                className={`ann-img-upload-container${errors.brochure_url ? ' error' : ''}`}
                style={{ minHeight: formData.thumbnailPreview ? 'auto' : 220 }}
                onClick={() => fileInputRef.current.click()}
              >
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                {formData.thumbnailPreview ? (
                  <>
                    <img src={formData.thumbnailPreview} alt="Preview" />
                    <div className="ann-img-overlay">Click to Change Image</div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
                    <p style={{ fontSize: 32, margin: 0, lineHeight: 1 }}>+</p>
                    <p style={{ fontSize: 14, marginTop: 8 }}>Click or drag to upload image</p>
                  </div>
                )}
              </div>

              {/* ── General Information ── */}
              <h3 style={sectionTitleStyle}>General Information</h3>

              <label style={formLabelStyle}>Title *</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Announcement Title"
                style={errors.title ? formInputErrorStyle : formInputStyle}
              />

              <label style={formLabelStyle}>Short Description</label>
              <input
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                placeholder="Short Hook Line"
                style={formInputStyle}
              />

              <label style={formLabelStyle}>Full Description</label>
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Full Detailed Description"
                style={{ ...formInputStyle, height: 100, resize: 'vertical' }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                <div>
                  <label style={formLabelStyle}>Start Date</label>
                  <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} style={formInputStyle} />
                </div>
                <div>
                  <label style={formLabelStyle}>End Date</label>
                  <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} style={formInputStyle} />
                </div>
              </div>

              {/* ── Registration (only for 'with' type) ── */}
              {regType === 'with' && (
                <>
                  <h3 style={sectionTitleStyle}>Registration</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                    <div>
                      <label style={formLabelStyle}>Registration Start Date</label>
                      <input type="date" name="registration_start_date" value={formData.registration_start_date} onChange={handleInputChange} style={formInputStyle} />
                    </div>
                    <div>
                      <label style={formLabelStyle}>Registration End Date</label>
                      <input type="date" name="registration_end_date" value={formData.registration_end_date} onChange={handleInputChange} style={formInputStyle} />
                    </div>
                  </div>
                  <label style={formLabelStyle}>Registration Form URL *</label>
                  <input
                    name="event_link"
                    value={formData.event_link}
                    onChange={handleInputChange}
                    placeholder="Google Forms / Typeform link"
                    style={errors.event_link ? formInputErrorStyle : formInputStyle}
                  />
                </>
              )}

              {/* ── Contact ── */}
              <h3 style={sectionTitleStyle}>Contact</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                <div>
                  <label style={formLabelStyle}>Faculty Contact</label>
                  <input name="faculty_contact" value={formData.faculty_contact} onChange={handleInputChange} placeholder="10-digit number" style={formInputStyle} />
                </div>
                <div>
                  <label style={formLabelStyle}>Student Contact</label>
                  <input name="student_contact" value={formData.student_contact} onChange={handleInputChange} placeholder="10-digit number" style={formInputStyle} />
                </div>
              </div>

              {/* ── Submit ── */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 40 }}>
                <button
                  onClick={resetFormAndGoHome}
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl font-bold bg-[#023347] text-white shadow-md hover:bg-red-700 transition-all active:scale-95"
                  style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: 14, opacity: isSubmitting ? 0.5 : 1, border: 'none' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAnnounce}
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl font-bold bg-[#023347] text-white shadow-md hover:bg-[#2A8E9E] transition-all active:scale-95"
                  style={{
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontSize: 14,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    opacity: isSubmitting ? 0.85 : 1,
                    minWidth: 140,
                    justifyContent: 'center',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        style={{ animation: 'spin 0.8s linear infinite', width: 16, height: 16, flexShrink: 0 }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path style={{ opacity: 0.9 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {formData.id ? 'Saving...' : 'Announcing...'}
                    </>
                  ) : (
                    formData.id ? 'Save Changes' : 'Announce Now'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ${IMG_UPLOAD_STYLES}
      ` }} />
    </AdminSidebar>
  );
};

export default AnnouncementAdmin;
