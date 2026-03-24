import React from "react";

import { useState } from "react";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";

import Home from "./Home";
import UpcomingEvents from "./UpcomingEvents";
import AssociationMembers from "./AssociationMembers";
import Glories from "./Glories";
import ProblemStatements from "./ProblemStatements";
import Suggestions from "./Suggestions";
import Contact from "./Contact";
import ActPage from "./ActPage";
import AddProblemStatement from "./AddProblemStatement";
import CGPACalculator from "./CGPACalculator";
import Events from "./Events";
import EventDetails from "./EventDetails";
import EventRegister from "./EventRegister";

import ProblemStatementVerification from "./ProblemStatementVerification";
import VerificationMentor from "./VerificationMentor";
import ScrollToTop from "./ScrollToTop";
import kiotlogo from "./kiot-logo.png";
import ExecutiveMember from "./ExecutiveMembers";
import Activities from "./Events";
import SuggesstionVerification from "./SuggesstionVerification";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Activities", path: "/activities" },
    { label: "Members", path: "/members" },
    { label: "Problems", path: "/problems" },
    { label: "Suggestions", path: "/suggestions" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white/60 backdrop-blur-md z-50 px-6 py-4">
        <div className="flex items-center justify-between max-w-full">

          {/* LOGO */}
          <div className="flex items-center gap-3">
            <img src={kiotlogo} alt="KIOT Logo" className="w-10 h-10 object-contain" />
            <div className="w-10 h-10 bg-[#023347] rounded-lg flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-black">Scintel</span>
          </div>

          {/* DESKTOP NAV */}
          <ul className="hidden md:flex items-center gap-10 text-sm font-bold text-black mr-27">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.label} className="relative group">
                  <button
                    onClick={() => navigate(item.path)}
                    className={`relative pb-1 transition-colors duration-300
                      ${isActive ? "text-[#388E9C]" : "text-black hover:text-[#388E9C]"}
                    `}
                  >
                    {item.label}
                    <span className={`absolute left-0 -bottom-0.5 h-0.5 bg-[#388E9C] rounded-full
                      transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                      ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                    />
                  </button>
                  {isActive && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#388E9C] rounded-full" />
                  )}
                </li>
              );
            })}
          </ul>

          {/* MOBILE HAMBURGER */}
          <button className="md:hidden text-black" onClick={() => setMenuOpen(!menuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN — outside <nav> so it's never clipped */}
      <div className={`fixed top-[72px] left-0 w-full bg-white/95 backdrop-blur-md z-40 border-t border-gray-100 shadow-lg md:hidden
        transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${menuOpen ? "max-h-96 opacity-100 pointer-events-auto" : "max-h-0 opacity-0 pointer-events-none overflow-hidden"}
      `}>
        <ul className="flex flex-col px-6 py-4 gap-1">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li
                key={item.label}
                style={{ transitionDelay: menuOpen ? `${index * 50}ms` : "0ms" }}
                className={`transform transition-all duration-300
                  ${menuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}
                `}
              >
                <button
                  onClick={() => { navigate(item.path); setMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300
                    flex items-center justify-between
                    ${isActive ? "text-[#388E9C] bg-[#023347]/5" : "text-black hover:bg-[#F5F9FA] hover:text-[#388E9C]"}
                  `}
                >
                  {item.label}
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#388E9C]" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}


function MainPage() {
return (
<div>
<Home />
<ExecutiveMember />
<UpcomingEvents />
<Glories />
<Contact />
</div>
);
}


function LandingPage() {
return (
<>
<ScrollToTop />
<Navbar />

<div className="pt-20">
<Routes>

<Route path="/" element={<MainPage />} />


<Route path="/activities" element={<ActPage />} />
<Route path="/members" element={<AssociationMembers />} />
<Route path="/problems" element={<ProblemStatements />} />
<Route path="/suggestions" element={<Suggestions />} />


<Route path="/contact" element={<Contact />} />
<Route path="/glories" element={<Glories />} />
<Route path="/upcoming-events" element={<UpcomingEvents />} />
<Route path="/Executive-members" element={<ExecutiveMember />} />


<Route path="/events" element={<Events />} />
<Route path="/activities/event/:id" element={<EventDetails />} />
<Route path="/event-register/:id" element={<EventRegister />} />


<Route path="/ProblemStatementVerification" element={<ProblemStatementVerification/>} />
<Route path="/verification-mentor" element={<VerificationMentor />} />
<Route path="/add-problem" element={<AddProblemStatement />} />
<Route path="/problem-details/:id" element={<CGPACalculator />} />
<Route path="/SuggesstionVerification" element={<SuggesstionVerification />} />

<Route path="/activities/batch/:batch" element={<Activities />} />

</Routes>
</div>
</>
);
}

export default LandingPage;
