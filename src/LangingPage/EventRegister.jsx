import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, User, FileText, ExternalLink, AlertCircle, Clock } from "lucide-react";

function EventRegister() {
  const { id, type } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Helper to format dates (e.g., "March 27, 2026")
  const formatDate = (dateString) => {
    if (!dateString || dateString.startsWith("0000")) return "NA";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "NA";
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (!id || id === "undefined" || !type || type === "undefined") {
      setError("Invalid access parameters. Please return to the event list.");
      setLoading(false);
      return;
    }

    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:3000/api/announcement/${id}/${type}`);
        
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setEvent(result.data);
          setTimeout(() => setIsVisible(true), 100);
        } else {
          setError(result.message || "Event details could not be found.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not connect to the server. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
    window.scrollTo(0, 0);
  }, [id, type]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="text-[#D4AF37] mb-4" size={48} />
        <h2 className="font-serif text-2xl text-[#023347] mb-2">Notice</h2>
        <p className="text-[#023347]/60 max-w-md mb-8">{error}</p>
        <button 
          onClick={() => navigate("/")} 
          className="bg-[#023347] text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all active:scale-95"
        >
          Return to Events
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6">
        <div className="max-w-[1200px] w-full animate-pulse">
          <div className="h-10 w-48 bg-[#023347]/10 rounded-xl mb-8" />
          <div className="h-[550px] bg-[#023347]/5 rounded-[2rem] md:rounded-[3rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FDFCFB] text-[#023347] font-sans selection:bg-[#D4AF37]/20 overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-[300px] md:h-[500px] bg-gradient-to-b from-[#D4AF37]/10 to-transparent pointer-events-none" />

      <main className="max-w-[1400px] mx-auto px-5 md:px-12 py-8 md:py-12 relative z-10">
        
        {/* Header */}
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#023347]/5 pb-8 md:pb-10">
          <div className="text-left">
            <span className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] md:tracking-[0.5em] uppercase text-[#D4AF37] mb-2 md:mb-3 block">
              {type === "event" ? "Official Symposium" : "Campus Life"}
            </span>
            <h1 className={`text-3xl md:text-6xl font-semibold transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0 translate-y-8"}`}>
              Register <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">Portal</span>
            </h1>
          </div>
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 bg-white border border-[#023347]/10 px-5 py-2.5 md:px-6 md:py-3 rounded-xl text-[9px] md:text-[10px] font-bold tracking-widest uppercase hover:shadow-lg transition-all active:scale-95"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Deck
          </button>
        </header>

        {/* Card Module */}
        <div className={`flex flex-col lg:flex-row bg-white/60 backdrop-blur-xl border border-black/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-[1200ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}>
          
          {/* Image Section */}
          <div className="w-full lg:w-[450px] xl:w-[550px] aspect-video lg:aspect-auto bg-[#023347]/5 relative overflow-hidden group">
            {event?.brochure_url ? (
              <img src={event.brochure_url} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-[#D4AF37]/30 font-bold uppercase text-[9px] tracking-widest">Visual Pending</div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex-1 p-6 md:p-10 xl:p-14">
            <div className="mb-8 md:mb-10">
              
              <h2 className="text-2xl md:text-5xl text-[#023347] font-semibold leading-tight">{event?.title}</h2>
            </div>

            <div className="space-y-8 md:space-y-10">
              <section>
                <div className="flex items-center gap-2 text-[#023347]/40 mb-3">
                  <FileText size={14} />
                  <h4 className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase">Abstract</h4>
                </div>
                <p className="text-[#023347]/70 text-base md:text-lg leading-relaxed font-sans italic">
                  {event?.description || event?.short_description || "Further details are currently being finalized by the department."}
                </p>
              </section>

              {/* Enhanced Data Grid with Registration Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {[
                  { label: "Registration Opens", val: formatDate(event?.registration_start_date), icon: <Clock size={14}/> },
                  { label: "Registration Closes", val: formatDate(event?.registration_end_date), icon: <Clock size={14}/> },
                  { label: "Event Starts", val: formatDate(event?.start_date), icon: <Calendar size={14}/> },
                  { label: "Event Ends", val: formatDate(event?.end_date), icon: <Calendar size={14}/> },
                  { label: "Faculty Liaison", val: event?.faculty_contact, icon: <User size={14}/> },
                  { label: "Student Lead", val: event?.student_contact, icon: <User size={14}/> },
                ].map((item, i) => (
                  <div key={i} className="p-3 md:p-4 rounded-xl md:rounded-2xl border border-[#023347]/5 hover:border-[#D4AF37]/20 transition-colors bg-white/40">
                    <div className="flex items-center gap-2 text-[#D4AF37] mb-1">
                      {item.icon}
                      <span className="text-[8px] md:text-[9px] font-bold tracking-widest uppercase">{item.label}</span>
                    </div>
                    <p className="text-[13px] md:text-[15px] font-semibold text-[#023347] truncate">{item.val || "TBA"}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 md:pt-6">
                {event?.event_link && (
                  <a 
                    href={event.event_link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-1 flex items-center justify-center gap-2 bg-[#023347] text-white py-4 md:py-5 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#D4AF37] transition-all shadow-xl active:scale-95"
                  >
                    Secure Registration <ExternalLink size={14} />
                  </a>
                )}
                {event?.brochure_url && (
                  <a 
                    href={event.brochure_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={`flex-1 text-center py-4 md:py-5 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase transition-all border ${
                      !event?.event_link ? "bg-[#023347] text-white" : "bg-white border-[#023347]/10 text-[#023347] hover:border-[#D4AF37]"
                    } active:scale-95`}
                  >
                    Download Brochure
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;500;600;700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}

export default EventRegister;
