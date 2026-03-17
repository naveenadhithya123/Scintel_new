import React, { useState, useEffect, useRef } from "react";

const batchData = {
  "2022-23": {
    title: "Batch 2022 – 23",
    description: "The mountain peak touches the golden sunrise. Cold wind brushes against your face. Clouds drift lazily below your feet. Nature feels powerful and peaceful at once.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=220&fit=crop",
    members: [
      { name: "Muhammed Shuaib", regNo: "611224104121", role: "Technical Support", year: "II" },
      { name: "Rithish Barath", regNo: "611224104160", role: "Technical Support", year: "II" },
      { name: "Santhoshkumar", regNo: "611224104176", role: "Technical Support", year: "II" },
      { name: "Kathir", regNo: "611224104086", role: "Technical Support", year: "II" },
      { name: "Kathir", regNo: "611224104086", role: "Technical Support", year: "II" },
      { name: "Kathir", regNo: "611224104086", role: "Technical Support", year: "II" },
      { name: "Kathir", regNo: "611224104086", role: "Technical Support", year: "II" },
      { name: "Kathir", regNo: "611224104086", role: "Technical Support", year: "II" },
      { name: "Kathir", regNo: "611224104086", role: "Technical Support", year: "II" },
      { name: "Kathir", regNo: "611224104086", role: "Technical Support", year: "II" },
      { name: "Kathir", regNo: "611224104086", role: "Technical Support", year: "II" },
      { name: "Kathir", regNo: "611224104086", role: "Technical Support", year: "II" },
    ],
  },
  "2023-24": {
    title: "Batch 2023 – 24",
    description: "The river flows gently through the valley, bringing life to the surrounding flora. The sound of water creates a melody that calms the soul.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=220&fit=crop",
    members: [{ name: "Arjun Prasad", regNo: "611324104101", role: "Vice President", year: "III" }],
  },
};

export default function AssociationMembers() {
  const [activeTab, setActiveTab] = useState("2022-23");
  const batch = batchData[activeTab];
  
  const [loaded, setLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); 
  
  // Animation Refs & State
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

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

  return (
    <>
      <style>{`
        .gray-scrollbar::-webkit-scrollbar { width: 6px; }
        .gray-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .gray-scrollbar::-webkit-scrollbar-thumb { background: #9ca3af !important; border-radius: 10px; }
        .gray-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280 !important; }
      `}</style>

      {/* --- IMAGE LIGHTBOX --- */}
      {selectedImage && (
        <div 
        id = "members"
          className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Full View" 
            className="max-w-full max-h-[95vh] rounded-md shadow-2xl object-contain transform transition-transform duration-300 scale-100" 
          />
          <button className="absolute top-6 right-6 text-white/80 bg-white/10 hover:bg-white/20 hover:text-white rounded-full p-3 transition-colors backdrop-blur-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      <div 
        ref={sectionRef}
        id="associationMembers" 
        className="min-h-screen bg-[#F5F9FA] flex flex-col font-sans py-12 perspective-[1000px] relative z-40"
      >
        
        {/* === TOP SECTION === */}
        <div className="px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col">
          
          {/* Header */}
          <div className="pb-6 overflow-hidden">
            <h1 
              className={`text-[40px] font-extrabold text-[#023347] mb-3 w-fit tracking-tight transform transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isVisible ? "translate-y-0 opacity-100 blur-0" : "translate-y-20 opacity-0 blur-sm"
              }`}
            >
              Association Members
            </h1>
          </div>

          {/* Batch Info Card */}
          <div 
            className={`flex flex-col md:flex-row gap-8 mb-6 items-start transform-gpu transition-all duration-1000 delay-100 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <div className="relative group w-full md:w-72 aspect-video rounded-2xl overflow-hidden shadow-md cursor-zoom-in shrink-0">
              <img
                src={batch.image}
                alt="batch"
                onClick={() => setSelectedImage(batch.image)}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-60"></div>
            </div>
            
            <div className="pt-2 flex-1">
              <h2 className="text-2xl font-bold text-[#023347] mb-3">{batch.title}</h2>
              <p className="text-sm text-[#3C3E40] leading-relaxed max-w-2xl opacity-80 line-clamp-3">{batch.description}</p>
            </div>
          </div>

          {/* Tabs */}
          <div 
            className={`flex gap-6 md:gap-8 mb-6 border-b border-gray-200 overflow-x-auto transform-gpu transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {Object.keys(batchData).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-bold whitespace-nowrap transition-all duration-300 relative px-2 ${
                  activeTab === tab
                    ? "text-[#023347]"
                    : "text-gray-400 hover:text-[#388E9C]"
                }`}
              >
                {tab}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#023347] transition-all duration-300 transform ${activeTab === tab ? "scale-x-100" : "scale-x-0"}`}></span>
              </button>
            ))}
          </div>
        </div>

        {/* === BOTTOM SECTION (BIG TABLE) === */}
        <div className="px-6 md:px-12 max-w-7xl mx-auto w-full">
          <div 
            className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[75vh] transform-gpu transition-all duration-1000 delay-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.98]"
            }`}
          >
            
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-4 gap-4 bg-[#388E9C] px-6 py-4 border-b border-[#2c7582] flex-none z-10">
              {["Name", "Reg No", "Role", "Year"].map((head) => (
                <div key={head} className="text-center text-[10px] font-bold text-white uppercase tracking-wider">
                  {head}
                </div>
              ))}
            </div>

            {/* SCROLLABLE LIST AREA */}
            {/* FIX: 'overscroll-auto' enables scrolling to continue to the main page */}
            <div key={activeTab} className="flex-1 overflow-y-auto gray-scrollbar p-2 overscroll-auto touch-pan-y"> 
              {batch.members.map((member, idx) => (
                <div
                  key={idx}
                  className={`group/row relative grid grid-cols-1 md:grid-cols-4 gap-4 px-6 py-4 border-b border-gray-50 items-center rounded-xl 
                    transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                    hover:bg-[#F5F9FA] hover:shadow-md hover:-translate-y-1 hover:scale-[1.005] hover:border-gray-200
                    ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                  `}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <div className="text-center flex flex-col md:block">
                    <span className="md:hidden text-[10px] text-[#388E9C] font-bold uppercase mb-1">Name</span>
                    <span className="text-sm font-semibold text-[#3C3E40] group-hover/row:text-[#023347] transition-colors">{member.name}</span>
                  </div>
                  <div className="text-center flex flex-col md:block">
                    <span className="md:hidden text-[10px] text-[#388E9C] font-bold uppercase mb-1">Reg No</span>
                    <span className="text-sm text-[#3C3E40] group-hover/row:text-[#023347] transition-colors font-mono">{member.regNo}</span>
                  </div>
                  <div className="text-center flex flex-col md:block">
                    <span className="md:hidden text-[10px] text-[#388E9C] font-bold uppercase mb-1">Role</span>
                    <span className="text-sm font-medium text-[#3C3E40] bg-gray-50 px-3 py-1 rounded-full inline-block group-hover/row:bg-white group-hover/row:shadow-sm transition-all">
                      {member.role}
                    </span>
                  </div>
                  <div className="text-center flex flex-col md:block">
                    <span className="md:hidden text-[10px] text-[#388E9C] font-bold uppercase mb-1">Year</span>
                    <span className="text-sm text-[#3C3E40]">{member.year}</span>
                  </div>
                </div>
              ))}

              {batch.members.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400 italic text-sm animate-in fade-in zoom-in duration-500">
                  <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  No members available.
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
