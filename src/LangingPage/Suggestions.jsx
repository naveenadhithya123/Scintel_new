import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

function Suggestions() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: 'General Feedback',
    title: '',
    category: '',
    description: '',
    priority: ''
  });
  const [proofFile, setProofFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isShaking, setIsShaking] = useState(false);

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.category.trim()) newErrors.category = 'Category is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.priority.trim()) newErrors.priority = 'Priority is required';
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

  // Pass raw data and the actual file object to verification page
  navigate("/SuggesstionVerification", { 
    state: { 
      suggestionData: { ...form },
      proofFile: proofFile // Pass the actual File object
    } 
  });
};

  return (
    <>
       <style>{`
        .gray-scrollbar::-webkit-scrollbar { width: 6px; }
        .gray-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .gray-scrollbar::-webkit-scrollbar-thumb { background: #9ca3af !important; border-radius: 10px; }
        .gray-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280 !important; }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>

      <div 
        ref={sectionRef}
        id='suggestions' 
        className='min-h-screen bg-[#F5F9FA] flex flex-col font-sans py-12 perspective-[1000px]'
      >
        <div className='max-w-7xl mx-auto px-6 md:px-12 w-full'>
          
          {/* Header */}
          <div className="pb-8 overflow-hidden flex items-center justify-between">
            <h1 
              className={`text-[40px] font-extrabold text-[#023347] mb-3 w-fit tracking-tight transform transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isVisible ? "translate-y-0 opacity-100 blur-0" : "translate-y-20 opacity-0 blur-sm"
              }`}
            >
              Suggestions
            </h1>

            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-2 bg-[#023347] text-white px-6 py-2 rounded-xl text-xs font-bold shadow-sm 
                transition-all duration-300 ease-out
                hover:bg-[#388E9C] hover:shadow-lg hover:scale-105 active:scale-95
                transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}
              `}
              style={{ transitionDuration: "1000ms", transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M5 12l7 7M5 12l7-7" />
              </svg>
              Back
            </button>
          </div>

          <div className={`rounded-3xl bg-white p-8 md:p-10 shadow-sm border border-gray-100 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            <div className='mb-8'>
              <label className='block text-sm font-bold text-[#3C3E40] mb-2 ml-1'>Type *</label>
              <input type='text' name='type' value={form.type} onChange={handleChange} className='w-full md:w-1/3 px-4 py-3 rounded-xl border border-gray-100 bg-[#F5F9FA] focus:ring-2 focus:ring-[#388E9C]/20 outline-none' />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8'>
              <div>
                <label className='block text-sm font-bold text-[#3C3E40] mb-2 ml-1'>Title *</label>
                <input type='text' name='title' value={form.title} onChange={handleChange} placeholder="e.g. Wi-Fi Issue" className={`w-full px-4 py-3 rounded-xl border bg-[#F5F9FA] focus:ring-2 outline-none ${errors.title ? 'border-red-400' : 'border-gray-100'}`} />
                {errors.title && <p className='text-red-500 text-xs mt-2 ml-1'>{errors.title}</p>}
              </div>

              <div>
                <label className='block text-sm font-bold text-[#3C3E40] mb-2 ml-1'>Category *</label>
                <input type='text' name='category' value={form.category} onChange={handleChange} placeholder="e.g. Infrastructure" className={`w-full px-4 py-3 rounded-xl border bg-[#F5F9FA] focus:ring-2 outline-none ${errors.category ? 'border-red-400' : 'border-gray-100'}`} />
                {errors.category && <p className='text-red-500 text-xs mt-2 ml-1'>{errors.category}</p>}
              </div>
            </div>

            <div className='mb-8'>
              <label className='block text-sm font-bold text-[#3C3E40] mb-2 ml-1'>Description *</label>
              <textarea name='description' value={form.description} onChange={handleChange} className={`w-full h-32 px-4 py-3 rounded-xl border bg-[#F5F9FA] focus:ring-2 outline-none resize-none gray-scrollbar ${errors.description ? 'border-red-400' : 'border-gray-100'}`} />
              {errors.description && <p className='text-red-500 text-xs mt-2 ml-1'>{errors.description}</p>}
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10'>
               <div>
                <label className='block text-sm font-bold text-[#3C3E40] mb-2 ml-1'>Add Proof (Optional)</label>
                <input type='file' onChange={(e) => setProofFile(e.target.files[0])} className='w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-[#F5F9FA] file:text-[#023347] hover:file:bg-[#023347] hover:file:text-white cursor-pointer' />
              </div>
              <div>
                <label className='block text-sm font-bold text-[#3C3E40] mb-2 ml-1'>Priority *</label>
                <input type='text' name='priority' value={form.priority} onChange={handleChange} placeholder="e.g. High" className={`w-full px-4 py-3 rounded-xl border bg-[#F5F9FA] focus:ring-2 outline-none ${errors.priority ? 'border-red-400' : 'border-gray-100'}`} />
                {errors.priority && <p className='text-red-500 text-xs mt-2 ml-1'>{errors.priority}</p>}
              </div>
            </div>

            <button onClick={handleSubmit} className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${isShaking ? 'animate-shake bg-red-500' : 'bg-[#023347] hover:bg-[#388E9C]'}`}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Suggestions;