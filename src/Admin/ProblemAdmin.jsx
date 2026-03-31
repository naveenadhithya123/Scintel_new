import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";

const TOAST_CSS = `
  @keyframes pb-toast-in {
    from { opacity: 0; transform: translateY(-16px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .pb-toast {
    position: fixed; top: 28px; right: 32px; z-index: 9999;
    display: flex; align-items: center; gap: 12px;
    background: #023347; color: #fff;
    padding: 14px 22px; border-radius: 12px;
    box-shadow: 0 8px 32px rgba(2,51,71,0.25);
    font-size: 14px; font-weight: 600;
    animation: pb-toast-in 0.3s ease forwards;
  }
  .pb-toast-icon {
    width: 26px; height: 26px; border-radius: 50%; background: #2A8E9E;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .pb-toast-close {
    background: none; border: none; color: #9bd3e0;
    cursor: pointer; font-size: 20px; line-height: 1; margin-left: 6px; padding: 0;
  }
  @keyframes pb-spin { to { transform: rotate(360deg); } }
  .pb-spinner {
    display: inline-block; width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff; border-radius: 50%;
    animation: pb-spin 0.7s linear infinite; flex-shrink: 0;
  }
`;

function ProblemToast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="pb-toast">
      <span className="pb-toast-icon">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      {message}
      <button className="pb-toast-close" onClick={onClose}>×</button>
    </div>
  );
}

const normalizeTeamMembers = (teamMembers) => {
  if (!teamMembers) return [];

  let parsed = teamMembers;

  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return [];
    }
  }

  if (Array.isArray(parsed)) return parsed;

  const candidates = [
    parsed?.members,
    parsed?.team_members,
    parsed?.students,
    parsed?.data,
  ];

  const matched = candidates.find(Array.isArray);
  if (matched) return matched;

  return [];
};

const readResponsePayload = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json().catch(() => ({}));
  }

  const text = await response.text().catch(() => "");
  return text ? { message: text } : {};
};

const ProblemAdmin = () => {
  const [activeTab, setActiveTab] = useState('Problems List');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // tracks which endpoint is loading
  const [toast, setToast] = useState(null);

  const showToast = (msg) => setToast(msg);

  const [problemData, setProblemData] = useState([]);
  const [requestData, setRequestData] = useState([]);
  const [lockRequestData, setLockRequestData] = useState([]);

  const tabs = ['Problems List', 'Problem Request', 'Lock Request'];

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  useEffect(() => {
    const handleResetView = (e) => {
      if (e.detail === '/admin/problems') {
        setSelectedProblem(null);
      }
    };
    window.addEventListener('reset-view', handleResetView);
    return () => window.removeEventListener('reset-view', handleResetView);
  }, []);

  const refreshData = () => {
    if (activeTab === 'Problems List') fetchProblems();
    if (activeTab === 'Problem Request') fetchProblemRequests();
    if (activeTab === 'Lock Request') fetchLockRequests();
  };

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/admin/current-problems");
      const result = await res.json();
      setProblemData(result.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchProblemRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/admin/problem-requests");
      const result = await res.json();
      setRequestData(result.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchLockRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/admin/problem-solver-requests");
      const result = await res.json();
      setLockRequestData(result.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleViewDetail = async (id, type) => {
    let url = "";
    if (type === 'problem') url = `http://localhost:3000/api/admin/current-problems/${id}`;
    if (type === 'request') url = `http://localhost:3000/api/admin/problem-requests/${id}`;
    if (type === 'lock') url = `http://localhost:3000/api/admin/problem-solver-requests/${id}`;

    try {
      setLoading(true);
      const res = await fetch(url);
      const result = await res.json();
      setSelectedProblem({ ...result.data, viewType: type });
    } catch (err) { showToast("Error fetching details. Please try again."); } finally { setLoading(false); }
  };

  const handleAction = async (endpoint, method, successMsg) => {
    try {
      setActionLoading(endpoint);
      const res = await fetch(`http://localhost:3000/api/admin/${endpoint}`, { method });
      const result = await readResponsePayload(res);
      if (res.ok) {
        showToast(successMsg);
        setSelectedProblem(null);
        refreshData();
      } else {
        showToast(result.message || "Action failed. Please try again.");
      }
    } catch (err) {
      showToast("Server error occurred. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveProblem = async (id) => {
    if (!window.confirm("Are you sure you want to remove this problem statement?")) return;

    const deleteEndpoints = [
      `http://localhost:3000/api/admin/current-problems/${id}`,
      `http://localhost:3000/api/admin/current-problem/${id}`,
    ];

    try {
      setLoading(true);

      let lastErrorMessage = "Unable to remove the problem.";

      for (const url of deleteEndpoints) {
        const response = await fetch(url, { method: "DELETE" });
        const result = await readResponsePayload(response);

        if (response.ok) {
          alert("Problem removed.");
          setSelectedProblem(null);
          refreshData();
          return;
        }

        lastErrorMessage = result.message || lastErrorMessage;
      }

      alert(lastErrorMessage);
    } catch (error) {
      console.error("Problem removal failed:", error);
      alert("Server error occurred while removing the problem.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (selectedProblem) {
      const type = selectedProblem.viewType;
      const id = type === 'problem' ? selectedProblem.problem_id : 
                 type === 'request' ? selectedProblem.problem_creation_request_id : 
                 selectedProblem.problem_solver_request_id;

      return (
        <div className="flex flex-col h-full overflow-y-auto p-4 md:p-6 no-scrollbar">
          <header className="mb-6 flex-shrink-0">
            <h2 className="text-xl md:text-2xl font-bold text-[#023347]">
              {type === 'problem' ? "Problem Detail" : type === 'request' ? "Creation Request" : "Solver Request"}
            </h2>
          </header>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 mb-6 flex-shrink-0">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-[#023347]">{selectedProblem.title}</h3>
              {selectedProblem.status && (
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${selectedProblem.status === 'In Progress' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                  {selectedProblem.status}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 mb-10 border-b pb-8 text-sm md:text-base">
              {selectedProblem.name && (
                <div className="flex items-center"><span className="font-bold text-[#023347] min-w-[120px]">Submitted By:</span><span className="text-gray-600">{selectedProblem.name}</span></div>
              )}
              {selectedProblem.category && (
                <div className="flex items-center"><span className="font-bold text-[#023347] min-w-[120px]">Category:</span><span className="text-gray-600">{selectedProblem.category}</span></div>
              )}
              {selectedProblem.email && (
                <div className="flex items-center"><span className="font-bold text-[#023347] min-w-[120px]">Email:</span><span className="text-gray-600">{selectedProblem.email}</span></div>
              )}
              {selectedProblem.phone_number && (
                <div className="flex items-center"><span className="font-bold text-[#023347] min-w-[120px]">Phone:</span><span className="text-gray-600">{selectedProblem.phone_number}</span></div>
              )}
              {selectedProblem.year && (
                <div className="flex items-center"><span className="font-bold text-[#023347] min-w-[120px]">Class:</span><span className="text-gray-600">Year {selectedProblem.year} - Sec {selectedProblem.section}</span></div>
              )}
              {selectedProblem.mentor && (
                <div className="flex items-center"><span className="font-bold text-[#023347] min-w-[120px]">Mentor:</span><span className="text-gray-600">{selectedProblem.mentor}</span></div>
              )}
              {selectedProblem.mentor_email && (
                <div className="flex items-center"><span className="font-bold text-[#023347] min-w-[120px]">Mentor Email:</span><span className="text-gray-600">{selectedProblem.mentor_email}</span></div>
              )}
            </div>

            <div>
              <h4 className="text-lg font-bold text-[#023347] mb-3">Detailed Description</h4>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                {selectedProblem.detailed_description}
              </p>
            </div>

            {type === 'lock' && (
              <div className="mt-10 space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-[#023347] mb-3">Lead Student</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
                    <div><span className="font-bold text-[#023347]">Name:</span> <span className="text-gray-600">{selectedProblem.name}</span></div>
                    <div><span className="font-bold text-[#023347]">Email:</span> <span className="text-gray-600">{selectedProblem.email}</span></div>
                    <div><span className="font-bold text-[#023347]">Phone:</span> <span className="text-gray-600">{selectedProblem.phone_number}</span></div>
                    <div><span className="font-bold text-[#023347]">Class:</span> <span className="text-gray-600">Year {selectedProblem.year} - Sec {selectedProblem.section}</span></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-[#023347] mb-3">Team Members</h4>
                  {normalizeTeamMembers(selectedProblem.team_members).length > 0 ? (
                    <div className="space-y-3">
                      {normalizeTeamMembers(selectedProblem.team_members).map((member, index) => (
                        <div key={`${member.email || "member"}-${index}`} className="rounded-xl border border-gray-100 p-4 bg-gray-50/80 text-sm">
                          <div className="font-semibold text-[#023347] mb-2">Member {index + 2}</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                            <div>Name: {member.name}</div>
                            <div>Email: {member.email}</div>
                            <div>Phone: {member.ph_no}</div>
                            <div>Class: Year {member.year} - Sec {member.section}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No additional team members were included in this request.</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* ── ONLY THESE BUTTONS CHANGED ── */}
          <div className="flex flex-wrap justify-end gap-4 pb-10 flex-shrink-0">

            {/* Back */}
            <button
              onClick={() => setSelectedProblem(null)}
              disabled={!!actionLoading}
              className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            {type === 'problem' && (
              <button
                onClick={() => handleAction(`current-problems/${id}`, 'DELETE', 'Problem removed successfully.')}
                disabled={!!actionLoading}
                className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-red-700 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                {actionLoading === `current-problems/${id}` && <span className="pb-spinner" />}
                {actionLoading === `current-problems/${id}` ? 'Removing...' : 'Remove Problem'}
              </button>
            )}

            {type === 'request' && (
              <>
                <button
                  onClick={() => handleAction(`problem-requests/${id}`, 'DELETE', 'Request denied.')}
                  disabled={!!actionLoading}
                  className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-red-700 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  {actionLoading === `problem-requests/${id}` && <span className="pb-spinner" />}
                  {actionLoading === `problem-requests/${id}` ? 'Denying...' : 'Deny'}
                </button>
                <button
                  onClick={() => handleAction(`problem-requests/accept/${id}`, 'POST', 'Added to list successfully.')}
                  disabled={!!actionLoading}
                  className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  {actionLoading === `problem-requests/accept/${id}` && <span className="pb-spinner" />}
                  {actionLoading === `problem-requests/accept/${id}` ? 'Adding...' : 'Add to List'}
                </button>
              </>
            )}

            {type === 'lock' && (
              <>
                <button
                  onClick={() => handleAction(`problem-solver-requests/deny/${id}`, 'DELETE', 'Solver declined.')}
                  disabled={!!actionLoading}
                  className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-red-700 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  {actionLoading === `problem-solver-requests/deny/${id}` && <span className="pb-spinner" />}
                  {actionLoading === `problem-solver-requests/deny/${id}` ? 'Denying...' : 'Deny Solver'}
                </button>
                <button
                  onClick={() => handleAction(`problem-solver-requests/accept/${id}`, 'POST', 'Solver approved successfully.')}
                  disabled={!!actionLoading}
                  className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  {actionLoading === `problem-solver-requests/accept/${id}` && <span className="pb-spinner" />}
                  {actionLoading === `problem-solver-requests/accept/${id}` ? 'Approving...' : 'Approve Solver'}
                </button>
              </>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-screen p-4 md:p-6">
        <header className="mb-6 flex-shrink-0">
          <h2 className="text-xl md:text-2xl font-bold text-[#023347] mb-4">Admin Dashboard</h2>
          <div className="flex space-x-4 md:space-x-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-xs md:text-sm font-semibold transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-[#023347]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2A8E9E]"></div>}
              </button>
            ))}
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-[#2A8E9E]/20 flex-1 overflow-hidden flex flex-col mb-6">
          <div className="overflow-auto flex-1 no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="sticky top-0 z-10 bg-[#2A8E9E]">
                <tr className="text-white">
                  <th className="px-6 py-4 font-semibold text-center">Problem Title</th>
                  <th className="px-6 py-4 font-semibold text-center">
                    {activeTab === 'Problems List' ? 'Status' : 'Submitted By'}
                  </th>
                  <th className="px-6 py-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="3" className="py-20 text-center text-gray-400">Syncing with database...</td></tr>
                ) : (
                  <>
                    {activeTab === 'Problems List' && problemData.map((row) => (
                      <tr key={row.problem_id} className="hover:bg-[#f4fafb] transition-colors duration-200">
                        <td className="px-6 py-5 text-[#023347] font-bold text-center">{row.title}</td>
                        <td className="px-6 py-5 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${row.status === 'In Progress' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button onClick={() => handleViewDetail(row.problem_id, 'problem')} className="bg-[#023347] text-white px-6 py-2 rounded-lg text-sm transition-colors duration-200 hover:bg-[#2A8E9E]">View Details</button>
                        </td>
                      </tr>
                    ))}
                    {activeTab === 'Problem Request' && requestData.map((row) => (
                     <tr key={row.problem_creation_request_id} className="hover:bg-[#f4fafb] transition-colors duration-200">
                        <td className="px-6 py-5 text-[#023347] font-bold text-center">{row.title}</td>
                        <td className="px-6 py-5 text-center text-gray-600 text-sm">{row.name}</td>
                        <td className="px-6 py-5 text-center">
                          <button onClick={() => handleViewDetail(row.problem_creation_request_id, 'request')} className="bg-[#023347] text-white px-6 py-2 rounded-lg text-sm transition-colors duration-200 hover:bg-[#2A8E9E]">Review Request</button>
                        </td>
                      </tr>
                    ))}
                    {activeTab === 'Lock Request' && lockRequestData.map((row) => (
                      <tr key={row.problem_solver_request_id} className="hover:bg-[#f4fafb] transition-colors duration-200">
                        <td className="px-6 py-5 text-[#023347] font-bold text-center">{row.title}</td>
                        <td className="px-6 py-5 text-center text-gray-600 text-sm">{row.name}</td>
                        <td className="px-6 py-5 text-center">
                          <button onClick={() => handleViewDetail(row.problem_solver_request_id, 'lock')} className="bg-[#023347] text-white px-6 py-2 rounded-lg text-sm transition-colors duration-200 hover:bg-[#2A8E9E]">Review Solver</button>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen overflow-hidden">
      <AdminSidebar>
        <style>{TOAST_CSS}</style>
        {toast && <ProblemToast message={toast} onClose={() => setToast(null)} />}
        {renderContent()}
      </AdminSidebar>
    </div>
  );
};

export default ProblemAdmin; 
