import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EventRegister() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/upcoming-events/${id}`);
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading event details...</div>;
  if (!event) return <div className="min-h-screen flex items-center justify-center">Event data not found.</div>;

  return (
    <div className="min-h-screen bg-[#f2f3f4] flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-7xl w-full flex flex-col items-start">
        <button onClick={() => navigate(-1)} className="mb-4 text-[#023347] font-bold hover:underline">
          ← Back to Events
        </button>

        <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-md overflow-hidden w-full">
          {/* LEFT IMAGE SECTION */}
          <div className="bg-[#1E1E1E] lg:w-[588px] h-[400px] lg:h-[844px] flex-shrink-0">
            <img 
              src={event.brochure_url} 
              alt="Event Brochure" 
              className="w-full h-full object-contain"
            />
          </div>

          {/* RIGHT CONTENT SECTION */}
          <div className="bg-white p-8 lg:p-12 flex flex-col lg:w-[652px] h-auto lg:h-[844px]">
            <h1 className="text-3xl font-bold text-[#023347] mb-2">{event.event_title}</h1>
            <span className="inline-block px-3 py-1 bg-[#388E9C]/10 text-[#388E9C] text-xs font-bold rounded-full mb-6 w-fit">
              {event.event_type}
            </span>

            <div className="overflow-y-auto pr-2 flex-1 scrollbar-thin">
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                {event.event_description}
              </p>

              <div className="space-y-4 text-gray-700 text-sm border-t pt-6">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Registration Starts:</span>
                  <span>{event.start_date}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Registration Ends:</span>
                  <span>{event.end_date}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Faculty Coordinator:</span>
                  <span>{event.faculty_contact}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Student Coordinator:</span>
                  <span>{event.student_contact}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row mt-8 w-full gap-4">
          <div className="hidden lg:block lg:w-[588px]" />
          <div className="flex flex-col sm:flex-row justify-between lg:w-[652px] gap-4">
            <a 
              href={event.brochure_url} 
              target="_blank" 
              rel="noreferrer"
              className="bg-[#023347] text-white flex-1 h-[50px] rounded-lg text-base font-medium flex items-center justify-center hover:bg-[#03465e] transition"
            >
              Download Brochure
            </a>
            <a 
              href={event.event_link} 
              target="_blank" 
              rel="noreferrer"
              className="bg-[#388E9C] text-white flex-1 h-[50px] rounded-lg text-base font-medium flex items-center justify-center hover:bg-[#2c717c] transition"
            >
              Register Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventRegister;