import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function SuggesstionVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const suggestionData = location.state?.suggestionData;

  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Resend Timer State
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  // Custom Toast State
  const [toast, setToast] = useState({ show: false, type: '', message: '', subMessage: '' });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    year: "I", // Defaulting to first dropdown value
  });

  const inputs = useRef([]);

  useEffect(() => {
    setIsVisible(true);
    if (!suggestionData) navigate("/suggestions");
  }, [suggestionData, navigate]);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (showOTP && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showOTP, timer]);

  const showFeedback = (type, message, subMessage) => {
    setToast({ show: true, type, message, subMessage });
    if (type === 'success') {
        setTimeout(() => navigate("/"), 3000);
    } else {
        setTimeout(() => setToast({ ...toast, show: false }), 4000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Mobile Number Validation: Only numbers, max 10 digits
    if (name === "phone_number") {
      const val = value.replace(/\D/g, "");
      if (val.length <= 10) setFormData({ ...formData, [name]: val });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleVerifyRequest = async (e) => {
    if (e) e.preventDefault();
    if (Object.values(formData).some(val => val.trim() === "")) {
        return showFeedback('error', 'SYSTEM INTERRUPTION', 'Please complete all identification fields.');
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      if (response.ok) {
          setShowOTP(true);
          setTimer(300);
          setCanResend(false);
      } else {
          showFeedback('error', 'HANDSHAKE FAILED', 'Check email credentials and retry.');
      }
    } catch (error) {
        showFeedback('error', 'NETWORK ERROR', 'Unable to reach security server.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    if (e.target.value.length === 1 && index < 5) inputs.current[index + 1].focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) inputs.current[index - 1].focus();
  };

  const handleSubmitOTP = async () => {
    const otpValue = inputs.current.map(input => input.value).join("");
    if (otpValue.length < 6) return showFeedback('error', 'INCOMPLETE OTP', '6-digit protocol required.');

    setLoading(true);
    try {
      const verifyRes = await fetch("http://localhost:3000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpValue }),
      });
      const verifyResult = await verifyRes.json();

      if (verifyRes.ok && verifyResult.verified) {
        const finalPayload = {
          title: suggestionData.title,
          description: suggestionData.description,
          name: formData.name,
          email: formData.email,
          phone: formData.phone_number,
          year: formData.year
        };

        const saveRes = await fetch("http://localhost:3000/api/add-suggestion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalPayload),
        });

        if (saveRes.ok) {
            showFeedback('success', 'ARCHIVAL COMPLETE', 'Your suggestion has been securely logged.');
        } else {
            showFeedback('error', 'LOGGING FAILED', 'Verification passed but record could not be saved.');
        }
      } else {
          showFeedback('error', 'INVALID PROTOCOL', verifyResult.message || 'The OTP entered is incorrect.');
      }
    } catch (error) {
        showFeedback('error', 'SYSTEM ERROR', 'An unexpected interruption occurred.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative min-h-screen bg-[#FDFCFB] text-[#023347] font-sans overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      {/* --- FEEDBACK TOASTS --- */}
      {toast.show && (
        <div className="fixed top-10 right-10 z-[200] flex animate-gentle-float">
          <div className={`w-1.5 rounded-l-full ${toast.type === 'success' ? 'bg-[#D4AF37]' : 'bg-[#8E2424]'}`} />
          <div className="bg-white shadow-2xl p-6 rounded-r-2xl border border-black/5 min-w-[300px]">
             <h5 className="font-sans font-bold text-[11px] tracking-widest uppercase mb-1">{toast.message}</h5>
             <p className="text-[13px] text-[#023347]/70">{toast.subMessage}</p>
          </div>
        </div>
      )}

      <main className="max-w-[1500px] mx-auto px-6 md:px-12 py-16 relative z-10">
        <header className="mb-16 border-b border-[#023347]/5 pb-10">
          <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] mb-4 block">Security Protocol</span>
          <h1 className="font-serif text-5xl font-semibold leading-tight">Identity <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37]">Verification</span></h1>
        </header>

        <div className={`bg-white/[0.02] backdrop-blur-[4px] border border-black/5 rounded-[2rem] p-10 md:p-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="mb-10 p-6 bg-[#023347]/5 rounded-2xl border-l-4 border-[#D4AF37]">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-2">Suggestion Preview:</h4>
            <p className=" text-xl text-[#023347]">{suggestionData?.title}</p>
          </div>

          <form onSubmit={handleVerifyRequest} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div>
                    <label className="text-[10px] font-bold tracking-widest uppercase text-[#023347]/50 mb-3 block">Full Name</label>
                    <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full bg-transparent border-b border-[#023347]/10 py-3 font-sans text-lg outline-none focus:border-[#D4AF37] transition-colors" />
                </div>
                <div>
                    <label className="text-[10px] font-bold tracking-widest uppercase text-[#023347]/50 mb-3 block">Institutional Email</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full bg-transparent border-b border-[#023347]/10 py-3 font-sans text-lg outline-none focus:border-[#D4AF37] transition-colors" />
                </div>
                <div>
                    <label className="text-[10px] font-bold tracking-widest uppercase text-[#023347]/50 mb-3 block">Contact Number</label>
                    <input name="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} placeholder="0000000000" className="w-full bg-transparent border-b border-[#023347]/10 py-3 font-sans text-lg outline-none focus:border-[#D4AF37] transition-colors" />
                </div>
                <div>
                    <label className="text-[10px] font-bold tracking-widest uppercase text-[#023347]/50 mb-3 block">Academic Year</label>
                    <select name="year" value={formData.year} onChange={handleChange} className="w-full bg-transparent border-b border-[#023347]/10 py-3 font-sans text-lg outline-none focus:border-[#D4AF37] transition-colors cursor-pointer appearance-none">
                        <option value="I">I</option>
                        <option value="II">II</option>
                        <option value="III">III</option>
                        <option value="IV">IV</option>
                    </select>
                </div>
            </div>

            <div className="pt-10 flex justify-end">
              <button type="submit" disabled={loading} className="bg-[#023347] text-white px-16 py-4 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase transition-all hover:bg-[#D4AF37] active:scale-95 disabled:opacity-50 shadow-xl shadow-[#023347]/10 hover:shadow-[#D4AF37]/20">
                {loading ? "Authenticating..." : "Request OTP"}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* OTP MODAL */}
      {showOTP && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#023347]/40 backdrop-blur-md" />
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-12 shadow-2xl border border-white/20 overflow-hidden">
            {/* Modal Pillar */}
            <div className="absolute left-0 top-0 w-2 h-full bg-[#023347]" />
            
            <div className="text-center mb-10">
              <h2 className=" text-3xl text-[#023347]">Enter OTP</h2>
              <p className="text-xs text-gray-400 mt-2 font-sans italic">Protocol sent to {formData.email}</p>
            </div>

            <div className="flex justify-between gap-3 mb-8">
              {[...Array(6)].map((_, index) => (
                <input key={index} maxLength="1" ref={(el) => (inputs.current[index] = el)} onChange={(e) => handleOtpChange(e, index)} onKeyDown={(e) => handleOtpKeyDown(e, index)} className="w-12 h-14 border border-[#023347]/10 rounded-xl text-center text-xl font-bold bg-gray-50/50 outline-none focus:border-[#D4AF37]" />
              ))}
            </div>

            <div className="text-center mb-8">
                {timer > 0 ? (
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Resend available in {formatTime(timer)}</p>
                ) : (
                    <button onClick={handleVerifyRequest} className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase hover:underline">Resend OTP Now</button>
                )}
            </div>

            <button onClick={handleSubmitOTP} disabled={loading} className="w-full bg-[#023347] text-white py-4 rounded-xl text-[11px] font-bold tracking-widest uppercase hover:bg-[#D4AF37] transition-all shadow-lg">
              {loading ? "Verifying..." : "Confirm & Submit"}
            </button>
            <button onClick={() => setShowOTP(false)} className="w-full mt-4 text-[#023347]/40 text-[10px] font-bold tracking-widest uppercase hover:text-[#023347]">Cancel</button>
          </div>
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;600;700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        @keyframes gentle-float {
            0% { transform: translateY(0px); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translateY(-5px); }
        }
        .animate-gentle-float { animation: gentle-float 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}