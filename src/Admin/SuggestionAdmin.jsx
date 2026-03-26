import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";

const DEFAULT_ADMIN_EMAIL = "admin@college.edu"; // <-- Change to your default email

export default function SuggestionAdmin() {
  const [view, setView] = useState("list"); // "list" | "detail" | "history"
  const [dashboardTab, setDashboardTab] = useState("overall");
  const [prevView, setPrevView] = useState("list");
  const [suggestionList, setSuggestionList] = useState([]);
  const [ackList, setAckList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // History states
  const [historyTab, setHistoryTab] = useState("rejected");
  const [rejectedList, setRejectedList] = useState([]);
  const [resolvedList, setResolvedList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Dummy data for acknowledge tab
  const DUMMY_ACK = [
    {
      suggestion_id: "ack-001",
      title: "Improve Library Timings",
      name: "Priya Ramesh",
      email: "priya.ramesh@college.edu",
      year: "3rd Year",
      section: "B",
      phone_number: "9876543210",
      description:
        "The library should remain open until 9 PM on weekdays to help students prepare for exams without rushing. Currently it closes at 6 PM which is inconvenient for many students who have classes until 5 PM.",
    },
  ];

  // Dummy data for history tabs
  const DUMMY_REJECTED = [
    {
      suggestion_id: "rej-001",
      title: "Outdoor Vending Machines",
      name: "Karthik Sundar",
      email: "karthik.s@college.edu",
      year: "2nd Year",
      section: "A",
      phone_number: "9123456780",
      description:
        "Place vending machines near the sports ground so students can get refreshments without walking to the canteen.",
    },
    {
      suggestion_id: "rej-002",
      title: "24/7 Wi-Fi in Hostel",
      name: "Ananya Menon",
      email: "ananya.m@college.edu",
      year: "4th Year",
      section: "C",
      phone_number: "9988776655",
      description:
        "Hostel Wi-Fi is switched off at 11 PM. Extending it to 24/7 would greatly help students doing late-night project work.",
    },
  ];

  const DUMMY_RESOLVED = [
    {
      suggestion_id: "res-001",
      title: "New Drinking Water Points",
      name: "Divya Krishnan",
      email: "divya.k@college.edu",
      year: "1st Year",
      section: "D",
      phone_number: "9001234567",
      description:
        "There are not enough drinking water points near the labs. Adding two more water dispensers on the second floor would help a lot.",
    },
    {
      suggestion_id: "res-002",
      title: "Canteen Menu Variety",
      name: "Rahul Nair",
      email: "rahul.n@college.edu",
      year: "3rd Year",
      section: "A",
      phone_number: "9876001234",
      description:
        "The canteen menu has remained the same for years. Introducing regional cuisine options once a week would be appreciated by students from different states.",
    },
  ];

  useEffect(() => {
    fetchSuggestions();
    fetchAckSuggestions();
  }, []);

  useEffect(() => {
    if (view === "history") {
      if (historyTab === "rejected") fetchRejected();
      if (historyTab === "resolved") fetchResolved();
    }
  }, [view, historyTab]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/admin/suggestions");
      const result = await response.json();
      setSuggestionList(result.data || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAckSuggestions = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/suggestions/acknowledge");
      const result = await response.json();
      setAckList([...DUMMY_ACK, ...(result.data || [])]);
    } catch (error) {
      setAckList(DUMMY_ACK);
    }
  };

  const fetchRejected = async () => {
    try {
      setHistoryLoading(true);
      const response = await fetch("http://localhost:3000/api/admin/suggestions/rejected");
      const result = await response.json();
      setRejectedList([...DUMMY_REJECTED, ...(result.data || [])]);
    } catch (error) {
      setRejectedList(DUMMY_REJECTED);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchResolved = async () => {
    try {
      setHistoryLoading(true);
      const response = await fetch("http://localhost:3000/api/admin/suggestions/resolved");
      const result = await response.json();
      setResolvedList([...DUMMY_RESOLVED, ...(result.data || [])]);
    } catch (error) {
      setResolvedList(DUMMY_RESOLVED);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleViewDetail = async (id, from = "overall") => {
    const allDummy = [...DUMMY_ACK, ...DUMMY_REJECTED, ...DUMMY_RESOLVED];
    const dummyItem = allDummy.find((d) => d.suggestion_id === id);
    if (dummyItem) {
      setSelectedItem(dummyItem);
      setPrevView(from);
      setView("detail");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/admin/suggestions/${id}`);
      const result = await response.json();
      setSelectedItem(result.data);
      setPrevView(from);
      setView("detail");
    } catch (error) {
      alert("Error fetching details");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteTargetId(id);
    setDeleteMessage("");
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTargetId(null);
    setDeleteMessage("");
  };

  const handleSendDeleteRejection = async () => {
    if (!deleteMessage.trim()) {
      alert("Please enter a rejection message before sending.");
      return;
    }
    try {
      setDeleteLoading(true);
      const mailtoLink = `mailto:${DEFAULT_ADMIN_EMAIL}?subject=Suggestion%20Rejected%3A%20${encodeURIComponent(
        selectedItem?.title || ""
      )}&body=${encodeURIComponent(deleteMessage)}`;
      window.location.href = mailtoLink;

      await fetch(
        `http://localhost:3000/api/admin/suggestions/${deleteTargetId}`,
        { method: "DELETE" }
      );

      if (selectedItem) {
        setRejectedList((prev) => [
          { ...selectedItem, rejection_message: deleteMessage },
          ...prev,
        ]);
      }

      setShowDeleteModal(false);
      setDeleteTargetId(null);
      setDeleteMessage("");
      setSelectedItem(null);
      setView("list");
      fetchSuggestions();
    } catch (error) {
      if (selectedItem) {
        setRejectedList((prev) => [
          { ...selectedItem, rejection_message: deleteMessage },
          ...prev,
        ]);
      }
      setShowDeleteModal(false);
      setDeleteTargetId(null);
      setDeleteMessage("");
      setSelectedItem(null);
      setView("list");
      fetchSuggestions();
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAcknowledge = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/admin/suggestions/acknowledge/${id}`,
        { method: "POST" }
      );
      const result = await response.json();
      if (response.ok) {
        alert("Success: " + result.message);
        setView("list");
        fetchSuggestions();
      } else {
        alert("Failed: " + result.message);
      }
    } catch (error) {
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleResolved = async (email) => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3000/api/admin/suggestions/accept-mail",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert("Success: " + result.message);
        setView("list");
        fetchSuggestions();
        fetchAckSuggestions();
      } else {
        alert("Failed: " + result.message);
      }
    } catch (error) {
      alert("Error connecting to mail server");
    } finally {
      setLoading(false);
    }
  };

  const filteredList = suggestionList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAckList = ackList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const historyCurrentList =
    historyTab === "rejected" ? rejectedList : resolvedList;

  // ── DETAIL CARD ──
  const renderDetailCard = () => (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ color: "#023347", fontSize: "24px", fontWeight: 800, margin: 0 }}>
          Suggestion Description
        </h1>
        <button
          onClick={() => {
            setSelectedItem(null);
            setView(prevView === "history" ? "history" : "list");
          }}
          className="h-11 px-6 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
        >
          ← Back to {prevView === "history" ? "History" : "List"}
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          border: "1px solid #e2e8ec",
          padding: "40px",
        }}
      >
        <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#023347", marginBottom: "24px" }}>
          {selectedItem.title}
        </h2>

        <div
          style={{
            backgroundColor: "#F8FAFC",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "30px",
          }}
        >
          <p style={{ margin: 0, color: "#1e293b", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
            {selectedItem.description}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            padding: "20px",
            backgroundColor: "#F8FAFC",
            borderRadius: "15px",
            marginBottom: "30px",
          }}
        >
          <div><strong>Name:</strong> {selectedItem.name}</div>
          <div><strong>Email:</strong> {selectedItem.email}</div>
          <div><strong>Year/Sec:</strong> {selectedItem.year} - {selectedItem.section}</div>
          <div><strong>Phone:</strong> {selectedItem.phone_number}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px" }}>
          {prevView === "overall" && (
            <>
              <button
                onClick={() => handleOpenDeleteModal(selectedItem.suggestion_id)}
                disabled={loading}
                className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-red-700 transition-all transform hover:-translate-y-0.5"
              >
                {loading ? "Processing..." : "Delete Record"}
              </button>
              <button
                onClick={() => handleAcknowledge(selectedItem.suggestion_id)}
                disabled={loading}
                className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
              >
                {loading ? "Processing..." : "Acknowledge"}
              </button>
              <button
                onClick={() => handleResolved(selectedItem.email)}
                disabled={loading}
                className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
              >
                {loading ? "Sending..." : "Resolved"}
              </button>
            </>
          )}

          {prevView === "acknowledge" && (
            <button
              onClick={() => handleResolved(selectedItem.email)}
              disabled={loading}
              className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
            >
              {loading ? "Sending..." : "Resolved"}
            </button>
          )}

          {prevView === "history" && null}
        </div>
      </div>
    </div>
  );

  // ── DELETE MODAL ──
  const renderDeleteModal = () => (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.45)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          padding: "40px",
          width: "100%",
          maxWidth: "520px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          border: "1px solid #e2e8ec",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#023347", marginBottom: "8px" }}>
          Reject Suggestion
        </h2>
        <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>
          Write a message explaining why this suggestion is being rejected. It will be sent to the
          admin email.
        </p>

        <textarea
          value={deleteMessage}
          onChange={(e) => setDeleteMessage(e.target.value)}
          placeholder="Enter rejection reason or message..."
          rows={5}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: "12px",
            border: "1.5px solid #e2e8ec",
            outline: "none",
            fontSize: "14px",
            color: "#023347",
            backgroundColor: "#F8FAFC",
            resize: "vertical",
            boxSizing: "border-box",
            fontFamily: "'Poppins', sans-serif",
            lineHeight: "1.6",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#2A8E9E";
            e.target.style.boxShadow = "0 0 0 3px rgba(42,142,158,0.1)";
            e.target.style.backgroundColor = "#fff";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e2e8ec";
            e.target.style.boxShadow = "none";
            e.target.style.backgroundColor = "#F8FAFC";
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "24px",
          }}
        >
          <button
            onClick={handleCancelDelete}
            disabled={deleteLoading}
            className="h-11 px-7 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
          >
            Cancel
          </button>
          <button
            onClick={handleSendDeleteRejection}
            disabled={deleteLoading}
            className="h-11 px-7 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
          >
            {deleteLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#F5F9FA",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Poppins', sans-serif !important; }
        .sg-main::-webkit-scrollbar { width: 6px; }
        .sg-main::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .sg-table-scroll::-webkit-scrollbar { width: 6px; }
        .sg-table-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>

      {/* Delete Modal */}
      {showDeleteModal && renderDeleteModal()}

      <AdminSidebar />

      <main className="sg-main" style={{ flex: 1, padding: "32px 40px", overflowY: "auto" }}>

        {/* ── LIST VIEW ── */}
        {view === "list" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h1 style={{ color: "#023347", fontSize: "24px", fontWeight: 800 }}>
                Suggestions Dashboard
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  onClick={() => setView("history")}
                  className="h-11 px-6 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
                >
                  History
                </button>
                <div style={{ position: "relative", width: "300px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "16px",
                      height: "16px",
                      color: "#9ca3af",
                      pointerEvents: "none",
                    }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search title or user..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 16px 10px 40px",
                      borderRadius: "12px",
                      border: "1.5px solid #e2e8ec",
                      outline: "none",
                      fontSize: "14px",
                      color: "#023347",
                      backgroundColor: "#F5F9FA",
                      boxSizing: "border-box",
                      fontFamily: "'Poppins', sans-serif",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#2A8E9E";
                      e.target.style.boxShadow = "0 0 0 3px rgba(42,142,158,0.1)";
                      e.target.style.backgroundColor = "#fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8ec";
                      e.target.style.boxShadow = "none";
                      e.target.style.backgroundColor = "#F5F9FA";
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div
              style={{
                display: "flex",
                gap: "28px",
                borderBottom: "2px solid #eee",
                marginBottom: "20px",
              }}
            >
              {[
                { key: "overall", label: "Unacknowledged Suggestions" },
                { key: "acknowledge", label: "Acknowledged Suggestions" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setDashboardTab(tab.key)}
                  style={{
                    paddingBottom: "10px",
                    fontSize: "14px",
                    fontWeight: dashboardTab === tab.key ? 700 : 500,
                    color: dashboardTab === tab.key ? "#023347" : "#6b7280",
                    background: "none",
                    border: "none",
                    borderBottom:
                      dashboardTab === tab.key
                        ? "2px solid #023347"
                        : "2px solid transparent",
                    marginBottom: "-2px",
                    cursor: "pointer",
                    transition: "color 0.2s",
                    whiteSpace: "nowrap",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div
              className="bg-white rounded-2xl shadow-sm border border-[#2A8E9E]/20 overflow-hidden flex flex-col"
              style={{ maxHeight: "calc(100vh - 240px)" }}
            >
              <div className="overflow-y-auto sg-table-scroll">
                <table
                  className="w-full text-left border-collapse"
                  style={{ minWidth: "700px" }}
                >
                  <thead className="bg-[#2A8E9E] sticky top-0 z-10">
                    <tr className="text-white">
                      <th className="px-6 py-4 font-semibold text-center text-sm">Title</th>
                      <th className="px-6 py-4 font-semibold text-center text-sm">Submitted By</th>
                      <th className="px-6 py-4 font-semibold text-center text-sm">Year</th>
                      <th className="px-6 py-4 font-semibold text-center text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading && (
                      <tr>
                        <td colSpan="4" className="py-20 text-center text-gray-400">
                          Processing...
                        </td>
                      </tr>
                    )}

                    {/* Overall Suggestions Tab */}
                    {!loading &&
                      dashboardTab === "overall" &&
                      filteredList.map((item) => (
                        <tr key={item.suggestion_id} className="hover:bg-gray-50">
                          <td className="px-6 py-5 text-[#023347] font-bold text-center">
                            {item.title}
                          </td>
                          <td className="px-6 py-5 text-center text-gray-600 text-sm">
                            {item.name}
                          </td>
                          <td className="px-6 py-5 text-center text-gray-600 text-sm">
                            {item.year}
                          </td>
                          <td className="px-6 py-5 text-center">
                            <button
                              onClick={() => handleViewDetail(item.suggestion_id, "overall")}
                              className="bg-[#023347] text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-[#2A8E9E] transition-colors"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    {!loading && dashboardTab === "overall" && filteredList.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-20 text-center text-gray-400">
                          No suggestions found.
                        </td>
                      </tr>
                    )}

                    {/* Acknowledge Suggestions Tab */}
                    {!loading &&
                      dashboardTab === "acknowledge" &&
                      filteredAckList.map((item) => (
                        <tr key={item.suggestion_id} className="hover:bg-gray-50">
                          <td className="px-6 py-5 text-[#023347] font-bold text-center">
                            {item.title}
                          </td>
                          <td className="px-6 py-5 text-center text-gray-600 text-sm">
                            {item.name}
                          </td>
                          <td className="px-6 py-5 text-center text-gray-600 text-sm">
                            {item.year}
                          </td>
                          <td className="px-6 py-5 text-center">
                            <button
                              onClick={() => handleViewDetail(item.suggestion_id, "acknowledge")}
                              className="bg-[#023347] text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-[#2A8E9E] transition-colors"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    {!loading &&
                      dashboardTab === "acknowledge" &&
                      filteredAckList.length === 0 && (
                        <tr>
                          <td colSpan="4" className="py-20 text-center text-gray-400">
                            No acknowledge suggestions found.
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── DETAIL VIEW ── */}
        {view === "detail" && selectedItem && renderDetailCard()}

        {/* ── HISTORY VIEW ── */}
        {view === "history" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h1 style={{ color: "#023347", fontSize: "24px", fontWeight: 800 }}>
                Suggestion Records
              </h1>
              <button
                onClick={() => setView("list")}
                className="h-11 px-6 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
              >
                ← Back
              </button>
            </div>

            {/* History Tabs */}
            <div
              style={{
                display: "flex",
                gap: "28px",
                borderBottom: "2px solid #eee",
                marginBottom: "24px",
              }}
            >
              {[
                { key: "rejected", label: "Rejected Suggestions" },
                { key: "resolved", label: "Resolved Suggestions" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setHistoryTab(tab.key)}
                  style={{
                    paddingBottom: "10px",
                    fontSize: "14px",
                    fontWeight: historyTab === tab.key ? 700 : 500,
                    color: historyTab === tab.key ? "#023347" : "#6b7280",
                    background: "none",
                    border: "none",
                    borderBottom:
                      historyTab === tab.key
                        ? "2px solid #023347"
                        : "2px solid transparent",
                    marginBottom: "-2px",
                    cursor: "pointer",
                    transition: "color 0.2s",
                    whiteSpace: "nowrap",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* History Table */}
            <div
              className="bg-white rounded-2xl shadow-sm border border-[#2A8E9E]/20 overflow-hidden flex flex-col"
              style={{ maxHeight: "calc(100vh - 220px)" }}
            >
              <div className="overflow-y-auto sg-table-scroll">
                <table
                  className="w-full text-left border-collapse"
                  style={{ minWidth: "600px" }}
                >
                  <thead className="bg-[#2A8E9E] sticky top-0 z-10">
                    <tr className="text-white">
                      <th className="px-6 py-4 font-semibold text-center text-sm">Title</th>
                      <th className="px-6 py-4 font-semibold text-center text-sm">Name</th>
                      <th className="px-6 py-4 font-semibold text-center text-sm">Year</th>
                      <th className="px-6 py-4 font-semibold text-center text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {historyLoading ? (
                      <tr>
                        <td colSpan="4" className="py-20 text-center text-gray-400">
                          Loading...
                        </td>
                      </tr>
                    ) : historyCurrentList.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-20 text-center text-gray-400">
                          No records found.
                        </td>
                      </tr>
                    ) : (
                      historyCurrentList.map((item) => (
                        <tr key={item.suggestion_id} className="hover:bg-gray-50">
                          <td className="px-6 py-5 text-[#023347] font-bold text-center">
                            {item.title}
                          </td>
                          <td className="px-6 py-5 text-center text-gray-600 text-sm">
                            {item.name}
                          </td>
                          <td className="px-6 py-5 text-center text-gray-600 text-sm">
                            {item.year}
                          </td>
                          <td className="px-6 py-5 text-center">
                            <button
                              onClick={() => handleViewDetail(item.suggestion_id, "history")}
                              className="bg-[#023347] text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-[#2A8E9E] transition-colors"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}