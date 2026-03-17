import React, { useState, useEffect, useRef } from 'react';


const glories = [
  {
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
    name: 'Name',
    desc: 'Student have developed the web application for solving the problem of CGPA calculation.'
  },
  {
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80',
    name: 'Name',
    desc: 'Student have developed the web application for solving the problem of CGPA calculation.'
  },
  {
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
    name: 'Name',
    desc: 'Student have developed the web application for solving the problem of CGPA calculation.'
  },
  {
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
    name: 'Name',
    desc: 'Student have developed the web application for solving the problem of CGPA calculation.'
  },
  {
    img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    name: 'Name',
    desc: 'Student have developed the web application for solving the problem of CGPA calculation.'
  },
  {
    img: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=600&q=80',
    name: 'Name',
    desc: 'Student have developed the web application for solving the problem of CGPA calculation.'
  },
];

function Glories() {
  const [loaded, setLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Lightbox State

  // Animation Refs & State
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // 1. Trigger Initial Load
  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  // 2. Intersection Observer for Scroll Reveal
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

  return (
    <>
      {/* --- IMAGE LIGHTBOX OVERLAY --- */}
      {selectedImage && (
        <div 
          id="glories"
          className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Full View" 
            className="max-w-full max-h-[95vh] rounded-md shadow-2xl object-contain transform transition-transform duration-300 scale-100" 
          />
          <button className="absolute top-6 right-6 text-white/80 bg-white/10 hover:bg-white/20 hover:text-white rounded-full p-3 transition-colors backdrop-blur-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      <div 
        ref={sectionRef}
        id="glories" 
        // Standard Background Color #F5F9FA
        className="min-h-screen bg-[#F5F9FA] flex flex-col font-sans py-12 perspective-[1000px]"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          
          {/* Header */}
          <div className="pb-8 overflow-hidden">
            <h1 
              className={`text-[40px] font-extrabold text-[#023347] mb-3 w-fit tracking-tight transform transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isVisible ? "translate-y-0 opacity-100 blur-0" : "translate-y-20 opacity-0 blur-sm"
              }`}
            >
              Glories of SCINTEL
            </h1>
          </div>
        
          {/* Grid Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {glories.map((item, index) => (
              <div
                key={index}
                // Card Animation & Physics
                className={`group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col
                  transform-gpu transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                  hover:-translate-y-2 hover:shadow-2xl hover:border-[#388E9C]/20 hover:scale-[1.02]
                  active:scale-[0.98]
                  ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-24 scale-95"}
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                
                {/* Image Section - PLUS ICON REMOVED */}
                <div 
                  className="w-full h-56 overflow-hidden relative cursor-zoom-in"
                  onClick={() => setSelectedImage(item.img)}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Subtle Gradient Overlay only */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content Section */}
                <div className="px-6 py-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#023347] mb-3 group-hover:text-[#388E9C] transition-colors duration-300">
                      {item.name}
                    </h2>
                    <p className="text-sm text-[#3C3E40] leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Glories;
