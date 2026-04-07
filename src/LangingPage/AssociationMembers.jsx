import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react"; 
import { API_BASE } from "../config/api";

const ROLE_ORDER = [
  "Secretary",
  "Joint-Secretary",
  "Treasurer",
  "Joint-Treasurer",
  "Executive member",
];

const sortMembersByRole = (members = []) =>
  [...members].sort((a, b) => {
    const aIndex = ROLE_ORDER.indexOf(a.role);
    const bIndex = ROLE_ORDER.indexOf(b.role);
    const safeAIndex = aIndex === -1 ? ROLE_ORDER.length : aIndex;
    const safeBIndex = bIndex === -1 ? ROLE_ORDER.length : bIndex;
    if (safeAIndex !== safeBIndex) return safeAIndex - safeBIndex;
    return (a.name || "").localeCompare(b.name || "");
  });

export default function AssociationMembers() {
  const navigate = useNavigate();
  const { batchYear } = useParams();

  // --- STATE FOR BACKEND DATA ---
  const [batches, setBatches] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [batchDetails, setBatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- UI STATES ---
  const [selectedImage, setSelectedImage] = useState(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showFloatingBack, setShowFloatingBack] = useState(false);

  const orderedMembers = sortMembersByRole(batchDetails?.members || []);

  // 1. FETCH ALL BATCHES
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch(`${API_BASE}/association-batches`);
        const data = await response.json();
        setBatches(data);
        if (data.length === 0) {
          setActiveTab("");
          return;
        }

        const matchedBatch = batchYear
          ? data.find((batch) => String(batch.batch_year) === String(batchYear))
          : null;

        setActiveTab(matchedBatch ? matchedBatch.batch_year : data[0].batch_year);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };
    fetchBatches();

    const handleScroll = () => {
      if (window.scrollY > 300) setShowFloatingBack(true);
      else setShowFloatingBack(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [batchYear]);

  // 2. FETCH SPECIFIC BATCH DETAILS
  useEffect(() => {
    const fetchMembers = async () => {
      if (!activeTab) return;
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/association-batch/${encodeURIComponent(activeTab)}`);
        const data = await response.json();
        setBatchDetails(data);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [activeTab]);

  useEffect(() => {
    if (!activeTab) return;
    if (String(batchYear || "") !== String(activeTab)) {
      navigate(`/members/${encodeURIComponent(activeTab)}`, { replace: true });
    }
  }, [activeTab, batchYear, navigate]);

  // 3. ANIMATION OBSERVER
  useEffect(() => {
    const currentSection = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (currentSection) observer.observe(currentSection);
    return () => { if (currentSection) observer.unobserve(currentSection); };
  }, []);

  return (
    <div 
      ref={sectionRef} 
      className="relative min-h-screen bg-[#FDFCFB] text-[#023347] font-sans selection:bg-[#D4AF37]/20 overflow-x-hidden"
    >
      {/* --- FLOATING MOBILE BACK BUTTON --- */}
      <button
        onClick={() => navigate(-1)}
        className={`fixed bottom-8 right-6 z-[100] flex md:hidden items-center justify-center w-14 h-14 bg-[#023347] text-[#D4AF37] rounded-full shadow-2xl border border-[#D4AF37]/30 transition-all duration-500 transform ${
          showFloatingBack ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <ChevronLeft size={28} />
      </button>

      {/* --- AMBIENT DEPTH LAYER --- */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      {/* --- IMAGE LIGHTBOX --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/25 transition-all duration-200 rounded-full w-9 h-9 flex items-center justify-center z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={selectedImage} 
            alt="Full View" 
            className="max-w-full max-h-[95vh] rounded-md shadow-2xl object-contain" 
          />
        </div>
      )}

      {/* RESTORED ORIGINAL PADDING FOR DESKTOP (md:px-12 md:py-16) */}
      <main className="relative z-10 mx-auto max-w-[1500px] px-5 py-12 md:px-12 md:py-16">
        
        {/* --- HEADER --- */}
        <header className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-[#023347]/5 pb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <span className={`text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                The Members Who Shape Our Community
              </span>
            </div>
            
            <h1 className={`text-3xl md:text-6xl font-semibold text-[#023347] tracking-tight transition-all duration-[1200ms] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              Association <span className="bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37] bg-clip-text text-transparent">Members</span>
            </h1>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="landing-btn-primary landing-btn-compact-mobile"
          >
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Return Home
          </button>
        </header>

        {/* --- BATCH OVERVIEW (Fixed Image Visibility) --- */}
        {batchDetails?.batch_info && (
          <section className={`mb-12 flex flex-col md:flex-row gap-10 items-start transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            {/* Added 'h-auto' and 'min-h-[200px]' to ensure visibility on mobile */}
            <div className="w-full md:w-80 relative group h-auto aspect-video md:aspect-[4/3] rounded-[2rem] overflow-hidden border border-black/5 shadow-sm cursor-zoom-in shrink-0 bg-black/5">
              <img
                src={batchDetails.batch_info.image_url || "https://via.placeholder.com/600x400"}
                alt="Batch"
                onClick={() => batchDetails.batch_info.image_url && setSelectedImage(batchDetails.batch_info.image_url)}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />
            </div>
            <div className="pt-2">
              <h2 className="text-2xl font-bold mb-3">{batchDetails.batch_info.title}</h2>
              <p className="text-[#023347]/70 leading-relaxed text-sm max-w-3xl">
                {batchDetails.batch_info.description}
              </p>
            </div>
          </section>
        )}

        {/* --- YEAR TABS --- */}
        <nav className="mb-8 flex gap-6 overflow-x-auto border-b border-[#023347]/5 no-scrollbar md:gap-10">
          {batches.map((tab) => (
            <button
              key={tab.batch_year}
              onClick={() => setActiveTab(tab.batch_year)}
              className={`pb-4 text-xs font-bold tracking-widest uppercase transition-all relative whitespace-nowrap ${activeTab === tab.batch_year ? "text-[#D4AF37]" : "text-[#023347]/40 hover:text-[#023347]"}`}
            >
              Academic Year {tab.batch_year}
              {activeTab === tab.batch_year && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37] animate-in slide-in-from-left duration-500" />
              )}
            </button>
          ))}
        </nav>

        {/* --- TABLE LAYOUT --- */}
        <div className="w-full space-y-3 mb-20">
          <div className="hidden md:grid grid-cols-12 gap-4 px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#023347]/40">
            <div className="col-span-1">No.</div>
            <div className="col-span-5">Member Name</div>
            <div className="col-span-3">Phone Number</div>
            <div className="col-span-3 text-right">Designation</div>
          </div>

          {loading ? (
              [...Array(8)].map((_, i) => <div key={i} className="h-16 bg-black/5 rounded-2xl animate-pulse" />)
          ) : orderedMembers.map((member, idx) => (
            <div 
              key={idx}
              className={`group relative grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white/[0.02] backdrop-blur-[4px] border border-black/5 rounded-2xl overflow-hidden px-6 md:px-10 py-5 transition-all duration-700 hover:border-[#D4AF37]/40 hover:shadow-2xl hover:-translate-y-1.5 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ 
                transitionDelay: `${idx * 40}ms`,
                animation: isVisible ? `gentle-float ${4 + (idx % 3)}s ease-in-out infinite alternate` : 'none',
                animationDelay: `${idx * 0.15}s`
              }}
            >
              <div className="absolute left-0 top-0 w-full md:w-1 h-1 md:h-full bg-[#023347] group-hover:bg-[#D4AF37] transition-all duration-500" />
              
              <div className="col-span-1 text-[11px] font-mono text-[#D4AF37]/60 transition-colors group-hover:text-[#D4AF37]">
                <span className="mr-2 font-sans text-[10px] uppercase tracking-[0.2em] text-[#023347]/45 md:hidden">No.</span>
                {String(idx + 1).padStart(2, '0')}
              </div>

              <div className="col-span-5">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#023347]/45 md:hidden">Member Name</p>
                <h3 className="text-sm font-bold text-[#023347] group-hover:translate-x-1 transition-transform duration-500">
                  {member.name}
                </h3>
              </div>

              <div className="col-span-3">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#023347]/45 md:hidden">Phone Number</p>
                <span className="text-[11px] font-medium text-[#023347]/50 tracking-wider">
                  {member.register_number || member.phone_number}
                </span>
              </div>

              <div className="col-span-3 text-left md:text-right">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#023347]/45 md:hidden">Designation</p>
                <span className="inline-block text-[9px] font-bold tracking-[0.1em] uppercase bg-[#023347]/5 text-[#023347] px-4 py-1.5 rounded-full group-hover:bg-[#D4AF37] group-hover:text-white transition-all duration-500">
                  {member.role}
                </span>
              </div>
            </div>
          ))}
          
          {!loading && (!batchDetails?.members || batchDetails.members.length === 0) && (
            <div className="py-20 text-center italic text-[#023347]/30 text-sm">
              No formal records found for this academic cycle.
            </div>
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins:wght@400;500;600;700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }

        @keyframes gentle-float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-8px); }
        }
        
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #FDFCFB; }
        ::-webkit-scrollbar-thumb { background: #02334715; border-radius: 20px; border: 3px solid #FDFCFB; }
        ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }

        .animate-in {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}