import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { API_BASE } from "../config/api";

function Glories() {
  const [glories, setGlories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(6);

  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // 1. DATA FETCHING
  useEffect(() => {
    const fetchGlories = async () => {
      try {
        const response = await fetch(`${API_BASE}/glories`);
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

  // 3. RESPONSIVE CARDS PER PAGE
  useEffect(() => {
    const updateCardsPerPage = () => {
      const nextCardsPerPage = window.innerWidth < 768 ? 2 : 6;
      setCardsPerPage(nextCardsPerPage);
      setActiveIndex(0);
      scrollRef.current?.scrollTo({ left: 0, behavior: "auto" });
    };

    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);
    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  // 4. SYNC SCROLL STATE (Fixes the "Snapping Back" bug)
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, offsetWidth } = scrollRef.current;
    const newIndex = Math.round(scrollLeft / offsetWidth);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

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
      
      {/* AMBIENT DEPTH LAYER */}
      <div className="absolute top-0 left-0 w-full h-[300px] md:h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      {/* LIGHTBOX */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl w-full max-h-[80vh] rounded-xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
             <img src={selectedImage} className="w-full h-full object-contain animate-in" alt="Enlarged" />
          </div>
        </div>
      )}

      <section ref={sectionRef} className="max-w-[1500px] mx-auto px-5 md:px-10 py-12 md:py-24 w-full">
        
        <header className="mb-10 md:mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-[#023347]/5 pb-8 md:pb-10">
          <div className="max-w-2xl">
            <span className={`text-[9px] md:text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] block mb-4 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              Milestones of Excellence
            </span>
            <h1 className={`text-3xl md:text-6xl font-semibold text-[#023347] tracking-tight transition-all duration-[1200ms] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              Glories of <span className="bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37] bg-clip-text text-transparent">SCINTEL</span>
            </h1>
          </div>

          <div className={`flex gap-3 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={() => scrollToPage(activeIndex - 1)}
              disabled={activeIndex === 0}
              className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border-[1.5px] border-[#023347]/20 text-[#023347] transition-all ${activeIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:border-[#D4AF37] hover:text-[#D4AF37]'}`}
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={() => scrollToPage(activeIndex + 1)}
              disabled={activeIndex === pages.length - 1 || pages.length === 0}
              className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#023347] text-white shadow-xl transition-all ${activeIndex === pages.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-[#D4AF37]'}`}
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </header>

        {/* --- SCROLL CONTAINER (UPDATED) --- */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pt-6"
          style={{ 
            touchAction: "pan-y",
            WebkitOverflowScrolling: "touch" // Smooth momentum for iOS
          }}
        >
          {loading ? (
            <div className="flex-none w-full snap-start snap-always shrink-0">
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 px-2 pb-10">
                 {[...Array(cardsPerPage)].map((_, i) => (
                    <article key={`skeleton-${i}`} className="w-full">
                      <div className="relative p-3 rounded-[2rem] border-[1.5px] border-transparent bg-[#023347]/5 animate-pulse h-[360px]">
                        <div className="relative aspect-video rounded-[1.5rem] bg-[#023347]/10 w-full h-[180px]"></div>
                        <div className="mt-6 px-4 pb-4">
                          <div className="h-4 bg-[#023347]/10 rounded w-1/3 mb-4"></div>
                          <div className="h-6 bg-[#023347]/10 rounded w-3/4 mb-4"></div>
                          <div className="h-4 bg-[#023347]/10 rounded w-full mb-2"></div>
                          <div className="h-4 bg-[#023347]/10 rounded w-5/6"></div>
                        </div>
                      </div>
                    </article>
                 ))}
               </div>
            </div>
          ) : pages.length > 0 ? (
            pages.map((pageCards, pageIndex) => (
              <div key={pageIndex} className="flex-none w-full snap-start snap-always shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 px-2 pb-2">
                  {pageCards.map((item, index) => {
                    const absoluteIndex = pageIndex * cardsPerPage + index;
                    return (
                      <article
                        key={item.id || absoluteIndex}
                        className={`w-full group transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                        style={{ 
                          transitionDelay: `${(index % 4) * 100}ms`,
                          animation: isVisible ? `gentle-float ${4 + (index % 3)}s ease-in-out infinite alternate` : 'none',
                          animationDelay: `${index * 0.2}s`
                        }}
                      >
                        <div className="relative p-3 rounded-[2rem] border-[1.5px] border-[#023347]/10 bg-white/60 backdrop-blur-md transition-all duration-700 group-hover:border-[#D4AF37]/50 group-hover:shadow-xl md:group-hover:-translate-y-2 group-hover:bg-white/90">
                          <div
                            className="relative aspect-video rounded-[1.5rem] overflow-hidden cursor-zoom-in"
                            onClick={() => setSelectedImage(item.image_url || item.img)}
                          >
                            <img
                              src={item.image_url || item.img}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                            />
                          </div>

                          <div className="mt-6 px-4 pb-4">
                            <span className="text-[9px] font-bold text-[#D4AF37] tracking-widest uppercase block mb-2">Milestone {absoluteIndex + 1}</span>
                            <h3 className="text-xl font-bold text-[#023347] mb-2 group-hover:text-[#B8860B] transition-colors">{item.title}</h3>
                            <p className="text-[13px] text-[#023347]/60 leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="w-full py-20 text-center text-[#023347]/40 uppercase text-xs tracking-widest">No entries found.</div>
          )}
        </div>

        {/* PAGINATION DOTS */}
        {pages.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-3 pb-2">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToPage(i)}
                className={`h-2 rounded-full transition-all duration-400 ${
                  activeIndex === i
                    ? 'w-7 bg-[#023347]'
                    : 'w-2 bg-[#023347]/25'
                }`}
              />
            ))}
          </div>
        )}

      </section>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shimmer { 100% { transform: translateX(200%); } }
        .animate-in { animation: fade-in-scale 0.4s ease-out forwards; }
        @keyframes fade-in-scale { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes gentle-float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}

export default Glories;