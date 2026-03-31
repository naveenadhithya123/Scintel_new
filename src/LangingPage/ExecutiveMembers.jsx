import React, { useEffect, useState, useRef } from "react";
import GiriN from "../assets/GiriN.jpeg";
import HarishB from "../assets/HarishB.jpeg";
import KavyaS from "../assets/KavyaS.jpeg";
import NegasriR from "../assets/NegasriR.jpeg";
import PriyankaSS from "../assets/PriyankaSS.jpeg";
import RohithS from "../assets/RohithS.jpeg";

/**
 * SCINTEL PRESTIGE: EXECUTIVE MEMBER COMPONENT
 * Refactored to Full Layout Design System (March 2026)
 */

const members = [
  { id: 1, name: "Harish B", designation: "Secretary", image: HarishB, mail: "2k22cse048@kiot.ac.in", mobile: "9597592496", imagePosition: "50% 20%" },
  { id: 2, name: "Kavya S", designation: "Joint-Secretary", image: KavyaS, mail: "2k22cse077@kiot.ac.in", mobile: "9994807970", imagePosition: "50% 18%" },
  { id: 3, name: "Giri N", designation: "Joint-Secretary", image: GiriN, mail: "2k23cse043@kiot.ac.in", mobile: "9345558611", imagePosition: "50% 18%" },
  { id: 4, name: "Priyanka S S", designation: "Treasurer", image: PriyankaSS, mail: "2k22cse121@kiot.ac.in", mobile: "6381244181", imagePosition: "50% 18%" },
  { id: 5, name: "Nega sri R", designation: "Joint-Treasurer", image: NegasriR, mail: "2k23cse109@kiot.ac.in", mobile: "8946092297", imagePosition: "50% 16%" },
  { id: 6, name: "Rohith S", designation: "Joint-Treasurer", image: RohithS, mail: "2k23cse133@kiot.ac.in", mobile: "8608900563", imagePosition: "50% 18%" },
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
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#FDFCFB] py-16 text-[#023347] selection:bg-[#D4AF37]/20 md:py-24">
      
      {/* --- 4. AMBIENT LIGHTING (God Ray) --- */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      <section ref={sectionRef} className="relative z-10 mx-auto w-full max-w-[1500px] px-5 md:px-12">
        
        {/* --- 1. UNIFIED HEADER SECTION --- */}
        <header className="mb-20 flex flex-col items-start border-b border-[#023347]/5 pb-10">
          <div className="flex items-center gap-4 mb-4">
            <span className={`text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              Leadership That Serves and Inspires
            </span>
          
          </div>
          
          <h2 className={`text-3xl md:text-6xl font-semibold text-[#023347] tracking-tight transition-all duration-[1200ms] delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            Executive <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37]">Members</span>
          </h2>
          
        </header>

        {/* --- 2. CORPORATE MODULE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-14">
          {members.map((member, index) => (
            <article 
              key={member.id}
              className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                animation: isVisible ? `gentle-float ${4 + (index % 3)}s ease-in-out infinite alternate` : 'none',
                animationDelay: `${index * 0.2}s`
              }}
            >
              {/* --- CORPORATE GLASS MODULE --- */}
              <div className="group relative flex flex-col items-center gap-5 rounded-[2rem] border-[1.5px] border-[#023347]/10 bg-white/[0.02] p-6 text-center backdrop-blur-[4px] transition-all duration-700 hover:-translate-y-3 hover:border-[#D4AF37]/50 hover:shadow-2xl hover:shadow-[#D4AF37]/10 md:flex-row md:items-center md:gap-6 md:text-left">
                
                {/* Image Frame (Circle Variant) */}
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-[1.5px] border-[#023347]/10 p-1 transition-all duration-700 group-hover:border-[#D4AF37]/50 flex-shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="h-full w-full object-cover opacity-90 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-100"
                      style={{ objectPosition: member.imagePosition }}
                    />
                  </div>
                </div>

                {/* Content Block (Standard Font) */}
                <div className="flex min-w-0 flex-1 flex-col font-sans">
                  <h3 className="text-xl font-bold text-[#023347] tracking-tight group-hover:text-[#B8860B] transition-colors duration-500 md:truncate">
                    {member.name}
                  </h3>
                  
                  <p className="text-[12px] text-[#023347]/60 font-semibold uppercase tracking-widest mt-1">
                    {member.designation}
                  </p>

                  <div className={`h-[1.5px] bg-[#D4AF37] mt-3 transition-all duration-700 ${isVisible ? 'w-8' : 'w-0'} group-hover:w-full`} />

                  <div className="mt-4 space-y-2">
                    <a
                      href={`mailto:${member.mail}`}
                      className="flex items-center gap-2 text-[12px] font-medium text-[#023347]/75 transition-colors duration-300 hover:text-[#B8860B]"
                    >
                      <svg className="h-4 w-4 flex-shrink-0 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 7.5v9A2.25 2.25 0 0 1 19.5 18.75h-15A2.25 2.25 0 0 1 2.25 16.5v-9m19.5 0A2.25 2.25 0 0 0 19.5 5.25h-15A2.25 2.25 0 0 0 2.25 7.5m19.5 0-8.689 5.792a2.25 2.25 0 0 1-2.122 0L2.25 7.5" />
                      </svg>
                      <span className="break-all md:truncate">{member.mail}</span>
                    </a>

                    <a
                      href={`tel:${member.mobile}`}
                      className="flex items-center gap-2 text-[12px] font-medium text-[#023347]/75 transition-colors duration-300 hover:text-[#B8860B]"
                    >
                      <svg className="h-4 w-4 flex-shrink-0 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 4.5A2.25 2.25 0 0 1 4.5 2.25h2.118c.966 0 1.8.691 1.981 1.64l.574 2.986a2.25 2.25 0 0 1-.634 2.045l-1.516 1.516a16.5 16.5 0 0 0 6.54 6.54l1.516-1.516a2.25 2.25 0 0 1 2.045-.634l2.986.574A2.25 2.25 0 0 1 21.75 17.382V19.5a2.25 2.25 0 0 1-2.25 2.25h-.75C9.559 21.75 2.25 14.441 2.25 5.25V4.5Z" />
                      </svg>
                      <span>{member.mobile}</span>
                    </a>
                  </div>
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
