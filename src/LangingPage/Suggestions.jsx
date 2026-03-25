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

  useEffect(() => {
    document.body.style.backgroundColor = "#EEF4F4";
    document.body.style.margin = "0";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
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
    navigate("/SuggesstionVerification", {
      state: {
        suggestionData: { ...form },
        proofFile: proofFile
      }
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Poppins', sans-serif !important; }
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
        .sugg-input:focus { border-color: #1a7a8a !important; background-color: #fff !important; }
        .submit-btn:hover { background-color: #388E9C !important; }
        html, body, #root { background-color: #EEF4F4 !important; margin: 0; padding: 0; }
      `}</style>

      <div
        ref={sectionRef}
        id="suggestions"
        style={{
          minHeight: "100vh",
          backgroundColor: "#EEF4F4",
          fontFamily: "'Poppins', sans-serif",
          padding: "40px 48px 80px",
          boxSizing: "border-box",
          transition: "opacity 1000ms cubic-bezier(0.22,1,0.36,1), transform 1000ms cubic-bezier(0.22,1,0.36,1)",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(48px)",
        }}
      >
        {/* Heading */}
        <h2
          style={{
            color: "#023347",
            fontSize: "36px",
            fontWeight: 800,
            marginBottom: "32px",
            marginLeft: 175,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Suggestions
        </h2>

        {/* White card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "44px 52px 48px",
            width: "100%",
            maxWidth: "860px",
            marginLeft: "auto",
            marginRight: "auto",
            boxSizing: "border-box",
            boxShadow: "0 4px 24px rgba(0,0,0,0.09)",
          }}
        >
          {/* Title */}
          <label
            style={{
              display: "block",
              color: "#023347",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "8px",
              letterSpacing: "0.01em",
            }}
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter a brief title"
            className="sugg-input"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "8px",
              border: errors.title ? "1.5px solid #f87171" : "1.5px solid #2A8E9E",
              backgroundColor: "#F7F8FA",
              fontSize: "14px",
              color: "#111",
              outline: "none",
              marginBottom: errors.title ? "4px" : "28px",
              boxSizing: "border-box",
              fontFamily: "'Poppins', sans-serif",
              transition: "border-color 0.2s, background-color 0.2s",
            }}
          />
          {errors.title && (
            <p style={{ color: "#ef4444", fontSize: "12px", marginBottom: "20px", marginLeft: "2px" }}>
              {errors.title}
            </p>
          )}

          {/* Description */}
          <label
            style={{
              display: "block",
              color: "#023347",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "8px",
              letterSpacing: "0.01em",
            }}
          >
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={8}
            placeholder="Describe your suggestion or complaint in detail..."
            className="sugg-input gray-scrollbar"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "8px",
              border: errors.description ? "1.5px solid #f87171" : "1.5px solid #2A8E9E",
              backgroundColor: "#F7F8FA",
              fontSize: "14px",
              color: "#111",
              outline: "none",
              resize: "none",
              marginBottom: errors.description ? "4px" : "28px",
              boxSizing: "border-box",
              fontFamily: "'Poppins', sans-serif",
              lineHeight: "1.7",
              transition: "border-color 0.2s, background-color 0.2s",
            }}
          />
          {errors.description && (
            <p style={{ color: "#ef4444", fontSize: "12px", marginBottom: "20px", marginLeft: "2px" }}>
              {errors.description}
            </p>
          )}

          {/* Disclaimer */}
          <div
            style={{
              backgroundColor: "#fdf6e3",
              border: "1.5px solid #e8c96a",
              borderRadius: "10px",
              padding: "14px 20px 16px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  backgroundColor: "#e8a020",
                  color: "#ffffff",
                  borderRadius: "50%",
                  width: "19px",
                  height: "19px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                i
              </span>
              <span style={{ color: "#b07d10", fontSize: "13.5px", fontWeight: 700 }}>
                Disclaimer
              </span>
            </div>
            <p style={{ color: "#5a4a1a", fontSize: "13px", lineHeight: "1.7", margin: 0, textAlign: "center" }}>
              Suggestions are applicable only to Career Development activities
              and Guidances.
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className={`submit-btn${isShaking ? " animate-shake" : ""}`}
            style={{
              width: "100%",
              backgroundColor: isShaking ? "#ef4444" : "#023347",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 700,
              padding: "15px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.03em",
              transition: "background 0.2s",
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default Suggestions;