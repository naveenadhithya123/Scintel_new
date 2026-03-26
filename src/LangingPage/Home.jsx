import React, { useState, useEffect, useRef } from 'react';
import clgimg from './kiot img.jpeg';

function Home() {
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const heroRef = useRef(null);
  const glassRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    const handleScroll = () => {
      window.requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMoveHero = (e) => {
    const { innerWidth, innerHeight } = window;
    const tiltX = (e.clientY - innerHeight / 2) / innerHeight;
    const tiltY = (e.clientX - innerWidth / 2) / innerWidth;
    setTilt({ x: tiltY * 3, y: tiltX * 3 });
  };

  const scale = 1.05 - scrollY / 10000;
  const textOpacity = Math.max(0, 1 - scrollY / 800);

  return (
    <div id='home' className='min-h-screen bg-[#FDFCFB] select-none overflow-x-hidden -mt-20'>
      
      {/* --- PROFESSIONAL HERO SECTION --- */}
      <div 
        ref={heroRef}
        onMouseMove={handleMouseMoveHero}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        className='relative w-full h-[100vh] bg-[#023347] overflow-hidden flex items-center justify-center'
      >
        <img
          src={clgimg}
          alt='Campus'
          className="absolute inset-0 w-full h-full object-cover will-change-transform opacity-60"
          style={{
            transform: `scale(${scale}) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transition: 'transform 0.5s cubic-bezier(0.2, 1, 0.2, 1)'
          }}
        />
        
        {/* SHARP OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#023347]/80 via-transparent to-[#023347]/40 z-10"></div>

        {/* HERO CONTENT: SCINTEL PRESTIGE GLASS MODULE */}
        <div 
          className="relative z-20 w-full max-w-[1500px] px-6 transition-all duration-1000"
          style={{ opacity: loaded ? textOpacity : 0, transform: `translateY(${loaded ? scrollY * 0.3 : 40}px)` }}
        >
          <div 
            ref={glassRef}
            className="relative bg-white/[0.02] backdrop-blur-[4px] border border-white/10 rounded-[2.5rem] py-16 md:py-24 px-10 text-center shadow-2xl"
          >
            {/* PRE-HEADER (Standard Font) */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-[10px] font-bold tracking-[0.6em] uppercase text-white/70 font-sans">Established 2009</span>
            </div>
            
            {/* MAIN PRESTIGE TITLE (Serif with Gold Gradient Accent) */}
            <h1 className="font-serif text-4xl md:text-6xl lg:text-8xl font-semibold text-white tracking-tight mb-10 drop-shadow-lg leading-tight">
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37] bg-clip-text text-transparent">Knowledge</span> Institute <br className="hidden md:block"/> of Technology
            </h1>

            {/* TAGLINE (Standard Font) */}
            <div className="relative inline-block">
              <p className="text-sm md:text-lg tracking-[0.8em] uppercase font-bold text-white/40 font-sans">
                Beyond Knowledge
              </p>
              <div className="mt-6 h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* --- OBJECTIVES SECTION --- */}
      <section className="relative z-30 max-w-[1500px] mx-auto px-6 -mt-24 pb-40">
        <div className={`bg-white rounded-[2rem] border border-black/5 p-10 md:p-20 shadow-[0_50px_100px_-20px_rgba(2,51,71,0.12)] transition-all duration-[1.2s] ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          
          <div className="mb-20">
             <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-black tracking-[0.5em] uppercase text-[#D4AF37] font-sans">Institutional Pillars</span>
                <div className="h-[1px] w-24 bg-[#D4AF37]/30" />
             </div>
             {/* Section Header (Serif) */}
             <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#023347] tracking-tight">
               Our Strategic <span className="bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37] bg-clip-text text-transparent">Objectives</span>
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Industry Interaction", desc: "Bridging the critical gap between academic excellence and corporate requirements through elite partnerships.", icon: "M3.75 21h16.5M4.5 3h15" },
              { title: "Research & Dev", desc: "Fostering an ecosystem that challenges real-world engineering hurdles through systematic innovation.", icon: "M9.75 3.104v5.714" },
              { title: "Practical Knowledge", desc: "Enriching the student experience with tactile, hands-on exposure that transcends standard curricula.", icon: "M12 6.042A8.967 8.967 0 006 3.75" }
            ].map((obj, i) => (
              <div 
                key={i} 
                className="group p-10 rounded-[2rem] border border-black/[0.03] bg-[#FDFCFB]/50 hover:border-[#D4AF37]/30 hover:bg-white transition-all duration-700 hover:shadow-2xl hover:shadow-[#D4AF37]/5 hover:-translate-y-3"
                style={{ animation: `gentle-float ${5 + i}s ease-in-out infinite alternate` }}
              >
                <div className="w-16 h-16 mb-10 rounded-2xl bg-[#023347]/5 flex items-center justify-center text-[#023347] group-hover:bg-[#023347] group-hover:text-white transition-all duration-500 shadow-sm">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={obj.icon} />
                  </svg>
                </div>
                {/* Card Title (Standard Font) */}
                <h3 className="font-sans text-xl font-bold text-[#023347] mb-5 tracking-tight group-hover:text-[#B8860B] transition-colors">{obj.title}</h3>
                {/* Card Body (Standard Font) */}
                <p className="font-sans text-[14px] leading-relaxed text-[#023347]/60 font-medium">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DESIGN SYSTEM STYLES --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap');
          
          .font-serif { font-family: "Playfair Display", serif; }
          .font-sans { font-family: "Inter", "Segoe UI", sans-serif; }
          
          @keyframes gentle-float {
            0% { transform: translateY(0px); }
            100% { transform: translateY(-12px); }
          }

          html { scroll-behavior: smooth; }
        `}
      </style>
    </div>
  );
}

export default Home;