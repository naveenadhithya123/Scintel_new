import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminMembers() {
  const navigate = useNavigate();
  
  const [batches, setBatches] = useState([]);
  const [selectedBatchYear, setSelectedBatchYear] = useState(""); 
  const [batchDetails, setBatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBatches = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/association-batches");
      const data = await res.json();
      setBatches(data);
      if (data.length > 0 && !selectedBatchYear) {
        // Default to the first batch in the list
        setSelectedBatchYear(data[0].batch_year);
      }
    } catch (err) {
      console.error("Error fetching batches:", err);
    }
  };

  const fetchBatchDetails = async (year) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/association-batch/${year}`);
      const data = await res.json();
      setBatchDetails(data);
    } catch (err) {
      console.error("Error fetching batch details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatchYear) {
      fetchBatchDetails(selectedBatchYear);
    }
  }, [selectedBatchYear]);

  return (
    <AdminSidebar>
      <style>{`
        .am-scrollbar::-webkit-scrollbar { width: 6px; }
        .am-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .am-scrollbar::-webkit-scrollbar-thumb { background: #9ca3af; border-radius: 10px; }
        .am-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280; }
        .am-tabs { display: flex; gap: 28px; color: #6b7280; margin-bottom: 32px; font-size: 14px; flex-wrap: wrap; border-bottom: 2px solid #eee; }
        .am-tab { cursor: pointer; padding-bottom: 8px; transition: color 0.2s; white-space: nowrap; border-bottom: 2px solid transparent; margin-bottom: -2px; }
        .am-tab.active { border-bottom: 2px solid #083A4B; font-weight: 600; color: #083A4B; }
        .am-cards { display: none; }
        @media (max-width: 768px) {
          .am-batch-info { flex-direction: column !important; }
          .am-batch-img { width: 100% !important; min-width: unset !important; height: 180px !important; }
          .am-table-styled { display: none; }
          .am-cards { display: block; }
          .am-card { padding: 16px; border-top: 1px solid #f3f4f6; }
          .am-card-name { font-weight: 600; margin-bottom: 4px; }
          .am-card-row { display: flex; justify-content: space-between; font-size: 13px; color: #6b7280; }
          .am-header-btns { flex-wrap: wrap; }
        }
      `}</style>

      <div style={{ flex: 1, overflowY: "auto", padding: "36px 40px" }}>

        {/* Header: title left, 3 buttons right */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1f2937", margin: 0 }}>Association Members</h1>
          <div className="am-header-btns" style={{ display: "flex", gap: "12px" }}>
            {/* Remove Batch — Delete style */}
            <button
              onClick={() => { if(window.confirm(`Remove batch ${selectedBatchYear}?`)) {} }}
              className="h-11 px-6 bg-[#023347] text-white rounded-xl  text-sm font-semibold shadow-md hover:shadow-lg hover:bg-red-700 transition-all transform hover:-translate-y-0.5"
            >
              Remove Batch
            </button>
            {/* Edit — Edit style */}
            <button
              onClick={() => navigate("/admin/edit-batch", { state: { batch: batchDetails } })}
              className="h-11 px-6 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
            >
              Edit
            </button>
            {/* Add Batch — Edit style */}
            <button
              onClick={() => navigate("/add-batch")}
              className="h-11 px-6 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
            >
              Add Batch
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="am-tabs">
          {batches.map((b) => (
            <span
              key={b.batch_year}
              onClick={() => setSelectedBatchYear(b.batch_year)}
              className={`am-tab ${selectedBatchYear === b.batch_year ? "active" : ""}`}
            >
              {b.batch_year}
            </span>
          ))}
        </div>

        {loading ? (
          <p style={{ color: "#6b7280" }}>Loading details...</p>
        ) : batchDetails ? (
          <>
            {/* Batch Info */}
            <div className="am-batch-info" style={{ display: "flex", gap: "28px", alignItems: "flex-start", marginBottom: "32px" }}>
              <img
                src={batchDetails.batch_info.image_url || "https://via.placeholder.com/384x216"}
                className="am-batch-img"
                alt="batch"
                style={{ width: "384px", minWidth: "384px", height: "216px", borderRadius: "12px", objectFit: "cover", background: "#e5e7eb", flexShrink: 0 }}
              />
              <div style={{ paddingTop: "8px" }}>
                <h3 style={{ fontSize: "17px", fontWeight: 600, marginBottom: "8px", color: "#111827" }}>
                  {batchDetails.batch_info.title}
                </h3>
                <p style={{ color: "#6b7280", lineHeight: 1.65, fontSize: "14px" }}>
                  {batchDetails.batch_info.description}
                </p>
              </div>
            </div>

            {/* Members Table — inner scroll */}
            <div className="am-table-styled bg-white rounded-2xl shadow-sm border border-[#2A8E9E]/20 overflow-hidden" style={{ maxHeight: "380px", display: "flex", flexDirection: "column" }}>
              <div className="overflow-y-auto am-scrollbar overflow-x-auto">
                <table className="w-full text-left border-collapse" style={{ minWidth: "600px" }}>
                  <thead className="bg-[#2A8E9E] sticky top-0 z-10">
                    <tr className="text-white">
                      <th className="px-6 py-4 font-semibold text-center">Name</th>
                      <th className="px-6 py-4 font-semibold text-center">Register no.</th>
                      <th className="px-6 py-4 font-semibold text-center">Role</th>
                      <th className="px-6 py-4 font-semibold text-center">Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {batchDetails.members.length > 0 ? (
                      batchDetails.members.map((member) => (
                        <tr key={member.register_number} className="hover:bg-gray-50">
                          <td className="px-6 py-5 text-[#023347] font-bold text-center">{member.name}</td>
                          <td className="px-6 py-5 text-center text-gray-600 text-sm">{member.register_number}</td>
                          <td className="px-6 py-5 text-center text-gray-600 text-sm">{member.role}</td>
                          <td className="px-6 py-5 text-center text-gray-600 text-sm">{member.year}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-20 text-center text-gray-400">No members found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="am-cards">
              {batchDetails.members.map((member) => (
                <div key={member.register_number} className="am-card">
                  <div className="am-card-name">{member.name}</div>
                  <div className="am-card-row"><span>Reg: {member.register_number}</span><span>Yr: {member.year}</span></div>
                  <div className="am-card-row" style={{ color: '#083A4B', fontWeight: 500 }}>{member.role}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={{ color: "#6b7280" }}>Select a batch to view details.</p>
        )}
      </div>
    </AdminSidebar>
  );
}