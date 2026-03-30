import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

function Activities() {
  const navigate = useNavigate();
  const [activitiesData, setActivitiesData] = useState([]); 
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = "http://localhost:3000/api/activities";
        const response = await fetch(API_URL);
        const data = await response.json();
        setActivitiesData(data);
        setLoaded(true);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  const handleViewDetail = (batch) => {
    navigate(`/activities/batch/${encodeURIComponent(batch)}`);
  };

  return (
    <div 
      ref={sectionRef} 
      className="relative min-h-screen bg-[#FDFCFB] overflow-x-hidden font-poppins selection:bg-[#D4AF37]/20"
    >
      {/* --- AMBIENT LIGHTING (God Ray) --- */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      <main className="max-w-[1500px] mx-auto px-6 md:px-12 py-12 relative z-10">
        
        {/* --- 1. UNIFIED HEADER SECTION --- */}
        <header className="mb-20 border-b border-[#023347]/5 pb-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="overflow-visible">
            <span className={`text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] mb-5 block transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              Institutional Archives
            </span>
            <h1 className={`text-4xl md:text-6xl font-semibold text-[#023347] transition-all duration-[1200ms] delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">Activities</span>
            </h1>
          </div>

          <button
            onClick={() => navigate("/")}
            className={`group flex items-center gap-3 bg-[#023347] text-white px-10 py-4 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/20 active:scale-95 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" />
            </svg>
            Return Home
          </button>
        </header>

        {/* --- 2. STAGGERED DECK TABLE LAYOUT --- */}
        <div className="grid grid-cols-1 gap-6">
          {activitiesData.length > 0 ? (
            activitiesData.map((item, index) => (
              <div
                key={item.id || index}
                className={`group relative flex flex-col md:flex-row bg-white/[0.02] backdrop-blur-[4px] border border-black/5 rounded-[2rem] overflow-hidden transition-all duration-700 hover:border-[#D4AF37]/40 hover:shadow-2xl hover:-translate-y-1.5 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  animation: isVisible ? `gentle-float ${5 + index}s ease-in-out infinite alternate` : 'none'
                }}
              >
                {/* Prestige Pillar */}
                <div className="w-full md:w-3 h-3 md:h-auto bg-[#023347] group-hover:bg-[#D4AF37] transition-colors duration-500" />

                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 items-center p-6 md:p-7 gap-4 md:gap-5">
                  {/* Year Display */}
                  <div className="md:col-span-4">
                    <p className="text-[10px] font-bold text-[#D4AF37] tracking-[0.25em] uppercase mb-1.5">Batch Period</p>
                    <h3 className="text-2xl md:text-[1.7rem] font-extrabold text-[#023347] group-hover:text-[#B8860B] transition-colors duration-500">
                      {item.batch}
                    </h3>
                  </div>

                  {/* Count Display */}
                  <div className="md:col-span-4 flex flex-col md:items-center">
                    <div className="bg-[#023347]/5 px-5 py-2.5 rounded-2xl group-hover:bg-[#023347]/10 transition-colors">
                        <p className="text-[9px] font-bold text-[#023347]/40 tracking-widest uppercase mb-1">Activity Volume</p>
                        <p className="text-base md:text-[1.05rem] font-bold text-[#023347]">
                            {item.activity_count} <span className="text-xs font-medium text-[#023347]/50 ml-1 italic">Published Records</span>
                        </p>
                    </div>
                  </div>

                  {/* Action Zone - SYNCHRONIZED BUTTON STYLE */}
                  <div className="md:col-span-4 flex justify-end">
                    <button
                      onClick={() => handleViewDetail(item.batch)}
                      className="group flex items-center justify-center gap-3 bg-[#023347] text-white w-full md:w-auto px-8 py-3.5 rounded-2xl text-[10px] md:text-[11px] font-bold tracking-[0.18em] uppercase transition-all duration-500 hover:bg-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/20 active:scale-95"
                    >
                      Explore Records
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Floating Aesthetic Marker */}
                <div className="absolute top-6 right-8 w-1 h-1 rounded-full bg-[#D4AF37]/30 group-hover:scale-[3] group-hover:bg-[#D4AF37] transition-all duration-700" />
              </div>
            ))
          ) : (
            <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-[#023347]/5 rounded-[3rem] bg-white/40">
              <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mb-4" />
              <p className="text-sm font-bold text-[#023347]/40 uppercase tracking-[0.4em]">
                {loaded ? "No Archives Located" : "Synchronizing Database"}
              </p>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-poppins { font-family: 'Poppins', sans-serif; }

        @keyframes gentle-float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-12px); }
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #FDFCFB; }
        ::-webkit-scrollbar-thumb { 
          background: #02334715; 
          border-radius: 20px; 
          border: 3px solid #FDFCFB; 
        }
        ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
      `}</style>
    </div>
  );
}

export default Activities;
