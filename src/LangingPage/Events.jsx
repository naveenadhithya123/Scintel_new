import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from "lucide-react"; 
import { API_BASE } from "../config/api";

function ActivitiesDetail() {
  const navigate = useNavigate();
  const { batch } = useParams(); 
  
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showFloatingBack, setShowFloatingBack] = useState(false);

  // 1. DATA FETCHING
  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/activities/batch/${encodeURIComponent(batch)}`);
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error("Error fetching batch details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (batch) fetchBatchData();

    // Scroll listener for the floating back button
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowFloatingBack(true);
      } else {
        setShowFloatingBack(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [batch]);

  // 2. ENTRANCE REVEAL
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  return (
    <div 
      ref={sectionRef} 
      className="relative min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-poppins selection:bg-[#D4AF37]/20 overflow-x-hidden flex flex-col"
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

      <main className="relative z-10 mx-auto w-full max-w-[1500px] px-5 py-10 md:px-10 md:py-16">
        
        {/* --- PROFESSIONAL HEADER SECTION (Optimized for Mobile) --- */}
        <header className="mb-10 md:mb-16 flex flex-row items-end justify-between gap-4 border-b border-[#023347]/5 pb-8 md:pb-10">
          <div className="flex-1">
            <span className={`text-[9px] md:text-[10px] font-bold tracking-[0.4em] md:tracking-[0.5em] uppercase text-[#D4AF37] mb-2 md:mb-4 block transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              Batch Archive View
            </span>
            <h1 className={`text-2xl md:text-6xl font-semibold font-poppins text-[#023347] tracking-tight transition-all duration-[1200ms] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              {batch} <span className="bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37] bg-clip-text text-transparent">Records</span>
            </h1>
          </div>

          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 px-5 py-2.5 md:px-8 md:py-4 bg-[#023347] text-white rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all duration-300 shadow-lg shadow-[#023347]/10 w-auto shrink-0 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Go Back</span>
          </button>
        </header>

        {/* --- GRID --- */}
        <div className="max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {loading ? (
             [...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-[2rem] bg-[#023347]/5 animate-pulse" />
            ))
          ) : (
            activities.map((item, index) => (
              <article
                key={item.activity_id || index}
                onClick={() => navigate(`/activities/event/${item.activity_id}`)}
                className={`group relative p-3 rounded-[2rem] border border-black/5 bg-white/60 backdrop-blur-md cursor-pointer transition-all duration-700 hover:border-[#D4AF37]/40 hover:shadow-2xl md:hover:-translate-y-2 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ 
                  transitionDelay: `${(index % 3) * 100}ms`
                }}
              >
                <div className="relative aspect-video rounded-[1.5rem] overflow-hidden mb-5">
                  <img
                    src={item.brochure_url || item.event_image_url?.split(',')[0]?.trim() || 'https://via.placeholder.com/600x400'}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-transform duration-[1.5s] group-hover:scale-105"
                  />
                </div>

                <div className="px-4 pb-4">
                  <span className="text-[9px] font-bold text-[#D4AF37] tracking-[0.3em] uppercase block mb-2">Record {index + 1}</span>
                  <h3 className="text-xl font-bold text-[#023347] mb-2 line-clamp-1 group-hover:text-[#B8860B] transition-colors">{item.title}</h3>
                  <p className="text-[13px] text-[#023347]/60 leading-relaxed line-clamp-2">{item.description}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        .font-poppins { font-family: 'Poppins', sans-serif; }
      `}</style>
    </div>
  );
}

export default ActivitiesDetail;