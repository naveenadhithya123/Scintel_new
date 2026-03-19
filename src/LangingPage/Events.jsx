import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Activities() {
  const navigate = useNavigate();
  const { batch } = useParams(); 
  
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        setLoading(true);
        // Fetches all events for a specific batch (e.g., 2022-23)
        const response = await fetch(`http://localhost:3000/api/activities/batch/${batch}`);
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error("Error fetching batch details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (batch) fetchBatchData();
  }, [batch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  return (
    <div ref={sectionRef} className='min-h-screen bg-[#F5F9FA] flex flex-col font-sans py-12 perspective-[1000px] relative z-40 select-none'>
      <div className='max-w-7xl mx-auto px-6 md:px-12 w-full'>
        
        <div className="pb-8 flex justify-between items-end">
          <h1 className={`text-[40px] font-extrabold text-[#023347] tracking-tight transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {batch} Events
          </h1>
          <button onClick={() => navigate(-1)} className="text-[#388E9C] font-bold hover:underline mb-3">← Back</button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading activities...</div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {activities.map((item, index) => (
              <div
                key={item.activity_id || index}
                // CHANGE: Navigate to the specific event ID
                onClick={() => navigate(`/activities/event/${item.activity_id}`)}
                className={`group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col cursor-pointer
                  transform-gpu transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                  hover:-translate-y-2 hover:shadow-2xl hover:border-[#388E9C]/20 hover:scale-[1.02]
                  ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-24 scale-95"}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className='w-full h-56 overflow-hidden relative bg-gray-200'>
                  <img
                    src={item.event_image_url || 'https://via.placeholder.com/600x400'}
                    alt={item.title}
                    className='w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110'
                  />
                </div>

                <div className='px-6 py-6 flex-1 flex flex-col'>
                  <h2 className='text-xl font-bold text-[#023347] mb-2 group-hover:text-[#388E9C] transition-colors duration-300'>
                    {item.title}
                  </h2>
                  <p className='text-sm text-[#3C3E40] leading-relaxed opacity-80'>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Activities;