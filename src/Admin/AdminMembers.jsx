import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const API_BASE = "http://localhost:3000/api";
const ROLE_ORDER = [
  "Secretary",
  "Joint-Secretary",
  "Treasurer",
  "Joint-Treasurer",
  "Executive member",
];

const sortMembersByRole = (members = []) =>
  [...members].sort((a, b) => {
    const aIndex = ROLE_ORDER.indexOf(a.role);
    const bIndex = ROLE_ORDER.indexOf(b.role);
    const safeAIndex = aIndex === -1 ? ROLE_ORDER.length : aIndex;
    const safeBIndex = bIndex === -1 ? ROLE_ORDER.length : bIndex;
    if (safeAIndex !== safeBIndex) return safeAIndex - safeBIndex;
    return (a.name || "").localeCompare(b.name || "");
  });

const TOAST_CSS = `
  @keyframes am-toast-in {
    from { opacity: 0; transform: translateY(-16px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .am-toast {
    position: fixed; top: 28px; right: 32px; z-index: 9999;
    display: flex; align-items: center; gap: 12px;
    background: #023347; color: #fff;
    padding: 14px 22px; border-radius: 12px;
    box-shadow: 0 8px 32px rgba(2,51,71,0.25);
    font-size: 14px; font-weight: 600;
    animation: am-toast-in 0.3s ease forwards;
  }
  .am-toast-icon {
    width: 26px; height: 26px; border-radius: 50%; background: #2A8E9E;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .am-toast-close {
    background: none; border: none; color: #9bd3e0;
    cursor: pointer; font-size: 20px; line-height: 1; margin-left: 6px; padding: 0;
  }
`;

function MemberToast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="am-toast">
      <span className="am-toast-icon">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      {message}
      <button className="am-toast-close" onClick={onClose}>×</button>
    </div>
  );
}

export default function AdminMembers() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [batchDetails, setBatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => setToast(msg);

  const selectedBatch = useMemo(
    () => batches.find((batch) => String(batch.batch_id) === String(selectedBatchId)) || null,
    [batches, selectedBatchId]
  );
  const orderedMembers = useMemo(
    () => sortMembersByRole(batchDetails?.members || []),
    [batchDetails]
  );

  const fetchBatches = async () => {
    const res = await fetch(`${API_BASE}/association-batches`);
    if (!res.ok) {
      throw new Error("Failed to fetch association batches");
    }

    const data = await res.json();
    setBatches(Array.isArray(data) ? data : []);

    if (!data.length) {
      setSelectedBatchId("");
      setBatchDetails(null);
      setLoading(false);
      return;
    }

    setSelectedBatchId((current) => {
      if (current && data.some((batch) => String(batch.batch_id) === String(current))) {
        return current;
      }
      return String(data[0].batch_id);
    });
  };

  const fetchBatchDetails = async (batchId) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/association-batch/${batchId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch batch details");
      }
      const data = await res.json();
      setBatchDetails(data);
    } catch (error) {
      console.error("Error fetching batch details:", error);
      setBatchDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBatch = async () => {
    if (!selectedBatch || deleting) return;
    if (!window.confirm(`Remove batch ${selectedBatch.batch_year}?`)) return;

    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/admin/association-batch/${selectedBatch.batch_id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to remove batch");
      showToast("Batch removed successfully.");
      await fetchBatches();
    } catch (error) {
      console.error("Error deleting batch:", error);
      showToast(error.message || "Failed to remove batch.");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchBatches().catch((error) => {
      console.error("Error fetching batches:", error);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedBatchId) {
      fetchBatchDetails(selectedBatchId);
    }
  }, [selectedBatchId]);

  return (
    <AdminSidebar>
      <style>{TOAST_CSS}</style>
      {toast && <MemberToast message={toast} onClose={() => setToast(null)} />}
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
              onClick={handleDeleteBatch}
              disabled={!selectedBatch || deleting}
              className="h-11 px-6 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-red-700 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {deleting ? "Removing..." : "Remove Batch"}
            </button>
            {/* Edit — Edit style */}
            <button
              onClick={() => batchDetails && navigate("/admin/edit-batch", { state: { batch: batchDetails } })}
              disabled={!batchDetails}
              className="h-11 px-6 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Edit Batch
            </button>
            {/* Add Batch — Edit style */}
            <button
              onClick={() => navigate("/admin/add-batch")}
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
              key={b.batch_id}
              onClick={() => setSelectedBatchId(String(b.batch_id))}
              className={`am-tab ${String(selectedBatchId) === String(b.batch_id) ? "active" : ""}`}
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
                alt={batchDetails.batch_info.title || "batch"}
                style={{ width: "384px", minWidth: "384px", height: "216px", borderRadius: "12px", objectFit: "cover", background: "#e5e7eb", flexShrink: 0 }}
              />
              <div style={{ paddingTop: "8px" }}>
                <div style={{ color: "#2A8E9E", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
                  Batch {batchDetails.batch_info.batch_year}
                </div>
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
                      <th className="px-6 py-4 font-semibold text-center">Phone no.</th>
                      <th className="px-6 py-4 font-semibold text-center">Role</th>
                      <th className="px-6 py-4 font-semibold text-center">Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orderedMembers.length > 0 ? (
                      orderedMembers.map((member) => (
                       <tr key={member.member_id} className="hover:bg-[#f4fafb] transition-colors duration-200">
                          <td className="px-6 py-5 text-[#023347] font-bold text-center">{member.name}</td>
                          <td className="px-6 py-5 text-center text-gray-600 text-sm">{member.register_number || member.phone_number}</td>
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
              {orderedMembers.map((member) => (
                <div key={member.member_id} className="am-card">
                  <div className="am-card-name">{member.name}</div>
                  <div className="am-card-row"><span>Phone: {member.register_number || member.phone_number}</span><span>Yr: {member.year}</span></div>
                  <div className="am-card-row" style={{ color: "#083A4B", fontWeight: 500 }}>{member.role}</div>
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
