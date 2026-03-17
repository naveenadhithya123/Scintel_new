import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";

function EventDetails() {
  const [loaded, setLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  /* FIX: Always open page from top */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [location]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } 
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const personImg = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80";
  const eventImg = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80";

  return (
    <>
      <style>{`
        .gray-scrollbar::-webkit-scrollbar { width: 6px; }
        .gray-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .gray-scrollbar::-webkit-scrollbar-thumb { background: #9ca3af !important; border-radius: 10px; }
        .gray-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280 !important; }
      `}</style>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Full View" 
            className="max-w-full max-h-[95vh] rounded-2xl shadow-2xl object-contain transform transition-transform duration-300 scale-100" 
          />
          <button className="absolute top-6 right-6 text-white/80 bg-white/10 hover:bg-white/20 hover:text-white rounded-full p-3 transition-colors backdrop-blur-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div 
        ref={sectionRef}
        id="eventDetails"
        className='min-h-screen bg-[#F5F9FA] flex flex-col font-sans py-12 perspective-[1000px] relative z-40 select-none'
      >
        <div className='w-full max-w-6xl mx-auto px-6 md:px-12'>

          <div className="pb-8 overflow-hidden">
            <h1 
              className={`text-[40px] font-extrabold text-[#023347] mb-3 w-fit tracking-tight transform transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isVisible ? "translate-y-0 opacity-100 blur-0" : "translate-y-20 opacity-0 blur-sm"
              }`}
            >
              Tech Talk 4.0
            </h1>
          </div>

          <div className="space-y-8">
            
            <div 
              className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 transform-gpu transition-all duration-1000 delay-100 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.98]"
              }`}
            >
              <section className='mb-8'>
                <h2 className='text-xl font-bold text-[#023347] mb-3'>Description</h2>
                <p className='text-gray-600 text-sm leading-relaxed max-w-4xl'>
                  An exciting opportunity to showcase your skills, creativity, and innovation on a competitive platform.
                  Join us to learn, connect, and make unforgettable memories with fellow participants.
                </p>
              </section>

              <section>
                <h2 className='text-xl font-bold text-[#023347] mb-2'>Participants</h2>
                <div className="inline-block bg-[#F5F9FA] px-4 py-2 rounded-lg border border-gray-100">
                   <p className='text-[#3C3E40] text-sm font-semibold'>2nd year CSE students</p>
                </div>
              </section>
            </div>

            <div 
              className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 transform-gpu transition-all duration-1000 delay-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.98]"
              }`}
            >
              <h2 className='text-xl font-bold text-[#023347] mb-6'>Resource Person</h2>
              <div className='group flex flex-col md:flex-row gap-8 items-start'>
                
                <div className='w-full md:w-56 h-56 rounded-2xl flex-shrink-0 overflow-hidden shadow-md relative'>
                   <img 
                     src={personImg} 
                     alt="Resource Person" 
                     className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                   />
                </div>

                <div className='flex flex-col justify-center pt-2'>
                  <h3 className='text-[#023347] font-bold text-2xl mb-3 group-hover:text-[#388E9C] transition-colors'>Dr. Aravind Krishnan</h3>
                  <p className='text-gray-500 text-sm leading-relaxed max-w-2xl'>
                    Senior Software Architect and AI Researcher with 12+ years of experience in building scalable
                    web applications and intelligent systems. He has mentored over 50 student projects and regularly
                    conducts workshops on emerging technologies and product innovation.
                  </p>
                </div>
              </div>
            </div>

            <div 
              className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 transform-gpu transition-all duration-1000 delay-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.98]"
              }`}
            >
              <h2 className='text-xl font-bold text-[#023347] mb-6'>Photos</h2>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedImage(eventImg)} 
                    className='group relative w-full h-32 sm:h-48 rounded-2xl overflow-hidden cursor-zoom-in shadow-sm hover:shadow-xl transition-all duration-300'
                  >
                    <img 
                      src={eventImg} 
                      alt="Event"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            </div>

            <div 
              className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 transform-gpu transition-all duration-1000 delay-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.98]"
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🏆</span>
                <h2 className='text-xl font-bold text-[#023347]'>Winner</h2>
              </div>
              
              <div className='group flex flex-col md:flex-row gap-8 items-start'>
                <div className='w-full md:w-56 h-44 rounded-2xl flex-shrink-0 overflow-hidden relative shadow-md'>
                  <img 
                     src={personImg} 
                     alt="Winner" 
                     className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                   />
                </div>
                <div className='flex flex-col justify-center pt-1'>
                  <h3 className='text-[#023347] font-bold text-2xl mb-1 group-hover:text-[#388E9C] transition-colors'>Dr. Aravind Krishnan</h3>
                  <p className='text-[#388E9C] text-xs font-bold mb-3 uppercase tracking-wider bg-[#F5F9FA] w-fit px-2 py-1 rounded'>Feedback</p>
                  <p className='text-gray-500 text-sm leading-relaxed max-w-2xl'>
                    Senior Software Architect and AI Researcher with 12+ years of experience in building scalable
                    web applications and intelligent systems. He has mentored over 50 student projects and regularly
                    conducts workshops on emerging technologies and product innovation.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default EventDetails;