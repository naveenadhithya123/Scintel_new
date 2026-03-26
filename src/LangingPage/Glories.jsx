import React, { useState, useEffect, useRef } from 'react';

/**
 * GLORIES COMPONENT
 * Design System: Scintel Prestige (Updated March 2026)
 */
function Glories() {
  const [glories, setGlories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // 1. DATA FETCHING
  useEffect(() => {
    const fetchGlories = async () => {
      try {
        const API_URL = "http://localhost:3000/api/glories";
        const response = await fetch(API_URL);
        const data = await response.json();
        setGlories(data);
      } catch (error) {
        console.error("Error fetching glories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGlories();
  }, []);

  // 2. INTERSECTION OBSERVER
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  // 3. SCROLL LOGIC
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.7; 
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-[#FDFCFB] min-h-screen text-[#1A1A1A] selection:bg-[#D4AF37]/20 overflow-hidden flex flex-col justify-center font-sans">
      
      {/* --- AMBIENT DEPTH LAYER --- */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      {/* --- ELITE LIGHTBOX (Refined Obsidian) --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out transition-all duration-500"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Icon (X) */}
          <button 
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors duration-300"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative max-w-6xl w-full max-h-[85vh] shadow-2xl rounded-2xl overflow-hidden border border-white/10" onClick={(e) => e.stopPropagation()}>
             <img 
               src={selectedImage} 
               className="w-full h-full object-contain animate-in" 
               alt="Enlarged View" 
             />
          </div>
        </div>
      )}

      <section ref={sectionRef} className="max-w-[1500px] mx-auto px-6 md:px-10 py-20 w-full">
        
        {/* --- PROFESSIONAL HEADER SECTION --- */}
        <header className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-[#023347]/5 pb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <span className={`text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                Institutional Prestige
              </span>
            </div>
            
            <h1 className={` text-4xl md:text-6xl font-semibold text-[#023347] tracking-tight transition-all duration-[1200ms] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              Glories of <span className="bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37] bg-clip-text text-transparent">Scintel</span>
            </h1>
          </div>

          {/* Navigation Controls */}
          <div className={`flex gap-4 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <button onClick={() => scroll('left')} className="group p-4 rounded-full border border-[#023347]/10 text-[#023347] hover:border-[#D4AF37] transition-all">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scroll('right')} className="group p-4 rounded-full bg-[#023347] text-white shadow-xl shadow-[#023347]/20 hover:bg-[#D4AF37] transition-all">
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </header>

        {/* --- CORPORATE SNAP GRID --- */}
        <div 
          ref={scrollContainerRef}
          className="grid grid-rows-2 grid-flow-col gap-x-8 md:gap-x-12 gap-y-10 md:gap-y-16 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-10"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading ? (
              [...Array(6)].map((_, i) => <div key={i} className="w-[300px] md:w-[460px] aspect-video bg-black/5 rounded-2xl animate-pulse" />)
          ) : (
            glories.map((item, index) => (
              <article
                key={item.id || index}
                className={`w-[290px] md:w-[460px] snap-start group transition-all duration-1000 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ 
                  transitionDelay: `${(index % 4) * 150}ms`,
                  animation: isVisible ? `gentle-float ${4 + (index % 3)}s ease-in-out infinite alternate` : 'none',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="relative p-3 rounded-[2rem] border border-black/5 bg-white/[0.02] backdrop-blur-[4px] transition-all duration-700 hover:border-[#D4AF37]/40 hover:shadow-2xl hover:shadow-[#D4AF37]/10 group-hover:-translate-y-3">
                  
                  <div 
                    className="relative aspect-video rounded-[1.5rem] overflow-hidden cursor-zoom-in"
                    onClick={() => setSelectedImage(item.image_url || item.img)}
                  >
                    <img
                      src={item.image_url || item.img}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-[1.5s] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#023347]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>

                  <div className="mt-6 px-4 pb-4 font-sans">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[9px] font-bold text-[#D4AF37] tracking-[0.3em] uppercase">Bulletin {String(index + 1).padStart(2, '0')}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-[#023347] mb-3 tracking-tight group-hover:text-[#B8860B] transition-colors duration-500">
                      {item.title}
                    </h3>
                    
                    <p className="text-[13px] text-[#023347]/60 leading-relaxed font-medium line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="absolute top-6 right-6 w-1.5 h-1.5 rounded-full bg-[#D4AF37]/10 group-hover:bg-[#D4AF37] transition-all duration-500" />
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        .font-serif {
          font-family: 'Playfair Display', serif;
        }

        @keyframes gentle-float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-12px); }
        }

        .animate-in { 
          animation: fade-in-scale 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }

        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default Glories;