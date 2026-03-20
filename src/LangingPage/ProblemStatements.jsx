import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

function ProblemStatements() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  
  // State Management
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Fetch Problems from API
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/current-problems");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problem statements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  // Dynamic Redirect Logic
  const handleViewRedirect = (id) => {
    navigate(`/problem-details/${id}`);
  };

  return (
    <>
      <style>{`
        .gray-scrollbar::-webkit-scrollbar { width: 6px; }
        .gray-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .gray-scrollbar::-webkit-scrollbar-thumb { background: #9ca3af !important; border-radius: 10px; }
        .gray-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280 !important; }
      `}</style>

      <div 
        ref={sectionRef}
        id='problems' 
        className="min-h-screen bg-[#F5F9FA] flex flex-col font-sans py-12 relative z-40 select-none"
      >
        {/* Header Section */}
        <div className="px-6 md:px-12 pb-6 max-w-7xl mx-auto w-full flex justify-between items-end">
          <h2 className={`text-[40px] font-extrabold text-[#023347] transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
            Problem Statements
          </h2>

          <div className="flex flex-col items-end gap-3">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-2 bg-[#023347] text-white px-6 py-2 rounded-xl text-xs font-bold shadow-sm 
                transition-all duration-300 ease-out hover:bg-[#388E9C] hover:shadow-lg hover:scale-105 active:scale-95
                ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
              style={{ transitionDuration: "1000ms" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M5 12l7 7M5 12l7-7" />
              </svg>
              Back
            </button>

            <button
              onClick={() => navigate("/ProblemStatementVerification")}
              className={`bg-[#023347] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-[#388E9C] transition-all duration-300
                ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
              style={{ transitionDuration: "1200ms" }}
            >
              Add Problem Statement
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="px-6 md:px-12 max-w-7xl mx-auto w-full">
          <div 
            className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[75vh] transform-gpu transition-all duration-1000 delay-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.98]"
            }`}
          >
            {/* Table Header (Sticky) */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-[#388E9C] px-6 py-4 border-b border-[#2c7582] flex-none sticky top-0 z-10">
              <div className="col-span-4 text-center text-[10px] font-bold text-white uppercase tracking-wider">Title</div>
              <div className="col-span-6 text-center text-[10px] font-bold text-white uppercase tracking-wider">Description</div>
              <div className="col-span-2 text-center text-[10px] font-bold text-white uppercase tracking-wider">Action</div>
            </div>

            {/* Scrollable List Area */}
            <div className="flex-1 overflow-y-auto gray-scrollbar p-2 overscroll-auto touch-pan-y">
              {loading ? (
                <div className="flex items-center justify-center h-full text-gray-400">Loading problems...</div>
              ) : problems.length > 0 ? (
                problems.map((item, idx) => (
                  <div 
                    key={item.problem_id || idx} 
                    className={`group/row relative grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 border-b border-gray-50 items-center rounded-xl 
                      transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                      hover:bg-[#F5F9FA] hover:shadow-md hover:-translate-y-1 hover:scale-[1.005]
                      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  >
                    {/* Title */}
                    <div className="md:col-span-4 flex flex-col items-center">
                      <span className="md:hidden text-[10px] font-bold text-[#388E9C] uppercase mb-1">Title</span>
                      <span className="text-sm font-semibold text-[#023347] text-center w-full group-hover/row:text-[#388E9C] transition-colors">
                        {item.title}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-6 flex flex-col items-center overflow-hidden">
                      <span className="md:hidden text-[10px] font-bold text-[#388E9C] uppercase mb-1">Description</span>
                      <span className="text-sm text-[#3C3E40] leading-relaxed block w-full text-center">
                        {item.short_description || item.shortDescription}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="md:col-span-2 flex flex-col items-center">
                      <span className="md:hidden text-[10px] font-bold text-[#388E9C] uppercase mb-1">Action</span>
                      <button
                        onClick={() => handleViewRedirect(item.problem_id)}
                        className="bg-[#023347] text-white font-bold px-6 py-2 rounded-xl text-xs shadow-sm 
                          transition-all duration-300 ease-out hover:bg-[#388E9C] hover:shadow-lg hover:scale-105 active:scale-95"
                      >
                        View Detail
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">No problems found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProblemStatements;