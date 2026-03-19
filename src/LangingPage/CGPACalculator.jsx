import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 

export default function ProblemDetails() {
  const { id } = useParams(); // Get the dynamic ID from the URL
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // 1. Fetch details for the specific ID
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // FETCHING FROM YOUR API IMAGE: http://localhost:3000/api/current-problem/:id
        const response = await fetch(`http://localhost:3000/api/current-problem/${id}`);
        const data = await response.json();
        setProblem(data);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  // Animation logic
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, [loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading details...</div>;
  if (!problem) return <div className="min-h-screen flex items-center justify-center">Problem not found.</div>;

  return (
    <div ref={sectionRef} className="min-h-screen bg-[#F5F9FA] py-16 px-6 flex justify-center select-none font-sans">
      <div className="w-full max-w-6xl">
        
        {/* Back Button and Title */}
        <div className="flex flex-col mb-10">
          <button onClick={() => navigate(-1)} className="text-[#388E9C] font-bold text-sm mb-2 hover:underline w-fit">← Back to List</button>
          <h1 className="text-3xl font-bold text-[#023347]">
            {problem.title}
          </h1>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Category: {problem.category}</span>
        </div>

        {/* Card */}
        <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          
          <h2 className="text-xl font-semibold text-[#023347] mb-8 border-b pb-4">
            Detailed Description
          </h2>

          <div className="text-[#3C3E40] text-[16px] leading-relaxed">
            {/* If your backend returns a single string with newlines, 
               we use white-space: pre-line. If it's an array, you'd .map it.
            */}
            <p className="whitespace-pre-line">
              {problem.detailed_description}
            </p>
          </div>

          <div className="flex justify-end mt-12">
            <button
              onClick={() => navigate("/verification-mentor")} 
              className="bg-[#0B1C3D] text-white px-10 py-3 rounded-xl font-semibold shadow-md hover:bg-[#142d63] transition duration-300"
            >
              Lock Statement
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}