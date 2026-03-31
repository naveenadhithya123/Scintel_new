import React, { useEffect, useRef, useState } from "react";
import { API_BASE } from "../config/api";
import { useNavigate, useParams } from "react-router-dom"; 

export default function ProblemDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/current-problem/${id}`);
        const data = await response.json();
        setProblem(data);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, [loading]);

  if (loading) return (
    <div className="min-h-screen bg-[#FDFCFB] py-16 px-6 flex flex-col items-center">
      <div className="w-full max-w-[1500px] animate-pulse">
        <div className="h-10 w-1/3 bg-[#023347]/10 rounded-xl mb-12" />
        <div className="relative h-[600px] bg-white/[0.03] border border-black/5 rounded-[2rem] overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      </div>
    </div>
  );

  if (!problem) return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center font-serif text-2xl text-[#023347]">
      Statement not located in archives.
    </div>
  );

  return (
    <div 
      ref={sectionRef} 
      className="relative min-h-screen bg-[#FDFCFB] text-[#023347] font-sans selection:bg-[#D4AF37]/20 overflow-x-hidden"
    >
      {/* --- AMBIENT LIGHTING --- */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      <main className="max-w-[1500px] mx-auto px-6 md:px-12 py-16 relative z-10">
        
        {/* --- HEADER --- */}
        <header className="mb-16 border-b border-[#023347]/5 pb-10 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="overflow-visible">
            <span className={`text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] mb-4 block transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              Case Analysis #{id}
            </span>
            <h1 className={`font-serif text-4xl md:text-5xl font-semibold leading-tight transition-all duration-[1200ms] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              {problem.title.split(' ').slice(0, -1).join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37]">
                {problem.title.split(' ').pop()}
              </span>
            </h1>
            
          </div>

          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 bg-white border border-[#023347]/10 text-[#023347] px-8 py-3.5 rounded-2xl text-[10px] font-bold tracking-[0.2em] uppercase transition-all hover:bg-gray-50 active:scale-95 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" />
            </svg>
            Back to archives
          </button>
        </header>

        {/* --- DESCRIPTION BOX --- */}
        <div className={`group relative bg-white/[0.02] backdrop-blur-[4px] border border-black/5 rounded-[2rem] p-8 md:p-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="absolute left-0 top-12 w-1.5 h-24 bg-[#023347] rounded-r-full group-hover:bg-[#D4AF37] transition-all duration-500" />

          <div className="max-w-5xl">
            <header className="mb-10 flex items-center gap-4">
                <div className="w-10 h-10 border border-[#023347]/10 flex items-center justify-center rounded-2xl text-lg font-serif italic bg-white/5 text-[#D4AF37]">¶</div>
                <h2 className="text-[11px] font-black text-[#D4AF37] tracking-[0.3em] uppercase">
                    Detailed Narrative
                </h2>
            </header>
            
            <div className="font-sans text-[#023347]/80 text-lg leading-[1.8] space-y-6">
              <p className="whitespace-pre-line ">
                {problem.detailed_description}
              </p>
            </div>
          </div>
        </div>

        {/* --- STANDALONE LOCK BUTTON --- */}
        <div className={`mt-10 flex justify-end transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
           <button
              onClick={() => navigate("/verification-mentor", { state: { problem_id: id } })} 
              className="bg-[#023347] text-white px-12 py-4 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/20 active:scale-95"
            >
              Lock Statement for Mentorship
            </button>
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
