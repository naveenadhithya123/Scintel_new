import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const eventsData = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Tech Event ${i + 1}.0`,
  description: `Technical Presentation Event for all students. Join us for session ${i + 1} to learn about new technologies.`,
  buttonText: i % 3 === 0 ? null : "Register Now",
  type: i % 2 === 0 ? "primary" : "secondary",
}));

export default function UpcomingEvents() {
  const [registeredIds, setRegisteredIds] = useState(() => {
    const saved = localStorage.getItem("userRegistrations");
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("userRegistrations", JSON.stringify(registeredIds));
  }, [registeredIds]);

  const cardsPerPage = 4;
  const pages = [];
  for (let i = 0; i < eventsData.length; i += cardsPerPage) {
    pages.push(eventsData.slice(i, i + cardsPerPage));
  }

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.clientWidth;
    const index = Math.round(scrollRef.current.scrollLeft / width);
    setActiveIndex(index);
  };

  const scrollToPage = (pageIndex) => {
    if (!scrollRef.current || pageIndex < 0 || pageIndex >= pages.length) return;
    const width = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({
      left: width * pageIndex,
      behavior: "smooth",
    });
    setActiveIndex(pageIndex);
  };

  return (
    <div
      ref={sectionRef}
      id="events"
      className="min-h-screen bg-[#F5F9FA] flex flex-col font-sans overflow-hidden py-12 perspective-[1000px]"
    >
      {/* Title */}
      <div className="px-6 md:px-12 pb-8 max-w-7xl mx-auto w-full flex justify-between items-end overflow-hidden">
        <h2
          className={`text-[40px] font-extrabold text-[#023347] mb-3 w-fit transform transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isVisible
              ? "translate-y-0 opacity-100 blur-0"
              : "translate-y-20 opacity-0 blur-sm"
          }`}
        >
          Upcoming Events
        </h2>
      </div>

      <div className="relative max-w-7xl mx-auto w-full flex-1 group/slider">
        {pages.length > 1 && (
          <>
            <button
              onClick={() => scrollToPage(activeIndex - 1)}
              disabled={activeIndex === 0}
              className={`absolute left-2 md:-left-6 top-1/2 -translate-y-1/2 z-40 bg-white/80 backdrop-blur-md shadow-2xl border border-white text-[#023347] rounded-full p-4 hidden md:flex items-center justify-center transition-all duration-500 hover:scale-110 ${
                activeIndex === 0
                  ? "opacity-0 translate-x-10 pointer-events-none"
                  : "opacity-100 translate-x-0"
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => scrollToPage(activeIndex + 1)}
              disabled={activeIndex === pages.length - 1}
              className={`absolute right-2 md:-right-6 top-1/2 -translate-y-1/2 z-40 bg-white/80 backdrop-blur-md shadow-2xl border border-white text-[#023347] rounded-full p-4 hidden md:flex items-center justify-center transition-all duration-500 hover:scale-110 ${
                activeIndex === pages.length - 1
                  ? "opacity-0 -translate-x-10 pointer-events-none"
                  : "opacity-100 translate-x-0"
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth pb-12 pt-4 px-2 no-scrollbar"
        >
          <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

          {pages.map((pageCards, pageIndex) => (
            <div key={pageIndex} className="flex-none w-full snap-center px-4 md:px-12 perspective-[1000px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {pageCards.map((event, index) => (
                  <div
                    key={event.id}
                    className={`group/card relative flex flex-col sm:flex-row bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 transform-gpu
                      transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                      hover:z-50 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] hover:border-[#388E9C]/20 
                      active:scale-[0.98] active:shadow-sm
                      ${
                        isVisible
                          ? "opacity-100 translate-y-0 rotate-x-0 scale-100"
                          : "opacity-0 translate-y-24 rotate-x-12 scale-90"
                      }
                    `}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Image */}
                    <div className="w-full sm:w-2/5 aspect-[4/3] sm:aspect-auto bg-[#023347] relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#023347] to-[#011d2b] transition-transform duration-700 ease-out group-hover/card:scale-110 flex items-center justify-center">
                        <span className="text-white/20 font-bold text-4xl tracking-tighter">
                          EVENT
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col justify-between flex-1 relative z-10 bg-white">
                      <div>
                        <h3 className="text-2xl font-bold text-[#023347] mb-3 leading-tight transition-colors duration-300 group-hover/card:text-[#388E9C]">
                          {event.title}
                        </h3>

                        <p className="text-sm text-[#3C3E40] leading-relaxed line-clamp-3 opacity-80 group-hover/card:opacity-100 transition-opacity">
                          {event.description}
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="mt-6 flex gap-4">
                        <button
                          onClick={() => navigate("/event-register")}
                          className="w-[140px] h-[44px] bg-[#023347] text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#388E9C] transition-all"
                        >
                          View Details
                        </button>

                        <button
                          className="w-[140px] h-[44px] bg-[#023347] text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#388E9C] transition-all"
                        >
                          Register
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