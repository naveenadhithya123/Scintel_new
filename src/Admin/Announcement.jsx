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

const AnnouncementAdmin = () => {
  const [view, setView] = useState('grid');
  const [regType, setRegType] = useState('without'); 
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, type: null });

  const sectionRef = useRef(null);
  const fileInputRef = useRef(null);
  const scrollContainerRef = useRef(null);

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

  // Helper to format Date from Backend (ISO) to Frontend (YYYY-MM-DD)
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
    fetchAnnouncements();
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
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

  const getInputClass = (fieldName) => {
    const base = "w-full border rounded-xl p-4 text-[#023347] bg-[#EBF1F3] outline-none transition-all focus:ring-2 focus:ring-[#2A8E9E]";
    return errors[fieldName] ? `${base} border-red-500 ring-1 ring-red-500` : `${base} border-[#2A8E9E]/20`;
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
                  <div key={`${event.type}-${event.id}`} className={`group flex flex-col sm:flex-row bg-white rounded-[20px] shadow-sm overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`} style={{ transitionDelay: `${index * 100}ms` }}>
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
                        <button onClick={() => handleEditClick(event.id, event.type)} className="flex-1 h-10 bg-[#023347] text-white rounded-lg text-xs font-bold hover:bg-[#2A8E9E] transition-all">Edit</button>
                        <button onClick={() => setDeleteModal({ isOpen: true, id: event.id, type: event.type })} className="flex-1 h-10 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-all">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-extrabold text-[#023347]">{view === 'add' ? 'New Announcement' : 'Modify Announcement'}</h1>
              <button onClick={resetFormAndGoHome} className="text-[#023347] font-bold hover:text-[#2A8E9E]">Cancel</button>
            </header>

            {view === 'add' && (
              <div className="flex gap-8 border-b mb-6">
                <button onClick={() => setRegType('with')} className={`pb-2 text-lg font-medium relative ${regType === 'with' ? 'text-[#023347]' : 'text-gray-400'}`}>
                  Prestige Event (With Reg)
                  {regType === 'with' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#023347]" />}
                </button>
                <button onClick={() => setRegType('without')} className={`pb-2 text-lg font-medium relative ${regType === 'without' ? 'text-[#023347]' : 'text-gray-400'}`}>
                  Celebration (No Reg)
                  {regType === 'without' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#023347]" />}
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar" ref={scrollContainerRef}>
              <div className="space-y-6 pb-12">
                <div>
                  <label className="block text-[#023347] font-medium mb-2">Brochure / Thumbnail</label>
                  <div onClick={() => fileInputRef.current.click()} className={`w-full h-64 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer bg-white hover:bg-gray-50 transition-all ${errors.brochure_url ? 'border-red-500' : 'border-gray-300'}`}>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                    {formData.thumbnailPreview ? (
                      <img src={formData.thumbnailPreview} className="h-full w-full object-contain" alt="Preview" />
                    ) : (
                      <div className="text-center text-gray-400">Click to upload image</div>
                    )}
                  </div>
                </div>

                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Announcement Title" className={getInputClass('title')} />
                <input type="text" name="short_description" value={formData.short_description} onChange={handleInputChange} placeholder="Short Hook Line" className={getInputClass('short_description')} />
                <textarea rows="4" name="description" value={formData.description} onChange={handleInputChange} placeholder="Full Detailed Description" className={getInputClass('description')} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="text-xs font-bold text-gray-400 ml-1">START DATE</label><input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} className={getInputClass('start_date')} /></div>
                  <div><label className="text-xs font-bold text-gray-400 ml-1">END DATE</label><input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} className={getInputClass('end_date')} /></div>
                </div>

                {regType === 'with' && (
                  <div className="p-6 bg-white rounded-2xl border border-gray-100 space-y-6">
                    <h3 className="font-bold text-[#2A8E9E]">Registration Windows</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input type="date" name="registration_start_date" value={formData.registration_start_date} onChange={handleInputChange} className={getInputClass('registration_start_date')} />
                      <input type="date" name="registration_end_date" value={formData.registration_end_date} onChange={handleInputChange} className={getInputClass('registration_end_date')} />
                    </div>
                    <input type="text" name="event_link" value={formData.event_link} onChange={handleInputChange} placeholder="Registration Form URL (Google Forms/Typeform)" className={getInputClass('event_link')} />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" name="faculty_contact" value={formData.faculty_contact} onChange={handleInputChange} placeholder="Faculty Contact (10 Digits)" className={getInputClass('faculty_contact')} />
                  <input type="text" name="student_contact" value={formData.student_contact} onChange={handleInputChange} placeholder="Student Contact (10 Digits)" className={getInputClass('student_contact')} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <button onClick={handleAnnounce} className="px-12 py-4 bg-[#023347] text-white font-bold rounded-xl hover:bg-[#2A8E9E] transition-all shadow-lg">
                {formData.id ? 'Save Changes' : 'Announce Now'}
              </button>
            </div>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }` }} />
    </AdminSidebar>
  );
};

export default AnnouncementAdmin;
