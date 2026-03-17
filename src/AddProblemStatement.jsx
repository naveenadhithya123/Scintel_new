import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // ✅ FIXED

export default function AddProblemStatement() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    shortDescription: "",
    detailedDescription: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate(); // ✅ Already correct

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setSubmitted(true);

    setTimeout(() => {
      setForm({
        title: "",
        category: "",
        shortDescription: "",
        detailedDescription: "",
      });
      setSubmitted(false);

      navigate("/"); // ✅ ADDED (go back to Problem Statements page)
      
    }, 3000);
  };

return (
  <div className="min-h-screen bg-gray-200 flex justify-center pt-20">
    
    <div className="w-full max-w-4xl px-6">
      
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Add Problem Statement
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-10">
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            Problem Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-lg border border-teal-300 bg-gray-100 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-lg border border-teal-300 bg-gray-100 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            Short Description
          </label>
          <input
            type="text"
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-lg border border-teal-300 bg-gray-100 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
          />
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 mb-2">
            Detailed Description
          </label>
          <textarea
            name="detailedDescription"
            value={form.detailedDescription}
            onChange={handleChange}
            className="w-full h-40 px-4 py-3 rounded-lg border border-teal-300 bg-gray-100 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full h-12 bg-[#0f3a46] text-white rounded-lg hover:bg-[#144d5d] transition active:scale-95"
        >
          Submit
        </button>

        {submitted && (
          <p className="text-center text-teal-600 mt-4 font-medium">
            ✓ Submitted successfully!
          </p>
        )}
      </div>

    </div>
  </div>
);
}