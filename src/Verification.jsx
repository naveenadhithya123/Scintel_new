import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Verification() {
  const [showOTP, setShowOTP] = useState(false);
  const navigate = useNavigate();
  const inputs = useRef([]);

  const handleVerify = (e) => {
    e.preventDefault();
    setShowOTP(true); // Show OTP modal
  };

  const handleChange = (e, index) => {
    if (e.target.value.length === 1 && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleSubmitOTP = () => {
    navigate("/add-problem");
  };

  return (
    <div className="min-h-screen bg-[#F5F9FA] flex items-center justify-center px-6 py-12 relative">

      {/* Verification Form Card */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm p-10 border border-gray-100">
        <h2 className="text-2xl font-semibold text-[#023347] mb-8">
          Verification
        </h2>

        <form onSubmit={handleVerify}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div>
              <label className="block text-sm text-gray-600 mb-2">Name</label>
              <input className="w-full border border-[#CFE8EC] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#388E9C]" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Email</label>
              <input className="w-full border border-[#CFE8EC] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#388E9C]" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Mobile no.</label>
              <input className="w-full border border-[#CFE8EC] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#388E9C]" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Year</label>
              <input className="w-full border border-[#CFE8EC] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#388E9C]" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-2">Section</label>
              <input className="w-full border border-[#CFE8EC] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#388E9C]" />
            </div>
          </div>

          <div className="mt-10">
            <button
              type="submit"
              className="w-full bg-[#023347] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#388E9C] transition-all shadow-md"
            >
              Verify
            </button>
          </div>
        </form>
      </div>

      {/* OTP MODAL */}
      {showOTP && (
        <div className="absolute inset-0 flex items-center justify-center">

          {/* Blur background */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>

          {/* OTP Card */}
          <div className="relative w-[500px] h-[360px] bg-white rounded-2xl border border-[#CDE4EC] shadow-xl flex flex-col items-center justify-center px-10">

            <h2 className="text-xl font-semibold text-[#1C2B33] mb-8">
              Enter OTP
            </h2>

            <div className="flex gap-4 mb-10">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  maxLength="1"
                  ref={(el) => (inputs.current[index] = el)}
                  onChange={(e) => handleChange(e, index)}
                  className="w-[50px] h-[50px] border border-[#3A9FBF] rounded-[10px] text-center text-xl outline-none focus:ring-2 focus:ring-[#3A9FBF]"
                />
              ))}
            </div>

            <button
              onClick={handleSubmitOTP}
              className="w-[440px] h-[50px] bg-[#0B1C3D] text-white rounded-lg text-sm hover:bg-[#142d63] transition-all"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}