import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

function ProblemStatements() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  
  // State Management
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  // Fetch Problems
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/current-problems");
        const data = await response.json();
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problem statements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  return (
    <div 
      ref={sectionRef}
      className="relative min-h-screen bg-[#FDFCFB] text-[#023347] font-sans selection:bg-[#D4AF37]/20 overflow-x-hidden"
    >
      {/* --- AMBIENT LIGHTING (God Ray) --- */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      <main className="max-w-[1500px] mx-auto px-6 md:px-12 py-16 relative z-10">
        
        {/* --- HEADER --- */}
        <header className="mb-16 border-b border-[#023347]/5 pb-10 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <span className={`text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] mb-4 block transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              Innovation Lab
            </span>
            <h1 className={`text-6xl font-semibold leading-tight transition-all duration-[1200ms] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              Problem <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">Statements</span>
            </h1>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 bg-white border border-[#023347]/10 text-[#023347] px-6 py-3.5 rounded-2xl text-[10px] font-bold tracking-[0.2em] uppercase transition-all hover:bg-gray-50 active:scale-95"
            >
              Back
            </button>
            <button
              onClick={() => navigate("/ProblemStatementVerification")}
              className="bg-[#023347] text-white px-8 py-3.5 rounded-2xl text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/20 active:scale-95"
            >
              + Submit Statement
            </button>
          </div>
        </header>

        {/* --- STAGGERED GLASS DECK --- */}
        <div className="space-y-4">
          {loading ? (
            /* --- 🏛️ PRESTIGE GHOST SHIMMER LOADING STATE --- */
            <div className="space-y-8">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className="relative flex flex-col md:flex-row bg-white/[0.03] border border-black/5 rounded-[2rem] overflow-hidden animate-pulse"
                >
                  {/* Ghost Pillar */}
                  <div className="w-full md:w-1.5 h-2 md:h-auto bg-[#023347]/10" />
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 items-center p-8 md:p-10 gap-8">
                    {/* Ghost Title Zone */}
                    <div className="md:col-span-4 space-y-3">
                      <div className="h-2 w-16 bg-[#D4AF37]/20 rounded-full" />
                      <div className="h-8 w-48 bg-[#023347]/10 rounded-xl" />
                    </div>

                    {/* Ghost Detail Zone */}
                    <div className="md:col-span-5 space-y-2 border-l border-[#023347]/5 pl-8">
                      <div className="h-3 w-full bg-[#023347]/5 rounded-full" />
                      <div className="h-3 w-5/6 bg-[#023347]/5 rounded-full" />
                    </div>

                    {/* Ghost Action Zone */}
                    <div className="md:col-span-3 flex justify-end">
                      <div className="h-12 w-40 bg-[#023347]/10 rounded-2xl" />
                    </div>
                  </div>

                  {/* The Shimmer Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
              ))}
            </div>
          ) : problems.length > 0 ? (
            problems.map((item, idx) => (
              <div 
                key={item.problem_id || idx}
                className={`group relative flex flex-col md:flex-row items-center gap-6 bg-white/[0.02] backdrop-blur-[4px] border border-black/5 rounded-[2rem] overflow-hidden p-6 md:p-8 transition-all duration-700 hover:border-[#D4AF37]/40 hover:shadow-2xl hover:-translate-y-1.5 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="absolute left-0 top-0 w-full md:w-1.5 h-2 md:h-full bg-[#023347] group-hover:bg-[#D4AF37] transition-all duration-500" />
                <div className="flex-1 md:max-w-[30%]">
                  <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-1 block">Case #{idx + 1}</span>
                  <h3 className="text-lg font-bold text-[#023347] leading-snug group-hover:text-[#B8860B] transition-colors">
                    {item.title}
                  </h3>
                </div>
                <div className="flex-[2] border-l border-[#023347]/5 pl-0 md:pl-8">
                  <div className="flex items-center gap-3">
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
                <div className="w-full md:w-auto">
                  <button
                    onClick={() => navigate(`/problem-details/${item.problem_id}`)}
                    className="w-full md:w-auto bg-[#023347] text-white px-8 py-3.5 rounded-2xl text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/20 active:scale-95"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-[#023347]/40">No records currently available.</div>
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;600;700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }

        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
}

export default ProblemStatements;
