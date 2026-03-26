import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const contacts = [
  {
    id: 1,
    name: "Aravind Kumar",
    designation: "Chief Coordinator",
    phone: "+91 98765 43210",
    email: "aravind@scintel.org",
    image: null,
  },
  {
    id: 2,
    name: "Sanjana Rao",
    designation: "Operations Lead",
    phone: "+91 87654 32109",
    email: "sanjana@scintel.org",
    image: null,
  },
];

const quickLinks = [
  { label: "Upcoming Events", type: "scroll", id: "events" },
  { label: "Activities", type: "page", path: "/activities" },
  { label: "Members", type: "page", path: "/members" },
  { label: "Glories", type: "scroll", id: "glories" },
  { label: "Problems", type: "page", path: "/problems" },
  { label: "Suggestions", type: "page", path: "/suggestions" },
  { label: "Contact", type: "scroll", id: "contact" }
];

export default function Contact() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div 
      ref={sectionRef} 
      id="contact" 
      className="relative bg-[#FDFCFB] min-h-screen text-[#023347] selection:bg-[#D4AF37]/20 flex flex-col pt-24"
    >
      {/* --- 4. AMBIENT LIGHTING (God Ray) --- */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      {/* --- CONTACT SECTION --- */}
      <section className="max-w-[1500px] mx-auto px-6 md:px-12 w-full flex-1 relative z-10">
        
        {/* --- 1. UNIFIED HEADER SECTION --- */}
        <header className="mb-16 border-b border-[#023347]/5 pb-10">
          <div className="flex items-center gap-4 mb-4">
            <span className={`text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              Connect with us
            </span>
            <div className={`h-[1px] bg-[#D4AF37]/30 transition-all duration-[1.5s] ${isVisible ? 'w-24' : 'w-0'}`} />
          </div>
          <h1 className={`text-5xl md:text-6xl font-semibold font-serif text-[#023347] tracking-tight transition-all duration-[1200ms] delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37]">Scintel</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-32">
          {contacts.map((person, index) => (
            <article
              key={person.id}
              className={`group relative transition-all duration-[1s] ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ 
                transitionDelay: `${index * 150}ms`,
                // 3. MOTION PHYSICS
                animation: isVisible ? `gentle-float ${4 + index}s ease-in-out infinite alternate` : 'none'
              }}
            >
              {/* --- 2. CORPORATE GLASS MODULE --- */}
              <div className="bg-white/[0.02] backdrop-blur-[4px] rounded-[2rem] border border-black/5 p-10 flex flex-col items-center text-center transition-all duration-700 hover:border-[#D4AF37]/40 hover:shadow-2xl hover:shadow-[#D4AF37]/10 hover:-translate-y-3">
                
                {/* Avatar Frame */}
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full mb-8 p-1 border border-black/5 group-hover:border-[#D4AF37]/50 transition-all duration-700 overflow-hidden bg-white/50 shadow-inner">
                  {person.image ? (
                    <img src={person.image} alt={person.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-[#FDFCFB] to-gray-100">
                      <svg className="w-12 h-12 text-[#023347]/20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="font-sans">
                  <span className="text-[9px] font-bold text-[#D4AF37] tracking-[0.4em] uppercase mb-3 block">Representative</span>
                  <h3 className="text-2xl font-bold text-[#023347] mb-1 group-hover:text-[#B8860B] transition-colors duration-500 tracking-tight">
                    {person.name}
                  </h3>
                  <p className="text-[11px] text-[#023347]/50 font-semibold uppercase tracking-widest mb-8">
                    {person.designation}
                  </p>

                  <div className="space-y-3">
                    <p className="text-md font-bold text-[#023347] group-hover:text-[#D4AF37] transition-colors duration-500">{person.phone}</p>
                    <p className="text-sm text-[#023347]/60 font-medium italic">{person.email}</p>
                  </div>
                </div>

                <div className="absolute top-8 right-8 w-1.5 h-1.5 rounded-full bg-[#D4AF37]/10 group-hover:bg-[#D4AF37] transition-all duration-500" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* --- PRESTIGE FOOTER --- */}
      <footer className="bg-[#023347] text-white pt-24 pb-12 relative overflow-hidden">
        {/* Subtle Decorative Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="max-w-[1500px] mx-auto px-8 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-16 relative z-10">
          
          {/* Brand Identity */}
          <div className="md:col-span-5 space-y-10">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 border border-white/10 rounded-2xl flex items-center justify-center text-xl font-serif italic text-[#D4AF37] bg-white/5 backdrop-blur-sm shadow-xl">
                S
              </div>
              <span className="text-3xl font-semibold tracking-tight font-serif">
                Scintel<span className="text-[#D4AF37]">.</span>
              </span>
            </div>
            <p className="text-white/40 font-sans text-sm leading-relaxed max-w-sm italic">
              Empowering the next generation of engineers through systematic research, elite industry partnerships, and practical knowledge.
            </p>
          </div>

          {/* Quick Navigation (Sans-Serif) */}
          <div className="md:col-span-4 lg:pl-20 font-sans">
            <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#D4AF37] mb-10">Navigation</h4>
            <ul className="grid grid-cols-2 gap-y-5 gap-x-10">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button 
                    onClick={() => link.type === "page" ? navigate(link.path) : scrollToSection(link.id)}
                    className="text-white/50 text-[13px] font-medium hover:text-[#D4AF37] transition-all duration-300 flex items-center gap-3 group"
                  >
                    <div className="w-0 h-[1px] bg-[#D4AF37] transition-all duration-500 group-hover:w-4" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Portal */}
          <div className="md:col-span-3 font-sans">
            <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#D4AF37] mb-10">Digital Presence</h4>
            <div className="space-y-4">
              <a href="#" className="flex items-center justify-between p-5 rounded-2xl border border-white/5 hover:border-[#D4AF37]/30 hover:bg-white/[0.03] transition-all duration-500 group">
                <span className="text-[13px] font-bold text-white/60 group-hover:text-white">LinkedIn</span>
                <div className="w-1 h-1 rounded-full bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all shadow-[0_0_8px_#D4AF37]" />
              </a>
              <a href="mailto:official@scintel.org" className="flex items-center justify-between p-5 rounded-2xl border border-white/5 hover:border-[#D4AF37]/30 hover:bg-white/[0.03] transition-all duration-500 group">
                <span className="text-[13px] font-bold text-white/60 group-hover:text-white">Email Portal</span>
                <div className="w-1 h-1 rounded-full bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all shadow-[0_0_8px_#D4AF37]" />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-[1500px] mx-auto px-8 mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 font-sans">
          <p className="text-[10px] tracking-[0.2em] text-white/20 uppercase font-bold">
            © 2026 Scintel Prestige . Secured & Verified Institutional Portal
          </p>
          <div className="flex gap-10">
             <span className="text-[10px] font-bold text-white/20 hover:text-[#D4AF37] cursor-pointer transition-colors uppercase tracking-widest">Privacy</span>
             <span className="text-[10px] font-bold text-white/20 hover:text-[#D4AF37] cursor-pointer transition-colors uppercase tracking-widest">Terms</span>
          </div>
        </div>
      </footer>

      {/* --- 3. MOTION PHYSICS --- */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');
        
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: "Inter", "Segoe UI", sans-serif; }

        @keyframes gentle-float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}