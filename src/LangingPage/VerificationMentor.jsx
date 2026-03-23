import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Verification() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const problem_id = location.state?.problem_id;

  const [showOTP, setShowOTP] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    year: "",
    section: "",
    mentor: ""
  });
  
  const inputs = useRef([]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      
      if (response.ok) {
        setShowOTP(true);
      } else {
        alert("Error sending OTP. Please check your email address.");
      }
    } catch (error) {
      console.error("OTP Error:", error);
    }
  };

  const handleOtpChange = (e, index) => {
    if (e.target.value.length === 1 && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleSubmitOTP = async () => {
    const otpValue = inputs.current.map(input => input.value).join("");

    try {
      // Step 2: Verify OTP
      const verifyRes = await fetch("http://localhost:3000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpValue }),
      });
      const verifyData = await verifyRes.json();

      if (verifyData.verified) {
        // ✅ FIXED: Added 'mentor' to the payload below
        const saveRes = await fetch("http://localhost:3000/api/add-problem-solver-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            problem_id: problem_id, 
            name: formData.name,
            email: formData.email,
            phone_number: formData.phone_number,
            year: formData.year,
            section: formData.section,
            mentor: formData.mentor // <--- THIS WAS MISSING
          }),
        });

        if (saveRes.ok) {
          alert("Success! Statement locked and request submitted.");
          navigate("/"); 
        } else {
          const err = await saveRes.json();
          alert(err.message || "Failed to save request.");
        }
      } else {
        alert("Invalid OTP code.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9FA] flex items-center justify-center px-6 py-12 relative">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm p-10 border border-[#E6EFF2]">

        {/* Header row: title left, back button right */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-[#023347]">Verification</h2>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-[#023347] text-white px-6 py-2 rounded-xl text-xs font-bold shadow-sm
              transition-all duration-300 ease-out
              hover:bg-[#388E9C] hover:shadow-lg hover:scale-105 active:scale-95"
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

        <form onSubmit={handleVerify}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Name</label>
              <input name="name" required onChange={handleInputChange} className="w-full border border-[#CFE8EC] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#388E9C]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Email</label>
              <input name="email" type="email" required onChange={handleInputChange} className="w-full border border-[#CFE8EC] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#388E9C]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Mobile no.</label>
              <input name="phone_number" required onChange={handleInputChange} className="w-full border border-[#CFE8EC] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#388E9C]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Year</label>
              <input name="year" required onChange={handleInputChange} className="w-full border border-[#CFE8EC] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#388E9C]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Section</label>
              <input name="section" required onChange={handleInputChange} className="w-full border border-[#CFE8EC] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#388E9C]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Mentor</label>
              <input name="mentor" required onChange={handleInputChange} className="w-full border border-[#CFE8EC] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#388E9C]" />
            </div>
          </div>
          <button type="submit" className="mt-10 w-full bg-[#0B1C3D] text-white py-3 rounded-lg font-semibold hover:bg-[#142d63] transition-all">Verify</button>
        </form>
      </div>

      {showOTP && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
          <div className="relative w-[500px] h-[360px] bg-white rounded-2xl border border-[#CDE4EC] shadow-xl flex flex-col items-center justify-center px-10">
            <h2 className="text-xl font-semibold text-[#1C2B33] mb-8">Enter OTP</h2>
            <div className="flex gap-4 mb-10">
              {[...Array(6)].map((_, index) => (
                <input key={index} maxLength="1" ref={(el) => (inputs.current[index] = el)} onChange={(e) => handleOtpChange(e, index)} className="w-[50px] h-[50px] border border-[#3A9FBF] rounded-[10px] text-center text-xl outline-none focus:ring-2 focus:ring-[#3A9FBF]" />
              ))}
            </div>
            <button onClick={handleSubmitOTP} className="w-full h-[50px] bg-[#0B1C3D] text-white rounded-lg text-sm hover:bg-[#142d63] transition-all">Submit</button>
          </div>
        </div>
      )}
    </div>
  );
}