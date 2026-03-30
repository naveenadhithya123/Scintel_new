import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // ← added useNavigate

const EventDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); // ← added
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/activities/event/${id}`);
        const data = await response.json();
        setEventData(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
    </div>
  );

  if (!eventData) return <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center font-serif text-[#023347]">Record Not Found.</div>;

  const photos = eventData.event_image_url ? [eventData.event_image_url] : [];

  return (
    <div ref={sectionRef} className="relative min-h-screen bg-[#FDFCFB] text-[#023347] font-poppins selection:bg-[#D4AF37]/20 overflow-x-hidden">
      
      {/* --- 4. AMBIENT LIGHTING (God Ray) --- */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />

      <main className="max-w-[1500px] mx-auto px-6 md:px-12 py-20 relative z-10">
        
        {/* --- 1. UNIFIED HEADER SECTION --- */}
        <header className="mb-16 border-b border-[#023347]/5 pb-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-3xl">
            <span className={`text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] mb-5 block transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              Batch Archive: {eventData.batch}
            </span>
            <h1 className={`font-serif text-4xl md:text-6xl font-semibold leading-tight transition-all duration-[1200ms] delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              {eventData.title.split(' ').slice(0, -1).join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">{eventData.title.split(' ').pop()}</span>
            </h1>
            <p className={`mt-6 text-[#023347]/70 leading-relaxed max-w-2xl transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              {eventData.description}
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 bg-[#023347] text-white px-10 py-4 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/20 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" />
            </svg>
            Back to Batch
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: Media & Participants */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Main Gallery Frame */}
            <section className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#D4AF37]">Event Gallery</h2>
                <div className="h-[1px] flex-1 bg-[#D4AF37]/20" />
              </div>
              <div className="grid grid-cols-1 gap-6">
                {photos.map((photo, index) => (
                  <div key={index} className="group relative aspect-video rounded-[2.5rem] overflow-hidden border border-black/5 shadow-inner">
                    <img 
                      src={`/images/${photo}`} 
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                      alt="Event" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#023347]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </section>

            {/* Participants Module */}
            <div className="bg-white/[0.02] backdrop-blur-[4px] border border-black/5 rounded-[2rem] p-8 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#023347] uppercase tracking-widest text-[10px] mb-1">Engagement</h3>
                <p className="text-2xl font-bold text-[#D4AF37]">{eventData.participants} <span className="text-sm font-medium text-[#023347]/50 italic">Students Enrolled</span></p>
              </div>
              <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Personnel & Recognition */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* Resource Person: Corporate Glass Module */}
            {eventData.resource_person_name && (
              <section className={`group bg-white/[0.02] backdrop-blur-[4px] border border-black/5 rounded-[2.5rem] p-8 transition-all duration-700 hover:border-[#D4AF37]/40 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-8 bg-[#023347] group-hover:bg-[#D4AF37] transition-colors" />
                  <h2 className="font-bold tracking-[0.2em] uppercase text-[11px]">Lead Facilitator</h2>
                </div>
                <div className="space-y-6">
                  <div className="aspect-square w-32 rounded-3xl overflow-hidden border-2 border-[#D4AF37]/10">
                    <img src={`/images/${eventData.resource_person_image_url}`} className="w-full h-full object-cover" alt="Facilitator" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{eventData.resource_person_name}</h3>
                    <p className="text-sm text-[#023347]/60 leading-relaxed italic">"{eventData.resource_person_description}"</p>
                  </div>
                </div>
              </section>
            )}

            {/* Winner Spotlight */}
            {eventData.winner_name && (
              <section className="relative overflow-hidden bg-[#023347] rounded-[2.5rem] p-10 text-white shadow-2xl shadow-[#023347]/20">
                <div className="absolute top-0 right-0 p-8">
                   <span className="text-[40px] opacity-10 font-serif">"</span>
                </div>
                <h2 className="text-[#D4AF37] font-bold tracking-[0.3em] uppercase text-[10px] mb-6">Excellence Award</h2>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">{eventData.winner_name}</h3>
                  <p className="text-sm text-white/70 leading-relaxed mb-6 italic">
                    {eventData.winner_description}
                  </p>
                  <div className="h-[1px] w-12 bg-[#D4AF37] mb-2" />
                  <p className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase">Top Achiever</p>
                </div>
              </section>
            )}

            {/* Testimonials */}
            {eventData.testimonials_name && (
              <div className="border-l-2 border-[#D4AF37]/30 pl-8 py-4">
                <p className="text-sm text-[#023347]/80 italic leading-relaxed mb-4">
                  "{eventData.testimonials_feedback}"
                </p>
                <p className="font-bold text-[11px] uppercase tracking-widest text-[#023347]">
                  — {eventData.testimonials_name}
                </p>
                <p className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-tighter mt-1">{eventData.testimonials_class}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins:wght@300;400;500;600;700;800&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-poppins { font-family: 'Poppins', sans-serif; }
      `}</style>
    </div>
  );
};

export default EventDetails;