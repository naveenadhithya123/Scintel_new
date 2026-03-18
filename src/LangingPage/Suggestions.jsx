import React, { useState, useEffect, useRef } from 'react';

function Suggestions() {
  const [form, setForm] = useState({
    type: 'General Feedback',
    title: '',
    category: '',
    description: '',
    priority: ''
  });
  const [proofFile, setProofFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isShaking, setIsShaking] = useState(false); // New state for error animation

  // Animation Refs & State
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

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

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Trigger Shake Animation
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    setSubmitted(true);
  };

  return (
    <>
       <style>{`
        /* Gray Scrollbar for Textarea */
        .gray-scrollbar::-webkit-scrollbar { width: 6px; }
        .gray-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .gray-scrollbar::-webkit-scrollbar-thumb { background: #9ca3af !important; border-radius: 10px; }
        .gray-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280 !important; }

        /* Error Shake Animation */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>

      <div 
        ref={sectionRef}
        id='suggestions' 
        // Standard layout consistency
        className='min-h-screen bg-[#F5F9FA] flex flex-col font-sans py-12 perspective-[1000px]'
      >
        <div className='max-w-7xl mx-auto px-6 md:px-12 w-full'>
          
          {/* Header */}
          <div className="pb-8 overflow-hidden">
            <h1 
              className={`text-[40px] font-extrabold text-[#023347] mb-3 w-fit tracking-tight transform transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isVisible ? "translate-y-0 opacity-100 blur-0" : "translate-y-20 opacity-0 blur-sm"
              }`}
            >
              Suggestions / Complaints
            </h1>
          </div>

          {/* MAIN FORM CARD */}
          <div 
            className={`flex-1 rounded-3xl bg-white p-8 md:p-10 flex flex-col shadow-sm border border-gray-100 transform-gpu transition-all duration-1000 delay-100 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.98]"
            }`}
          >
            
            {/* Type Selection */}
            <div className='mb-8 group'>
              <label className='block text-sm font-bold text-[#3C3E40] tracking-wide mb-2 ml-1 transition-colors group-focus-within:text-[#388E9C]'>
                Type
              </label>
              <div className="relative">
                <input 
                  type='text' 
                  name='type' 
                  value={form.type} 
                  onChange={handleChange} 
                  className='w-full md:w-1/3 px-4 py-3 rounded-xl border border-gray-100 bg-[#F5F9FA] text-sm text-[#023347] font-medium 
                  focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#388E9C]/20 focus:border-[#388E9C] 
                  transition-all duration-300 ease-out hover:bg-gray-50' 
                />
              </div>
            </div>

            {/* Title & Category Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8'>
              <div className="group">
                <label className='block text-sm font-bold text-[#3C3E40] tracking-wide mb-2 ml-1 transition-colors group-focus-within:text-[#388E9C]'>
                  Title
                </label>
                <input 
                  type='text' 
                  name='title' 
                  value={form.title} 
                  onChange={handleChange} 
                  placeholder="e.g. Wi-Fi Connectivity Issue"
                  className={`w-full px-4 py-3 rounded-xl border bg-[#F5F9FA] text-sm text-[#023347] font-medium 
                  focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#388E9C]/20 focus:border-[#388E9C] 
                  transition-all duration-300 ease-out placeholder-gray-400
                  ${errors.title ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-100'}`} 
                />
                {errors.title && <p className='text-red-500 text-xs mt-2 ml-1 font-medium animate-in slide-in-from-left-2'>{errors.title}</p>}
              </div>

              <div className="group">
                <label className='block text-sm font-bold text-[#3C3E40] tracking-wide mb-2 ml-1 transition-colors group-focus-within:text-[#388E9C]'>
                  Category
                </label>
                <input 
                  type='text' 
                  name='category' 
                  value={form.category} 
                  onChange={handleChange} 
                  placeholder="e.g. Infrastructure"
                  className={`w-full px-4 py-3 rounded-xl border bg-[#F5F9FA] text-sm text-[#023347] font-medium 
                  focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#388E9C]/20 focus:border-[#388E9C] 
                  transition-all duration-300 ease-out placeholder-gray-400
                  ${errors.category ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-100'}`} 
                />
                {errors.category && <p className='text-red-500 text-xs mt-2 ml-1 font-medium animate-in slide-in-from-left-2'>{errors.category}</p>}
              </div>
            </div>

            {/* Description */}
            <div className='mb-8 group'>
              <label className='block text-sm font-bold text-[#3C3E40] tracking-wide mb-2 ml-1 transition-colors group-focus-within:text-[#388E9C]'>
                Description
              </label>
              <textarea 
                name='description' 
                value={form.description} 
                onChange={handleChange} 
                placeholder="Describe your suggestion or complaint in detail..."
                className={`w-full h-32 px-4 py-3 rounded-xl border bg-[#F5F9FA] text-sm text-[#023347] font-medium leading-relaxed
                focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#388E9C]/20 focus:border-[#388E9C] 
                transition-all duration-300 ease-out resize-none gray-scrollbar placeholder-gray-400
                ${errors.description ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-100'}`} 
              />
              {errors.description && <p className='text-red-500 text-xs mt-2 ml-1 font-medium animate-in slide-in-from-left-2'>{errors.description}</p>}
            </div>

            {/* Proof & Priority Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10'>
              <div className="group">
                <label className='block text-sm font-bold text-[#3C3E40] tracking-wide mb-2 ml-1'>
                  Add Proof (Screenshot/File)
                </label>
                <div className="relative overflow-hidden rounded-xl">
                  <input 
                    type='file' 
                    onChange={(e) => setProofFile(e.target.files[0])} 
                    className='w-full text-sm text-gray-500 font-medium
                    file:mr-4 file:py-3 file:px-6
                    file:rounded-xl file:border-0
                    file:text-sm file:font-bold
                    file:bg-[#F5F9FA] file:text-[#023347]
                    hover:file:bg-[#023347] hover:file:text-white
                    file:transition-colors file:duration-300
                    cursor-pointer' 
                  />
                </div>
              </div>

              <div className="group">
                <label className='block text-sm font-bold text-[#3C3E40] tracking-wide mb-2 ml-1 transition-colors group-focus-within:text-[#388E9C]'>
                  Priority
                </label>
                <input 
                  type='text' 
                  name='priority' 
                  value={form.priority} 
                  onChange={handleChange} 
                  placeholder="e.g. High, Medium, Low"
                  className={`w-full px-4 py-3 rounded-xl border bg-[#F5F9FA] text-sm text-[#023347] font-medium 
                  focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#388E9C]/20 focus:border-[#388E9C] 
                  transition-all duration-300 ease-out placeholder-gray-400
                  ${errors.priority ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-100'}`} 
                />
                {errors.priority && <p className='text-red-500 text-xs mt-2 ml-1 font-medium animate-in slide-in-from-left-2'>{errors.priority}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleSubmit} 
              disabled={submitted} 
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center transform transition-all duration-300 
              ${isShaking ? 'animate-shake bg-red-500' : ''}
              ${submitted 
                ? 'bg-green-600 cursor-default scale-100 shadow-green-200' 
                : 'bg-[#023347] hover:bg-[#388E9C] hover:shadow-xl hover:scale-[1.01] active:scale-[0.98]'
              }`}
            >
              {submitted ? (
                <span className="flex items-center gap-2 animate-in zoom-in duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  Submitted Successfully
                </span>
              ) : (
                'Submit'
              )}
            </button>

          </div>
        </div>
      </div>
    </>
  )
}

export default Suggestions;
