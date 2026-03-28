import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function UpcomingEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/admin/announcements");
        const result = await response.json();

        // Based on your screenshot, the API returns { success: true, data: [...] }
        if (result.success && Array.isArray(result.data)) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const filteredAndSorted = result.data
            .filter(event => {
              // If end_date is missing in the DB, show it by default
              if (!event.end_date) return true; 
              const eventEndDate = new Date(event.end_date);
              return eventEndDate >= today;
            })
            .sort((a, b) => {
              // Sort if dates exist, otherwise keep original order
              if (!a.start_date || !b.start_date) return 0;
              return new Date(a.start_date) - new Date(b.start_date);
            });

          setEvents(filteredAndSorted);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  const cardsPerPage = 4;
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
      className="relative bg-[#FDFCFB] min-h-screen text-[#023347] selection:bg-[#D4AF37]/20 overflow-hidden py-24 flex flex-col justify-center"
    >
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      <section className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
        
        <header className="mb-16 border-b border-[#023347]/5 pb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="overflow-visible">
            <div className="flex items-center gap-4 mb-4">
              <span className={`text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                Calendar of Excellence
              </span>
              <div className={`h-[1px] bg-[#D4AF37]/30 transition-all duration-[1.5s] ${isVisible ? 'w-24' : 'w-0'}`} />
            </div>
            <h2 className={`text-5xl md:text-6xl font-semibold font-serif text-[#023347] tracking-tight transition-all duration-[1200ms] delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37]">Prestige</span>
            </h2>
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

        <div 
          ref={scrollRef} 
          className="flex overflow-x-hidden snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {pages.length > 0 ? (
            pages.map((pageCards, pageIndex) => (
              <div key={pageIndex} className="flex-none w-full snap-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-2 pb-12">
                  {pageCards.map((event, idx) => (
                    <article 
                      key={event.id || idx} 
                      className={`group relative transition-all duration-[1s] ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                      style={{ 
                        transitionDelay: `${idx * 150}ms`,
                        animation: isVisible ? `gentle-float ${4 + (idx % 2)}s ease-in-out infinite alternate` : 'none',
                      }}
                    >
                      <div className="relative flex flex-col sm:flex-row bg-white/[0.02] backdrop-blur-[4px] rounded-[2rem] border border-black/5 transition-all duration-700 hover:border-[#D4AF37]/40 hover:shadow-2xl hover:shadow-[#D4AF37]/10 hover:-translate-y-3 overflow-hidden h-full">
                        
                        {/* Image Frame - Handles Cloudinary URLs vs simple filenames */}
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

                        {/* Content Area */}
                        <div className="p-8 flex flex-col justify-between flex-1 font-sans">
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-[9px] font-bold text-[#D4AF37] tracking-[0.4em] uppercase">
                                {event.type || 'Bulletin Entry'}
                              </span>
                              <div className="flex-1 h-[1px] bg-[#D4AF37]/20" />
                            </div>
                            
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
                              className="group/btn w-full h-[52px] bg-[#023347] text-white rounded-[1rem] text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#D4AF37] shadow-lg active:scale-95"
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
      `}</style>
    </div>
  );
}