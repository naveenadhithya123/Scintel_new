import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams, useNavigate } from "react-router-dom";

function EventDetails() {
  const { id } = useParams(); // Successfully gets the activity_id from URL
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        // CHANGE: Dynamic ID used in the URL
        const response = await fetch(`http://localhost:3000/api/activities/event/${id}`);
        const data = await response.json();
        
        // Handle if API returns an array or single object
        setEventData(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, [loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-sans text-gray-500">Loading detailed info...</div>;
  if (!eventData) return <div className="min-h-screen flex items-center justify-center">Event not found.</div>;

  return (
    <>
      <style>{`
        .gray-scrollbar::-webkit-scrollbar { width: 6px; }
        .gray-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .gray-scrollbar::-webkit-scrollbar-thumb { background: #9ca3af !important; border-radius: 10px; }
      `}</style>

      {selectedImage && (
        <div className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Full View" className="max-w-full max-h-[95vh] rounded-2xl object-contain" />
        </div>
      )}

      <div ref={sectionRef} className='min-h-screen bg-[#F5F9FA] flex flex-col py-12 select-none font-sans'>
        <div className='w-full max-w-6xl mx-auto px-6 md:px-12'>
          
          <div className="pb-8 overflow-hidden">
            <button onClick={() => navigate(-1)} className="text-[#388E9C] font-bold text-sm mb-4 hover:underline">← Back to Gallery</button>
            <h1 className={`text-[40px] font-extrabold text-[#023347] transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
              {eventData.title}
            </h1>
            <p className="text-sm text-gray-400 font-semibold tracking-wide uppercase">Batch: {eventData.batch}</p>
          </div>

          <div className="space-y-8">
            <div className={`bg-white rounded-3xl shadow-sm p-8 transition-all duration-1000 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              <section className='mb-8'>
                <h2 className='text-xl font-bold text-[#023347] mb-3'>Description</h2>
                <p className='text-gray-600 text-sm leading-relaxed'>{eventData.description}</p>
              </section>
              <section>
                <h2 className='text-xl font-bold text-[#023347] mb-2'>Target Audience</h2>
                <div className="inline-block bg-[#F5F9FA] px-4 py-2 rounded-lg border border-gray-100">
                   <p className='text-[#3C3E40] text-sm font-semibold'>{eventData.participants}</p>
                </div>
              </section>
            </div>

            <div className={`bg-white rounded-3xl shadow-sm p-8 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              <h2 className='text-xl font-bold text-[#023347] mb-6'>Resource Person</h2>
              <div className='flex flex-col md:flex-row gap-8 items-start'>
                <div className='w-full md:w-56 h-56 rounded-2xl overflow-hidden shadow-md bg-gray-100'>
                   <img 
                     src={eventData.resource_person_image_url || "https://via.placeholder.com/400"} 
                     alt={eventData.resource_person_name} 
                     className="w-full h-full object-cover"
                   />
                </div>
                <div className='flex flex-col justify-center pt-2'>
                  <h3 className='text-[#023347] font-bold text-2xl mb-3'>{eventData.resource_person_name}</h3>
                  <p className='text-gray-500 text-sm leading-relaxed'>{eventData.resource_person_description}</p>
                </div>
              </div>
            </div>

            <div className={`bg-white rounded-3xl shadow-sm p-8 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🏆</span>
                <h2 className='text-xl font-bold text-[#023347]'>Winner</h2>
              </div>
              <div className='flex flex-col md:flex-row gap-8 items-start'>
                <div className='w-full md:w-56 h-44 rounded-2xl overflow-hidden shadow-md bg-gray-100'>
                  <img src={eventData.winner_image || "https://via.placeholder.com/400"} alt="Winner" className="w-full h-full object-cover" />
                </div>
                <div className='flex flex-col justify-center pt-1'>
                  <h3 className='text-[#023347] font-bold text-2xl mb-1'>{eventData.winner_name}</h3>
                  <p className='text-[#388E9C] text-xs font-bold mb-3 uppercase tracking-wider bg-[#F5F9FA] px-2 py-1 rounded inline-block w-fit'>Feedback: {eventData.testimonials_feedback}</p>
                  <p className='text-gray-500 text-sm leading-relaxed'>{eventData.winner_description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventDetails;