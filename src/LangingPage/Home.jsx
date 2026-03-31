import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.jpeg';
import clgimg from './kiot img.jpeg';

const objectives = [
  {
    title: 'Industry Interaction',
    desc: 'To interact with Industries in all possible ways.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12m-4.5 4.5H16.5a4.5 4.5 0 1 0 0-9H15" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3 21 7.5m0 0L16.5 12M21 7.5H7.5a4.5 4.5 0 1 0 0 9H9" />
      </svg>
    ),
  },
  {
    title: 'Research & Development',
    desc: 'Nab to bulid Research and Development activities.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-2.844.813a1.125 1.125 0 0 0 0 2.124l2.844.813L9.813 25.5a1.125 1.125 0 0 0 2.124 0l.813-2.844 2.844-.813a1.125 1.125 0 0 0 0-2.124l-2.844-.813-.813-2.846a1.125 1.125 0 0 0-2.124 0ZM18.259 8.715 17.25 12l-3.285 1.009a1.125 1.125 0 0 0 0 2.148l3.285 1.009 1.009 3.285a1.125 1.125 0 0 0 2.148 0l1.009-3.285 3.285-1.009a1.125 1.125 0 0 0 0-2.148L21.416 12l-1.009-3.285a1.125 1.125 0 0 0-2.148 0ZM15.75 4.5h.008v.008h-.008V4.5Z" />
      </svg>
    ),
  },
  {
    title: 'Practical Knowledge',
    desc: 'To enrich the students Practical Knowledge.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9m-9 6h9m-9 6h9M4.5 6h.008v.008H4.5V6Zm0 6h.008v.008H4.5V12Zm0 6h.008v.008H4.5V18Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5A1.5 1.5 0 0 1 21.75 6v12a1.5 1.5 0 0 1-1.5 1.5H3.75A1.5 1.5 0 0 1 2.25 18V6a1.5 1.5 0 0 1 1.5-1.5Z" />
      </svg>
    ),
  },
];

function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="home" className="min-h-screen overflow-x-hidden bg-[#FDFCFB] -mt-20 selection:bg-[#D4AF37]/20">
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#023347]">
        <img
          src={clgimg}
          alt="Campus"
          className="absolute inset-0 h-full w-full object-cover opacity-95"
        />

        <div className="absolute inset-0 bg-[#041f2b]/25 backdrop-blur-[2.5px] z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#022534]/35 via-[#022534]/20 to-[#022534]/45 z-10" />

        <div
          className={`relative z-20 w-full max-w-[1500px] px-6 transition-all duration-1000 ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="mx-auto w-full max-w-9xl rounded-[2rem] border border-white/15 bg-black/10 px-5 py-12 text-center shadow-[0_30px_80px_rgba(0,0,0,0.24)] sm:px-8 md:rounded-[2.5rem] md:px-14 md:py-20">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-3 md:gap-4">
              
              <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.45em] text-white/85 md:text-[10px] md:tracking-[0.6em]">
                Established 2009
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-tight text-white drop-shadow-lg sm:text-4xl md:text-6xl lg:text-8xl">
              Knowledge Institute of
              <br className="hidden md:block" />Technology
            </h1>

            <p className="mt-6 font-sans text-base font-semibold uppercase tracking-[0.28em] text-[#D4AF37] sm:text-lg md:text-2xl md:tracking-[0.5em]">
              Beyond Knowledge
            </p>

            <div className="mx-auto mt-5 h-[2px] w-36 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

            <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-[#D4AF37] sm:text-sm md:text-base md:tracking-[0.45em]">
              Department of Computer Science and Engineering
            </p>
          </div>
        </div>
      </div>

      <section className="relative z-30 mx-auto -mt-16 max-w-[1500px] px-4 pb-24 sm:px-6 md:-mt-24 md:pb-40">
        <div
          className={`rounded-[2rem] border-2 border-black/5 bg-white p-6 shadow-[0_50px_100px_-20px_rgba(2,51,71,0.12)] transition-all duration-[1.2s] sm:p-8 md:p-20 ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
        >
          <div className="mb-20">
            <div className="mb-6 flex items-center gap-4">
              <span className="font-sans text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">
               The Pillars of Progress
              </span>
            </div>
            <h2 className="font-sans text-3xl font-semibold tracking-tight text-[#023347] md:text-5xl">
              Our <span className="text-[#B8860B]">Objectives</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {objectives.map((obj, i) => (
              <div
                key={obj.title}
                className="group rounded-[2rem] border-2 border-[#023347]/10 bg-[#FDFCFB]/50 p-6 transition-all duration-700 hover:-translate-y-3 hover:border-[#D4AF37]/50 hover:bg-white hover:shadow-2xl hover:shadow-[#D4AF37]/10 sm:p-8 md:p-10"
                style={{ animation: `gentle-float ${5 + i}s ease-in-out infinite alternate` }}
              >
                <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#023347]/5 text-[#023347] shadow-sm transition-all duration-500 group-hover:bg-[#023347] group-hover:text-white">
                  {obj.icon}
                </div>
                <h3 className="font-sans text-xl font-bold tracking-tight text-[#023347] transition-colors group-hover:text-[#B8860B]">
                  {obj.title}
                </h3>
                <p className="mt-5 font-sans text-[14px] font-medium leading-relaxed text-[#023347]/60">
                  {obj.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

          .font-sans { font-family: "Poppins", sans-serif; }
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
