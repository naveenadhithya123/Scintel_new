import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function EditBatch() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  // ── State for Batch Info ──
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

    // 2. LOGIC FIX: Check if we have the data. 
    // If you sent 'batchDetails' from AdminMembers, 'data.batch_info' will exist.
    if (data && data.batch_info) {
      const info = data.batch_info;
      
      setOriginalYear(info.batch_year); 
      setBatchYear(info.batch_year);
      setTitle(info.title || "");
      setDescription(info.description || "");
      setExistingImageUrl(info.image_url || "");
      setPreviewUrl(info.image_url || "");
      setMembers(data.members || []); 
    } else {
      // If data is missing (e.g. page refresh), redirect back to Admin Members
      console.warn("No batch data found in state. Redirecting...");
      navigate("/admin-members"); 
    }
  }, [location, navigate]);

  const handleSaveAll = async () => {
    if (!batchYear || !title) {
      alert("Batch Year and Title are required.");
      return;
    }

    setLoading(true);
    try {
      // A. Update Batch Details (Multipart/FormData)
      const formData = new FormData();
      formData.append("batch_year", batchYear);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("existing_image_url", existingImageUrl);
      if (newImageFile) formData.append("image", newImageFile);

      const batchRes = await fetch(`http://localhost:3000/api/admin/association-batch/${originalYear}`, {
        method: "PUT",
        body: formData,
      });

      if (!batchRes.ok) throw new Error("Failed to update batch info");

      // B. Update Members (Sequential PUT requests)
      const memberPromises = members.map(m => 
        fetch(`http://localhost:3000/api/admin/association-members/${m.register_number}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            name: m.name, 
            role: m.role, 
            year: m.year, 
            batch_year: batchYear // Link to updated batch year
          })
        })
      );

      await Promise.all(memberPromises);

      alert("Batch and members updated successfully!");
      navigate("/admin-members");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: "100%", padding: "10px", margin: "8px 0 18px", borderRadius: "6px", border: "1px solid #ccc" };

  return (
    <AdminSidebar>
      <div style={{ padding: "40px", flex: 1, overflowY: "auto" }}>
        <h2 style={{ marginBottom: "25px", color: "#083A4B" }}>Edit Batch: {originalYear}</h2>
        
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
            <input type="file" ref={fileInputRef} hidden onChange={(e) => {
              const file = e.target.files[0];
              if(file) {
                setNewImageFile(file);
                setPreviewUrl(URL.createObjectURL(file));
              }
            }} />
            <button 
              onClick={() => fileInputRef.current.click()}
              style={{ marginTop: "12px", width: "100%", padding: "8px", cursor: "pointer", background: "#f8f9fa", border: "1px solid #ccc", borderRadius: "5px" }}
            >
              Change Batch Image
            </button>
          </div>

          {/* Right: Form Fields */}
          <div style={{ flex: 1, minWidth: "300px" }}>
            <label style={{ fontWeight: "600", fontSize: "14px" }}>Batch Year</label>
            <input style={inputStyle} value={batchYear} onChange={e => setBatchYear(e.target.value)} />
            
            <label style={{ fontWeight: "600", fontSize: "14px" }}>Batch Title</label>
            <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} />
            
            <label style={{ fontWeight: "600", fontSize: "14px" }}>Description</label>
            <textarea 
              style={{ ...inputStyle, height: "80px", resize: "none" }} 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
            />
          </div>
        </div>

        <h3 style={{ marginBottom: "15px" }}>Batch Members</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <thead style={{ background: "#3DA6B6", color: "#fff" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "left" }}>Reg No</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Role</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Year</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px", color: "#666" }}>{m.register_number}</td>
                <td style={{ padding: "12px" }}>
                  <input 
                    style={{ padding: "6px", width: "90%" }}
                    value={m.name} 
                    onChange={e => {
                      const updated = [...members];
                      updated[index].name = e.target.value;
                      setMembers(updated);
                    }} 
                  />
                </td>
                <td style={{ padding: "12px" }}>
                  <input 
                    style={{ padding: "6px", width: "90%" }}
                    value={m.role} 
                    onChange={e => {
                      const updated = [...members];
                      updated[index].role = e.target.value;
                      setMembers(updated);
                    }} 
                  />
                </td>
                <td style={{ padding: "12px" }}>
                  <input 
                    style={{ padding: "6px", width: "90%" }}
                    value={m.year} 
                    onChange={e => {
                      const updated = [...members];
                      updated[index].year = e.target.value;
                      setMembers(updated);
                    }} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "30px", display: "flex", justifyContent: "flex-end", gap: "15px" }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ padding: "10px 25px", borderRadius: "6px", border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveAll} 
            disabled={loading}
            style={{ padding: "10px 30px", borderRadius: "6px", border: "none", background: "#083A4B", color: "#fff", cursor: "pointer", fontWeight: "600" }}
          >
            {loading ? "Saving..." : "Update Everything"}
          </button>
        </div>
      </div>
    </AdminSidebar>
  );
}