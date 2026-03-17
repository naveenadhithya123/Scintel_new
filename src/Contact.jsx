import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const contacts = [
  {
    id: 1,
    name: "Name",
    designation: "Designation",
    phone: "Phone Number",
    email: "Email",
    image: null,
  },
  {
    id: 2,
    name: "Name",
    designation: "Designation",
    phone: "Phone Number",
    email: "Email",
    image: null,
  },
];

const quickLinks = [
  { label: "Upcoming Events", type: "scroll", id: "events" },
  { label: "Activities", type: "page", path: "/activities" },
  { label: "Members", type: "page", path: "/members" },
  { label: "Glories", type: "scroll", id: "glories" },
  { label: "Problems", type: "page", path: "/problems" },
  { label: "Suggestions", type: "page", path: "/suggestions" },
  { label: "Contact", type: "scroll", id: "contact" }
];

export default function Contact() {

  const navigate = useNavigate();   // ✅ FIXED

  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

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

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <style>{`
        .gray-scrollbar::-webkit-scrollbar { width: 6px; }
        .gray-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .gray-scrollbar::-webkit-scrollbar-thumb { background: #9ca3af !important; border-radius: 10px; }
        .gray-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280 !important; }
      `}</style>

      <div
        ref={sectionRef}
        id="contact"
        className="min-h-screen bg-[#F5F9FA] flex flex-col font-sans pt-12 perspective-[1000px] relative z-40"
      >
        {/* CONTACT SECTION */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex-1">

          {/* Header */}
          <div className="pb-8 overflow-hidden">
            <h1
              className={`text-[40px] font-extrabold text-[#023347] mb-6 w-fit tracking-tight transform transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isVisible
                  ? "translate-y-0 opacity-100 blur-0"
                  : "translate-y-20 opacity-0 blur-sm"
              }`}
            >
              Contact
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-20">
            {contacts.map((person, index) => (
              <div
                key={person.id}
                className={`group bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-7 flex flex-col items-center max-w-[420px] w-full mx-auto
                ${
                  isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-12 scale-95"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >

                {/* Avatar */}
                <div className="w-40 h-40 md:w-48 md:h-48 bg-[#F5F9FA] rounded-full mb-6 flex items-center justify-center overflow-hidden shadow-inner border-4 border-white ring-1 ring-gray-100 group-hover:ring-[#388E9C]/30 transition-all duration-500">
                  {person.image ? (
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-full object-cover rounded-full transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <svg
                      className="w-20 h-20 text-gray-300 group-hover:text-[#388E9C] transition-colors duration-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-[#023347] mb-2 group-hover:text-[#388E9C] transition-colors duration-300">
                  {person.name}
                </h2>

                <p className="text-sm font-medium text-[#3C3E40] opacity-70 mb-8 uppercase tracking-wide">
                  {person.designation}
                </p>

                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>

                <div className="w-full space-y-5 px-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-[#3C3E40]">
                      {person.phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-[#3C3E40]">
                      {person.email}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="bg-[#023347] text-white mt-auto relative z-10 overflow-hidden">

          <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-white/20 rounded-xl flex items-center justify-center text-sm font-bold bg-white/5 backdrop-blur-sm">
                  S
                </div>
                <span className="text-2xl font-extrabold tracking-tight">
                  Scintel
                </span>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                The mountain peak touches the golden sunrise. Cold wind brushes
                against your face. Clouds drift lazily below your feet.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white/90">
                Quick links
              </h3>

              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    {link.type === "page" ? (
                      <button onClick={() => navigate(link.path)}>
                        {link.label}
                      </button>
                    ) : (
                      <button onClick={() => scrollToSection(link.id)}>
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white/90">
                Contact us
              </h3>

              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-all duration-300">
                    LinkedIn
                  </a>
                </li>

                <li>
                  <a href="mailto:example@mail.com" className="text-gray-400 hover:text-white transition-all duration-300">
                    Mail
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/10 py-6 text-center">
            <p className="text-xs text-gray-500">
              © 2026 Scintel. All rights reserved.
            </p>
          </div>

        </footer>
      </div>
    </>
  );
}