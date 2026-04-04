import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react"; 
import { API_BASE } from "../config/api";

function ProblemStatements() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  
  // State Management
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [toast, setToast] = useState(null);
  const [showFloatingBack, setShowFloatingBack] = useState(false);

  // Intersection Observer for Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Fetch Problems & Scroll Listener
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch(`${API_BASE}/current-problems`);
        const data = await response.json();
        setProblems(data || []);
      } catch (error) {
        console.error("Error fetching problem statements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();

    const handleScroll = () => {
      if (window.scrollY > 300) setShowFloatingBack(true);
      else setShowFloatingBack(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      ref={sectionRef}
      className="relative min-h-screen bg-[#FDFCFB] text-[#023347] font-sans selection:bg-[#D4AF37]/20 overflow-x-hidden"
    >
      {/* --- FLOATING MOBILE BACK BUTTON (Matches Activities Page Logic) --- */}
      <button
        onClick={() => navigate(-1)}
        className={`fixed bottom-8 right-6 z-[100] flex md:hidden items-center justify-center w-14 h-14 bg-[#023347] text-[#D4AF37] rounded-full shadow-2xl border border-[#D4AF37]/30 transition-all duration-500 transform ${
          showFloatingBack ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <ChevronLeft size={28} />
      </button>

      {toast ? (
        <div className="fixed left-4 right-4 top-4 z-[120] md:left-auto md:right-10 md:top-10">
          <div className="relative flex w-full items-center overflow-hidden rounded-xl border border-black/5 bg-white shadow-2xl animate-[slideInRight_0.45s_cubic-bezier(0.16,1,0.3,1)_forwards] md:min-w-[320px]">
            <div className="h-16 w-1.5 bg-[#8E2424]" />
            <div className="px-6 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8E2424]">Statement Unavailable</p>
              <p className="mt-1 text-[13px] text-[#023347]/80">{toast}</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* --- AMBIENT LIGHTING --- */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      {/* RESTORED: Main Desktop Container Padding (px-12) */}
      <main className="relative z-10 mx-auto max-w-[1500px] px-5 py-12 md:px-12 md:py-16">
        
        {/* --- HEADER (Restored Desktop Alignment) --- */}
        <header className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-[#023347]/5 pb-10">
          <div className="max-w-2xl">
            <span className={`text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] mb-4 block transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              Open Challenges for Curious Minds
            </span>
            <h1 className={`text-3xl md:text-6xl font-semibold text-[#023347] tracking-tight transition-all duration-[1200ms] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              Problem <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">Statements</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
            {/* COMPACT: Back button reduced width on mobile, full on desktop */}
            <button
              onClick={() => navigate(-1)}
              className="landing-btn-primary landing-btn-compact-mobile"
            >
              <ChevronLeft size={16} className="md:mr-1" />
              <span className="hidden md:inline">Back</span>
            </button>
            
            <button
              onClick={() => navigate("/ProblemStatementVerification")}
              className="flex-1 md:flex-none px-6 py-4 bg-[#023347] text-white rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all duration-300 shadow-lg whitespace-nowrap"
            >
              + Submit Statement
            </button>
          </div>
        </header>

        {/* --- STAGGERED GLASS DECK --- */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="relative flex flex-col md:flex-row bg-white/[0.03] border border-black/5 rounded-[2rem] overflow-hidden animate-pulse">
                  <div className="w-full md:w-1.5 h-2 md:h-auto bg-[#023347]/10" />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 items-center p-8 md:p-10 gap-8">
                    <div className="space-y-3"><div className="h-8 w-48 bg-[#023347]/10 rounded-xl" /></div>
                    <div className="flex justify-center"><div className="h-10 w-32 bg-[#023347]/5 rounded-full" /></div>
                    <div className="flex justify-end"><div className="h-12 w-40 bg-[#023347]/10 rounded-2xl" /></div>
                  </div>
                </div>
              ))}
            </div>
          ) : problems.length > 0 ? (
            problems.map((item, idx) => (
              <div 
                key={item.problem_id || idx}
                className={`group relative flex flex-col gap-6 bg-white/[0.02] backdrop-blur-[4px] border border-black/5 rounded-[2rem] overflow-hidden p-6 md:grid md:grid-cols-3 md:items-center md:gap-8 md:p-8 transition-all duration-700 hover:border-[#D4AF37]/40 hover:shadow-2xl hover:-translate-y-1.5 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="absolute left-0 top-0 w-full md:w-1.5 h-2 md:h-full bg-[#023347] group-hover:bg-[#D4AF37] transition-all duration-500" />
                
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-1 block">Case #{idx + 1}</span>
                  <h3 className="text-lg font-bold text-[#023347] leading-snug group-hover:text-[#B8860B] transition-colors">
                    {item.title}
                  </h3>
                </div>

                <div className="flex justify-start md:justify-center">
                  {/* UPDATED: Changed md:rounded-2xl to rounded-2xl for mobile support */}
                  <div className="flex items-center gap-3 rounded-2xl md:border md:border-[#023347]/10 md:bg-white/70 md:px-5 md:py-3 shadow-sm p-3">
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#023347]/45">
                      Status
                    </span>
                    <span className={`inline-flex rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] ${
                      (item.status || "").toLowerCase() === "in progress"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {item.status || "Open to Build"}
                    </span>
                  </div>
                </div>

                <div className="w-full md:flex md:justify-end">
                  <button
                    onClick={() => {
                      if ((item.status || "").toLowerCase() === "in progress") {
                        setToast("This problem statement is already in progress.");
                        return;
                      }
                      navigate(`/problem-details/${item.problem_id}`);
                    }}
                    className="w-full md:w-auto px-8 py-4 bg-[#023347] text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#D4AF37] transition-all duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-[#023347]/40 italic">No records currently available.</div>
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;600;700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default ProblemStatements;