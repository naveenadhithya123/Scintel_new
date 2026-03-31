import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE } from "../config/api";

function ActivitiesDetail() {
  const navigate = useNavigate();
  const { batch } = useParams(); 
  
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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
      className="relative min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-poppins selection:bg-[#D4AF37]/20 overflow-hidden flex flex-col"
    >
      {/* --- AMBIENT DEPTH LAYER --- */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      <main className="relative z-10 mx-auto w-full max-w-[1500px] px-5 py-12 md:px-10 md:py-16">
        
        {/* --- PROFESSIONAL HEADER SECTION --- */}
        <header className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-[#023347]/5 pb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <span className={`text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                A Closer Look at This Batch
              </span>
              
            </div>
            
            <h1 className={`text-3xl md:text-6xl font-semibold font-poppins text-[#023347] tracking-tight transition-all duration-[1200ms] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              {batch} <span className="bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37] bg-clip-text text-transparent">Records</span>
            </h1>
          </div>

          <button
            onClick={() => navigate(-1)}
            className={`landing-btn-primary landing-btn-compact-mobile ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Go Back
          </button>
        </header>

        {/* --- MATCHED CORPORATE GRID (Compact Size) --- */}
        <div className="max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {loading ? (
             [...Array(6)].map((_, i) => (
              <div key={i} className="relative overflow-hidden rounded-[2rem] border border-[#023347]/10 bg-white/80 p-3">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/75 to-transparent" />
                <div className="aspect-video rounded-[1.5rem] bg-[#023347]/8" />
                <div className="space-y-3 px-4 pb-4 pt-5">
                  <div className="h-3 w-16 rounded-full bg-[#D4AF37]/20" />
                  <div className="h-5 w-3/4 rounded-full bg-[#023347]/10" />
                  <div className="h-4 w-full rounded-full bg-[#023347]/8" />
                </div>
              </div>
            ))
          ) : (
            activities.map((item, index) => (
              <article
                key={item.activity_id || index}
                onClick={() => navigate(`/activities/event/${item.activity_id}`)}
                className={`group relative p-3 rounded-[2rem] border border-black/5 bg-white/[0.02] backdrop-blur-[4px] cursor-pointer transition-all duration-700 hover:border-[#D4AF37]/40 hover:shadow-2xl hover:shadow-[#D4AF37]/10 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ 
                  transitionDelay: `${(index % 3) * 150}ms`,
                  animation: isVisible ? `gentle-float ${4 + (index % 3)}s ease-in-out infinite alternate` : 'none',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Image Frame - Matched to Glories Aspect Ratio */}
                <div className="relative aspect-video rounded-[1.5rem] overflow-hidden mb-5">
                  <img
                    src={item.brochure_url || item.event_image_url?.split(',')[0]?.trim() || 'https://via.placeholder.com/600x400'}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-[1.5s] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#023347]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                {/* Content Area - Professional Sans-Serif */}
                <div className="px-4 pb-4 font-sans">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[9px] font-bold text-[#D4AF37] tracking-[0.3em] uppercase">
                      no. {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#023347] mb-3 tracking-tight group-hover:text-[#B8860B] transition-colors duration-500 line-clamp-1">
                    {item.title}
                  </h3>
                  
                  <p className="text-[13px] text-[#023347]/60 leading-relaxed font-medium line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Aesthetic Dot Marker */}
                <div className="absolute top-6 right-6 w-1.5 h-1.5 rounded-full bg-[#D4AF37]/10 group-hover:bg-[#D4AF37] transition-all duration-500" />
              </article>
            ))
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins:wght@300;400;500;600;700&display=swap');
        
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Poppins', sans-serif; }

        @keyframes gentle-float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-12px); }
        }

        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #FDFCFB; }
        ::-webkit-scrollbar-thumb { 
          background: #02334715; 
          border-radius: 20px; 
        }
        ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
      `}</style>
    </div>
  );
}

export default ActivitiesDetail;

