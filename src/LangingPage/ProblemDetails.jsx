import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const YEAR_OPTIONS = ["I", "II", "III", "IV"];

const createEmptyMember = () => ({
  name: "",
  email: "",
  ph_no: "",
  year: "",
  section: "",
});

const leadFieldConfig = [
  { label: "Lead Student Name", name: "name", type: "text" },
  { label: "Lead Student Email", name: "email", type: "email" },
  { label: "Lead Student Phone", name: "phone_number", type: "text" },
  { label: "Year", name: "year", type: "select", options: YEAR_OPTIONS },
  { label: "Section", name: "section", type: "text" },
  { label: "Mentor Name", name: "mentor", type: "text" },
  { label: "Mentor Email", name: "mentor_email", type: "email", full: true },
];

export default function ProblemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [showLockForm, setShowLockForm] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [submissionState, setSubmissionState] = useState(null);
  const [pendingPayload, setPendingPayload] = useState(null);
  const otpInputs = useRef([]);
  const [solverForm, setSolverForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    year: "",
    section: "",
    mentor: "",
    mentor_email: "",
    team_members: Array.from({ length: 5 }, createEmptyMember),
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/current-problem/${id}`);
        const data = await response.json();
        setProblem(response.ok ? data : null);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching detail:", error);
        setProblem(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [loading]);

  const titleParts = useMemo(() => {
    const words = problem?.title?.trim()?.split(/\s+/) || [];

    if (words.length <= 1) {
      return {
        primary: problem?.title || "Problem Statement",
        accent: "",
      };
    }

    return {
      primary: words.slice(0, -1).join(" "),
      accent: words[words.length - 1],
    };
  }, [problem?.title]);

  const handleLeadFieldChange = (event) => {
    const { name, value } = event.target;
    setSolverForm((current) => ({ ...current, [name]: value }));
  };

  const handleTeamMemberChange = (index, field, value) => {
    setSolverForm((current) => {
      const nextMembers = [...current.team_members];
      nextMembers[index] = { ...nextMembers[index], [field]: value };
      return { ...current, team_members: nextMembers };
    });
  };

  const handleSolverSubmit = async (event) => {
    event.preventDefault();
    setSubmissionState(null);

    const sanitizedMembers = solverForm.team_members
      .map((member) => ({
        name: member.name.trim(),
        email: member.email.trim(),
        ph_no: member.ph_no.trim(),
        year: member.year.trim(),
        section: member.section.trim(),
      }))
      .filter((member) => Object.values(member).some(Boolean));

    const hasPartialMember = sanitizedMembers.some((member) =>
      Object.values(member).some((value) => !value)
    );

    if (hasPartialMember) {
      setSubmissionState({
        type: "error",
        message: "Each optional member row must be fully completed or left blank.",
      });
      return;
    }

    const requestPayload = {
      problem_id: id,
      name: solverForm.name.trim(),
      email: solverForm.email.trim(),
      phone_number: solverForm.phone_number.trim(),
      year: solverForm.year.trim(),
      section: solverForm.section.trim(),
      mentor: solverForm.mentor.trim(),
      mentor_email: solverForm.mentor_email.trim(),
      team_members: sanitizedMembers,
    };

    try {
      setSubmitting(true);

      const response = await fetch("http://localhost:3000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: requestPayload.email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmissionState({
          type: "error",
          message: result.message || "Unable to send OTP to the lead student right now.",
        });
        return;
      }

      setSubmissionState({
        type: "success",
        message: "OTP sent to the lead student. Verify it to complete the lock request.",
      });
      setPendingPayload(requestPayload);
      setShowOtpModal(true);
    } catch (error) {
      console.error("Solver request submission failed:", error);
      setSubmissionState({
        type: "error",
        message: "Unable to send OTP to the lead student right now.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpChange = (event, index) => {
    if (event.target.value.length === 1 && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (event, index) => {
    if (event.key === "Backspace") {
      if (otpInputs.current[index]?.value) {
        otpInputs.current[index].value = "";
      } else if (index > 0) {
        otpInputs.current[index - 1].value = "";
        otpInputs.current[index - 1]?.focus();
      }
    }
  };

  const resetOtpFlow = () => {
    otpInputs.current.forEach((input) => {
      if (input) input.value = "";
    });
    setShowOtpModal(false);
    setPendingPayload(null);
  };

  const handleOtpVerification = async () => {
    if (!pendingPayload) return;

    const otp = otpInputs.current.map((input) => input?.value || "").join("");

    try {
      setOtpLoading(true);

      const verifyResponse = await fetch("http://localhost:3000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingPayload.email,
          otp,
        }),
      });

      const verifyResult = await verifyResponse.json();

      if (!verifyResult.verified) {
        setSubmissionState({
          type: "error",
          message: verifyResult.message || "Invalid OTP. Please try again.",
        });
        return;
      }

      const submitResponse = await fetch("http://localhost:3000/api/add-problem-solver-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingPayload),
      });

      const submitResult = await submitResponse.json();

      if (!submitResponse.ok) {
        setSubmissionState({
          type: "error",
          message: submitResult.message || "Unable to submit the lock request right now.",
        });
        return;
      }

      setSubmissionState({
        type: "success",
        message: "Lock request submitted successfully. The admin will review the mentor and student details.",
      });
      setShowLockForm(false);
      resetOtpFlow();
      setSolverForm({
        name: "",
        email: "",
        phone_number: "",
        year: "",
        section: "",
        mentor: "",
        mentor_email: "",
        team_members: Array.from({ length: 5 }, createEmptyMember),
      });
    } catch (error) {
      console.error("OTP verification or request submission failed:", error);
      setSubmissionState({
        type: "error",
        message: "Unable to complete OTP verification right now.",
      });
    } finally {
      setOtpLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] py-16 px-6 flex flex-col items-center">
        <div className="w-full max-w-[1500px] animate-pulse">
          <div className="h-10 w-1/3 bg-[#023347]/10 rounded-xl mb-12" />
          <div className="relative h-[600px] bg-white/[0.03] border border-black/5 rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center font-serif text-2xl text-[#023347]">
        Statement not located in archives.
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen bg-[#FDFCFB] text-[#023347] font-sans selection:bg-[#D4AF37]/20 overflow-x-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

      <main className="max-w-[1500px] mx-auto px-6 md:px-12 py-16 relative z-10">
        <header className="mb-16 border-b border-[#023347]/5 pb-10 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="overflow-visible">
            <span className={`text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] mb-4 block transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
              Case Analysis #{id}
            </span>
            <h1 className={`font-serif text-4xl md:text-5xl font-semibold leading-tight transition-all duration-[1200ms] ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}>
              {titleParts.primary}
              {titleParts.accent ? (
                <>
                  {" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37]">
                    {titleParts.accent}
                  </span>
                </>
              ) : null}
            </h1>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 bg-white border border-[#023347]/10 text-[#023347] px-8 py-3.5 rounded-2xl text-[10px] font-bold tracking-[0.2em] uppercase transition-all hover:bg-gray-50 active:scale-95 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" />
            </svg>
            Back to archives
          </button>
        </header>

        <div className={`group relative bg-white/[0.02] backdrop-blur-[4px] border border-black/5 rounded-[2rem] p-8 md:p-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="absolute left-0 top-12 w-1.5 h-24 bg-[#023347] rounded-r-full group-hover:bg-[#D4AF37] transition-all duration-500" />

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-12">
            <div className="max-w-5xl">
              <header className="mb-10 flex items-center gap-4">
                <div className="w-10 h-10 border border-[#023347]/10 flex items-center justify-center rounded-2xl text-lg font-serif italic bg-white/5 text-[#D4AF37]">P</div>
                <h2 className="text-[11px] font-black text-[#D4AF37] tracking-[0.3em] uppercase">
                  Detailed Narrative
                </h2>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <div className="rounded-2xl border border-[#023347]/10 bg-white/60 p-5">
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#023347]/45 mb-2">Category</p>
                  <p className="text-sm font-semibold text-[#023347]">{problem.category || "Not specified"}</p>
                </div>
                <div className="rounded-2xl border border-[#023347]/10 bg-white/60 p-5">
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#023347]/45 mb-2">Status</p>
                  <p className="text-sm font-semibold text-[#023347]">{problem.status || "Open to Build"}</p>
                </div>
                <div className="rounded-2xl border border-[#023347]/10 bg-white/60 p-5">
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#023347]/45 mb-2">Summary</p>
                  <p className="text-sm font-semibold text-[#023347]/80">{problem.short_description || "No summary provided."}</p>
                </div>
              </div>

              <div className="font-sans text-[#023347]/80 text-lg leading-[1.8] space-y-6">
                <p className="whitespace-pre-line">{problem.detailed_description}</p>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-[#023347]/10 bg-white/70 p-8 h-fit shadow-xl shadow-[#023347]/5">
              <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#D4AF37] mb-4">Solver Access</p>
              <h3 className="text-2xl font-semibold text-[#023347] mb-3">Lock This Statement</h3>
              <p className="text-sm leading-7 text-[#023347]/65 mb-8">
                Submit the mentor details and student team information to request ownership of this problem statement.
              </p>
              <button
                onClick={() => setShowLockForm((current) => !current)}
                className="w-full bg-[#023347] text-white px-8 py-4 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/20 active:scale-95"
              >
                {showLockForm ? "Close Form" : "Lock Statement"}
              </button>
            </aside>
          </div>
        </div>

        {submissionState ? (
          <div className={`mt-8 rounded-[1.5rem] border px-6 py-4 text-sm font-medium ${submissionState.type === "success" ? "border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#7C5A05]" : "border-red-200 bg-red-50 text-red-700"}`}>
            {submissionState.message}
          </div>
        ) : null}

        {showLockForm ? (
          <section className={`mt-10 rounded-[2rem] border border-[#023347]/10 bg-white/75 backdrop-blur-[8px] p-8 md:p-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[#023347]/8 pb-8 mb-10">
              <div>
                <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#D4AF37] mb-3">Team Registration</p>
                <h2 className="text-3xl md:text-4xl font-semibold text-[#023347]">Mentor and Student Details</h2>
                <p className="text-sm text-[#023347]/65 mt-3 max-w-3xl">
                  One lead student is required. You can add up to five more teammates, for a total of six student members.
                </p>
              </div>
              <div className="rounded-2xl border border-[#023347]/10 px-5 py-4 bg-[#FDFCFB]">
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#023347]/40">Capacity</p>
                <p className="text-sm font-semibold text-[#023347] mt-2">1 required lead + 5 optional members</p>
              </div>
            </div>

            <form onSubmit={handleSolverSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {leadFieldConfig.map((field) => (
                  <div key={field.name} className={field.full ? "md:col-span-2" : ""}>
                    <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#023347]/45 mb-3 block">
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        required
                        value={solverForm[field.name]}
                        onChange={handleLeadFieldChange}
                        className="w-full rounded-2xl border border-[#023347]/10 bg-white px-5 py-4 text-sm text-[#023347] outline-none transition-colors focus:border-[#D4AF37]"
                      >
                        <option value="">Select year</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        name={field.name}
                        type={field.type}
                        required
                        value={solverForm[field.name]}
                        onChange={handleLeadFieldChange}
                        className="w-full rounded-2xl border border-[#023347]/10 bg-white px-5 py-4 text-sm text-[#023347] outline-none transition-colors focus:border-[#D4AF37]"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#D4AF37] mb-2">Optional Members</p>
                    <h3 className="text-2xl font-semibold text-[#023347]">Additional Student Team</h3>
                  </div>
                  <span className="text-xs font-semibold text-[#023347]/50">Up to 5 more students</span>
                </div>

                <div className="space-y-6">
                  {solverForm.team_members.map((member, index) => (
                    <div key={index} className="rounded-[1.75rem] border border-[#023347]/10 bg-[#FDFCFB] p-6">
                      <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#023347]/40 mb-5">
                        Member {index + 2}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                        <input
                          type="text"
                          value={member.name}
                          onChange={(event) => handleTeamMemberChange(index, "name", event.target.value)}
                          placeholder="Name"
                          className="rounded-2xl border border-[#023347]/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#D4AF37]"
                        />
                        <input
                          type="email"
                          value={member.email}
                          onChange={(event) => handleTeamMemberChange(index, "email", event.target.value)}
                          placeholder="Email"
                          className="rounded-2xl border border-[#023347]/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#D4AF37]"
                        />
                        <input
                          type="text"
                          value={member.ph_no}
                          onChange={(event) => handleTeamMemberChange(index, "ph_no", event.target.value)}
                          placeholder="Phone"
                          className="rounded-2xl border border-[#023347]/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#D4AF37]"
                        />
                        <select
                          value={member.year}
                          onChange={(event) => handleTeamMemberChange(index, "year", event.target.value)}
                          className="rounded-2xl border border-[#023347]/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#D4AF37]"
                        >
                          <option value="">Year</option>
                          {YEAR_OPTIONS.map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={member.section}
                          onChange={(event) => handleTeamMemberChange(index, "section", event.target.value)}
                          placeholder="Section"
                          className="rounded-2xl border border-[#023347]/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLockForm(false)}
                  className="px-8 py-4 rounded-2xl border border-[#023347]/10 text-[#023347] text-[11px] font-bold tracking-[0.2em] uppercase transition-all hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#023347] text-white px-10 py-4 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/20 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Lock Request"}
                </button>
              </div>
            </form>
          </section>
        ) : null}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;600;700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }

        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>

      {showOtpModal ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#023347]/40 backdrop-blur-md" onClick={resetOtpFlow} />
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-12 shadow-2xl border border-white/20">
            <div className="text-center mb-10">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#D4AF37]">Lead Verification</span>
              <h2 className="font-serif text-3xl text-[#023347] mt-2">Enter OTP</h2>
              <p className="text-xs text-gray-400 mt-2 font-sans italic">The OTP was sent to the lead student email.</p>
            </div>
            <div className="flex justify-between gap-3 mb-10">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  maxLength="1"
                  ref={(element) => {
                    otpInputs.current[index] = element;
                  }}
                  onChange={(event) => handleOtpChange(event, index)}
                  onKeyDown={(event) => handleOtpKeyDown(event, index)}
                  className="w-12 h-14 border border-[#023347]/10 rounded-xl text-center text-xl font-bold bg-gray-50/50 outline-none focus:border-[#D4AF37] transition-all"
                />
              ))}
            </div>
            <div className="space-y-4">
              <button
                onClick={handleOtpVerification}
                disabled={otpLoading}
                className="w-full bg-[#023347] text-white py-4 rounded-xl text-[11px] font-bold tracking-widest uppercase hover:bg-[#D4AF37] transition-all disabled:opacity-50"
              >
                {otpLoading ? "Verifying..." : "Confirm OTP"}
              </button>
              <button
                onClick={resetOtpFlow}
                className="w-full bg-transparent text-[#023347]/40 py-2 text-[10px] font-bold tracking-widest uppercase hover:text-[#023347] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
