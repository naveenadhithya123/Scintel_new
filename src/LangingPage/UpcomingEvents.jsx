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
          <div className="overflow-visible">
            <div className="flex items-center gap-4 mb-4">
              <span className={`text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                Upcoming Opportunities to Engage
              </span>
            </div>
            <h2 className={`text-5xl md:text-6xl font-semibold text-[#023347] tracking-tight transition-all duration-[1200ms] delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37]">Events</span>
            </h2>
          </div>

          <div className={`flex gap-3 md:gap-4 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              onClick={() => activeIndex > 0 && scrollToPage(activeIndex - 1)} 
              disabled={activeIndex === 0}
              className={`flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-[#023347]/20 text-[#023347] transition-all duration-300 ${activeIndex === 0 ? 'opacity-30' : 'hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 active:scale-95'}`}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={() => activeIndex < pages.length - 1 && scrollToPage(activeIndex + 1)} 
              disabled={activeIndex === pages.length - 1 || pages.length === 0}
              className={`flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#023347] text-white shadow-xl shadow-[#023347]/20 transition-all duration-300 ${activeIndex === pages.length - 1 || pages.length === 0 ? 'opacity-30' : 'hover:bg-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/20 active:scale-95'}`}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </header>

        <div 
          ref={scrollRef} 
          className="flex overflow-x-hidden snap-x snap-mandatory scroll-smooth no-scrollbar pt-10"
          style={{ touchAction: "pan-y" }}
        >
          {loading ? (
            <div className="flex-none w-full snap-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-2 pb-12">
                {Array.from({ length: cardsPerPage }).map((_, idx) => (
                  <div key={idx} className="overflow-hidden rounded-[2rem] border-2 border-[#023347]/10 bg-white/70">
                    <div className="relative h-full">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                      <div className="h-[240px] bg-[#023347]/6" />
                      <div className="space-y-4 p-8">
                        <div className="h-6 w-3/4 rounded-full bg-[#023347]/10" />
                        <div className="h-4 w-full rounded-full bg-[#023347]/8" />
                        <div className="h-4 w-5/6 rounded-full bg-[#023347]/8" />
                        <div className="pt-6">
                          <div className="h-12 w-full rounded-2xl bg-[#023347]/10" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : pages.length > 0 ? (
            pages.map((pageCards, pageIndex) => (
              <div key={pageIndex} className="flex-none w-full snap-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-2 pb-12">
                  {pageCards.map((event, idx) => (
                    <article 
                      key={event.id || idx} 
                      className={`group relative transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                      style={{ 
                        transitionDelay: `${idx * 150}ms`,
                        animation: isVisible ? `gentle-float ${4 + (idx % 2)}s ease-in-out infinite alternate` : 'none',
                      }}
                    >
                      <div className="relative flex flex-col sm:flex-row bg-white/80 backdrop-blur-[8px] rounded-[2rem] border-2 border-[#023347]/15 transition-all duration-700 hover:border-[#D4AF37]/50 hover:shadow-2xl hover:shadow-[#D4AF37]/10 hover:-translate-y-3 overflow-hidden h-full">
                        
                        <div className="w-full sm:w-[220px] h-[240px] sm:h-auto overflow-hidden relative bg-[#023347]/5">
                          {event.brochure_url && event.brochure_url.startsWith('http') ? (
                            <img 
                              src={event.brochure_url} 
                              alt={event.title} 
                              className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-[#D4AF37] font-bold text-[10px] uppercase p-4 text-center">
                              {event.type || 'Event'} Image
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-r from-[#023347]/20 via-transparent to-transparent" />
                        </div>

                        <div className="p-8 flex flex-col justify-between flex-1 font-sans">
                          <div>
                            <h3 className="text-xl font-bold text-[#023347] mb-3 tracking-tight group-hover:text-[#B8860B] transition-colors duration-500 line-clamp-1">
                              {event.title}
                            </h3>
                            <p className="text-[13px] text-[#023347]/60 leading-relaxed font-medium line-clamp-3">
                              {event.short_description || "Detailed schedule and guidelines provided in the full announcement."}
                            </p>
                          </div>

                          <div className="mt-8">
                            <button 
                              type="button"
                              onClick={() => navigate(`/event-register/${event.id}/${event.type}`)}
                              className="w-full bg-[#023347] text-white py-4 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/20 active:scale-95"
                            >
                              View Details
                            </button>
                          </div>
                        </div>

                        <div className="absolute top-6 right-6 w-1.5 h-1.5 rounded-full bg-[#D4AF37]/10 group-hover:bg-[#D4AF37] transition-all duration-500" />
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="w-full py-20 text-center">
              <p className="text-[#023347]/40 font-sans tracking-widest uppercase text-xs">No upcoming events currently scheduled.</p>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .font-serif { font-family: 'Playfair Display', serif; }
        @keyframes gentle-float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-12px); }
        }
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

