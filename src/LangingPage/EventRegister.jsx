import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EventRegister() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/upcoming-events/${id}`);
        const data = await response.json();
        setEvent(data);
        setTimeout(() => setIsVisible(true), 100);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  // --- GHOST SHIMMER LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6">
        <div className="max-w-[1500px] w-full space-y-8 animate-pulse">
           <div className="h-10 w-48 bg-[#023347]/10 rounded-xl" />
           <div className="relative flex flex-col lg:flex-row bg-white/[0.03] border border-black/5 rounded-[2rem] overflow-hidden min-h-[600px]">
              <div className="w-full lg:w-[500px] bg-[#023347]/5" />
              <div className="flex-1 p-12 space-y-6">
                <div className="h-12 w-3/4 bg-[#023347]/10 rounded-2xl" />
                <div className="h-4 w-24 bg-[#D4AF37]/20 rounded-full" />
                <div className="space-y-3 pt-8">
                  <div className="h-4 w-full bg-[#023347]/5 rounded" />
                  <div className="h-4 w-5/6 bg-[#023347]/5 rounded" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
           </div>
        </div>
      </div>
    );
  }

  if (!event) return <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center font-serif text-[#023347]">Event data not found.</div>;

  return (
    <div className="relative min-h-screen bg-[#FDFCFB] text-[#023347] font-sans selection:bg-[#D4AF37]/20 overflow-x-hidden">
      
      {/* --- AMBIENT LIGHTING --- */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      <main className="max-w-[1500px] mx-auto px-6 md:px-12 py-16 relative z-10">
        
        {/* --- HEADER ZONE --- */}
        <header className="mb-12 border-b border-[#023347]/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="flex flex-col items-start text-left">
            <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] mb-4">Academic Opportunity</span>
            <h1 className={`font-serif text-4xl md:text-5xl font-semibold leading-tight transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37]">Registration</span>
            </h1>
          </div>
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-3 bg-white border border-[#023347]/10 text-[#023347] px-8 py-3.5 rounded-2xl text-[10px] font-bold tracking-[0.2em] uppercase transition-all hover:bg-gray-50 shadow-sm active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg>
            Back to Deck
          </button>
        </header>

        {/* --- CONTENT MODULE (Corporate Glass) --- */}
        <div className={`flex flex-col lg:flex-row bg-white/[0.02] backdrop-blur-[4px] border border-black/5 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-[1200ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          
          {/* IMAGE SECTION */}
          <div className="lg:w-[500px] xl:w-[600px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#023347]/10 z-10 pointer-events-none" />
            <img 
              src={event.brochure_url} 
              alt="Brochure" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          </div>

          {/* DETAIL SECTION */}
          <div className="flex-1 p-8 md:p-14 relative">
            {/* The Prestige Pillar */}
            <div className="absolute left-0 top-14 w-1.5 h-20 bg-[#D4AF37] rounded-r-full" />
            
            <div className="mb-8">
              <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase">{event.event_type}</span>
              <h2 className="font-serif text-3xl md:text-4xl mt-3 text-[#023347]">{event.event_title}</h2>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                 <h4 className="text-[11px] font-bold tracking-widest uppercase text-[#023347]/40 border-b border-[#023347]/5 pb-2">Overview</h4>
                 <p className="text-[#023347]/70 text-base leading-relaxed font-sans">{event.event_description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                {[
                  { label: "Window Opens", value: event.start_date },
                  { label: "Window Closes", value: event.end_date },
                  { label: "Faculty Lead", value: event.faculty_contact },
                  { label: "Student Liaison", value: event.student_contact },
                ].map((item, idx) => (
                  <div key={idx} className="border-l-2 border-[#023347]/5 pl-4 hover:border-[#D4AF37] transition-colors">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-[#023347]/40 mb-1">{item.label}</p>
                    <p className="text-[15px] font-medium text-[#023347]">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* ACTION ANCHORS */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <a 
                  href={event.event_link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 bg-[#023347] text-white text-center py-4 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#D4AF37] hover:shadow-xl hover:shadow-[#D4AF37]/20 transition-all duration-500 active:scale-95"
                >
                  Secure Registration
                </a>
                <a 
                  href={event.brochure_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 bg-white border border-[#023347]/10 text-[#023347] text-center py-4 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all active:scale-95"
                >
                  View Full Brochure
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- PRESTIGE STYLES --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;500;600;700&display=swap');
        
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }

        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }

        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #D4AF37/20; border-radius: 10px; }
      `}</style>
    </div>
  );
}

export default EventRegister;