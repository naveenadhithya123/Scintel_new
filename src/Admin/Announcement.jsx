import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Announcement Component
 * Features:
 * - Four Initial Cards: Populated with high-quality, working Unsplash images.
 * - Iconic UI: Megaphone icon and sidebar styles synced with design screenshots.
 * - Auto-Scroll Validation: Automatically scrolls to the first empty/invalid field.
 * - Fixed Edit Mode: Tab selectors are hidden during editing to focus on specific data.
 * - Layout Sync: Full-height sidebar and corrected left-side border visibility.
 */

// --- SVG Icons (Synced with design screenshots) ---
const MegaphoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5L6 9H2V15H6L11 19V5Z" />
    <path d="M19.07 4.93C20.94 6.81 22 9.33 22 12C22 14.67 20.94 17.19 19.07 19.07" />
    <path d="M15.53 8.47C16.44 9.38 17 10.63 17 12C17 13.37 16.44 14.62 15.53 15.53" />
  </svg>
);

const ActivitiesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </svg>
);

const MembersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const GloriesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="6" />
    <path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5" />
    <circle cx="12" cy="9" r="2" fill="currentColor" />
  </svg>
);

const ProblemsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.1 17.1c1.8-1.4 2.9-3.5 2.9-5.9 0-4-3.1-7.2-7-7.2S4 7.1 4 11.2c0 2.4 1.1 4.5 2.9 5.9" />
  </svg>
);

const SuggestionIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M12 7v4M12 14h.01" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2A8E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const App = () => {
  const [view, setView] = useState('grid'); 
  const [regType, setRegType] = useState('without'); 
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState({}); 
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, eventId: null });

  const sectionRef = useRef(null);
  const fileInputRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  // Initial Data with corrected Unsplash images
  const [eventList, setEventList] = useState([
    { 
      id: 1, 
      shortDesc: 'Tech Talk 2.0', 
      regType: 'without',
      detailedDesc: 'Technical Presentation Event for 2nd Year Students. Join us to learn about emerging cloud technologies and microservices architecture.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
      eventStartDate: '2024-05-10',
      eventEndDate: '2024-05-11',
      facultyContact: '9845012345',
      studentContact: '7012345678'
    },
    { 
      id: 2, 
      shortDesc: 'Workshop on AI', 
      regType: 'with',
      detailedDesc: 'Hand-on workshop on Artificial Intelligence and Machine Learning for beginners. Limited seats available for registration.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
      eventStartDate: '2024-06-15',
      eventEndDate: '2024-06-16',
      regStartDate: '2024-06-01',
      regEndDate: '2024-06-10',
      regFormLink: 'https://forms.google.com/ai-workshop',
      facultyContact: '9845054321',
      studentContact: '7012398765'
    },
    { 
      id: 3, 
      shortDesc: 'Cyber Security Summit', 
      regType: 'without',
      detailedDesc: 'Annual gathering to discuss the latest trends in network security and ethical hacking. Open to all students.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
      eventStartDate: '2024-07-05',
      eventEndDate: '2024-07-06',
      facultyContact: '9512345677',
      studentContact: '8887776665'
    },
    { 
      id: 4, 
      shortDesc: 'UI/UX Design Jam', 
      regType: 'with',
      detailedDesc: 'A fast-paced competition to design intuitive user interfaces for modern web applications. Register to participate.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800',
      eventStartDate: '2024-08-20',
      eventEndDate: '2024-08-21',
      regStartDate: '2024-08-01',
      regEndDate: '2024-08-15',
      regFormLink: 'https://forms.google.com/design-jam',
      facultyContact: '9612345688',
      studentContact: '7776665554'
    }
  ]);

  const [formData, setFormData] = useState({
    id: null, shortDesc: '', detailedDesc: '', regStartDate: '', regEndDate: '',
    eventStartDate: '', eventEndDate: '', facultyContact: '', studentContact: '',
    regFormLink: '', thumbnailUrl: null, thumbnailName: '' 
  });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (errors[name]) setErrors(prev => { const next = { ...prev }; delete next[name]; return next; });
    if (name === 'facultyContact' || name === 'studentContact') {
      if (value !== '' && !/^\d+$/.test(value)) return;
      if (value.length > 10) return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, thumbnailName: file.name, thumbnailUrl: url }));
      if (errors.thumbnailUrl) setErrors(prev => { const next = { ...prev }; delete next.thumbnailUrl; return next; });
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFormData(prev => ({ ...prev, thumbnailName: '', thumbnailUrl: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnnounce = () => {
    const newErrors = {};
    const validationOrder = [
      'thumbnailUrl', 'shortDesc', 'detailedDesc', 'regStartDate', 'regEndDate',
      'eventStartDate', 'eventEndDate', 'facultyContact', 'studentContact', 'regFormLink'
    ];

    validationOrder.forEach(field => {
      if (regType === 'without' && (field === 'regStartDate' || field === 'regEndDate' || field === 'regFormLink')) return;
      if (!formData[field]) {
        newErrors[field] = 'empty';
      } else if ((field === 'facultyContact' || field === 'studentContact') && formData[field].length < 10) {
        newErrors[field] = 'short';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = validationOrder.find(f => newErrors[f]);
      if (firstError) {
        setTimeout(() => {
          const element = document.getElementsByName(firstError)[0] || 
                          document.querySelector(`[data-field-error="${firstError}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
      return;
    }

    const targetId = formData.id || Date.now();
    const preparedEvent = { ...formData, id: targetId, regType: regType };

    if (formData.id) {
      setEventList(prev => prev.map(ev => ev.id === formData.id ? preparedEvent : ev));
      showToast('Event updated!');
    } else {
      setEventList(prev => [preparedEvent, ...prev]);
      showToast('Event announced!');
    }
    resetFormAndGoHome();
  };

  const confirmDelete = () => {
    setEventList(prev => prev.filter(ev => ev.id !== deleteModal.eventId));
    setDeleteModal({ isOpen: false, eventId: null });
    showToast('Event deleted.');
  };

  const handleEditClick = (event) => {
    setRegType(event.regType || 'without');
    setFormData({
      id: event.id, shortDesc: event.shortDesc || '', detailedDesc: event.detailedDesc || '',
      regStartDate: event.regStartDate || '', regEndDate: event.regEndDate || '',
      eventStartDate: event.eventStartDate || '', eventEndDate: event.eventEndDate || '',
      facultyContact: event.facultyContact || '', studentContact: event.studentContact || '',
      regFormLink: event.regFormLink || '', thumbnailUrl: event.thumbnailUrl || null,
      thumbnailName: event.thumbnailUrl ? 'Existing Image' : ''
    });
    setErrors({});
    setView('edit');
  };

  const resetFormAndGoHome = () => {
    setFormData({
      id: null, shortDesc: '', detailedDesc: '', regStartDate: '', regEndDate: '',
      eventStartDate: '', eventEndDate: '', facultyContact: '', studentContact: '',
      regFormLink: '', thumbnailUrl: null, thumbnailName: ''
    });
    setErrors({});
    setView('grid');
  };

  useEffect(() => {
    if (view === 'grid') {
      const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
      if (sectionRef.current) observer.observe(sectionRef.current);
      return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
    }
  }, [view]);

  const getInputClass = (fieldName) => {
    const base = "w-full border rounded-xl p-4 text-[#023347] bg-[#EBF1F3] outline-none transition-all placeholder-[#023347]/40 focus:ring-2 focus:ring-[#2A8E9E]";
    const borderColor = errors[fieldName] ? "border-red-500 ring-1 ring-red-500" : "border-[#2A8E9E]/20";
    return `${base} ${borderColor}`;
  };

  const ContactErrorLabel = ({ fieldName }) => {
    if (!errors[fieldName]) return null;
    const message = errors[fieldName] === 'short' ? "Please fill 10 numbers" : "Please fill";
    return <p className="text-red-500 text-xs font-semibold mt-1 ml-1 animate-in fade-in zoom-in-95 duration-200">{message}</p>;
  };

  return (
    <div className="flex h-screen w-full font-sans bg-[#F3F7F8] overflow-hidden">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-2xl border-b-4 border-[#2A8E9E] animate-in slide-in-from-bottom-10 fade-in">
          <CheckCircleIcon />
          <span className="font-bold text-[#023347]">{toast}</span>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border-t-8 border-red-500">
            <h3 className="text-xl font-bold text-[#023347] mb-2 text-center">Are you sure?</h3>
            <p className="text-gray-600 mb-8 text-center">This event will be permanently removed.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteModal({ isOpen: false, eventId: null })} className="flex-1 py-3 bg-gray-100 text-[#023347] rounded-xl font-bold hover:bg-gray-200 transition-all">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Section */}
      <aside className="w-64 flex-shrink-0 bg-[#023347] flex flex-col text-white h-full overflow-y-auto no-scrollbar">
        <div className="p-8 pb-4 flex flex-col items-center flex-shrink-0">
          <h2 className="text-2xl font-bold tracking-tight">Admin Portal</h2>
        </div>
        <nav className="flex flex-col gap-1 px-3 mt-4">
          <div onClick={() => setView('grid')} className={`flex items-center p-3 px-6 cursor-pointer text-sm font-medium rounded-xl transition-all duration-300 ${(view === 'grid' || view === 'add' || view === 'edit') ? 'bg-[#2A8E9E] shadow-md' : 'text-[#CBD5E0] hover:bg-white/5'}`}>
            <span className="mr-4 opacity-95 transition-transform group-hover:scale-110"><MegaphoneIcon /></span>
            <span>Announcement</span>
          </div>
          <div className="flex items-center p-3 px-6 cursor-pointer text-sm font-medium text-[#CBD5E0] hover:bg-white/5 transition-colors rounded-xl"><span className="mr-4 opacity-70"><ActivitiesIcon /></span><span>Activities</span></div>
<div
  onClick={() => navigate("/admin/members")}
  className="flex items-center p-3 px-6 cursor-pointer text-sm font-medium text-[#CBD5E0] hover:bg-white/5 transition-colors rounded-xl"
>
  <span className="mr-4 opacity-70"><MembersIcon /></span>
  <span>Members</span>
</div>         
<div
  onClick={() => navigate("/admin/glories")}
  className="flex items-center p-3 px-6 cursor-pointer text-sm font-medium text-[#CBD5E0] hover:bg-white/5 transition-colors rounded-xl"
>
  <span className="mr-4 opacity-70"><GloriesIcon /></span>
  <span>Glories</span>
</div>          <div className="flex items-center p-3 px-6 cursor-pointer text-sm font-medium text-[#CBD5E0] hover:bg-white/5 transition-colors rounded-xl"><span className="mr-4 opacity-70"><ProblemsIcon /></span><span>Problems</span></div>
<div
  onClick={() => navigate("/admin/suggestion")}
  className="flex items-center p-3 px-6 cursor-pointer text-sm font-medium text-[#CBD5E0] hover:bg-white/5 transition-colors rounded-xl"
>
  <span className="mr-4 opacity-70"><SuggestionIcon /></span>
  <span>Suggestion</span>
</div>        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F3F7F8] overflow-hidden h-full">
        <div className={`flex-1 flex flex-col overflow-y-auto custom-scrollbar p-10 scroll-smooth`}>
          <div ref={sectionRef} className="max-w-7xl mx-auto w-full h-full flex flex-col">
            
            {view === 'grid' ? (
              <>
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 flex-shrink-0">
                  <h1 className={`text-3xl font-extrabold text-[#023347] transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>Announcement</h1>
                  <button onClick={() => setView('add')} className="bg-[#023347] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-[#1a4457] transition-all active:scale-95 whitespace-nowrap">Add Event</button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
                  {eventList.map((event, index) => (
                    <div key={event.id} className={`group flex flex-col sm:flex-row bg-white rounded-[20px] shadow-sm overflow-hidden border border-gray-100 transform-gpu transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.01] hover:border-[#2A8E9E]/20 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-20 scale-95"}`} style={{ transitionDelay: `${index * 100}ms` }}>
                      <div className="w-full sm:w-2/5 min-h-[180px] bg-[#333] relative overflow-hidden flex items-center justify-center border-r border-gray-100">
                        {event.thumbnailUrl ? (
                          <img src={event.thumbnailUrl} alt={event.shortDesc} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                        ) : (
                          <span className="relative z-10 text-white/20 font-black text-3xl tracking-tighter uppercase">EVENT</span>
                        )}
                      </div>
                      <div className="p-8 flex flex-col justify-between flex-1 bg-white">
                        <div>
                          <h3 className="text-2xl font-bold text-[#023347] mb-3 leading-tight group-hover:text-[#2A8E9E] transition-colors duration-300">{event.shortDesc}</h3>
                          <p className="text-sm text-[#3C3E40] leading-relaxed line-clamp-3 opacity-80 group-hover:opacity-100 transition-opacity">{event.detailedDesc}</p>
                        </div>
                        <div className="mt-6 flex gap-4">
                          <button onClick={() => handleEditClick(event)} className="flex-1 h-11 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5">Edit</button>
                          <button onClick={() => setDeleteModal({ isOpen: true, eventId: event.id })} className="flex-1 h-11 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-red-700 transition-all transform hover:-translate-y-0.5">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* --- Inside Page (Add/Edit Form) --- */
              <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
                <header className="flex justify-between items-center mb-6 flex-shrink-0">
                  <h1 className="text-3xl font-extrabold text-[#023347]">{view === 'add' ? 'Add Event' : 'Edit Event'}</h1>
                  <button onClick={resetFormAndGoHome} className="bg-white text-[#023347] px-8 py-2.5 rounded-xl font-bold border-2 border-[#023347] hover:border-[#2A8E9E] hover:text-[#2A8E9E] transition-all shadow-sm active:scale-95">Back</button>
                </header>

                {view === 'add' && (
                  <div className="flex gap-8 border-b border-gray-200 mb-6 flex-shrink-0 animate-in fade-in duration-300">
                    <button onClick={() => { setRegType('without'); setErrors({}); }} className={`pb-2 text-lg font-medium transition-all relative ${regType === 'without' ? 'text-[#023347]' : 'text-gray-400 hover:text-[#023347]'}`}>
                      Without Registration
                      {regType === 'without' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#023347] rounded-full animate-in fade-in slide-in-from-left-2 duration-300" />}
                    </button>
                    <button onClick={() => { setRegType('with'); setErrors({}); }} className={`pb-2 text-lg font-medium transition-all relative ${regType === 'with' ? 'text-[#023347]' : 'text-gray-400'}`}>
                      With Registration
                      {regType === 'with' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#023347] rounded-full animate-in fade-in slide-in-from-right-2 duration-300" />}
                    </button>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar" ref={scrollContainerRef}>
                  <div className="space-y-6 pb-12 pr-2 pl-1">
                    <div className="animate-in fade-in duration-500">
                      <label className="block text-[#023347] font-medium mb-2 ml-1">Thumbnail Picture</label>
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
                      <div 
                        onClick={() => fileInputRef.current.click()} 
                        data-field-error="thumbnailUrl"
                        className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all group relative bg-white hover:bg-[#2A8E9E]/5 ${errors.thumbnailUrl ? 'border-red-500 ring-1 ring-red-500' : 'border-[#2A8E9E]'}`}
                      >
                        {formData.thumbnailUrl ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-50 relative">
                            <img src={formData.thumbnailUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                            <button onClick={removeFile} className="absolute top-4 right-4 bg-[#023347] text-white p-2 rounded-full hover:bg-red-600 transition-colors z-20 shadow-lg">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                            <div className="absolute bottom-0 left-0 w-full bg-[#023347]/80 text-white p-2 text-center text-sm font-medium backdrop-blur-sm">{formData.thumbnailName}</div>
                          </div>
                        ) : (
                          <div className="text-center px-4">
                            <svg className={`mx-auto mb-4 ${errors.thumbnailUrl ? 'text-red-500' : 'text-[#2A8E9E]'}`} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            <p className={`${errors.thumbnailUrl ? 'text-red-600 font-bold' : 'text-[#023347]'} text-lg`}>Drag and Drop or <span className="text-[#2A8E9E] font-bold group-hover:underline">choose file</span></p>
                          </div>
                        )}
                      </div>
                      <ContactErrorLabel fieldName="thumbnailUrl" />
                    </div>

                    <div className="animate-in fade-in duration-500">
                      <label className="block text-[#023347] font-medium mb-2 ml-1">Short Description</label>
                      <input type="text" name="shortDesc" value={formData.shortDesc} onChange={handleInputChange} placeholder="Enter short description here..." className={getInputClass('shortDesc')} />
                      <ContactErrorLabel fieldName="shortDesc" />
                    </div>
                    
                    <div className="animate-in fade-in duration-500">
                      <label className="block text-[#023347] font-medium mb-2 ml-1">Detailed Description</label>
                      <textarea rows="6" name="detailedDesc" value={formData.detailedDesc} onChange={handleInputChange} placeholder="Enter detailed description here..." className={`${getInputClass('detailedDesc')} resize-none`} />
                      <ContactErrorLabel fieldName="detailedDesc" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {regType === 'with' && (
                        <React.Fragment>
                          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="block text-[#023347] font-medium mb-2 ml-1">Registration Start Date</label>
                            <input type="date" name="regStartDate" value={formData.regStartDate} onChange={handleInputChange} className={getInputClass('regStartDate')} />
                            <ContactErrorLabel fieldName="regStartDate" />
                          </div>
                          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="block text-[#023347] font-medium mb-2 ml-1">Registration End Date</label>
                            <input type="date" name="regEndDate" value={formData.regEndDate} onChange={handleInputChange} className={getInputClass('regEndDate')} />
                            <ContactErrorLabel fieldName="regEndDate" />
                          </div>
                        </React.Fragment>
                      )}
                      <div className="animate-in fade-in duration-500">
                        <label className="block text-[#023347] font-medium mb-2 ml-1">Event Start Date</label>
                        <input type="date" name="eventStartDate" value={formData.eventStartDate} onChange={handleInputChange} className={getInputClass('eventStartDate')} />
                        <ContactErrorLabel fieldName="eventStartDate" />
                      </div>
                      <div className="animate-in fade-in duration-500">
                        <label className="block text-[#023347] font-medium mb-2 ml-1">Event End Date</label>
                        <input type="date" name="eventEndDate" value={formData.eventEndDate} onChange={handleInputChange} className={getInputClass('eventEndDate')} />
                        <ContactErrorLabel fieldName="eventEndDate" />
                      </div>
                      <div className="animate-in fade-in duration-500">
                        <label className="block text-[#023347] font-medium mb-2 ml-1">Faculty Contact Number</label>
                        <input type="text" name="facultyContact" value={formData.facultyContact} onChange={handleInputChange} placeholder="eg: 9512345677" className={getInputClass('facultyContact')} />
                        <ContactErrorLabel fieldName="facultyContact" />
                      </div>
                      <div className="animate-in fade-in duration-500">
                        <label className="block text-[#023347] font-medium mb-2 ml-1">Student Contact Number</label>
                        <input type="text" name="studentContact" value={formData.studentContact} onChange={handleInputChange} placeholder="eg: 9512345677" className={getInputClass('studentContact')} />
                        <ContactErrorLabel fieldName="studentContact" />
                      </div>
                    </div>

                    {regType === 'with' && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-[#023347] font-medium mb-2 ml-1">Registration form link</label>
                        <input type="text" name="regFormLink" value={formData.regFormLink} onChange={handleInputChange} placeholder="Enter URL to registration form..." className={getInputClass('regFormLink')} />
                        <ContactErrorLabel fieldName="regFormLink" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer buttons fixed at bottom */}
                <div className="flex justify-end gap-4 pt-6 mt-2 border-t border-gray-200 flex-shrink-0">
                  <button onClick={resetFormAndGoHome} className="px-10 py-3 bg-gray-100 text-[#023347] font-bold rounded-xl hover:bg-gray-200 transition-all border border-gray-200 shadow-sm">Cancel</button>
                  <button onClick={handleAnnounce} className="px-10 py-3 bg-[#023347] text-white font-bold rounded-xl hover:bg-[#1a4457] transition-all shadow-md active:scale-95">{view === 'add' ? 'Announce' : 'Save Changes'}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <style>{`
        /* Visible, modern scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
          border: 2px solid #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;