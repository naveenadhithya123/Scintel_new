import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function SuggesstionVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Data passed from Suggestions.jsx via state
  const suggestionData = location.state?.suggestionData;
  const proofFile = location.state?.proofFile;

  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 2. State for current verification form
  const [formData, setFormData] = useState({
    name: "", 
    email: "", 
    phone_number: "", 
    year: "", 
    section: ""
  });
  
  const inputs = useRef([]);

  // Redirect if user tries to access this page directly without suggestion data
  useEffect(() => {
    if (!suggestionData) {
      alert("No suggestion data found. Returning to form.");
      navigate("/suggestions");
    }
  }, [suggestionData, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerifyRequest = async (e) => {
    e.preventDefault();
    
    // Manual validation check to prevent "All fields required" error
    const emptyFields = Object.values(formData).some(val => val.trim() === "");
    if (emptyFields) {
      alert("All fields are required");
      return;
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
      } else {
        alert("Failed to send OTP. Please check the email provided.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    if (e.target.value.length === 1 && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  // ✅ CHANGE 1: Handle backspace to clear current field and move focus back
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (inputs.current[index].value !== "") {
        // If current field has a value, just clear it
        inputs.current[index].value = "";
      } else if (index > 0) {
        // If current field is already empty, move to previous and clear it
        inputs.current[index - 1].focus();
        inputs.current[index - 1].value = "";
      }
    }
  };

  const handleSubmitOTP = async () => {
    const otpValue = inputs.current.map(input => input.value).join("");
    if (otpValue.length < 6) return alert("Enter full OTP");
    
    setLoading(true);
    try {
      // Step 1: Verify the OTP
      const verifyRes = await fetch("http://localhost:3000/api/verify-otp", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpValue }),
      });
      
      const verifyResult = await verifyRes.json();

      if (verifyRes.ok && verifyResult.verified) {
        // Step 2: Prepare Multipart Form Data
        const finalPayload = new FormData();
        
        // Append Suggestion Data (title, description, etc.)
        Object.keys(suggestionData).forEach(key => {
          finalPayload.append(key, suggestionData[key]);
        });

        // Append User Data (name, email, year, etc.)
        Object.keys(formData).forEach(key => {
          finalPayload.append(key, formData[key]);
        });

        // Append File
        if (proofFile) {
          finalPayload.append('proof', proofFile);
        }

        // Step 3: Final Submit to Database
        const saveRes = await fetch("http://localhost:3000/api/add-suggestion", {
          method: "POST",
          // NOTE: Do NOT set Content-Type header manually for FormData
          body: finalPayload, 
        });

        if (saveRes.ok) {
          alert("Success! Your suggestion has been recorded.");
          navigate("/"); 
        } else {
          const err = await saveRes.json();
          alert(`Database Error: ${err.message || "Submission failed"}`);
        }
      } else {
        alert(verifyResult.message || "Invalid or expired OTP");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CHANGE 2: Cancel handler to close OTP modal and clear OTP inputs
  const handleCancelOTP = () => {
    inputs.current.forEach(input => {
      if (input) input.value = "";
    });
    setShowOTP(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FA] flex items-center justify-center px-6 py-12 relative">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm p-10 border border-gray-100">
        <h2 className="text-2xl font-semibold text-[#023347] mb-8">Verification</h2>
        <form onSubmit={handleVerifyRequest}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Name</label>
              <input 
                name="name" 
                value={formData.name}
                required 
                onChange={handleChange} 
                className="w-full border border-[#CFE8EC] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#388E9C]" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Email</label>
              <input 
                name="email" 
                value={formData.email}
                type="email" 
                required 
                onChange={handleChange} 
                className="w-full border border-[#CFE8EC] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#388E9C]" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Mobile no.</label>
              <input 
                name="phone_number" 
                value={formData.phone_number}
                required 
                onChange={handleChange} 
                className="w-full border border-[#CFE8EC] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#388E9C]" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Year</label>
              <input 
                name="year" 
                value={formData.year}
                required 
                onChange={handleChange} 
                className="w-full border border-[#CFE8EC] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#388E9C]" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-2">Section</label>
              <input 
                name="section" 
                value={formData.section}
                required 
                onChange={handleChange} 
                className="w-full border border-[#CFE8EC] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#388E9C]" 
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="mt-10 w-full bg-[#023347] text-white py-3 rounded-lg font-semibold hover:bg-[#388E9C] transition-all shadow-md"
          >
            {loading ? "Processing..." : "Verify"}
          </button>
        </form>
      </div>

      {showOTP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative w-[500px] bg-white rounded-2xl border border-[#CDE4EC] shadow-xl flex flex-col items-center justify-center px-10 py-10">
            <h2 className="text-xl font-semibold text-[#1C2B33] mb-8">Enter OTP</h2>
            <div className="flex gap-4 mb-6">
              {[...Array(6)].map((_, index) => (
                <input 
                  key={index} 
                  maxLength="1" 
                  ref={(el) => (inputs.current[index] = el)} 
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="w-[50px] h-[50px] border border-[#3A9FBF] rounded-[10px] text-center text-xl outline-none focus:ring-2 focus:ring-[#3A9FBF]" 
                />
              ))}
            </div>
            {/* ✅ Submit Button */}
            <button 
              disabled={loading} 
              onClick={handleSubmitOTP} 
              className="w-full h-[50px] bg-[#0B1C3D] text-white rounded-lg text-sm hover:bg-[#142d63] transition-all mb-3"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            {/* ✅ CHANGE 2: Cancel Button */}
            <button 
              disabled={loading}
              onClick={handleCancelOTP} 
              className="w-full h-[50px] bg-white text-[#0B1C3D] border border-[#0B1C3D] rounded-lg text-sm hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}