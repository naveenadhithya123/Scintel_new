import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";

const API_BASE = "http://localhost:3000/api";

export default function SuggestionAdmin() {
  const [view, setView] = useState("list"); // "list" | "detail" | "history"
  const [dashboardTab, setDashboardTab] = useState("unacknowledged"); // "unacknowledged" | "acknowledged"
  const [historyTab, setHistoryTab] = useState("rejected"); // "rejected" | "resolved"
  const [prevView, setPrevView] = useState("list");

  const [suggestionList, setSuggestionList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Rejection Modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState("");

  // 1. Fetch Data
  useEffect(() => {
    if (view === "list") {
      fetchDashboardSuggestions();
    } else if (view === "history") {
      fetchHistorySuggestions();
    }
  }, [view, dashboardTab, historyTab]);

  const fetchDashboardSuggestions = async () => {
    setLoading(true);
    try {
      const endpoint = dashboardTab === "unacknowledged" 
        ? "/admin/suggestions/unacknowledged" 
        : "/admin/suggestions/acknowledged";
      const response = await fetch(`${API_BASE}${endpoint}`);
      const result = await response.json();
      setSuggestionList(result.data || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistorySuggestions = async () => {
    setLoading(true);
    try {
      const endpoint = historyTab === "rejected" 
        ? "/admin/suggestion-records/unresolved" 
        : "/admin/suggestion-records/resolved";
      const response = await fetch(`${API_BASE}${endpoint}`);
      const result = await response.json();
      setHistoryList(result.data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Navigation & Detail Logic
  const handleViewDetail = async (id, source) => {
    setLoading(true);
    try {
      const endpoint = (source === "history") 
        ? `/admin/suggestion-records/${id}` 
        : `/admin/suggestions/${id}`;
      
      const response = await fetch(`${API_BASE}${endpoint}`);
      const result = await response.json();
      setSelectedItem(result.data);
      setPrevView(source);
      setView("detail");
    } catch (error) {
      alert("Error fetching details");
    } finally {
      setLoading(false);
    }
  };

  // 3. Actions (Acknowledge, Resolve, Reject)
  const handleAcknowledge = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/suggestions/${selectedItem.suggestion_id}/acknowledge`, {
        method: "PATCH",
      });
      if (response.ok) {
        alert("Suggestion Acknowledged and Email Sent!");
        setView("list");
        setDashboardTab("acknowledged");
      }
    } catch (error) {
      alert("Failed to acknowledge");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/suggestions/${selectedItem.suggestion_id}/resolve`, {
        method: "POST",
      });
      if (response.ok) {
        alert("Suggestion marked as Resolved!");
        setView("history");
        setHistoryTab("resolved");
      }
    } catch (error) {
      alert("Failed to resolve");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionMessage.trim()) return alert("Please enter a reason");
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/suggestions/delete-send-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suggestion_id: selectedItem.suggestion_id,
          mail_content: rejectionMessage
        }),
      });
      if (response.ok) {
        alert("Rejection email sent and record moved to history.");
        setShowRejectModal(false);
        setRejectionMessage("");
        setView("history");
        setHistoryTab("rejected");
      }
    } catch (error) {
      alert("Error processing rejection");
    } finally {
      setActionLoading(false);
    }
  };

  // ── RENDER DETAIL ──
  const renderDetailCard = () => (
    <div className="animate-fadeIn">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "#023347", fontSize: "24px", fontWeight: 800 }}>Suggestion Details</h1>
        <button
          onClick={() => setView(prevView === "history" ? "history" : "list")}
          className="h-11 px-6 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:bg-[#2A8E9E] transition-all"
        >
          ← Back
        </button>
      </div>

      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #e2e8ec", padding: "50px shadow-sm" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#023347", marginBottom: "24px" }}>
          {selectedItem.title}
        </h2>

        <div style={{ backgroundColor: "#F8FAFC", padding: "25px", borderRadius: "15px", marginBottom: "30px" }}>
          <p style={{ margin: 0, color: "#1e293b", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
            {selectedItem.description || selectedItem.suggestion}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", padding: "20px", backgroundColor: "#F8FAFC", borderRadius: "15px", marginBottom: "30px" }}>
          <div><strong>Name:</strong> {selectedItem.name}</div>
          <div><strong>Email:</strong> {selectedItem.email}</div>
          <div><strong>Year/Sec:</strong> {selectedItem.year} {selectedItem.section ? `- ${selectedItem.section}` : ""}</div>
          <div><strong>Phone:</strong> {selectedItem.phone_number || selectedItem.phone}</div>
        </div>

        {prevView !== "history" && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
            <button
              onClick={() => setShowRejectModal(true)}
              className="h-11 px-8 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition-all"
            >
              Reject & Delete
            </button>
            
            {dashboardTab === "unacknowledged" && (
              <button
                onClick={handleAcknowledge}
                disabled={actionLoading}
                className="h-11 px-8 bg-[#2A8E9E] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#023347] transition-all"
              >
                {actionLoading ? "Processing..." : "Acknowledge"}
              </button>
            )}

            <button
              onClick={handleResolve}
              disabled={actionLoading}
              className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#2A8E9E] transition-all"
            >
              {actionLoading ? "Saving..." : "Resolved"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ── RENDER REJECT MODAL ──
  const renderRejectModal = () => (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
      <div style={{ backgroundColor: "#fff", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "500px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#023347", marginBottom: "8px" }}>Reject Suggestion</h2>
        <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}>Provide a reason for rejection. This will be sent to the user's email.</p>
        <textarea
          value={rejectionMessage}
          onChange={(e) => setRejectionMessage(e.target.value)}
          placeholder="Type the rejection message here..."
          rows={5}
          style={{ width: "100%", padding: "15px", borderRadius: "12px", border: "1.5px solid #e2e8ec", backgroundColor: "#F8FAFC", outline: "none", fontSize: "14px", resize: "none" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
          <button onClick={() => setShowRejectModal(false)} className="px-6 py-2 text-gray-500 font-bold">Cancel</button>
          <button 
            onClick={handleRejectSubmit} 
            disabled={actionLoading}
            className="h-11 px-8 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
          >
            {actionLoading ? "Sending..." : "Reject & Send"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#F5F9FA", fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Poppins', sans-serif !important; }
        .sg-table-scroll::-webkit-scrollbar { width: 6px; }
        .sg-table-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>

      {showRejectModal && renderRejectModal()}
      <AdminSidebar />

      <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto" }}>
        {view === "list" || view === "history" ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h1 style={{ color: "#023347", fontSize: "24px", fontWeight: 800 }}>
                {view === "list" ? "Suggestions Dashboard" : "Suggestion Records"}
              </h1>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setView(view === "list" ? "history" : "list")}
                  className="h-11 px-6 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:bg-[#2A8E9E] transition-all"
                >
                  {view === "list" ? "View History" : "← Dashboard"}
                </button>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ padding: "10px 16px", borderRadius: "12px", border: "1.5px solid #e2e8ec", outline: "none", width: "250px" }}
                />
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "28px", borderBottom: "2px solid #eee", marginBottom: "20px" }}>
              {view === "list" ? (
                <>
                  <TabBtn active={dashboardTab === "unacknowledged"} label="Unacknowledged" onClick={() => setDashboardTab("unacknowledged")} />
                  <TabBtn active={dashboardTab === "acknowledged"} label="Acknowledged" onClick={() => setDashboardTab("acknowledged")} />
                </>
              ) : (
                <>
                  <TabBtn active={historyTab === "rejected"} label="Rejected Suggestions" onClick={() => setHistoryTab("rejected")} />
                  <TabBtn active={historyTab === "resolved"} label="Resolved Suggestions" onClick={() => setHistoryTab("resolved")} />
                </>
              )}
            </div>

            {/* Table */}
            <div style={{ backgroundColor: "white", borderRadius: "20px", overflow: "hidden", border: "1px solid #e2e8ec" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ backgroundColor: "#2A8E9E", color: "white" }}>
                  <tr>
                    <th style={{ padding: "16px", textAlign: "center" }}>Title</th>
                    <th style={{ padding: "16px", textAlign: "center" }}>Submitted By</th>
                    <th style={{ padding: "16px", textAlign: "center" }}>Year</th>
                    <th style={{ padding: "16px", textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="4" style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>Loading...</td></tr>
                  ) : (view === "list" ? suggestionList : historyList)
                    .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((item) => (
                      <tr key={item.suggestion_id || item.record_id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "16px", textAlign: "center", fontWeight: 700, color: "#023347" }}>{item.title}</td>
                        <td style={{ padding: "16px", textAlign: "center", color: "#64748b" }}>{item.name}</td>
                        <td style={{ padding: "16px", textAlign: "center", color: "#64748b" }}>{item.year}</td>
                        <td style={{ padding: "16px", textAlign: "center" }}>
                          <button
                            onClick={() => handleViewDetail(item.suggestion_id || item.record_id, view)}
                            style={{ padding: "8px 20px", backgroundColor: "#023347", color: "white", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          renderDetailCard()
        )}
      </main>
    </div>
  );
}

const TabBtn = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      paddingBottom: "10px",
      fontSize: "14px",
      fontWeight: active ? 700 : 500,
      color: active ? "#023347" : "#6b7280",
      background: "none",
      border: "none",
      borderBottom: active ? "2px solid #023347" : "2px solid transparent",
      marginBottom: "-2px",
      cursor: "pointer",
    }}
  >
    {label}
  </button>
);