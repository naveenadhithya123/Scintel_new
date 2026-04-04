import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react"; 
import { API_BASE } from "../config/api";

const cleanValue = (value) => {
  if (value === null || value === undefined) return "";
  const text = String(value).trim();
  if (!text || text.toLowerCase() === "not applicable") return "";
  return text;
};

const formatDate = (value) => {
  const cleaned = cleanValue(value);
  if (!cleaned) return "";
  const parsedDate = new Date(cleaned);
  if (Number.isNaN(parsedDate.getTime())) return cleaned;
  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const parseStoredList = (value) => {
  const cleaned = cleanValue(value);
  if (!cleaned) return [];
  try {
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed.map((item) => cleanValue(item)).filter(Boolean) : [];
  } catch {
    return [cleaned];
  }
};

const hasSectionData = (...values) =>
  values.some((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return Boolean(cleanValue(value));
  });

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [showFloatingBack, setShowFloatingBack] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${API_BASE}/activities/event/${id}`);
        if (!response.ok) throw new Error(`Failed to load event ${id}`);
        const data = await response.json();
        setEventData(data);
      } catch (fetchError) {
        console.error("Error fetching event:", fetchError);
        setError("We could not load this activity right now.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();

    const handleScroll = () => {
      if (window.scrollY > 300) setShowFloatingBack(true);
      else setShowFloatingBack(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [id]);

  useEffect(() => {
    const currentSection = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (currentSection) observer.observe(currentSection);
    return () => { if (currentSection) observer.unobserve(currentSection); };
  }, []);

  const normalizedEvent = useMemo(() => {
    if (!eventData) return null;
    const photos = cleanValue(eventData.event_image_url)
      ? eventData.event_image_url.split(",").map((url) => url.trim()).filter(Boolean)
      : [];
    const testimonialNames = parseStoredList(eventData.testimonials_name);
    const testimonialClasses = parseStoredList(eventData.testimonials_class);
    const testimonialFeedbacks = parseStoredList(eventData.testimonials_feedback);
    const testimonials = Array.from(
      { length: Math.max(testimonialNames.length, testimonialClasses.length, testimonialFeedbacks.length) },
      (_, index) => ({
        name: testimonialNames[index] || "",
        className: testimonialClasses[index] || "",
        feedback: testimonialFeedbacks[index] || "",
      })
    ).filter((item) => item.name || item.className || item.feedback);

    return {
      activityId: cleanValue(eventData.activity_id),
      batch: cleanValue(eventData.batch),
      title: cleanValue(eventData.title) || "Untitled Activity",
      description: cleanValue(eventData.description),
      startDate: formatDate(eventData.start_date),
      endDate: formatDate(eventData.end_date),
      participants: cleanValue(eventData.participants),
      brochureUrl: cleanValue(eventData.brochure_url),
      photos,
      resourceName: cleanValue(eventData.resource_person_name),
      resourceRole: cleanValue(eventData.resource_person_description),
      resourceImage: cleanValue(eventData.resource_person_image_url),
      winnerName: cleanValue(eventData.winner_name),
      winnerNote: cleanValue(eventData.winner_description),
      winnerImage: cleanValue(eventData.winner_image),
      testimonials,
    };
  }, [eventData]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    );
  }

  // Error State
  if (error || !normalizedEvent) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center px-6">
        <div className="max-w-xl rounded-[2rem] border border-[#023347]/10 bg-white/80 p-10 text-center shadow-xl shadow-[#023347]/5">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37]">Activity Archive</p>
          <h1 className="mb-3 text-3xl font-semibold text-[#023347]">Record Not Found</h1>
          <button onClick={() => navigate(-1)} className="landing-btn-primary landing-btn-compact-mobile">Go Back</button>
        </div>
      </div>
    );
  }

  // Destructure ONLY after ensuring normalizedEvent exists
  const {
    activityId, batch, title, description, startDate, endDate,
    participants, brochureUrl, photos, resourceName, resourceRole,
    resourceImage, winnerName, winnerNote, winnerImage, testimonials
  } = normalizedEvent;

  const infoCards = [
    { label: "Event ID", value: activityId ? `#${activityId}` : `#${id}` },
    { label: "Batch", value: batch || "N/A" },
    { label: "Timeline", value: startDate && endDate ? `${startDate} - ${endDate}` : startDate || endDate || "N/A" },
    { label: "Participants", value: participants || "N/A" },
  ];

  return (
    <div ref={sectionRef} className="relative min-h-screen overflow-x-hidden bg-[#FDFCFB] font-poppins text-[#023347] flex flex-col">
      
      {/* FLOATING MOBILE BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className={`fixed bottom-8 right-6 z-[100] flex md:hidden items-center justify-center w-14 h-14 bg-[#023347] text-[#D4AF37] rounded-full shadow-2xl border border-[#D4AF37]/30 transition-all duration-500 transform ${
          showFloatingBack ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <ChevronLeft size={28} />
      </button>

      <div className="absolute top-0 left-0 h-[420px] w-full bg-gradient-to-b from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />

      <main className="relative z-10 mx-auto max-w-[1500px] px-5 py-12 md:px-10 md:py-20">
        <header className="mb-12 border-b border-[#023347]/5 pb-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-5 flex items-center gap-4">
                <span className={`text-[10px] font-bold uppercase tracking-[0.45em] text-[#D4AF37] transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
                  Activity Details
                </span>
                <div className="h-px w-16 bg-[#D4AF37]/30" />
              </div>
              <h1 className="text-3xl font-semibold leading-tight text-[#023347] md:text-6xl">{title}</h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-[#023347]/70 md:text-base">{description || "No description available."}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {brochureUrl && (
                <a href={brochureUrl} target="_blank" rel="noreferrer" className="landing-btn-secondary px-6 py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border border-[#023347]/20 hover:bg-[#023347]/5 transition-all">
                  View Brochure
                </a>
              )}
              <button
                onClick={() => navigate(-1)}
                className={`flex items-center gap-2 px-6 py-3 bg-[#023347] text-white rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all duration-300 shadow-lg shadow-[#023347]/10 w-auto shrink-0 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Go Back</span>
              </button>
            </div>
          </div>
        </header>

        <section className="space-y-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {infoCards.map((item) => (
              <article key={item.label} className="rounded-[1.8rem] border border-[#023347]/10 bg-white/70 p-6 shadow-lg shadow-[#023347]/[0.03]">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]">{item.label}</p>
                <p className="text-lg font-semibold leading-snug text-[#023347]">{item.value}</p>
              </article>
            ))}
          </div>

          {hasSectionData(resourceName, resourceRole, resourceImage) && (
            <section className="rounded-[2rem] border border-[#023347]/10 bg-white/70 p-6 shadow-xl shadow-[#023347]/[0.03] md:p-8">
              <div className="mb-5 flex items-center gap-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#023347]">Resource Person</h2>
                <div className="h-px flex-1 bg-[#023347]/10" />
              </div>
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                {resourceImage ? (
                  <div className="overflow-hidden rounded-[1.5rem] bg-[#023347]">
                    <img src={resourceImage} alt={resourceName} className="aspect-[4/3] h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center rounded-[1.5rem] bg-[#023347]/5 text-[10px] font-bold uppercase tracking-widest text-[#023347]/40">No Image</div>
                )}
                <div className="pt-1">
                  <h3 className="text-2xl font-semibold text-[#023347]">{resourceName}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-[#023347]/70">{resourceRole}</p>
                </div>
              </div>
            </section>
          )}

          {photos.length > 0 && (
            <section className="rounded-[2rem] border border-[#023347]/10 bg-white/70 p-6 shadow-xl shadow-[#023347]/[0.03] md:p-8">
              <div className="mb-5 flex items-center gap-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#023347]">Gallery</h2>
                <div className="h-px flex-1 bg-[#023347]/10" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {photos.map((url, idx) => (
                  <div key={idx} className="overflow-hidden rounded-[1.2rem] border border-[#023347]/10 bg-white group">
                    <img src={url} alt={`Gallery ${idx}`} className="aspect-[4/3] h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {hasSectionData(winnerName, winnerNote, winnerImage) && (
            <section className="rounded-[2rem] border border-[#023347]/10 bg-white/70 p-6 shadow-xl shadow-[#023347]/[0.03] md:p-8">
              <div className="mb-5 flex items-center gap-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#023347]">Winner Spotlight</h2>
                <div className="h-px flex-1 bg-[#023347]/10" />
              </div>
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                {winnerImage ? (
                  <div className="overflow-hidden rounded-[1.5rem] bg-[#023347]">
                    <img src={winnerImage} alt={winnerName} className="aspect-[4/3] h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center rounded-[1.5rem] bg-[#023347]/5 text-[10px] font-bold uppercase tracking-widest text-[#023347]/40">No Image</div>
                )}
                <div className="pt-1">
                  <h3 className="text-2xl font-semibold text-[#023347]">{winnerName}</h3>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-[#B8860B]">Achievement Note</p>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-[#023347]/70">{winnerNote}</p>
                </div>
              </div>
            </section>
          )}

          {testimonials.length > 0 && (
            <section className="rounded-[2rem] border border-[#023347]/10 bg-white/70 p-6 md:p-8 shadow-xl shadow-[#023347]/[0.03]">
              <div className="mb-5 flex items-center gap-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#023347]">Voice of Participants</h2>
                <div className="h-px flex-1 bg-[#023347]/10" />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                  <article key={index} className="rounded-[1.5rem] bg-white p-6 shadow-lg shadow-[#023347]/5 border border-black/5">
                    <p className="text-sm font-semibold leading-7 text-[#023347]/85 italic">"{testimonial.feedback}"</p>
                    <div className="mt-6 border-t border-[#023347]/10 pt-4 text-right">
                      <p className="text-sm font-bold text-[#023347]">{testimonial.name}</p>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[#023347]/50">{testimonial.className}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </section>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
        .font-poppins { font-family: 'Poppins', sans-serif; }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #FDFCFB; }
        ::-webkit-scrollbar-thumb { background: #02334715; border-radius: 20px; border: 3px solid #FDFCFB; }
        ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
      `}</style>
    </div>
  );
};

export default EventDetails;