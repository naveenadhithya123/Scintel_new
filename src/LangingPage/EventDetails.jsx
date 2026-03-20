import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EventDetails = () => {
  const { id } = useParams(); 
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        // Using your localhost API structure
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

  if (loading) return <div className="p-10 text-center font-bold">Loading Event Details...</div>;
  if (!eventData) return <div className="p-10 text-center">Event not found.</div>;

  // Transform single string values into arrays for the gallery
  const photos = eventData.event_image_url ? [eventData.event_image_url] : [];
  
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 bg-white text-slate-800">
      
      {/* 1. Header & Description (Always Visible) */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-[#0a2e3f] mb-2">{eventData.title}</h1>
        <p className="text-sm font-semibold text-blue-600 mb-6 italic tracking-wide">Batch: {eventData.batch}</p>
        <h2 className="text-lg font-bold text-[#0a2e3f] mb-2">Description</h2>
        <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">{eventData.description}</p>
      </section>

      {/* 2. Resource Person - Conditional Rendering */}
      {eventData.resource_person_name && (
        <section className="mb-10 animate-fade-in">
          <h2 className="text-lg font-bold text-[#0a2e3f] mb-4">Resource Person</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 aspect-video bg-[#0a2e3f] rounded-lg overflow-hidden">
              <img 
                src={`/images/${eventData.resource_person_image_url}`} 
                alt={eventData.resource_person_name} 
                className="w-full h-full object-cover"
                onError={(e) => e.target.style.display = 'none'} 
              />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-md font-bold text-[#0a2e3f]">{eventData.resource_person_name}</h3>
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">{eventData.resource_person_description}</p>
            </div>
          </div>
        </section>
      )}

      {/* 3. Participants */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-[#0a2e3f] mb-1">Participants</h2>
        <p className="text-sm text-gray-500">{eventData.participants} Students</p>
      </section>

      {/* 4. Event Gallery */}
      {photos.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0a2e3f] mb-4">Photos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="aspect-video bg-[#0a2e3f] rounded-lg overflow-hidden">
                 <img src={`/images/${photo}`} alt="Event Gallery" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Winner Section - Conditional Rendering */}
      {eventData.winner_name && (
        <section className="mb-10 animate-fade-in">
          <h2 className="text-lg font-bold text-[#0a2e3f] mb-4">Winner</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 aspect-video bg-[#0a2e3f] rounded-lg overflow-hidden">
              <img src={`/images/${eventData.winner_image}`} alt={eventData.winner_name} className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-md font-bold text-[#0a2e3f]">{eventData.winner_name}</h3>
              <h4 className="text-xs font-bold mt-4 uppercase tracking-wider text-gray-400">Feedback</h4>
              <p className="text-xs text-gray-600 mt-1 italic">"{eventData.winner_description}"</p>
            </div>
          </div>
        </section>
      )}

      {/* 6. Testimonials - Conditional Rendering */}
      {eventData.testimonials_name && (
        <section>
          <h2 className="text-lg font-bold text-[#0a2e3f] mb-4">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f8fafc] p-6 rounded-xl border border-gray-100 flex flex-col justify-between shadow-sm">
              <p className="text-[11px] leading-relaxed font-medium text-gray-700">
                {eventData.testimonials_feedback}
              </p>
              <div className="mt-6 text-right">
                <p className="text-[10px] font-bold text-[#0a2e3f] leading-none">-{eventData.testimonials_name}</p>
                <p className="text-[9px] font-bold text-gray-400 mt-1">{eventData.testimonials_class}</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default EventDetails;