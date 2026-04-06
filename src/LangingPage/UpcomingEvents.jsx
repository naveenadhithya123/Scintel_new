import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";

export default function UpcomingEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(6);
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // 1. New Scroll Handler: Updates the dots/arrows when you swipe with your finger
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / offsetWidth);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/announcements`);
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const filteredAndSorted = result.data
            .filter(event => {
              if (!event.end_date) return true;
              const eventEndDate = new Date(event.end_date);
              return eventEndDate >= today;
            })
            .sort((a, b) => {
              if (!a.start_date || !b.start_date) return 0;
              return new Date(a.start_date) - new Date(b.start_date);
            });
          setEvents(filteredAndSorted);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const updateCardsPerPage = () => {
      // Logic: 2 cards for mobile, 4 for desktop (as per your previous logic)
      const nextCardsPerPage = window.innerWidth < 768 ? 2 : 4;
      setCardsPerPage(nextCardsPerPage);
      setActiveIndex(0);
      scrollRef.current?.scrollTo({ left: 0, behavior: "auto" });
    };
    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);
    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  const pages = [];
  for (let i = 0; i < events.length; i += cardsPerPage) {
    pages.push(events.slice(i, i + cardsPerPage));
  }

  const scrollToPage = (pageIndex) => {
    if (!scrollRef.current) return;
    const containerWidth = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({
      left: containerWidth * pageIndex,
      behavior: "smooth"
    });
    setActiveIndex(pageIndex);
  };

  return (
    <div 
      ref={sectionRef} 
      id="events" 
      className="relative bg-[#FDFCFB] min-h-screen text-[#023347] selection:bg-[#D4AF37]/20 overflow-hidden pt-32 pb-10 flex flex-col justify-center"
    >
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      <section className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
        <header className="mb-16 border-b border-[#023347]/5 pb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className={`text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                Upcoming Opportunities
              </span>
            </div>
            <h2 className={`text-5xl md:text-6xl font-semibold text-[#023347] tracking-tight transition-all duration-[1200ms] delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37]">Events</span>
            </h2>
          </div>

          <div className={`flex gap-3 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              onClick={() => scrollToPage(activeIndex - 1)} 
              disabled={activeIndex === 0}
              className={`flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#023347]/20 text-[#023347] transition-all ${activeIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:border-[#D4AF37] hover:text-[#D4AF37]'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={() => scrollToPage(activeIndex + 1)} 
              disabled={activeIndex === pages.length - 1 || pages.length === 0}
              className={`flex items-center justify-center w-12 h-12 rounded-full bg-[#023347] text-white transition-all ${activeIndex === pages.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-[#D4AF37]'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </header>

        {/* 2. Changed overflow-x-hidden to overflow-x-auto to allow finger swiping */}
        {/* 3. Added onScroll to track finger movement */}
        <div 
          ref={scrollRef} 
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pt-4"
          style={{ touchAction: "pan-y", WebkitOverflowScrolling: 'touch' }}
        >
          {loading ? (
            <div className="flex-none w-full snap-start snap-always shrink-0">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 pb-12">
                 {[...Array(cardsPerPage)].map((_, i) => (
                    <article key={`skeleton-${i}`} className="w-full">
                      <div className="flex flex-col sm:flex-row bg-[#023347]/5 backdrop-blur-md rounded-[2rem] border-2 border-transparent h-[200px] animate-pulse">
                        <div className="w-full sm:w-[200px] h-[200px] sm:h-[196px] bg-[#023347]/10 rounded-t-[2rem] sm:rounded-tr-none sm:rounded-l-[2rem]"></div>
                        <div className="p-8 flex flex-col justify-between flex-1">
                          <div>
                            <div className="h-6 bg-[#023347]/10 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-[#023347]/10 rounded w-full mb-2"></div>
                            <div className="h-4 bg-[#023347]/10 rounded w-5/6"></div>
                          </div>
                          <div className="h-10 mt-6 bg-[#023347]/10 rounded-xl w-full"></div>
                        </div>
                      </div>
                    </article>
                 ))}
               </div>
            </div>
          ) : pages.length > 0 ? (
            pages.map((pageCards, pageIndex) => (
              /* 4. Added snap-start and flex-shrink-0 to ensure pages align perfectly */
              <div key={pageIndex} className="flex-none w-full snap-start snap-always shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 pb-12">
                  {pageCards.map((event, idx) => (
                    <article 
                      key={event.id || idx} 
                      className={`group relative transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                      style={{ 
                        transitionDelay: `${idx * 100}ms`,
                        animation: isVisible ? `gentle-float ${4 + (idx % 3)}s ease-in-out infinite alternate` : 'none',
                        animationDelay: `${idx * 0.2}s`
                      }}
                    >
                      <div className="flex flex-col sm:flex-row bg-white/60 backdrop-blur-md rounded-[2rem] border-2 border-slate-200 transition-all duration-700 overflow-hidden h-full group-hover:border-[#D4AF37] group-hover:shadow-xl md:group-hover:-translate-y-2 group-hover:bg-white/95">
                        <div className="w-full sm:w-[200px] h-[200px] sm:h-auto bg-[#023347]/5 pointer-events-none overflow-hidden">
                          {event.brochure_url && <img src={event.brochure_url} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" alt="" />}
                        </div>
                        <div className="p-8 flex flex-col justify-between flex-1">
                          <div>
                            <h3 className="text-xl font-bold mb-2 line-clamp-1 text-[#023347] group-hover:text-[#B8860B] transition-colors">{event.title}</h3>
                            <p className="text-sm text-[#023347]/60 line-clamp-3">{event.short_description}</p>
                          </div>
                          <button 
                            onClick={() => navigate(`/event-register/${event.id}/${event.type}`)}
                            className="mt-6 w-full bg-[#023347] text-white py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-[#D4AF37] transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="w-full py-20 text-center text-[#023347]/40 uppercase text-xs tracking-widest">No upcoming events.</div>
          )}
        </div>
      </section>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes gentle-float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}