import React, { useState, useEffect, useRef } from 'react';
import clgimg from './kiot img.jpeg';

function Home() {
  // Fix: Removed 'setMenuOpen' to prevent the "unused variable" error
  const [menuOpen] = useState(false); 
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  // Refs
  const heroRef = useRef(null);
  const cardRef = useRef(null);
  const liquidRef = useRef(null);

  // Shared Tilt State for Parallax Effects
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Initial Load Animation
    setTimeout(() => setLoaded(true), 100);

    // Optimized Scroll Listener using requestAnimationFrame
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Liquid Glass Mouse Tracking
  const handleMouseMoveHero = (e) => {
    const rect = liquidRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePos({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
    
    // Parallax tilt
    const { innerWidth, innerHeight } = window;
    const tiltX = (e.clientY - innerHeight / 2) / innerHeight;
    const tiltY = (e.clientX - innerWidth / 2) / innerWidth;
    setTilt({ x: tiltY * 8, y: tiltX * 8 });
  };

  const handleMouseLeaveHero = () => {
    setMousePos({ x: 0.5, y: 0.5 });
    setTilt({ x: 0, y: 0 });
  };

  // --- CARD MOUSE TILT ---
  const handleMouseMoveCard = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xRot = ((y / rect.height) - 0.5) * -6; 
    const yRot = ((x / rect.width) - 0.5) * 6;

    setTilt({ x: xRot, y: yRot });
  };

  const handleMouseLeaveCard = () => {
    setTilt({ x: 0, y: 0 });
  };

  // --- ANIMATION CALCULATIONS ---
  const scale = 1.25 - scrollY / 3000;
  const translateY = scrollY * 0.35;
  const blur = Math.min(18, scrollY / 60);

  const textExitStart = 550; 
  const textExitDistance = 150; 

  let textOpacity = 1;
  let textScale = 1;
  let textTranslate = scrollY * 0.3;

  if (scrollY > textExitStart) {
    const exitProgress = Math.min((scrollY - textExitStart) / textExitDistance, 1);
    textOpacity = 1 - exitProgress; 
    textScale = 1 - (exitProgress * 0.4); 
    textTranslate -= (exitProgress * 200); 
  }

  // Card opacity triggers earlier and finishes faster
  const triggerStart = 20; 
  const triggerEnd = 250;
  
  let cardProgress = 0;
  if (scrollY > triggerStart) {
    cardProgress = Math.min((scrollY - triggerStart) / (triggerEnd - triggerStart), 1);
  }

  const cardTranslateY = 100 - (cardProgress * 100);
  const cardOpacity = cardProgress;
  const cardScale = 0.9 + (cardProgress * 0.1);

  return (
   <div 
   id='home'
   className='min-h-screen bg-[#F5F9FA] select-none font-sans overflow-x-hidden perspective-[2000px] -mt-20'>
    
      {/* Mobile Menu */}
      <div className={`md:hidden bg-white border-b border-gray-200 overflow-hidden transition-all duration-500 ease-in-out ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <ul className='flex flex-col gap-4 p-6 text-sm text-[#3C3E40] font-bold'>
          {/* Fix: Replaced href="#" with dynamic IDs to fix 7 ESLint anchor errors */}
          {['Upcoming Events', 'Activities', 'Members', 'Glories', 'Problems', 'Suggestions', 'Contact'].map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase().replace(/\s+/g, '')}`} className='hover:text-[#388E9C] block'>
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* HERO SECTION CONTAINER */}
      <div 
        ref={heroRef}
        onMouseMove={handleMouseMoveHero}
        onMouseLeave={handleMouseLeaveHero}
        className='relative w-full h-screen bg-black overflow-hidden'
      >
        
        {/* HERO IMAGE */}
        <img
          src={clgimg}
          alt='College Campus'
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{
            transform: `
              scale(${scale}) 
              translateY(${translateY}px)
              rotateX(${tilt.x}deg) 
              rotateY(${tilt.y}deg)
            `,
            filter: `blur(${blur}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 z-10"></div>

        {/* HERO TEXT */}
        <div 
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4`}
          style={{
            opacity: loaded ? textOpacity : 0, 
            transform: `translateY(${loaded ? textTranslate : 80}px) scale(${textScale})`,
            transition: 'opacity 1s ease-out' 
          }}
        >
          {/* LIQUID GLASS WRAPPER */}
          <div 
            ref={liquidRef}
            className="
              relative group pointer-events-auto cursor-default
              transition-all duration-[1200ms] ease-out
              w-fit max-w-[95vw] mx-auto
            "
            style={{
              '--mouse-x': `${mousePos.x * 100}%`,
              '--mouse-y': `${mousePos.y * 100}%`,
            }}
          >
            {/* LIQUID GLASS CAPSULE */}
            <div className="
              relative flex flex-col items-center justify-center
              py-6 px-8 sm:px-12 md:py-8 md:px-20
              bg-white/5 hover:bg-white/10
              backdrop-blur-[4px] hover:backdrop-blur-[2px]
              border border-white/15 hover:border-white/30
              rounded-full 
              shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
              overflow-hidden
              ring-1 ring-white/30 hover:ring-white/50
              hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]
              hover:scale-[1.03] hover:-translate-y-1
              transition-all duration-[800ms] ease-out
              before:content-[''] before:absolute before:inset-0 before:rounded-full
              before:bg-gradient-to-r before:from-white/10 before:to-white/5
              before:opacity-30 hover:before:opacity-60
              before:transition-opacity duration-500
              after:content-[''] after:absolute after:inset-0 after:rounded-full
              after:bg-gradient-to-b after:from-transparent after:via-white/10 after:to-transparent
              after:opacity-20 hover:after:opacity-40
              after:transition-opacity duration-500
            ">
              {/* MOUSE FOLLOWING LIQUID RIPPLE */}
              <div 
                className="absolute w-24 h-24 bg-white/25 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                style={{
                  left: `calc(var(--mouse-x) - 12px)`,
                  top: `calc(var(--mouse-y) - 12px)`,
                  transform: `translate(calc(var(--mouse-x) * -15px), calc(var(--mouse-y) * -15px))`
                }}
              />
              
              {/* FLUID BLOB LAYERS */}
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <div className="absolute w-48 h-48 bg-gradient-to-br from-cyan-100/10 to-blue-100/5 rounded-full -top-16 -left-16 translate-x-2 animate-liquid-blob-1" />
                <div className="absolute w-40 h-40 bg-gradient-to-br from-indigo-100/8 to-purple-100/3 top-4 -right-12 translate-y-1 animate-liquid-blob-2" />
                <div className="absolute w-52 h-52 bg-gradient-to-br from-pink-100/6 to-rose-100/2 bottom-8 left-4 -translate-x-1 animate-liquid-blob-3" />
              </div>

              {/* TEXT CONTENT - Forced single line */}
              <div className="relative z-10">
                <h1 className="text-[4.5vw] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 md:mb-3 drop-shadow-lg tracking-tight capitalize whitespace-nowrap">
                  Knowledge Institute Of Technology
                </h1>
                <p className="text-base sm:text-lg md:text-2xl font-medium opacity-90 tracking-wide whitespace-nowrap">
                  Beyond Knowledge
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OBJECTIVES CARD */}
      <div className="relative z-30 -mt-24 w-full flex justify-center pb-24 px-4">
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMoveCard}
          onMouseLeave={handleMouseLeaveCard}
          className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl px-12 py-16 border border-gray-100 origin-center transform-gpu will-change-transform"
          style={{
            opacity: cardOpacity,
            transform: `
              translateY(${cardTranslateY}px)
              scale(${cardScale})
              rotateX(${tilt.x}deg) 
              rotateY(${tilt.y}deg)
            `,
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-12">
            <h2 className='text-[#023347] font-extrabold text-[40px] tracking-tight'>
              Our objectives
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-12 text-left'>
            
            {/* 1. Industry Interaction */}
            <div 
              className={`flex flex-col gap-4 group p-4 rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] 
                hover:bg-white hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] hover:border-[#388E9C]/20 border border-transparent
                active:scale-[0.98] active:shadow-sm
                ${cardOpacity > 0.6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <div className="w-8 h-8 text-[#3C3E40] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:text-[#388E9C]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              </div>
              <h3 className="text-[#023347] font-bold text-xl transition-colors duration-300 group-hover:text-[#388E9C]">Industry Interaction</h3>
              <p className='text-[#3C3E40] text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-300'>
                To interact with Industries in all possible ways to bridge the gap between academia and corporate.
              </p>
            </div>

            {/* 2. Research & Dev */}
            <div 
              className={`flex flex-col gap-4 group p-4 rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] 
                hover:bg-white hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] hover:border-[#388E9C]/20 border border-transparent
                active:scale-[0.98] active:shadow-sm
                ${cardOpacity > 0.6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <div className="w-8 h-8 text-[#3C3E40] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:text-[#388E9C]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <h3 className="text-[#023347] font-bold text-xl transition-colors duration-300 group-hover:text-[#388E9C]">Research & Dev</h3>
              <p className='text-[#3C3E40] text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-300'>
                To build Research and Development activities that solve real-world engineering problems.
              </p>
            </div>

            {/* 3. Practical Knowledge */}
            <div 
              className={`flex flex-col gap-4 group p-4 rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] 
                hover:bg-white hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] hover:border-[#388E9C]/20 border border-transparent
                active:scale-[0.98] active:shadow-sm
                ${cardOpacity > 0.6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <div className="w-8 h-8 text-[#3C3E40] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:text-[#388E9C]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-[#023347] font-bold text-xl transition-colors duration-300 group-hover:text-[#388E9C]">Practical Knowledge</h3>
              <p className='text-[#3C3E40] text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-300'>
                To enrich students with hands-on practical knowledge beyond standard curriculum textbooks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fix: Standard React style tag injection to prevent syntax errors */}
      <style>
        {`
          @keyframes liquid-blob-1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(8px, -12px) scale(1.03); }
            66% { transform: translate(-5px, 5px) scale(0.97); }
          }
          @keyframes liquid-blob-2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-10px, 8px) scale(1.05); }
            66% { transform: translate(6px, -4px) scale(0.95); }
          }
          @keyframes liquid-blob-3 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(12px, -6px) scale(0.99); }
            66% { transform: translate(-8px, 10px) scale(1.02); }
          }
        `}
      </style>
    </div>
  )
}

export default Home;