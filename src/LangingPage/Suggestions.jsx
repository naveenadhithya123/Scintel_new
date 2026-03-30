import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function Suggestions() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isShaking, setIsShaking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title required';
    if (!form.description.trim()) newErrors.description = 'Narrative required';
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    navigate("/SuggesstionVerification", {
      state: { suggestionData: { ...form } }
    });
  };

  return (
    <div className="relative min-h-screen bg-[#FDFCFB] text-[#023347] font-sans selection:bg-[#D4AF37]/20 overflow-x-hidden">
      
      {/* --- AMBIENT LIGHTING (God Ray) --- */}
      <div className="absolute top-0 left-0 w-full h-[300px] md:h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      <main className="max-w-[1500px] mx-auto px-5 md:px-12 py-10 md:py-16 relative z-10">
        
        {/* --- HEADER ZONE --- */}
        <header className="mb-10 md:mb-16 border-b border-[#023347]/5 pb-8 md:pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
          <div className="flex flex-col items-start text-left">
            <span className={`text-[9px] md:text-[10px] font-bold tracking-[0.4em] md:tracking-[0.5em] uppercase text-[#D4AF37] mb-3 md:mb-4 block transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              Community Voice
            </span>
            <h1 className={`text-3xl md:text-5xl font-semibold leading-tight transition-all duration-[1200ms] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 md:translate-y-12 opacity-0'}`}>
              Submit <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37]">Suggestions</span>
            </h1>
          </div>
          
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 bg-white border border-[#023347]/10 text-[#023347] px-6 md:px-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase transition-all hover:bg-gray-50 active:scale-95 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 md:w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" />
            </svg>
            Discard
          </button>
        </header>

        {/* --- FORM MODULE (Corporate Glass) --- */}
        <div className={`group relative bg-white/[0.02] backdrop-blur-[4px] border border-black/5 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          
          {/* Prestige Pillar Anchor */}
          <div className="absolute left-0 top-12 w-1 md:w-1.5 h-24 md:h-28 bg-[#023347] rounded-r-full group-hover:bg-[#D4AF37] transition-all duration-500" />

          <div className="space-y-8 md:space-y-12">
            <div className="flex flex-col gap-y-8 md:gap-y-12 text-left">
              
              {/* Title Field */}
              <div>
                <label className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-[#023347]/50 mb-2 md:mb-3 block">Suggestion Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={form.title} 
                  onChange={handleChange} 
                  placeholder="Summarize your thought..."
                  className={`w-full bg-transparent border-b py-3 md:py-4 font-sans text-lg md:text-xl outline-none transition-colors placeholder:text-[#023347]/20 ${errors.title ? 'border-red-400' : 'border-[#023347]/10 focus:border-[#D4AF37]'}`} 
                />
                {errors.title && <p className="text-[9px] md:text-[10px] text-red-500 font-bold mt-2 uppercase tracking-tighter">{errors.title}</p>}
              </div>

              {/* Description Field */}
              <div>
                <label className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-[#023347]/50 mb-2 md:mb-3 block">Comprehensive Narrative</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  placeholder="Explain the impact and reasoning behind this suggestion..."
                  className={`w-full bg-transparent border rounded-xl md:rounded-2xl p-4 md:p-6 font-sans text-base md:text-lg outline-none transition-colors min-h-[200px] md:min-h-[250px] resize-none placeholder:text-[#023347]/20 ${errors.description ? 'border-red-400' : 'border-[#023347]/10 focus:border-[#D4AF37]'}`} 
                />
                {errors.description && <p className="text-[9px] md:text-[10px] text-red-500 font-bold mt-2 uppercase tracking-tighter">{errors.description}</p>}
              </div>
            </div>

            {/* Disclaimer Module */}
            <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl md:rounded-2xl p-5 md:p-6 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-[#D4AF37] text-white text-[9px] md:text-[10px] flex items-center justify-center font-bold">!</div>
                <span className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-[#B8860B]">Disclaimer</span>
              </div>
              <p className="text-[12px] md:text-[13px] text-[#023347]/70 leading-relaxed max-w-xl">
                Submissions are strictly monitored. Suggestions must pertain exclusively to <strong>Career Development</strong> and <strong>Guidance activities</strong>.
              </p>
            </div>

            {/* Submission Logic */}
            <div className="flex justify-center md:justify-end pt-4 md:pt-6">
              <button 
                onClick={handleSubmit} 
                className={`w-full md:w-auto bg-[#023347] text-white px-12 md:px-20 py-4 md:py-5 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/20 active:scale-95 ${isShaking ? 'animate-shake bg-red-500' : ''}`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;600;700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }

        /* Custom extra-small breakpoint for very narrow phones */
        @media (min-width: 380px) {
          .xs\:block { display: block; }
        }
      `}</style>
    </div>
  );
}

export default Suggestions;
