import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

function ProblemStatements() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  
  // Animation Refs & State
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // 1. Trigger Initial Load
  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  // 2. Intersection Observer for Scroll Reveal
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

  const problems = [
    { id: 1, title: "Can't calculate CGPA easily", shortDescription: "A Tool for Calculate CGPA", isLocked: false },
    { id: 2, title: "Getting OD is long Procedure", shortDescription: "A Tool for get OD easily", isLocked: true },
    { id: 3, title: "Library Seat Booking", shortDescription: "Real-time seat availability", isLocked: false },
    { id: 4, title: "Mess Menu Feedback", shortDescription: "Daily feedback system", isLocked: false },
    { id: 5, title: "Lost and Found Portal", shortDescription: "Campus-wide lost item tracker", isLocked: true },
    { id: 6, title: "Bus Tracking System", shortDescription: "GPS tracking for college buses", isLocked: false },
    { id: 7, title: "Event Registration", shortDescription: "Digital pass generator", isLocked: false },
    { id: 8, title: "Event Registration", shortDescription: "Digital pass generator", isLocked: false },
    { id: 9, title: "Event Registration", shortDescription: "Digital pass generator", isLocked: false },
    { id: 10, title: "Event Registration", shortDescription: "Digital pass generator", isLocked: false },
    { id: 11, title: "Event Registration", shortDescription: "Digital pass generator", isLocked: false },
    { id: 12, title: "Event Registration", shortDescription: "Digital pass generator", isLocked: false },
  ];

  const handleAddRedirect = () => {
    navigate("/add-problem");
  };

  const handleViewRedirect = (id) => {
    if (id === 1) {
      navigate("/cgpa-calculator");
    } else {
      alert(`Viewing details for ID: ${id}`);
    }
  };

  return (
    <>
      <style>{`
        /* Gray Scrollbar Styling (Consistent with other pages) */
        .gray-scrollbar::-webkit-scrollbar { width: 6px; }
        .gray-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .gray-scrollbar::-webkit-scrollbar-thumb { background: #9ca3af !important; border-radius: 10px; }
        .gray-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280 !important; }
      `}</style>

      <div 
        ref={sectionRef}
        id='problems' 
        // Layout: Min-height screen, Relative Z-40 to sit on top of previous pages
        className="min-h-screen bg-[#F5F9FA] flex flex-col font-sans py-12 perspective-[1000px] relative z-40"
      >
        
        {/* HEADER SECTION */}
        <div className="px-6 md:px-12 pb-6 max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 flex-none overflow-hidden">
          <h2 
            className={`text-[40px] font-extrabold text-[#023347] mb-3 w-fit tracking-tight transform transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isVisible ? "translate-y-0 opacity-100 blur-0" : "translate-y-20 opacity-0 blur-sm"
            }`}
          >
            Problem Statements
          </h2>

          <button
  onClick={() => navigate("/verification")}
  className="bg-[#023347] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-[#388E9C] transition-all duration-300"
>
  Add Problem Statement
</button>
        </div>

        {/* TABLE CONTAINER */}
        <div className="px-6 md:px-12 max-w-7xl mx-auto w-full">
          <div 
            // Height fixed to 75vh to match Association Members table feel
            className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[75vh] transform-gpu transition-all duration-1000 delay-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.98]"
            }`}
          >

            {/* Table Header (Sticky) */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-[#388E9C] px-6 py-4 border-b border-[#2c7582] flex-none sticky top-0 z-10">
              <div className="col-span-4 text-center text-[10px] font-bold text-white uppercase tracking-wider">Title</div>
              <div className="col-span-4 text-center text-[10px] font-bold text-white uppercase tracking-wider">Description</div>
              <div className="col-span-4 text-center text-[10px] font-bold text-white uppercase tracking-wider">Action</div>
            </div>

            {/* Scrollable List Area */}
            {/* Added 'gray-scrollbar' and 'overscroll-auto' */}
            <div className="flex-1 overflow-y-auto gray-scrollbar p-2 overscroll-auto touch-pan-y">
              {problems.map((item, idx) => (
                <div 
                  key={idx} 
                  // Staggered Animation & Hover Physics
                  className={`group/row relative grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 border-b border-gray-50 items-center rounded-xl 
                    transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                    hover:bg-[#F5F9FA] hover:shadow-md hover:-translate-y-1 hover:scale-[1.005] hover:border-gray-200
                    ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                  `}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  
                  {/* Title Column */}
                  <div className="md:col-span-4 flex flex-col md:items-center">
                    <span className="md:hidden text-[10px] font-bold text-[#388E9C] uppercase mb-1">Title</span>
                    <span className="text-sm font-semibold text-[#023347] text-center w-full group-hover/row:text-[#388E9C] transition-colors">
                      {item.title}
                    </span>
                  </div>

                  {/* Description Column */}
                  <div className="md:col-span-4 flex flex-col md:items-center overflow-hidden">
                    <span className="md:hidden text-[10px] font-bold text-[#388E9C] uppercase mb-1">Description</span>
                    <span className="text-sm text-[#3C3E40] leading-relaxed block w-full text-center">
                      {item.shortDescription}
                    </span>
                  </div>

                  {/* Action Column */}
                  <div className="md:col-span-4 flex flex-col md:items-center">
                    <span className="md:hidden text-[10px] font-bold text-[#388E9C] uppercase mb-1">Action</span>
                    <button
                     onClick={() => navigate("/cgpa-calculator")}
                      className="bg-[#023347] text-white font-bold px-6 py-2 rounded-xl text-xs shadow-sm 
                        transition-all duration-300 ease-out
                        hover:bg-[#388E9C] hover:shadow-lg hover:scale-105 active:scale-95"
                    >
                      View Detail
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default ProblemStatements;
