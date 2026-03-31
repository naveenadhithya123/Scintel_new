import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const YEAR_OPTIONS = ["I", "II", "III", "IV"];

export default function Verification() {
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    year: "",
    section: ""
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
      if (response.ok) setShowOTP(true);
      else alert("Failed to send OTP. Please check the email.");
    } catch (error) {
      console.error("Error:", error);
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
        navigate("/add-problem", { state: { userDetails: formData } });
      } else {
        alert(result.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  const handleCancel = () => {
    inputs.current.forEach(input => { if (input) input.value = ""; });
    setShowOTP(false);
  };

  return (
    <div className="relative min-h-screen bg-[#FDFCFB] text-[#023347] font-sans selection:bg-[#D4AF37]/20 overflow-x-hidden">
      {/* --- AMBIENT LIGHTING --- */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      <main className="max-w-[1500px] mx-auto px-6 md:px-12 py-16 relative z-10">
        
        {/* --- LEFT-ALIGNED PRESTIGE HEADER --- */}
        <header className="mb-16 border-b border-[#023347]/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="flex flex-col items-start text-left">
            <span className={`text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] mb-4 block transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              Security Protocol
            </span>
            <h1 className={`font-serif text-5xl font-semibold leading-tight transition-all duration-[1200ms] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              Identity <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37]">Verification</span>
            </h1>
          </div>

          <button
            onClick={() => navigate("/problems")}
            className="group flex items-center gap-3 bg-white border border-[#023347]/10 text-[#023347] px-8 py-3.5 rounded-2xl text-[10px] font-bold tracking-[0.2em] uppercase transition-all hover:bg-gray-50 active:scale-95 shadow-sm self-end md:self-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" />
            </svg>
            Return to List
          </button>
        </header>

        {/* --- FORM MODULE --- */}
        <div className={`bg-white/[0.02] backdrop-blur-[4px] border border-black/5 rounded-[2rem] p-10 md:p-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <form onSubmit={handleVerifyRequest} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {[
                { label: "Full Name", name: "name", type: "text" },
                { label: "Academic Email", name: "email", type: "email" },
                { label: "Mobile Number", name: "phone_number", type: "text" },
                { label: "Section Assignment", name: "section", type: "text", full: true }
              ].map((field) => (
                <div key={field.name} className={`${field.full ? "md:col-span-2" : ""}`}>
                  <label className="text-[10px] font-bold tracking-widest uppercase text-[#023347]/50 mb-3 block text-left">
                    {field.label}
                  </label>
                  <input 
                    name={field.name}
                    type={field.type}
                    required 
                    onChange={handleChange} 
                    className="w-full bg-transparent border-b border-[#023347]/10 py-3 font-sans text-lg outline-none focus:border-[#D4AF37] transition-colors placeholder:text-gray-300 text-left" 
                  />
                </div>
              ))}
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-[#023347]/50 mb-3 block text-left">
                  Batch Year
                </label>
                <select
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-[#023347]/10 py-3 font-sans text-lg outline-none focus:border-[#D4AF37] transition-colors text-left"
                >
                  <option value="">Select year</option>
                  {YEAR_OPTIONS.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-10 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#023347] text-white px-16 py-4 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/20 active:scale-95 flex items-center gap-4 disabled:opacity-50"
              >
                {loading ? "Authenticating..." : "Verify Account"}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* --- OTP MODAL --- */}
      {showOTP && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#023347]/40 backdrop-blur-md animate-fade-in" onClick={handleCancel} />
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-12 shadow-2xl border border-white/20 animate-slide-up overflow-hidden">
            <div className="text-center mb-10">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#D4AF37]">Secure Access</span>
              <h2 className="font-serif text-3xl text-[#023347] mt-2">Enter OTP</h2>
              <p className="text-xs text-gray-400 mt-2 font-sans italic">Verification code sent via email.</p>
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
              <button onClick={handleSubmitOTP} className="w-full bg-[#023347] text-white py-4 rounded-xl text-[11px] font-bold tracking-widest uppercase hover:bg-[#D4AF37] transition-all">Confirm</button>
              <button onClick={handleCancel} className="w-full bg-transparent text-[#023347]/40 py-2 text-[10px] font-bold tracking-widest uppercase hover:text-[#023347] transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;600;700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}
