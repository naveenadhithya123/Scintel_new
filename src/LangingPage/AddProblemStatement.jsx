import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CATEGORY_OPTIONS = [
  "Artificial Intelligence and Machine Learning",
  "HealthTech and Biomedical Innovation",
  "Smart Cities and Mobility",
  "Agriculture and Rural Innovation",
  "Climate and Sustainability",
  "Education Technology",
  "FinTech and Digital Commerce",
  "Cybersecurity and Digital Trust",
  "Open Innovation",
];

export default function AddProblemStatement() {
  const location = useLocation();
  const navigate = useNavigate();
  const userDetails = location.state?.userDetails;

  const [form, setForm] = useState({ title: "", category: "", shortDescription: "", detailedDescription: "" });
  const [status, setStatus] = useState(null); // 'success' or 'error'
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    if (!userDetails) navigate("/ProblemStatementVerification");
  }, [userDetails, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const payload = {
      ...userDetails,
      title: form.title,
      category: form.category,
      short_description: form.shortDescription,
      detailed_description: form.detailedDescription,
    };
    try {
      const response = await fetch("http://localhost:3000/api/problem-creation-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus("success");
        setTimeout(() => navigate("/"), 3500);
      } else {
        setStatus("error");
        setTimeout(() => setStatus(null), 5000);
      }
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FDFCFB] text-[#023347] font-sans selection:bg-[#D4AF37]/20 overflow-x-hidden">
      
      {/* --- PRESTIGE FEEDBACK TABS (TOASTS) --- */}
      <div className="fixed top-10 right-10 z-[100] flex flex-col gap-4">
        {/* Success Tab */}
        {status === "success" && (
          <div className="relative flex items-center bg-white border border-black/5 shadow-2xl rounded-xl overflow-hidden min-w-[320px] animate-slide-in-right">
            <div className="w-1.5 h-16 bg-[#D4AF37]" />
            <div className="px-6 py-4">
              <p className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase">Archival Complete</p>
              <p className="text-[13px] text-[#023347]/80 mt-1">Statement logged securely.</p>
            </div>
          </div>
        )}

        {/* Failure Tab */}
        {status === "error" && (
          <div className="relative flex items-center bg-white border border-black/5 shadow-2xl rounded-xl overflow-hidden min-w-[320px] animate-slide-in-right">
            <div className="w-1.5 h-16 bg-[#8E2424]" />
            <div className="px-6 py-4">
              <p className="text-[10px] font-bold tracking-[0.3em] text-[#8E2424] uppercase">System Interruption</p>
              <p className="text-[13px] text-[#023347]/80 mt-1">Unable to archive record. Retry.</p>
            </div>
          </div>
        )}
      </div>

      {/* --- PAGE CONTENT --- */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      <main className="max-w-[1500px] mx-auto px-6 md:px-12 py-16 relative z-10">
        <header className="mb-16 border-b border-[#023347]/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="flex flex-col items-start text-left">
            <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] mb-4">Submission Portal</span>
            <h1 className={`font-serif text-5xl font-semibold leading-tight transition-all duration-[1200ms] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              New Problem <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">Statement</span>
            </h1>
          </div>
          <button onClick={() => navigate("/")} className="group flex items-center gap-3 bg-white border border-[#023347]/10 text-[#023347] px-8 py-3.5 rounded-2xl text-[10px] font-bold tracking-[0.2em] uppercase transition-all hover:bg-gray-50 active:scale-95 shadow-sm">
            Discard Draft
          </button>
        </header>

        <div className={`relative bg-white/[0.02] backdrop-blur-[4px] border border-black/5 rounded-[2rem] p-10 md:p-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="absolute left-0 top-12 w-1.5 h-24 bg-[#023347] rounded-r-full" />
          
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-[#023347]/50 mb-3 block">Problem Title</label>
                <input type="text" name="title" onChange={handleChange} className="w-full bg-transparent border-b border-[#023347]/10 py-4 font-sans text-xl outline-none focus:border-[#D4AF37] transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-[#023347]/50 mb-3 block">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-[#023347]/10 py-4 font-sans text-lg outline-none focus:border-[#D4AF37] transition-all"
                >
                  <option value="">Select category</option>
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-[#023347]/50 mb-3 block">Abstract Summary</label>
                <input type="text" name="shortDescription" onChange={handleChange} className="w-full bg-transparent border-b border-[#023347]/10 py-4 font-sans text-lg outline-none focus:border-[#D4AF37] transition-all" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-[#023347]/50 mb-3 block">Comprehensive Narrative</label>
                <textarea name="detailedDescription" onChange={handleChange} className="w-full bg-transparent border border-[#023347]/10 rounded-2xl p-6 font-sans text-lg outline-none focus:border-[#D4AF37] transition-all min-h-[200px] resize-none" />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button 
                onClick={handleSubmit} 
                className="bg-[#023347] text-white px-20 py-5 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/20 active:scale-95"
              >
                Submit Statement
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;600;700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right { animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}
