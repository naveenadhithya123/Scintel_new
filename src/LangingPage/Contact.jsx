import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HarishB from "../assets/HarishB.jpeg";
import logo from "../assets/logo.jpeg";
import Sasikumarsir from "../assets/Sasikumarsir.webp";

const contacts = [
  {
    id: 1,
    name: "Mr.P.Sasikumar",
    designation: "Faculty Incharge",
    phone: "9976949310",
    email: "psacse@kiot.ac.in",
    image: Sasikumarsir,
  },
  {
    id: 2,
    name: "Harish B",
    designation: "Secretary",
    phone: "9597592496",
    email: "2k22cse048@kiot.ac.in",
    image: HarishB,
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
      className="relative flex min-h-screen flex-col bg-[#FDFCFB] pt-20 text-[#023347] selection:bg-[#D4AF37]/20 md:pt-24"
    >
      {/* --- 4. AMBIENT LIGHTING (God Ray) --- */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      {/* --- CONTACT SECTION --- */}
      <section className="relative z-10 mx-auto flex-1 w-full max-w-[1500px] px-5 md:px-12">
        
        {/* --- 1. UNIFIED HEADER SECTION --- */}
        <header className="mb-16 border-b border-[#023347]/5 pb-10">
          <div className="flex items-center gap-4 mb-4">
            <span className={`text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              Reach Us Anytime
            </span>
              
            </div>
            <h1 className={`text-3xl md:text-6xl font-semibold text-[#023347] tracking-tight transition-all duration-[1200ms] delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37]">SCINTEL</span>
            </h1>
        </header>

        <div className="mb-20 grid grid-cols-1 gap-6 md:mb-32 md:grid-cols-2 md:gap-10">
          {contacts.map((person, index) => (
            <article
              key={person.id}
              className={`group relative transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ 
                transitionDelay: `${index * 150}ms`,
                animation: isVisible ? `gentle-float ${4 + index}s ease-in-out infinite alternate` : 'none'
              }}
            >
              {/* --- 2. CORPORATE GLASS MODULE --- */}
              <div className="flex flex-col items-center rounded-[2rem] border-[1.5px] border-[#023347]/10 bg-white/[0.02] p-6 text-center backdrop-blur-[4px] transition-all duration-700 hover:-translate-y-3 hover:border-[#D4AF37]/50 hover:shadow-2xl hover:shadow-[#D4AF37]/10 md:p-10">
                
                {/* Avatar Frame */}
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full mb-8 p-1 border-[1.5px] border-[#023347]/10 group-hover:border-[#D4AF37]/50 transition-all duration-700 overflow-hidden bg-white/50 shadow-inner">
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

        <div className="relative z-10 mx-auto grid max-w-[1500px] grid-cols-1 gap-12 px-5 md:grid-cols-12 md:gap-16 md:px-12">
          
          {/* Brand Identity */}
          <div className="md:col-span-5 space-y-10">
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
                <img src={logo} alt="SCINTEL logo" className="h-full w-full object-cover" />
              </div>
              <span className="text-3xl font-semibold tracking-tight font-serif">
                SCINTEL<span className="text-[#D4AF37]">.</span>
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
              <a href="https://www.linkedin.com/school/infokiot/" className="flex items-center justify-between p-5 rounded-2xl border border-white/5 hover:border-[#D4AF37]/30 hover:bg-white/[0.03] transition-all duration-500 group">
                <span className="text-[13px] font-bold text-white/60 group-hover:text-white">LinkedIn</span>
                <div className="w-1 h-1 rounded-full bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all shadow-[0_0_8px_#D4AF37]" />
              </a>
              <a href="mailto:official@scintel.org" className="flex items-center justify-between p-5 rounded-2xl border border-white/5 hover:border-[#D4AF37]/30 hover:bg-white/[0.03] transition-all duration-500 group">
                <span className="text-[13px] font-bold text-white/60 group-hover:text-white">Email Portal</span>
                <div className="w-1 h-1 rounded-full bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all shadow-[0_0_8px_#D4AF37]" />
              </a>
              <a href="https://www.instagram.com/scintel_association?igsh=MnRuYnFlZGNsOTh1" className="flex items-center justify-between p-5 rounded-2xl border border-white/5 hover:border-[#D4AF37]/30 hover:bg-white/[0.03] transition-all duration-500 group">
                <span className="text-[13px] font-bold text-white/60 group-hover:text-white">Instagram</span>
                <div className="w-1 h-1 rounded-full bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all shadow-[0_0_8px_#D4AF37]" />
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-[1500px] flex-col items-center justify-between gap-6 border-t border-white/5 px-5 pt-10 text-center font-sans md:mt-24 md:flex-row md:px-8 md:text-left">
          <p className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase font-bold">
            © 2026 Built with excellence by Synergy Squad 4.0 Consultancy Project Team
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
