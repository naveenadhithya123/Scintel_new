import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const activities = [
  {
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    name: 'Tech Talk 4.0',
    desc: 'Students gathered for an engaging session on emerging technologies and future trends in the industry.'
  },
  {
    img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80',
    name: 'Hackathon 5.0',
    desc: 'A 24-hour coding marathon where teams built innovative solutions for real-world problems.'
  },
  {
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80',
    name: 'AI Workshop',
    desc: 'Hands-on workshop introducing students to artificial intelligence and machine learning fundamentals.'
  },
  {
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
    name: 'Code Sprint',
    desc: 'A competitive coding event where students solved algorithmic challenges under time constraints.'
  },
  {
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
    name: 'Web Dev Bootcamp',
    desc: 'Intensive two-day bootcamp covering modern web development tools, frameworks and best practices.'
  },
  {
    img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    name: 'Open Source Day',
    desc: 'Students contributed to open source projects and learned the importance of collaborative development.'
  },
  {
    img: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&q=80',
    name: 'IoT Expo',
    desc: 'Students showcased their IoT projects ranging from smart home devices to environmental monitors.'
  },
  {
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
    name: 'Industry Connect',
    desc: 'A networking event connecting students with industry professionals for mentorship and internship opportunities.'
  },
  {
    img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80',
    name: 'Paper Presentation',
    desc: 'Students presented their research papers on cybersecurity, data science and cloud computing.'
  },
];

function Activities() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  
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
    <div 
      ref={sectionRef}
      // Standard Layout: Gray BG, Min-Height, Z-40
      className='min-h-screen bg-[#F5F9FA] flex flex-col font-sans py-12 perspective-[1000px] relative z-40 select-none'
    >

      <div className='max-w-7xl mx-auto px-6 md:px-12 w-full'>

        {/* Header */}
        <div className="pb-8 overflow-hidden">
          <h1 
            className={`text-[40px] font-extrabold text-[#023347] mb-3 w-fit tracking-tight transform transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isVisible ? "translate-y-0 opacity-100 blur-0" : "translate-y-20 opacity-0 blur-sm"
            }`}
          >
            2025 – 2026 Events
          </h1>
        </div>

        {/* Cards Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {activities.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate("/event-details")}
              // CARD ANIMATION & PHYSICS
              className={`group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col cursor-pointer
                transform-gpu transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                hover:-translate-y-2 hover:shadow-2xl hover:border-[#388E9C]/20 hover:scale-[1.02]
                active:scale-[0.98]
                ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-24 scale-95"}
              `}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              
              {/* Image Container */}
              <div className='w-full h-56 overflow-hidden relative'>
                <img
                  src={item.img}
                  alt={item.name}
                  className='w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110'
                />
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className='px-6 py-6 flex-1 flex flex-col'>
                <h2 className='text-xl font-bold text-[#023347] mb-2 group-hover:text-[#388E9C] transition-colors duration-300'>
                  {item.name}
                </h2>
                <p className='text-sm text-[#3C3E40] leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity'>
                  {item.desc}
                </p>
                
                {/* View Details Text (Optional Aesthetic Touch) */}
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-xs font-bold text-[#388E9C] opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span>View Details</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}

export default Activities;
