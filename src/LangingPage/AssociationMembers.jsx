import React, { useState, useEffect, useRef } from "react";

export default function AssociationMembers() {
  // --- STATE FOR BACKEND DATA ---
  const [batches, setBatches] = useState([]); // List of years/titles from Image 1
  const [activeTab, setActiveTab] = useState(""); // Currently selected year (e.g., "2022")
  const [batchDetails, setBatchDetails] = useState(null); // Members list from Image 2
  const [loading, setLoading] = useState(true);

  // --- UI STATES ---
  const [selectedImage, setSelectedImage] = useState(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // 1. FETCH ALL BATCHES (Initial Load)
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/association-batches");
        const data = await response.json();
        setBatches(data);
        if (data.length > 0) {
          // Default to the first batch year in the list (e.g., "2024")
          setActiveTab(data[0].batch_year);
        }
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };
    fetchBatches();
  }, []);

  // 2. FETCH MEMBERS (When Tab Changes)
  useEffect(() => {
    const fetchMembers = async () => {
      if (!activeTab) return;
      setLoading(true);
      try {
        // Using the URL format from your screenshot: /:year
        const response = await fetch(`http://localhost:3000/api/association-batch/:${activeTab}`);
        const data = await response.json();

        // Find the metadata (title, and eventually desc/image) from the 'batches' list
        const meta = batches.find((b) => b.batch_year === activeTab);

        setBatchDetails({
          title: meta?.title || `Batch ${activeTab}`,
          // Fallback to dummy strings if keys don't exist in DB yet
          description: meta?.description || "Association activities and student leadership details for this academic session.",
          image: meta?.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=220&fit=crop",
          members: data.members || [],
        });
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [activeTab, batches]);

  // 3. INTERSECTION OBSERVER (For Animations)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
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
          className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Full View" className="max-w-full max-h-[95vh] rounded-md shadow-2xl object-contain" />
          <button className="absolute top-6 right-6 text-white/80 bg-white/10 rounded-full p-3"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
      )}

      <div ref={sectionRef} id="associationMembers" className="min-h-screen bg-[#F5F9FA] flex flex-col font-sans py-12 relative z-40">
        
        <div className="px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col">
          {/* Header */}
          <div className="pb-6 overflow-hidden">
            <h1 className={`text-[40px] font-extrabold text-[#023347] mb-3 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
              Association Members
            </h1>
          </div>

          {/* Dynamic Content (Info & Tabs) */}
          {batchDetails && (
            <>
              <div className={`flex flex-col md:flex-row gap-8 mb-6 items-start transition-all duration-1000 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
                <div className="relative group w-full md:w-72 aspect-video rounded-2xl overflow-hidden shadow-md cursor-zoom-in shrink-0">
                  <img
                    src={batchDetails.image}
                    alt="batch"
                    onClick={() => setSelectedImage(batchDetails.image)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="pt-2 flex-1">
                  <h2 className="text-2xl font-bold text-[#023347] mb-3">{batchDetails.title}</h2>
                  <p className="text-sm text-[#3C3E40] leading-relaxed max-w-2xl opacity-80">{batchDetails.description}</p>
                </div>
              </div>

              {/* Tabs from Backend */}
              <div className={`flex gap-6 md:gap-8 mb-6 border-b border-gray-200 overflow-x-auto transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                {batches.map((tab) => (
                  <button
                    key={tab.batch_year}
                    onClick={() => setActiveTab(tab.batch_year)}
                    className={`pb-3 text-sm font-bold whitespace-nowrap transition-all duration-300 relative px-2 ${activeTab === tab.batch_year ? "text-[#023347]" : "text-gray-400 hover:text-[#388E9C]"}`}
                  >
                    {tab.batch_year}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#023347] transition-all duration-300 transform ${activeTab === tab.batch_year ? "scale-x-100" : "scale-x-0"}`}></span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* --- TABLE SECTION --- */}
        <div className="px-6 md:px-12 max-w-7xl mx-auto w-full">
          <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[75vh] transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.98]"}`}>
            
            <div className="hidden md:grid grid-cols-4 gap-4 bg-[#388E9C] px-6 py-4 border-b border-[#2c7582] flex-none z-10">
              {["Name", "Reg No", "Role", "Year"].map((head) => (
                <div key={head} className="text-center text-[10px] font-bold text-white uppercase tracking-wider">{head}</div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto gray-scrollbar p-2 overscroll-auto"> 
              {loading ? (
                <div className="flex items-center justify-center h-full text-gray-400">Loading members...</div>
              ) : batchDetails?.members.map((member, idx) => (
                <div key={idx} className="group/row relative grid grid-cols-1 md:grid-cols-4 gap-4 px-6 py-4 border-b border-gray-50 items-center rounded-xl transition-all duration-500 hover:bg-[#F5F9FA] hover:shadow-md">
                  <div className="text-center flex flex-col md:block">
                    <span className="md:hidden text-[10px] text-[#388E9C] font-bold uppercase mb-1">Name</span>
                    <span className="text-sm font-semibold text-[#3C3E40]">{member.name}</span>
                  </div>
                  <div className="text-center flex flex-col md:block">
                    <span className="md:hidden text-[10px] text-[#388E9C] font-bold uppercase mb-1">Reg No</span>
                    <span className="text-sm text-[#3C3E40] font-mono">{member.regNo}</span>
                  </div>
                  <div className="text-center flex flex-col md:block">
                    <span className="md:hidden text-[10px] text-[#388E9C] font-bold uppercase mb-1">Role</span>
                    <span className="text-sm font-medium text-[#3C3E40] bg-gray-50 px-3 py-1 rounded-full inline-block">{member.role}</span>
                  </div>
                  <div className="text-center flex flex-col md:block">
                    <span className="md:hidden text-[10px] text-[#388E9C] font-bold uppercase mb-1">Year</span>
                    <span className="text-sm text-[#3C3E40]">{member.year}</span>
                  </div>
                </div>
              ))}

              {!loading && batchDetails?.members.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400 italic text-sm">No members available for this batch.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}