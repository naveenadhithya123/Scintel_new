import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function EditBatch() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  // ── State for Batch Info ──
  const [batchId, setBatchId] = useState("");
  const [originalYear, setOriginalYear] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // ── State for Members ──
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Capture the data passed via navigate state
    const data = location.state?.batch;

    if (data && data.batch_info) {
      const info = data.batch_info;
      
      setBatchId(info.batch_id);
      setOriginalYear(info.batch_year); 
      setBatchYear(info.batch_year);
      setTitle(info.title || "");
      setDescription(info.description || "");
      setExistingImageUrl(info.image_url || "");
      setPreviewUrl(info.image_url || "");
      setMembers(data.members || []); 
    } else {
      console.warn("No batch data found in state. Redirecting...");
      navigate("/admin-members"); 
    }
  }, [location, navigate]);

  // Handle removing a single member from the database
  const handleRemoveMember = async (regNum) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/admin/association-members/${regNum}`, { 
        method: "DELETE" 
      });
      if (res.ok) {
        setMembers(members.filter(m => m.register_number !== regNum));
      } else {
        alert("Failed to delete member from server.");
      }
    } catch (err) { 
      console.error(err);
      alert("Delete failed due to network error"); 
    }
  };

  // Save changes to Batch Info only
  const handleSaveBatch = async () => {
    if (!batchYear || !title) {
      alert("Batch Year and Title are required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("batch_year", batchYear);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("existing_image_url", existingImageUrl);
      if (newImageFile) formData.append("image", newImageFile);

      // Using batchId for the update
      const res = await fetch(`http://localhost:3000/api/admin/association-batch/${batchId}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        alert("Batch updated successfully!");
        navigate("/admin-members");
      } else {
        throw new Error("Failed to update batch info");
      }
    } catch (err) { 
      alert(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <AdminSidebar>
      <div style={{ padding: "40px", flex: 1, overflowY: "auto" }}>
        {/* Header with Add Member Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 25 }}>
          <h2 style={{ color: "#083A4B", margin: 0 }}>Edit Batch: {originalYear}</h2>
          <button 
            onClick={() => navigate("/add-member", { state: { batch_year: batchYear } })} 
            style={{ background: "#3DA6B6", color: "#fff", padding: "10px 18px", border: "none", borderRadius: 6, fontWeight: "600", cursor: "pointer" }}
          >
            + Add Member to this Batch
          </button>
        </div>

        {/* Batch Info Section */}
        <div style={{ display: "flex", gap: "40px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Left: Image Upload */}
          <div style={{ width: "320px" }}>
            <div style={{ width: "100%", height: "180px", background: "#f0f0f0", borderRadius: "10px", overflow: "hidden", border: "1px solid #ddd" }}>
              <img 
                src={previewUrl || "https://placehold.jp/320x180.png"} 
                alt="Preview" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              hidden 
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setNewImageFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }} 
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              style={{ marginTop: "12px", width: "100%", padding: "8px", cursor: "pointer", background: "#f8f9fa", border: "1px solid #ccc", borderRadius: "5px" }}
            >
              Change Batch Image
            </button>
          </div>

          {/* Right: Form Fields */}
          <div style={{ flex: 1, minWidth: "300px" }}>
            <label style={labelStyle}>Batch Year</label>
            <input style={inputStyle} value={batchYear} onChange={e => setBatchYear(e.target.value)} />
            
            <label style={labelStyle}>Batch Title</label>
            <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} />
            
            <label style={labelStyle}>Description</label>
            <textarea 
              style={{ ...inputStyle, height: "80px", resize: "none" }} 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
            />
          </div>
        </div>

        {/* Members List Table */}
        <h3 style={{ marginBottom: "15px", color: "#083A4B" }}>Batch Members</h3>
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f8f9fa", borderBottom: "2px solid #eee" }}>
              <tr>
                <th style={tdStyle}>Reg No</th>
                <th style={tdStyle}>Name</th>
                <th style={tdStyle}>Role</th>
                <th style={tdStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map(m => (
                  <tr key={m.register_number} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={tdStyle}>{m.register_number}</td>
                    <td style={tdStyle}>{m.name}</td>
                    <td style={tdStyle}>{m.role}</td>
                    <td style={tdStyle}>
                      <button 
                        onClick={() => navigate("/edit-member", { 
                          state: { 
                            member: m, 
                            batch_year: batchYear // <-- CRITICAL FIX: Passing batch_year to EditMember
                          } 
                        })} 
                        style={actionBtnStyle}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleRemoveMember(m.register_number)} 
                        style={{ ...actionBtnStyle, color: "#dc2626" }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: "30px", textAlign: "center", color: "#6b7280" }}>
                    No members found in this batch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div style={{ marginTop: 40, textAlign: "right", display: "flex", justifyContent: "flex-end", gap: "15px" }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ padding: "12px 25px", borderRadius: "8px", border: "1px solid #ccc", background: "#fff", cursor: "pointer", fontWeight: "600" }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveBatch} 
            disabled={loading} 
            style={saveBtnStyle}
          >
            {loading ? "Saving..." : "Save Batch Changes"}
          </button>
        </div>
      </div>
    </AdminSidebar>
  );
}

// ── Styles ──
const labelStyle = { display: "block", fontWeight: "600", fontSize: "14px", marginBottom: "5px", color: "#4b5563" };
const inputStyle = { width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", outlineColor: "#3DA6B6" };
const tdStyle = { padding: "14px 16px", textAlign: "left", fontSize: "14px", color: "#374151" };
const actionBtnStyle = { background: "none", border: "none", color: "#083A4B", fontWeight: "600", cursor: "pointer", marginRight: "15px", fontSize: "14px" };
const saveBtnStyle = { background: "#083A4B", color: "#fff", padding: "12px 35px", border: "none", borderRadius: 8, fontWeight: "600", cursor: "pointer", transition: "opacity 0.2s" };