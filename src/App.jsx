/*import React from "react";*/

/*import { useLocation, useNavigate } from "react-router-dom";*/

/*import Home from "./Home";
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

import Verification from "./Verification";
import VerificationMentor from "./VerificationMentor";
import ScrollToTop from "./ScrollToTop";
import kiotlogo from "./assets/kiot-logo.png";



/* ================= NAVBAR ================= */

/*function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  

  /*return (
<nav className="fixed top-0 left-0 w-full bg-white/60 backdrop-blur-md z-50 px-6 py-4">
  <div className="flex items-center justify-between max-w-full">      
      {/* Logo *//*}
     /* <div className="flex items-center gap-3">
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

      {/* Desktop Menu *//*}/*
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

      {/* Mobile Button *//*}/*
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
*/

/* ================= MAIN PAGE ================= */
/*

function MainPage() {
  return (
    <div>
      <Home />
      <UpcomingEvents />
  
      <Glories />
      
  
      <Contact />
    </div>
  );
}


/* ================= APP ================= */
/*
function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <div className="pt-20">
       <Routes>

  <Route path="/" element={<MainPage />} />

  {/* Main Navigation Pages *//*}/*
  <Route path="/activities" element={<ActPage />} />
  <Route path="/members" element={<AssociationMembers />} />
  <Route path="/problems" element={<ProblemStatements />} />
  <Route path="/suggestions" element={<Suggestions />} />

  {/* Pages used in footer / quick links *//*}/*
  <Route path="/contact" element={<Contact />} />
  <Route path="/glories" element={<Glories />} />
  <Route path="/upcoming-events" element={<UpcomingEvents />} />

  {/* Event Pages *//*}/*
  <Route path="/events" element={<Events />} />
  <Route path="/event-details" element={<EventDetails />} />
  <Route path="/event-register" element={<EventRegister />} />

  {/* Other Pages *//*}/*
  <Route path="/verification" element={<Verification />} />
  <Route path="/verification-mentor" element={<VerificationMentor />} />
  <Route path="/add-problem" element={<AddProblemStatement />} />
  <Route path="/cgpa-calculator" element={<CGPACalculator />} />

</Routes>
      </div>
    </>
  );
}

export default App;
*/
import React from "react";
import { Routes, Route } from "react-router-dom";

import Announcement from "./Announcement";
import AdminMembers from "./AdminMembers";
import AddBatch from "./AddBatch";
import EditBatch from "./EditBatch";
import AddMember from "./AddMember";
import GloriesAdmin from "./GloriesAdmin";
import SuggestionAdmin from "./SuggestionAdmin";
import EditMember from "./EditMember";
import ProblemAdmin from "./ProblemAdmin";
import ActivitiesAdmin from "./ActivitiesAdmin";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Announcement />} />

      <Route path="/admin/members" element={<AdminMembers />} />

      <Route path="/add-batch" element={<AddBatch />} />

      <Route path="/edit-batch" element={<EditBatch />} />

      <Route path="/add-member" element={<AddMember />} />
      <Route path="/edit-member" element={<EditMember />} />
      <Route path="/admin/problems" element={<ProblemAdmin />} />
      <Route path="/admin/activities" element={<ActivitiesAdmin />} />

      <Route path="/admin/glories" element={<GloriesAdmin />} />

      <Route path="/admin/suggestion" element={<SuggestionAdmin />} />

    </Routes>
  );
}

export default App;