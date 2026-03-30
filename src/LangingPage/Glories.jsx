import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * GLORIES COMPONENT
 * Design System: Scintel Prestige (Updated March 2026)
 */
function Glories() {
  const [glories, setGlories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
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

  const cardsPerPage = 6;
  const pages = [];

  for (let i = 0; i < glories.length; i += cardsPerPage) {
    pages.push(glories.slice(i, i + cardsPerPage));
  }

  const scrollToPage = (pageIndex) => {
    if (!scrollRef.current) return;

    const containerWidth = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({
      left: containerWidth * pageIndex,
      behavior: "smooth",
    });
    setActiveIndex(pageIndex);
  };

  return (
    <div className="relative bg-[#FDFCFB] min-h-screen text-[#1A1A1A] selection:bg-[#D4AF37]/20 overflow-hidden flex flex-col justify-center font-sans">
      
      {/* --- AMBIENT DEPTH LAYER --- */}
      <div className="absolute top-0 left-0 w-full h-[300px] md:h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      {/* --- ELITE LIGHTBOX --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out transition-all duration-500"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors duration-300"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative max-w-6xl w-full max-h-[80vh] md:max-h-[85vh] shadow-2xl rounded-xl md:rounded-2xl overflow-hidden border border-white/10" onClick={(e) => e.stopPropagation()}>
             <img 
               src={selectedImage} 
               className="w-full h-full object-contain animate-in" 
               alt="Enlarged View" 
             />
          </div>
        </div>
      )}

      {/* Added pt-24 to section to ensure header and cards don't hit the screen top */}
      <section ref={sectionRef} className="max-w-[1500px] mx-auto px-5 md:px-10 py-12 md:py-24 w-full">
        
        {/* --- PROFESSIONAL HEADER SECTION --- */}
        <header className="mb-10 md:mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-8 border-b border-[#023347]/5 pb-8 md:pb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-3 md:mb-4">
              <span className={`text-[9px] md:text-[10px] font-bold tracking-[0.4em] md:tracking-[0.5em] uppercase text-[#D4AF37] transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                Institutional Prestige
              </span>
            </div>
            
            <h1 className={`text-3xl md:text-6xl font-semibold text-[#023347] tracking-tight transition-all duration-[1200ms] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              Glories of <span className="bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37] bg-clip-text text-transparent">Scintel</span>
            </h1>
          </div>

          <div className={`flex gap-4 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={() => activeIndex > 0 && scrollToPage(activeIndex - 1)}
              disabled={activeIndex === 0}
              className={`p-4 rounded-full border border-[#023347]/10 text-[#023347] transition-all duration-300 ${activeIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:border-[#D4AF37] hover:bg-white'}`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => activeIndex < pages.length - 1 && scrollToPage(activeIndex + 1)}
              disabled={activeIndex === pages.length - 1 || pages.length === 0}
              className={`p-4 rounded-full bg-[#023347] text-white shadow-xl shadow-[#023347]/20 transition-all duration-300 ${activeIndex === pages.length - 1 || pages.length === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-[#D4AF37] hover:scale-105 active:scale-95'}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </header>

        {/* --- CORPORATE SNAP GRID --- */}
        <div
          ref={scrollRef}
          className="flex overflow-x-hidden snap-x snap-mandatory scroll-smooth no-scrollbar pt-6"
        >
          {loading ? (
            <div className="flex-none w-full snap-center">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 pb-10">
                {[...Array(6)].map((_, i) => <div key={i} className="w-full aspect-video bg-black/5 rounded-2xl animate-pulse" />)}
              </div>
            </div>
          ) : pages.length > 0 ? (
            pages.map((pageCards, pageIndex) => (
              <div key={pageIndex} className="flex-none w-full snap-center">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 pb-10">
                  {pageCards.map((item, index) => {
                    const absoluteIndex = pageIndex * cardsPerPage + index;

                    return (
                      <article
                        key={item.id || absoluteIndex}
                        className={`w-full group transition-all duration-1000 ease-out ${
                          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                        }`}
                        style={{
                          transitionDelay: `${(index % 4) * 150}ms`,
                          animation: isVisible ? `gentle-float ${4 + (index % 3)}s ease-in-out infinite alternate` : 'none',
                          animationDelay: `${index * 0.1}s`
                        }}
                      >
                        <div className="relative p-2.5 md:p-3 rounded-[1.5rem] md:rounded-[2rem] border border-[#023347]/15 bg-white/80 backdrop-blur-[6px] transition-all duration-700 hover:border-[#D4AF37]/60 hover:shadow-2xl hover:shadow-[#D4AF37]/10 md:group-hover:-translate-y-4">
                          <div
                            className="relative aspect-video rounded-[1rem] md:rounded-[1.5rem] overflow-hidden cursor-zoom-in"
                            onClick={() => setSelectedImage(item.image_url || item.img)}
                          >
                            <img
                              src={item.image_url || item.img}
                              alt={item.title}
                              className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-all duration-[1.5s] ease-out md:group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#023347]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                          </div>

                          <div className="mt-4 md:mt-6 px-2 md:px-4 pb-2 md:pb-4 font-sans">
                            <div className="flex items-center gap-3 mb-2 md:mb-4">
                              <span className="text-[8px] md:text-[9px] font-bold text-[#D4AF37] tracking-[0.2em] md:tracking-[0.3em] uppercase">Article {String(absoluteIndex + 1).padStart(2, '0')}</span>
                            </div>

                            <h3 className="text-lg md:text-xl font-bold text-[#023347] mb-2 md:mb-3 tracking-tight group-hover:text-[#B8860B] transition-colors duration-500 line-clamp-1">
                              {item.title}
                            </h3>

                            <p className="text-[11px] md:text-[13px] text-[#023347]/60 leading-relaxed font-medium line-clamp-2">
                              {item.description}
                            </p>
                          </div>

                          <div className="absolute top-5 right-5 md:top-6 md:right-6 w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#D4AF37]/10 group-hover:bg-[#D4AF37] transition-all duration-500" />
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="w-full py-20 text-center">
              <p className="text-[#023347]/40 font-sans tracking-widest uppercase text-xs">No glories available right now.</p>
            </div>
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
          100% { transform: translateY(-8px); }
        }

        @media (min-width: 768px) {
           @keyframes gentle-float {
              0% { transform: translateY(0px); }
              100% { transform: translateY(-16px); }
           }
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
