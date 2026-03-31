import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Verification() {
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    year: "",
    section: "",
    mentor: "",
    mentor_mail_id: ""
  });
  
  const navigate = useNavigate();
  const inputs = useRef([]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerifyRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      if (response.ok) {
        setShowOTP(true);
        setStatus(null);
      } else {
        setStatus("error");
        setTimeout(() => setStatus(null), 5000);
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    if (e.target.value.length === 1 && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (inputs.current[index].value !== "") {
        inputs.current[index].value = "";
      } else if (index > 0) {
        inputs.current[index - 1].value = "";
        inputs.current[index - 1].focus();
      }
    }
  };

  const handleSubmitOTP = async () => {
    const otpValue = inputs.current.map(input => input.value).join("");
    try {
      const response = await fetch("http://localhost:3000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpValue }),
      });
      const result = await response.json();

      if (result.verified) {
        setStatus("success");
        setTimeout(() => {
          navigate("/add-problem", { state: { userDetails: formData } });
        }, 2000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus(null), 4000);
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FDFCFB] text-[#023347] font-sans selection:bg-[#D4AF37]/20 overflow-x-hidden">
      
      {/* --- NOTIFICATION TOASTS --- */}
      <div className="fixed left-4 right-4 top-4 z-[110] flex flex-col gap-4 md:left-auto md:right-10 md:top-10">
        {status === "success" && (
          <div className="relative flex w-full items-center overflow-hidden rounded-xl border border-black/5 bg-white shadow-2xl animate-slide-in md:min-w-[320px]">
            <div className="w-1.5 h-16 bg-[#D4AF37]" />
            <div className="px-6 py-4 text-left">
              <p className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase">Identity Confirmed</p>
              <p className="text-[13px] text-[#023347]/80 mt-1">Establishing secure session...</p>
            </div>
          </div>
        )}
        {status === "error" && (
          <div className="relative flex w-full items-center overflow-hidden rounded-xl border border-black/5 bg-white shadow-2xl animate-slide-in md:min-w-[320px]">
            <div className="w-1.5 h-16 bg-[#8E2424]" />
            <div className="px-6 py-4 text-left">
              <p className="text-[10px] font-bold tracking-[0.3em] text-[#8E2424] uppercase">System Interruption</p>
              <p className="text-[13px] text-[#023347]/80 mt-1">Unable to verify. Please retry.</p>
            </div>
          </div>
        )}
      </div>

      {/* --- AMBIENT LIGHTING --- */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      <main className="relative z-10 mx-auto max-w-[1500px] px-5 py-12 md:px-12 md:py-16">
        
        {/* --- HEADER --- */}
        <header className="mb-16 border-b border-[#023347]/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="flex flex-col items-start text-left">
            <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] mb-4">Security Protocol</span>
            <h1 className={`font-serif text-3xl font-semibold leading-tight transition-all duration-[1200ms] sm:text-4xl md:text-5xl ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              Identity <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">Verification</span>
            </h1>
          </div>
          <button onClick={() => navigate(-1)} className="landing-btn-secondary landing-btn-compact-mobile">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg>
            Return to List
          </button>
        </header>

        {/* --- FORM MODULE (Corporate Glass) --- */}
        <div className={`relative bg-white/[0.02] backdrop-blur-[4px] border border-black/5 rounded-[2rem] p-6 md:p-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="absolute left-0 top-12 w-1 h-24 bg-[#023347]" />
          
          <form onSubmit={handleVerifyRequest} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {[
                { label: "Full Name", name: "name", type: "text" },
                { label: "Academic Email", name: "email", type: "email" },
                { label: "Mobile Number", name: "phone_number", type: "text" },
                { label: "Batch Year", name: "year", type: "text" },
                { label: "Section", name: "section", type: "text" },
                { label: "Mentor Name", name: "mentor", type: "text" },
                { label: "Mentor Mail ID", name: "mentor_mail_id", type: "email", full: true }
              ].map((field) => (
                <div key={field.name} className={field.full ? "md:col-span-2 text-left" : "text-left"}>
                  <label className="text-[10px] font-bold tracking-widest uppercase text-[#023347]/50 mb-2 block">{field.label}</label>
                  <input 
                    name={field.name} 
                    type={field.type} 
                    required 
                    onChange={handleChange} 
                    className="w-full bg-transparent border-b border-[#023347]/10 py-3 font-sans text-lg outline-none focus:border-[#D4AF37] transition-all placeholder:text-gray-300" 
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className="landing-btn-primary disabled:opacity-50"
              >
                {loading ? "Authenticating..." : "Request Access"}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* --- OTP OVERLAY --- */}
      {showOTP && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#023347]/40 backdrop-blur-md animate-fade-in" onClick={() => setShowOTP(false)} />
          <div className="relative w-full max-w-md rounded-[2rem] border border-white/20 bg-white p-6 shadow-2xl animate-slide-up md:rounded-[2.5rem] md:p-12">
            <div className="absolute left-0 top-0 w-2 h-full bg-[#023347]" />
            <div className="text-center mb-10">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#D4AF37]">Access Gate</span>
              <h2 className="font-serif text-3xl text-[#023347] mt-2">Enter OTP</h2>
            </div>
            <div className="flex justify-between gap-3 mb-10">
              {[...Array(6)].map((_, index) => (
                <input 
                  key={index} maxLength="1" 
                  ref={(el) => (inputs.current[index] = el)} 
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="w-12 h-14 border border-[#023347]/10 rounded-xl text-center text-xl font-bold bg-gray-50/50 outline-none focus:border-[#D4AF37] transition-all" 
                />
              ))}
            </div>
            <div className="space-y-4">
              <button onClick={handleSubmitOTP} className="landing-btn-primary w-full">Confirm</button>
              <button onClick={() => setShowOTP(false)} className="landing-btn-secondary w-full">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;600;700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slideUp 0.5s ease-out; }
      `}</style>
    </div>
  );
}
