import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

function Activities() {
  const navigate = useNavigate();
  const [activitiesData, setActivitiesData] = useState([]); // State for fetched data
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // 1. Fetch Data inside useEffect using await
  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = "http://localhost:3000/api/activities";
        const response = await fetch(API_URL);
        const data = await response.json();
        setActivitiesData(data);
        setLoaded(true);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchData();
  }, []);

  // Intersection Observer for animations
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

  // 2. Navigation handler with dynamic batch parameter
  const handleViewDetail = (batch) => {
    // Navigates to /activities/batch/2024-25 (assuming your React route matches this pattern)
    navigate(`/activities/batch/${batch}`);
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
        id="activities" 
        className="h-screen bg-[#F5F9FA] flex flex-col font-sans py-12 perspective-[1000px]"
      >
        <div className="px-6 md:px-12 pb-6 max-w-7xl mx-auto w-full flex-none overflow-hidden">
          <h2 
            className={`text-[40px] font-extrabold text-[#023347] mb-3 w-fit tracking-tight transform transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isVisible ? "translate-y-0 opacity-100 blur-0" : "translate-y-20 opacity-0 blur-sm"
            }`}
          >
            Activities
          </h2>
        </div>

        <div className="px-6 md:px-12 max-w-7xl mx-auto w-full flex-1 min-h-0">
          <div 
            className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full transform-gpu transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.98]"
            }`}
          >
            <div className="hidden md:grid grid-cols-12 gap-4 bg-[#388E9C] px-6 py-4 border-b border-[#2c7582] flex-none z-10 relative">
              <div className="col-span-4 text-center text-[10px] font-bold text-white uppercase tracking-wider">Year</div>
              <div className="col-span-4 text-center text-[10px] font-bold text-white uppercase tracking-wider">Activities</div>
              <div className="col-span-4 text-center text-[10px] font-bold text-white uppercase tracking-wider">Action</div>
            </div>

            <div className="flex-1 overflow-y-auto gray-scrollbar p-2 overscroll-auto touch-pan-y">
              {activitiesData.map((item, index) => (
                <div 
                  key={item.id || index} 
                  className={`group/row relative grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 border-b border-gray-50 items-center rounded-xl 
                    transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                    hover:bg-[#F5F9FA] hover:shadow-md hover:-translate-y-1 hover:scale-[1.005] hover:border-gray-200
                    ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                  `}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="md:col-span-4 flex flex-col md:items-center">
                    <span className="md:hidden text-[10px] font-bold text-[#388E9C] uppercase mb-1 tracking-wider">Year</span>
                    <span className="text-sm font-semibold text-[#3C3E40] group-hover/row:text-[#023347] transition-colors">{item.batch}</span>
                  </div>
                  
                  <div className="md:col-span-4 flex flex-col md:items-center">
                    <span className="md:hidden text-[10px] font-bold text-[#388E9C] uppercase mb-1 tracking-wider">Activities</span>
                    <span className="text-sm font-medium text-[#3C3E40] bg-gray-50 px-3 py-1 rounded-full group-hover/row:bg-white group-hover/row:shadow-sm transition-all">
                      {item.activity_count}
                    </span>
                  </div>
                  
                  <div className="md:col-span-4 flex flex-col md:items-center">
                    <span className="md:hidden text-[10px] font-bold text-[#388E9C] uppercase mb-1 tracking-wider">Action</span>
                    <button
                      onClick={() => handleViewDetail(item.batch)}
                      className="bg-[#023347] text-white px-6 py-2 rounded-xl text-xs font-bold shadow-sm 
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

export default Activities;