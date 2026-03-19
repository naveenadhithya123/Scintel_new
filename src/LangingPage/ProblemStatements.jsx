import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

function ProblemStatements() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/current-problems");
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

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  // UPDATED: Dynamic Redirect Logic
  const handleViewRedirect = (id) => {
    // Navigate to the dynamic route
    navigate(`/problem-details/${id}`);
  };

  return (
    <>
      {/* (Style tags remain the same) */}
      <div ref={sectionRef} id='problems' className="min-h-screen bg-[#F5F9FA] flex flex-col font-sans py-12 relative z-40 select-none">
        
        <div className="px-6 md:px-12 pb-6 max-w-7xl mx-auto w-full flex justify-between items-center">
          <h2 className={`text-[40px] font-extrabold text-[#023347] transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
            Problem Statements
          </h2>
          <button onClick={() => navigate("/verification")} className="bg-[#023347] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#388E9C] transition-all">
            Add Problem Statement
          </button>
        </div>

        <div className="px-6 md:px-12 max-w-7xl mx-auto w-full">
          <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[75vh] transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.98]"}`}>
            
            <div className="hidden md:grid grid-cols-12 gap-4 bg-[#388E9C] px-6 py-4 border-b border-[#2c7582]">
              <div className="col-span-4 text-center text-[10px] font-bold text-white uppercase tracking-wider">Title</div>
              <div className="col-span-6 text-center text-[10px] font-bold text-white uppercase tracking-wider">Description</div>
              <div className="col-span-2 text-center text-[10px] font-bold text-white uppercase tracking-wider">Action</div>
            </div>

            <div className="flex-1 overflow-y-auto gray-scrollbar p-2">
              {loading ? (
                 <div className="flex items-center justify-center h-full text-gray-400">Loading problems...</div>
              ) : (
                problems.map((item, idx) => (
                  <div key={item.problem_id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 border-b border-gray-50 items-center hover:bg-[#F5F9FA] transition-all">
                    <div className="md:col-span-4 text-sm font-semibold text-[#023347] md:text-center">{item.title}</div>
                    <div className="md:col-span-6 text-sm text-[#3C3E40] md:text-center">{item.short_description}</div>
                    <div className="md:col-span-2 flex justify-center">
                      <button
                        // UPDATED: Passes the dynamic problem_id
                        onClick={() => handleViewRedirect(item.problem_id)}
                        className="bg-[#023347] text-white font-bold px-6 py-2 rounded-xl text-xs hover:bg-[#388E9C] transition-all"
                      >
                        View Detail
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProblemStatements;