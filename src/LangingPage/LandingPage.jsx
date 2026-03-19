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
import AddProblemStatement from "../Admin/AddProblemStatement";
import CGPACalculator from "./CGPACalculator";
import Events from "./Events";
import EventDetails from "./EventDetails";
import EventRegister from "./EventRegister";

import Verification from "./Verification";
import VerificationMentor from "./VerificationMentor";
import ScrollToTop from "./ScrollToTop";
import kiotlogo from "./kiot-logo.png";
import ExecutiveMember from "./ExecutiveMembers";
import Activities from "./Events";

function Navbar() {
const location = useLocation();
const navigate = useNavigate();
const [menuOpen, setMenuOpen] = useState(false);

    return (
    <nav className="fixed top-0 left-0 w-full bg-white/60 backdrop-blur-md z-50 px-6 py-4">
    <div className="flex items-center justify-between max-w-full">      

    <div className="flex items-center gap-3">
    <img
    src={kiotlogo}
    alt="KIOT Logo"
    className="w-10 h-10 object-contain"
    />

    <div className="w-10 h-10 bg-[#023347] rounded-lg flex items-center justify-center shadow-md">
    <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    >
    <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M13 10V3L4 14h7v7l9-11h-7z"
    />
    </svg>
    </div>

    <span className="font-extrabold text-xl tracking-tight text-black">
    Scintel
    </span>
    </div>


    <ul className="hidden md:flex items-center gap-10 text-sm font-bold text-black mr-27">

    <li>
    <button onClick={() => navigate("/")}>
    Home
    </button>
    </li>

    <li>
    <button onClick={() => navigate("/activities")}>
    Activities
    </button>
    </li>

    <li>
    <button onClick={() => navigate("/members")}>
    Members
    </button>
    </li>

    <li>
    <button onClick={() => navigate("/problems")}>
    Problems
    </button>
    </li>

    <li>
    <button onClick={() => navigate("/suggestions")}>
    Suggestions
    </button>
    </li>

    </ul>

    <button
    className="md:hidden text-black"
    onClick={() => setMenuOpen(!menuOpen)}
    >
    <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-7 h-7"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    >
    <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d={
    menuOpen
    ? "M6 18L18 6M6 6l12 12"
    : "M4 6h16M4 12h16M4 18h16"
    }
    />
    </svg>
    </button>
    </div>
    </nav>
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


<Route path="/verification" element={<Verification />} />
<Route path="/verification-mentor" element={<VerificationMentor />} />
<Route path="/add-problem" element={<AddProblemStatement />} />
<Route path="/problem-details/:id" element={<CGPACalculator />} />

<Route path="/activities/batch/:batch" element={<Activities />} />

</Routes>
</div>
</>
);
}

export default LandingPage;
