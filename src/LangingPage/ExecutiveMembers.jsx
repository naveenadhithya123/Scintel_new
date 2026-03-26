import React, { useEffect, useState, useRef } from "react";

/**
 * SCINTEL PRESTIGE: EXECUTIVE MEMBER COMPONENT
 * Refactored to Full Layout Design System (March 2026)
 */

const members = [
  { id: 1, name: "Rithish Barath N", designation: "Frontend Developer", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?&w=400&h=400&q=80" },
  { id: 2, name: "Rithish Barath N", designation: "UI/UX Designer", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?&w=400&h=400&q=80" },
  { id: 3, name: "Rithish Barath N", designation: "Backend Engineer", image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?&w=400&h=400&q=80" },
  { id: 4, name: "Rithish Barath N", designation: "Project Manager", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?&w=400&h=400&q=80" },
  { id: 5, name: "Rithish Barath N", designation: "Data Scientist", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?&w=400&h=400&q=80" },
  { id: 6, name: "Rithish Barath N", designation: "Content Strategist", image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?&w=400&h=400&q=80" },
];

export default function ExecutiveMember() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  return (
    <div className="relative bg-[#FDFCFB] min-h-screen text-[#023347] selection:bg-[#D4AF37]/20 overflow-hidden py-24 flex flex-col justify-center">
      
      {/* --- 4. AMBIENT LIGHTING (God Ray) --- */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      <section ref={sectionRef} className="max-w-[1500px] mx-auto px-8 md:px-12 w-full relative z-10">
        
        {/* --- 1. UNIFIED HEADER SECTION --- */}
        <header className="mb-20 flex flex-col items-start border-b border-[#023347]/5 pb-10">
          <div className="flex items-center gap-4 mb-4">
            <span className={`text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              Leadership Tier
            </span>
            <div className={`h-[1px] bg-[#D4AF37]/30 transition-all duration-[1.5s] ${isVisible ? 'w-24' : 'w-0'}`} />
          </div>
          
          <h2 className={`text-4xl md:text-6xl font-semibold font-serif text-[#023347] tracking-tight transition-all duration-[1200ms] delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            Executive <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37]">Members</span>
          </h2>
          
        </header>

        {/* --- 2. CORPORATE MODULE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-14">
          {members.map((member, index) => (
            <article 
              key={member.id}
              className={`transition-all duration-[1s] ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                // Applying Design System Idle Float
                animation: isVisible ? `gentle-float ${4 + (index % 3)}s ease-in-out infinite alternate` : 'none',
                animationDelay: `${index * 0.2}s`
              }}
            >
              {/* --- CORPORATE GLASS MODULE --- */}
              <div className="group relative p-6 rounded-[2rem] border border-black/5 bg-white/[0.02] backdrop-blur-[4px] transition-all duration-700 hover:border-[#D4AF37]/40 hover:shadow-2xl hover:shadow-[#D4AF37]/10 flex items-center gap-6">
                
                {/* Image Frame (Circle Variant) */}
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border border-black/5 p-1 transition-all duration-700 group-hover:border-[#D4AF37]/50 flex-shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                    />
                  </div>
                </div>

                {/* Content Block (Standard Font) */}
                <div className="flex flex-col min-w-0 font-sans">
                  <h3 className="text-xl font-bold text-[#023347] tracking-tight group-hover:text-[#B8860B] transition-colors duration-500 truncate">
                    {member.name}
                  </h3>
                  
                  <p className="text-[12px] text-[#023347]/60 font-semibold uppercase tracking-widest mt-1">
                    {member.designation}
                  </p>

                  <div className={`h-[1.5px] bg-[#D4AF37] mt-3 transition-all duration-700 ${isVisible ? 'w-8' : 'w-0'} group-hover:w-full`} />
                </div>

                {/* Aesthetic Corner Marker */}
                <div className="absolute top-6 right-6 w-1.5 h-1.5 rounded-full bg-[#D4AF37]/10 group-hover:bg-[#D4AF37] transition-all duration-500" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* --- DESIGN SYSTEM MOTION PHYSICS --- */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');

        .font-serif {
          font-family: 'Playfair Display', serif;
        }

        @keyframes gentle-float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-12px); }
        }

        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}