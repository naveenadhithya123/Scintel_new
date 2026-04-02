import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";

const API_BASE = "http://localhost:3000/api";

// ── Toast Component ──────────────────────────────────────────────────────────
const Toast = ({ toasts, removeToast }) => (
  <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "10px" }}>
    {toasts.map(t => (
      <div
        key={t.id}
        style={{
          display: "flex", alignItems: "flex-start", gap: "12px",
          backgroundColor: "#fff", borderRadius: "14px",
          padding: "16px 20px", minWidth: "320px", maxWidth: "420px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          borderLeft: `4px solid ${t.type === "success" ? "#22c55e" : t.type === "error" ? "#ef4444" : "#f59e0b"}`,
          animation: "slideIn 0.3s ease",
        }}
      >
        <span style={{ fontSize: "20px", lineHeight: 1 }}>
          {t.type === "success" ? "✅" : t.type === "error" ? "❌" : "⚠️"}
        </span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "14px", color: "#023347" }}>{t.title}</p>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b", lineHeight: "1.4" }}>{t.message}</p>
        </div>
        <button
          onClick={() => removeToast(t.id)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "16px", lineHeight: 1, padding: 0 }}
        >×</button>
      </div>
    ))}
  </div>
);

// ── useToast hook ────────────────────────────────────────────────────────────
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (type, title, message, duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  };

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return { toasts, removeToast, showToast };
};

// ── Main Component ───────────────────────────────────────────────────────────
export default function SuggestionAdmin() {
  const [view, setView] = useState("list");
  const [dashboardTab, setDashboardTab] = useState("unacknowledged");
  const [historyTab, setHistoryTab] = useState("rejected");
  const [prevView, setPrevView] = useState("list");

  const [suggestionList, setSuggestionList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState("");

  const { toasts, removeToast, showToast } = useToast();

  useEffect(() => {
    if (view === "list") fetchDashboardSuggestions();
    else if (view === "history") fetchHistorySuggestions();
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
      showToast("error", "Fetch Failed", "Unable to load suggestions. Please try again.");
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
      showToast("error", "Fetch Failed", "Unable to load suggestion history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id, source) => {
    setLoading(true);
    try {
      const endpoint = source === "history"
        ? `/admin/suggestion-records/${id}`
        : `/admin/suggestions/${id}`;
      const response = await fetch(`${API_BASE}${endpoint}`);
      const result = await response.json();
      setSelectedItem(result.data);
      setPrevView(source);
      setView("detail");
    } catch {
      showToast("error", "Error", "Unable to fetch suggestion details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/suggestions/${selectedItem.suggestion_id}/acknowledge`, {
        method: "PATCH",
      });
      if (response.ok) {
        showToast("success", "Suggestion Acknowledged", `The suggestion "${selectedItem.title}" has been acknowledged and a confirmation email has been sent to ${selectedItem.email}.`);
        setView("list");
        setDashboardTab("acknowledged");
      } else {
        showToast("error", "Acknowledge Failed", "Something went wrong while acknowledging. Please try again.");
      }
    } catch {
      showToast("error", "Acknowledge Failed", "Network error. Please check your connection and try again.");
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
        showToast("success", "Marked as Resolved", `The suggestion "${selectedItem.title}" has been successfully marked as resolved and moved to history.`);
        setView("history");
        setHistoryTab("resolved");
      } else {
        showToast("error", "Resolve Failed", "Something went wrong while resolving. Please try again.");
      }
    } catch {
      showToast("error", "Resolve Failed", "Network error. Please check your connection and try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionMessage.trim()) {
      showToast("warning", "Message Required", "Please enter a rejection reason before sending.");
      return;
    }
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/suggestions/delete-send-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suggestion_id: selectedItem.suggestion_id,
          mail_content: rejectionMessage,
        }),
      });
      if (response.ok) {
        showToast("success", "Suggestion Rejected", `A rejection email has been sent to ${selectedItem.email} and the record has been moved to history.`);
        setShowRejectModal(false);
        setRejectionMessage("");
        setView("history");
        setHistoryTab("rejected");
      } else {
        showToast("error", "Rejection Failed", "Something went wrong while sending the rejection email. Please try again.");
      }
    } catch {
      showToast("error", "Rejection Failed", "Network error. Please check your connection and try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const btnBase = {
    height: "44px", padding: "0 28px", backgroundColor: "#023347",
    color: "#ffffff", borderRadius: "10px", border: "none", cursor: "pointer",
    fontSize: "14px", fontWeight: 600, transition: "background-color 0.2s",
  };

  const btnDelete = { ...btnBase, backgroundColor: "#023347" };

  const renderDetailCard = () => (
    <div className="animate-fadeIn">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "#023347", fontSize: "24px", fontWeight: 800 }}>Suggestion Description</h1>
        <button
          onClick={() => setView(prevView === "history" ? "history" : "list")}
          style={{ ...btnBase }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2A8E9E"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#023347"}
        >
          ← Back to List
        </button>
      </div>

      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #e2e8ec", padding: "40px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#023347", marginBottom: "24px" }}>
          {selectedItem.title}
        </h2>

        <div style={{ backgroundColor: "#F8FAFC", padding: "25px", borderRadius: "15px", marginBottom: "24px" }}>
          <p style={{ margin: 0, color: "#1e293b", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
            {selectedItem.description || selectedItem.suggestion}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", padding: "20px", backgroundColor: "#F8FAFC", borderRadius: "15px", marginBottom: "30px" }}>
          <div><strong>Name:</strong> {selectedItem.name}</div>
          <div><strong>Email:</strong> {selectedItem.email}</div>
          <div><strong>Year/Sec:</strong> {selectedItem.year} {selectedItem.section ? `- ${selectedItem.section}` : ""}</div>
          <div><strong>Phone:</strong> {selectedItem.phone_number || selectedItem.phone}</div>
        </div>

        {prevView !== "history" && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", borderTop: "1px solid #eee", paddingTop: "24px" }}>
            <button
              onClick={() => setShowRejectModal(true)}
              style={{ ...btnDelete }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#dc2626"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#023347"}
            >
              Delete Record
            </button>

            {dashboardTab === "unacknowledged" && (
              <button
                onClick={handleAcknowledge}
                disabled={actionLoading}
                style={{ ...btnBase, opacity: actionLoading ? 0.7 : 1, cursor: actionLoading ? "not-allowed" : "pointer" }}
                onMouseEnter={e => { if (!actionLoading) e.currentTarget.style.backgroundColor = "#2A8E9E"; }}
                onMouseLeave={e => { if (!actionLoading) e.currentTarget.style.backgroundColor = "#023347"; }}
              >
                {actionLoading ? "Processing..." : "Acknowledge"}
              </button>
            )}

            <button
              onClick={handleResolve}
              disabled={actionLoading}
              style={{ ...btnBase, opacity: actionLoading ? 0.7 : 1, cursor: actionLoading ? "not-allowed" : "pointer" }}
              onMouseEnter={e => { if (!actionLoading) e.currentTarget.style.backgroundColor = "#2A8E9E"; }}
              onMouseLeave={e => { if (!actionLoading) e.currentTarget.style.backgroundColor = "#023347"; }}
            >
              {actionLoading ? "Saving..." : "Resolved"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

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
          style={{ width: "100%", padding: "15px", borderRadius: "12px", border: "1.5px solid #e2e8ec", backgroundColor: "#F8FAFC", outline: "none", fontSize: "14px", resize: "none", boxSizing: "border-box" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
          <button
            onClick={() => setShowRejectModal(false)}
            style={{ ...btnBase }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#dc2626"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#023347"}
          >
            Cancel
          </button>
          <button
            onClick={handleRejectSubmit}
            disabled={actionLoading}
            style={{ ...btnBase, opacity: actionLoading ? 0.7 : 1, cursor: actionLoading ? "not-allowed" : "pointer" }}
            onMouseEnter={e => { if (!actionLoading) e.currentTarget.style.backgroundColor = "#2A8E9E"; }}
            onMouseLeave={e => { if (!actionLoading) e.currentTarget.style.backgroundColor = "#023347"; }}
          >
            {actionLoading ? "Sending..." : "Send"}
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
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* ── Toast Notifications ── */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {showRejectModal && renderRejectModal()}
      <AdminSidebar />

      <main style={{ flex: 1, padding: "32px 40px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {view === "list" || view === "history" ? (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexShrink: 0 }}>
              <h1 style={{ color: "#023347", fontSize: "24px", fontWeight: 800 }}>
                {view === "list" ? "Suggestions Dashboard" : "Suggestion Records"}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ padding: "10px 16px", borderRadius: "12px", border: "1.5px solid #e2e8ec", outline: "none", width: "220px", height: "44px", boxSizing: "border-box", transition: "border-color 0.2s" }}
                  onFocus={e => e.currentTarget.style.borderColor = "#2A8E9E"}
                  onBlur={e => e.currentTarget.style.borderColor = "#e2e8ec"}
                />
                <button
                  onClick={() => setView(view === "list" ? "history" : "list")}
                  style={{ ...btnBase, whiteSpace: "nowrap" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2A8E9E"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#023347"}
                >
                  {view === "list" ? "View History" : "← Dashboard"}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "28px", borderBottom: "2px solid #eee", marginBottom: "20px", flexShrink: 0 }}>
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

            {/* Table card */}
            <div style={{ backgroundColor: "white", borderRadius: "20px", border: "1px solid #e2e8ec", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "35%" }} />
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "25%" }} />
                </colgroup>
                <thead style={{ backgroundColor: "#2A8E9E", color: "white" }}>
                  <tr>
                    <th style={{ padding: "16px", textAlign: "center" }}>Title</th>
                    <th style={{ padding: "16px", textAlign: "center" }}>Submitted By</th>
                    <th style={{ padding: "16px", textAlign: "center" }}>Year</th>
                    <th style={{ padding: "16px", textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
              </table>

              <div className="sg-table-scroll" style={{ overflowY: "auto", flex: 1 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                  <colgroup>
                    <col style={{ width: "35%" }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "25%" }} />
                  </colgroup>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="4" style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>Loading...</td></tr>
                    ) : (view === "list" ? suggestionList : historyList)
                      .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((item) => (
                        <tr
                          key={item.suggestion_id || item.record_id}
                          style={{ borderBottom: "1px solid #f1f5f9", transition: "background-color 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f4fafb"}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          <td style={{ padding: "16px", textAlign: "center", fontWeight: 700, color: "#023347" }}>{item.title}</td>
                          <td style={{ padding: "16px", textAlign: "center", color: "#64748b" }}>{item.name}</td>
                          <td style={{ padding: "16px", textAlign: "center", color: "#64748b" }}>{item.year}</td>
                          <td style={{ padding: "16px", textAlign: "center" }}>
                            <button
                              onClick={() => handleViewDetail(item.suggestion_id || item.record_id, view)}
                              style={{ padding: "8px 20px", backgroundColor: "#023347", color: "white", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, transition: "background-color 0.2s" }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2A8E9E"}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#023347"}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          <div style={{ overflowY: "auto", height: "100%" }}>
            {renderDetailCard()}
          </div>
        )}
      </main>
    </div>
  );
}

const TabBtn = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      paddingBottom: "10px", fontSize: "14px",
      fontWeight: active ? 700 : 500,
      color: active ? "#023347" : "#6b7280",
      background: "none", border: "none",
      borderBottom: active ? "2px solid #023347" : "2px solid transparent",
      marginBottom: "-2px", cursor: "pointer",
    }}
  >
    {label}
  </button>
);