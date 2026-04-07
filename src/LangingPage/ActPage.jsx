import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react"; // Matching the icon style
import { API_BASE } from "../config/api";

function Activities() {
  const navigate = useNavigate();
  const [activitiesData, setActivitiesData] = useState([]); 
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showFloatingBack, setShowFloatingBack] = useState(false); // Added scroll state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = `${API_BASE}/activities`;
        const response = await fetch(API_URL);
        const data = await response.json();
        setActivitiesData(data);
        setLoaded(true);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    fetchData();

    // Scroll listener for the floating back button (Synchronized Logic)
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowFloatingBack(true);
      } else {
        setShowFloatingBack(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      className="relative min-h-screen bg-[#FDFCFB] overflow-x-hidden font-poppins selection:bg-[#D4AF37]/20 flex flex-col"
    >
      {/* --- FLOATING MOBILE BACK BUTTON (Synchronized with Detail Page) --- */}
      <button
        onClick={() => navigate("/")}
        className={`fixed bottom-8 right-6 z-[100] flex md:hidden items-center justify-center w-14 h-14 bg-[#023347] text-[#D4AF37] rounded-full shadow-2xl border border-[#D4AF37]/30 transition-all duration-500 transform ${
          showFloatingBack ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <ChevronLeft size={28} />
      </button>

      {/* --- AMBIENT LIGHTING --- */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      <main className="relative z-10 mx-auto w-full max-w-[1500px] px-5 py-10 md:px-12 md:py-16">
        
        {/* --- PROFESSIONAL HEADER SECTION (Optimized for Mobile) --- */}
        <header className="mb-10 md:mb-16 flex flex-row items-end justify-between gap-4 border-b border-[#023347]/5 pb-8 md:pb-12">
          <div className="flex-1">
            <span className={`text-[9px] md:text-[10px] font-bold tracking-[0.4em] md:tracking-[0.5em] uppercase text-[#D4AF37] mb-2 md:mb-5 block transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              Every Batch, Every Effort, Every Milestone 
            </span>
            <h1 className={`text-2xl md:text-6xl font-semibold text-[#023347] transition-all duration-[1200ms] delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              SCINTEL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">Activities</span>
            </h1>
          </div>

          <button
            onClick={() => navigate("/")}
            className={`flex items-center gap-2 px-5 py-2.5 md:px-8 md:py-4 bg-[#023347] text-white rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all duration-300 shadow-lg shadow-[#023347]/10 w-auto shrink-0 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Return Home</span>
          </button>
        </header>

        {/* --- STAGGERED DECK TABLE LAYOUT --- */}
        <div className="grid grid-cols-1 gap-6">
          {!loaded ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-32 rounded-[2rem] bg-[#023347]/5 animate-pulse" />
            ))
          ) : activitiesData.length > 0 ? (
            activitiesData.map((item, index) => (
              <div
                key={item.id || index}
                className={`group relative flex flex-col md:flex-row bg-white/[0.02] backdrop-blur-[4px] border border-black/5 rounded-[2rem] overflow-hidden transition-all duration-700 hover:border-[#D4AF37]/40 hover:shadow-2xl hover:-translate-y-1.5 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  animation: isVisible ? `gentle-float ${5 + (index % 3)}s ease-in-out infinite alternate` : 'none',
                  animationDelay: `${index * 0.3}s`
                }}
              >
                <div className="w-full md:w-3 h-3 md:h-auto bg-[#023347] group-hover:bg-[#D4AF37] transition-colors duration-500" />

                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 items-center p-6 md:p-7 gap-4 md:gap-5">
                  <div className="md:col-span-4">
                    <p className="text-[10px] font-bold text-[#D4AF37] tracking-[0.25em] uppercase mb-1.5">Batch Period</p>
                    <h3 className="text-2xl md:text-[1.7rem] font-extrabold text-[#023347] group-hover:text-[#B8860B] transition-colors duration-500">
                      {item.batch}
                    </h3>
                  </div>

                  <div className="md:col-span-4 flex flex-col md:items-center">
                    <div className="bg-[#023347]/5 px-5 py-2.5 rounded-2xl group-hover:bg-[#023347]/10 transition-colors">
                        <p className="text-[9px] font-bold text-[#023347]/40 tracking-widest uppercase mb-1">Activity Volume</p>
                        <p className="text-base md:text-[1.05rem] font-bold text-[#023347]">
                            {item.activity_count} <span className="text-xs font-medium text-[#023347]/50 ml-1 italic">Records</span>
                        </p>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex justify-start md:justify-end">
                    <button
                      onClick={() => handleViewDetail(item.batch)}
                      className="landing-btn-primary w-full md:w-auto"
                    >
                      Explore Records
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-[#023347]/5 rounded-[3rem] bg-white/40">
              <p className="text-sm font-bold text-[#023347]/40 uppercase tracking-[0.4em]">No Archives Located</p>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        .font-poppins { font-family: 'Poppins', sans-serif; }
        
        @keyframes gentle-float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-10px); }
        }

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