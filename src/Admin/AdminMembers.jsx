import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminMembers() {
  const navigate = useNavigate();

  // ── State for API Data ──
  const [batches, setBatches] = useState([]); // List for tabs
  const [selectedBatchYear, setSelectedBatchYear] = useState("");
  const [batchDetails, setBatchDetails] = useState(null); // Info + Members list
  const [loading, setLoading] = useState(true);

  // 1. Fetch all available batches for the tabs
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

  // 2. Fetch specific details (info + members) when a tab is clicked
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

  // 3. Handle Batch Deletion
  const handleRemoveBatch = async () => {
    if (!batchDetails?.batch_info?.batch_id) return;
    
    if (!window.confirm(`Are you sure you want to delete the entire ${selectedBatchYear} batch?`)) return;
    
    try {
      const res = await fetch(`http://localhost:3000/api/admin/association-batch/${batchDetails.batch_info.batch_id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        alert("Batch deleted successfully");
        window.location.reload(); // Refresh to update tabs and clear deleted data
      } else {
        alert("Failed to delete batch");
      }
    } catch (err) {
      console.error("Error deleting batch:", err);
      alert("Error deleting batch");
    }
  };

  // Run on mount
  useEffect(() => {
    fetchBatches();
  }, []);

  // Run whenever the selected tab year changes
  useEffect(() => {
    if (selectedBatchYear) {
      fetchBatchDetails(selectedBatchYear);
    }
  }, [selectedBatchYear]);

  return (
    <AdminSidebar>
      <style>{`
        .am-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; gap: 12px; flex-wrap: wrap; }
        .am-header h1 { font-size: 22px; font-weight: 600; color: #1f2937; margin: 0; }
        .am-header-btns { display: flex; gap: 12px; }
        .am-tabs { display: flex; gap: 28px; color: #6b7280; margin-bottom: 32px; font-size: 14px; flex-wrap: wrap; border-bottom: 1px solid #eee; }
        .am-tab { cursor: pointer; padding-bottom: 8px; transition: color 0.2s; white-space: nowrap; border-bottom: 2px solid transparent; }
        .am-tab.active { border-bottom: 2px solid #083A4B; font-weight: 600; color: #083A4B; }
        .am-batch-info { display: flex; gap: 28px; align-items: flex-start; margin-bottom: 36px; }
        .am-batch-img { width: 384px; min-width: 384px; height: 216px; background: #e5e7eb; border-radius: 12px; flex-shrink: 0; object-fit: cover; }
        .am-batch-text h3 { font-size: 17px; font-weight: 600; margin-bottom: 8px; color: #111827; }
        .am-batch-text p { color: #6b7280; line-height: 1.65; font-size: 14px; }
        .am-table-wrap { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; min-height: 100px; }
        .am-table { width: 100%; border-collapse: collapse; }
        .am-table thead { background: #3DA6B6; color: #fff; }
        .am-table th, .am-table td { padding: 14px 16px; text-align: left; font-size: 14px; }
        .am-table td { color: #4b5563; border-top: 1px solid #f3f4f6; }
        .am-cards { display: none; }
        @media (max-width: 768px) {
          .am-batch-info { flex-direction: column; }
          .am-batch-img { width: 100%; min-width: unset; height: 180px; }
          .am-table { display: none; }
          .am-cards { display: block; }
          .am-card { padding: 16px; border-top: 1px solid #f3f4f6; }
          .am-card-name { font-weight: 600; margin-bottom: 4px; }
          .am-card-row { display: flex; justify-content: space-between; font-size: 13px; color: #6b7280; }
        }
      `}</style>

      <div style={{ flex: 1, overflowY: "auto", padding: "36px 40px" }} className="am-main-pad">
        <div className="am-header">
          <h1>Association Members</h1>
          <div className="am-header-btns">
            <button 
              onClick={handleRemoveBatch} 
              style={{ ...btnStyle, background: "#dc2626" }}
            >
              Remove Batch
            </button>
            <button 
              onClick={() => navigate("/admin/edit-batch", { state: { batch: batchDetails } })} 
              style={btnStyle}
            >
              Edit
            </button>
            <button 
              onClick={() => navigate("/add-batch")} 
              style={btnStyle}
            >
              Add Batch
            </button>
          </div>
        </div>

        {/* Dynamic Tabs */}
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
          <p>Loading details...</p>
        ) : batchDetails ? (
          <>
            <div className="am-batch-info">
              <img 
                src={batchDetails.batch_info.image_url || "https://via.placeholder.com/384x216"} 
                className="am-batch-img" 
                alt="batch" 
              />
              <div className="am-batch-text">
                <h3>{batchDetails.batch_info.title}</h3>
                <p>{batchDetails.batch_info.description}</p>
              </div>
            </div>

            <div className="am-table-wrap">
              <table className="am-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Register no.</th>
                    <th>Role</th>
                    <th>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {batchDetails.members && batchDetails.members.length > 0 ? (
                    batchDetails.members.map((member) => (
                      <tr key={member.register_number}>
                        <td>{member.name}</td>
                        <td>{member.register_number}</td>
                        <td>{member.role}</td>
                        <td>{member.year}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                        No members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Mobile View */}
              <div className="am-cards">
                {batchDetails.members && batchDetails.members.map((member) => (
                  <div key={member.register_number} className="am-card">
                    <div className="am-card-name">{member.name}</div>
                    <div className="am-card-row">
                      <span>Reg: {member.register_number}</span>
                      <span>Yr: {member.year}</span>
                    </div>
                    <div className="am-card-row" style={{ color: '#083A4B', fontWeight: 500 }}>
                      {member.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p>Select a batch to view details.</p>
        )}
      </div>
    </AdminSidebar>
  );
}

const btnStyle = { 
  background: "#083A4B", 
  color: "#fff", 
  padding: "9px 20px", 
  borderRadius: 8, 
  border: "none", 
  fontWeight: 600, 
  fontSize: 14, 
  cursor: "pointer" 
};