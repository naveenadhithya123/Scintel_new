import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`http://localhost:3000/api/activities/event/${id}`);
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
  }, [id]);

  useEffect(() => {
    const currentSection = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (currentSection) observer.observe(currentSection);
    return () => {
      if (currentSection) observer.unobserve(currentSection);
    };
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !normalizedEvent) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center px-6">
        <div className="max-w-xl rounded-[2rem] border border-[#023347]/10 bg-white/80 p-10 text-center shadow-xl shadow-[#023347]/5">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37]">
            Activity Archive
          </p>
          <h1 className="mb-3 text-3xl font-semibold text-[#023347]">Record Not Found</h1>
          <p className="mb-8 text-sm leading-relaxed text-[#023347]/65">
            {error || "This activity record is currently unavailable."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="rounded-2xl bg-[#023347] px-8 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#D4AF37]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const {
    activityId,
    batch,
    title,
    description,
    startDate,
    endDate,
    participants,
    brochureUrl,
    photos,
    resourceName,
    resourceRole,
    resourceImage,
    winnerName,
    winnerNote,
    winnerImage,
    testimonials,
  } = normalizedEvent;

  const infoCards = [
    { label: "Event ID", value: activityId ? `#${activityId}` : `#${id}` },
    { label: "Batch", value: batch || "Batch details not available" },
    {
      label: "Timeline",
      value:
        startDate && endDate
          ? `${startDate} - ${endDate}`
          : startDate || endDate || "Event dates not available",
    },
    {
      label: "Participants",
      value: participants || "Participant details not available",
    },
  ];

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen overflow-x-hidden bg-[#FDFCFB] font-poppins text-[#023347]"
    >
      <div className="absolute top-0 left-0 h-[420px] w-full bg-gradient-to-b from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />

      <main className="relative z-10 mx-auto max-w-[1500px] px-6 py-14 md:px-10 md:py-20">
        <header className="mb-12 border-b border-[#023347]/5 pb-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-5 flex items-center gap-4">
                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.45em] text-[#D4AF37] transition-all duration-1000 ${
                    isVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Activity Details
                </span>
                <div className="h-px w-16 bg-[#D4AF37]/30" />
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-[#023347] md:text-6xl">
                {title}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-[#023347]/70 md:text-base">
                {description || "Description not available for this event yet."}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {brochureUrl && (
                <a
                  href={brochureUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center rounded-2xl border border-[#023347]/10 bg-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#023347] transition-all duration-300 hover:border-[#D4AF37] hover:text-[#B8860B]"
                >
                  View Brochure
                </a>
              )}
              <button
                onClick={() => navigate(-1)}
                className="rounded-2xl bg-[#023347] px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#D4AF37]"
              >
                Back to Records
              </button>
            </div>
          </div>
        </header>

        <section className="space-y-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {infoCards.map((item) => (
              <article
                key={item.label}
                className="rounded-[1.8rem] border border-[#023347]/10 bg-white/70 p-6 shadow-lg shadow-[#023347]/[0.03]"
              >
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
                  {item.label}
                </p>
                <p className="text-lg font-semibold leading-snug text-[#023347]">{item.value}</p>
              </article>
            ))}
          </div>

          <section className="rounded-[2rem] border border-[#023347]/10 bg-white/70 p-8 shadow-xl shadow-[#023347]/[0.03]">
            <div className="mb-4 flex items-center gap-4">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#023347]">
                Description
              </h2>
              <div className="h-px flex-1 bg-[#023347]/10" />
            </div>
            <p className="max-w-5xl text-sm leading-7 text-[#023347]/75 md:text-[15px]">
              {description || "Description not available for this event."}
            </p>
          </section>

          {hasSectionData(resourceName, resourceRole, resourceImage) && (
            <section className="rounded-[2rem] border border-[#023347]/10 bg-white/70 p-8 shadow-xl shadow-[#023347]/[0.03]">
              <div className="mb-5 flex items-center gap-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#023347]">
                  Resource Person
                </h2>
                <div className="h-px flex-1 bg-[#023347]/10" />
              </div>
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                {resourceImage ? (
                  <div className="overflow-hidden rounded-[1.5rem] bg-[#023347]">
                    <img src={resourceImage} alt={resourceName || "Resource person"} className="aspect-[4/3] h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center rounded-[1.5rem] bg-[#023347]/5 text-xs font-semibold uppercase tracking-[0.2em] text-[#023347]/60">
                    Image not available
                  </div>
                )}
                <div className="pt-1">
                  <h3 className="text-2xl font-semibold text-[#023347]">
                    {resourceName || "Resource person details not available"}
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-[#023347]/70">
                    {resourceRole || "Role or description not available."}
                  </p>
                </div>
              </div>
            </section>
          )}

          {participants && (
            <section className="rounded-[2rem] border border-[#023347]/10 bg-white/70 p-8 shadow-xl shadow-[#023347]/[0.03]">
              <div className="mb-4 flex items-center gap-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#023347]">
                  Participants
                </h2>
                <div className="h-px flex-1 bg-[#023347]/10" />
              </div>
              <p className="text-sm leading-7 text-[#023347]/75 md:text-[15px]">{participants}</p>
            </section>
          )}

          {photos.length > 0 && (
            <section className="rounded-[2rem] border border-[#023347]/10 bg-white/70 p-8 shadow-xl shadow-[#023347]/[0.03]">
              <div className="mb-5 flex items-center gap-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#023347]">
                  Photos
                </h2>
                <div className="h-px flex-1 bg-[#023347]/10" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {photos.map((url, idx) => (
                  <div key={idx} className="overflow-hidden rounded-[1.2rem] border border-[#023347]/10 bg-white">
                    <img src={url} alt={`Event ${idx + 1}`} className="aspect-[4/3] h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {hasSectionData(winnerName, winnerNote, winnerImage) && (
            <section className="rounded-[2rem] border border-[#023347]/10 bg-white/70 p-8 shadow-xl shadow-[#023347]/[0.03]">
              <div className="mb-5 flex items-center gap-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#023347]">
                  Winner
                </h2>
                <div className="h-px flex-1 bg-[#023347]/10" />
              </div>
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                {winnerImage ? (
                  <div className="overflow-hidden rounded-[1.5rem] bg-[#023347]">
                    <img src={winnerImage} alt={winnerName || "Winner"} className="aspect-[4/3] h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center rounded-[1.5rem] bg-[#023347]/5 text-xs font-semibold uppercase tracking-[0.2em] text-[#023347]/60">
                    Image not available
                  </div>
                )}
                <div className="pt-1">
                  <h3 className="text-2xl font-semibold text-[#023347]">
                    {winnerName || "Winner details not available"}
                  </h3>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#B8860B]">
                    Feedback
                  </p>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-[#023347]/70">
                    {winnerNote || "Winner feedback not available."}
                  </p>
                </div>
              </div>
            </section>
          )}

          {testimonials.length > 0 && (
            <section className="rounded-[2rem] border border-[#023347]/10 bg-white/70 p-8 shadow-xl shadow-[#023347]/[0.03]">
              <div className="mb-5 flex items-center gap-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#023347]">
                  Testimonials
                </h2>
                <div className="h-px flex-1 bg-[#023347]/10" />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                  <article key={`${testimonial.name}-${index}`} className="rounded-[1.5rem] bg-white p-6 shadow-lg shadow-[#023347]/5">
                    <p className="text-sm font-semibold leading-7 text-[#023347]/85">
                      {testimonial.feedback || "Feedback not available."}
                    </p>
                    <div className="mt-6 border-t border-[#023347]/10 pt-4 text-right">
                      <p className="text-sm font-bold text-[#023347]">
                        {testimonial.name || "Anonymous"}
                      </p>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#023347]/70">
                        {testimonial.className || "Class not available"}
                      </p>
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
      `}</style>
    </div>
  );
};

export default EventDetails;
