import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADDED

export default function CGPACalculator() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate(); // ✅ ADDED

  // Scroll to top when opened
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Intersection animation (same behavior)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const points = [
    "I don’t clearly understand the exact formula used for SGPA and CGPA calculation.",
    "Each subject has different credits, and multiplying credit with grade points manually often leads to mistakes.",
    "I usually depend on a basic calculator or Excel sheet, which is time-consuming and stressful.",
    "Even a small calculation error changes my overall CGPA and gives me the wrong expectation.",
    "I cannot easily track how my CGPA has improved or declined semester by semester.",
    "There is no simple way for me to know what grades I need in the upcoming semesters to reach my target CGPA.",
    "Different grading systems (10-point scale, 4-point scale, percentage-based system) make the process even more confusing.",
    "I have no visual insights to identify my weak subjects or strong performance areas.",
    "Since CGPA plays a major role in placements, higher studies, and scholarships, incorrect calculation affects my academic planning.",
    "I need a smart system where I can enter my subjects, credits, and grades, and it automatically calculates SGPA, CGPA, shows performance trends, and predicts what I need to score in the future to achieve my academic goals."
  ];

  return (
    <div
      ref={sectionRef}
      className="min-h-screen bg-[#F5F9FA] py-16 px-6 flex justify-center"
    >
      <div className="w-full max-w-6xl">

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-[#023347] mb-10">
          CGPA Calculator
        </h1>

        {/* Card */}
        <div
          className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >

          {/* Section Title */}
          <h2 className="text-xl font-semibold text-[#023347] mb-8">
            Detailed Description
          </h2>

          {/* Description Points */}
          <div className="space-y-6 text-[#3C3E40] text-[15px] leading-relaxed">
            {points.map((point, index) => (
              <p key={index}>{point}</p>
            ))}
          </div>

          {/* Lock Button */}
          <div className="flex justify-end mt-12">
            <button
              onClick={() => navigate("/verification-mentor")}  // ✅ ADDED
              className="bg-[#0B1C3D] text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-[#142d63] transition duration-300"
            >
              Lock
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}