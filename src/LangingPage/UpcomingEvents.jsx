import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function UpcomingEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Fetch all events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/upcoming-events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.15 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  const cardsPerPage = 4;
  const pages = [];
  for (let i = 0; i < events.length; i += cardsPerPage) {
    pages.push(events.slice(i, i + cardsPerPage));
  }

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
    setActiveIndex(index);
  };

  const scrollToPage = (pageIndex) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: scrollRef.current.clientWidth * pageIndex, behavior: "smooth" });
    setActiveIndex(pageIndex);
  };

  return (
    <div ref={sectionRef} id="events" className="min-h-screen bg-[#F5F9FA] flex flex-col font-sans overflow-hidden py-12">
      <div className="px-6 md:px-12 pb-8 max-w-7xl mx-auto w-full">
        <h2 className={`text-[40px] font-extrabold text-[#023347] transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
          Upcoming Events
        </h2>
      </div>

      <div className="relative max-w-7xl mx-auto w-full flex-1">
        <div ref={scrollRef} onScroll={handleScroll} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth pb-12 px-2 no-scrollbar">
          <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
          {pages.map((pageCards, pageIndex) => (
            <div key={pageIndex} className="flex-none w-full snap-center px-4 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {pageCards.map((event, index) => (
                  <div key={event.event_id} className={`flex flex-col sm:flex-row bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-24"}`}>
                    <div className="w-full sm:w-2/5 aspect-[4/3] bg-[#023347] relative">
                      <img src={event.brochure_url} alt={event.event_title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-8 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="text-2xl font-bold text-[#023347] mb-3">{event.event_title}</h3>
                        <p className="text-sm text-[#3C3E40] line-clamp-3">{event.event_short_description}</p>
                      </div>
                      <div className="mt-6 flex gap-4">
                        <button 
                          onClick={() => navigate(`/event-register/${event.event_id}`)}
                          className="w-full h-[44px] bg-[#023347] text-white rounded-lg text-sm font-semibold hover:bg-[#388E9C] transition-all"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}