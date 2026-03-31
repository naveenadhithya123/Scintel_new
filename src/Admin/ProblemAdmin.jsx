import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";

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

  const [problemData, setProblemData] = useState([]);
  const [requestData, setRequestData] = useState([]);
  const [lockRequestData, setLockRequestData] = useState([]);

  const tabs = ['Problems List', 'Problem Request', 'Lock Request'];

  useEffect(() => {
    refreshData();
  }, [activeTab]);

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
    } catch (err) { alert("Error fetching details"); } finally { setLoading(false); }
  };

  const handleAction = async (endpoint, method, successMsg) => {
    if (!window.confirm("Are you sure you want to proceed with this action?")) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/admin/${endpoint}`, { method });
      const result = await readResponsePayload(res);
      if (res.ok) {
        alert(successMsg);
        setSelectedProblem(null);
        refreshData();
      } else {
        alert(result.message || "Action failed");
      }
    } catch (err) {
      alert("Server error occurred");
    } finally {
      setLoading(false);
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

            {/* Back — Edit style: hover teal */}
            <button
              onClick={() => setSelectedProblem(null)}
              className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
            >
              Back
            </button>

            {type === 'problem' && (
              /* Remove Problem — Delete style: hover red */
              <button
                onClick={() => handleRemoveProblem(id)}
                className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-red-700 transition-all transform hover:-translate-y-0.5"
              >
                Remove Problem
              </button>
            )}

            {type === 'request' && (
              <>
                {/* Deny — Delete style */}
                <button
                  onClick={() => handleAction(`problem-requests/${id}`, 'DELETE', 'Denied.')}
                  className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-red-700 transition-all transform hover:-translate-y-0.5"
                >
                  Deny
                </button>
                {/* Add to List — Edit style */}
                <button
                  onClick={() => handleAction(`problem-requests/accept/${id}`, 'POST', 'Added to list.')}
                  className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
                >
                  Add to List
                </button>
              </>
            )}

            {type === 'lock' && (
              <>
                {/* Deny Solver — Delete style */}
                <button
                  onClick={() => handleAction(`problem-solver-requests/deny/${id}`, 'DELETE', 'Solver declined.')}
                  className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-red-700 transition-all transform hover:-translate-y-0.5"
                >
                  Deny Solver
                </button>
                {/* Approve Solver — Edit style */}
                <button
                  onClick={() => handleAction(`problem-solver-requests/accept/${id}`, 'POST', 'Solver approved.')}
                  className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
                >
                  Approve Solver
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
        {renderContent()}
      </AdminSidebar>
    </div>
  );
};

export default ProblemAdmin; 
