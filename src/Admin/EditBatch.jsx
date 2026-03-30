import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const API_BASE = "http://localhost:3000/api";
const YEAR_OPTIONS = ["I", "II", "III", "IV"];

export default function EditBatch() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [batchId, setBatchId] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [members, setMembers] = useState([]);
  const [originalMembers, setOriginalMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = location.state?.batch;
    if (data && data.batch_info) {
      const info = data.batch_info;
      const normalizedMembers = (data.members || []).map((member) => ({
        member_id: member.member_id ?? null,
        name: member.name || "",
        register_number: member.register_number || member.phone_number || "",
        role: member.role || "",
        year: member.year || "",
        batch_year: member.batch_year || info.batch_year || "",
      }));
      setBatchId(String(info.batch_id || ""));
      setBatchYear(info.batch_year);
      setTitle(info.title || "");
      setDescription(info.description || "");
      setExistingImageUrl(info.image_url || "");
      setPreviewUrl(info.image_url || "");
      setMembers(normalizedMembers);
      setOriginalMembers(normalizedMembers);
    } else {
      console.warn("No batch data found in state. Redirecting...");
      navigate("/admin/members");
    }
  }, [location, navigate]);

  const handleSaveAll = async () => {
    if (!batchId || !batchYear.trim() || !title.trim() || !description.trim()) {
      alert("Batch year, title and description are required.");
      return;
    }

    const hasInvalidMember = members.some(
      (member) => !member.name.trim() || !member.register_number.trim() || !member.role.trim() || !member.year
    );

    if (hasInvalidMember) {
      alert("Each member needs a name, register number, role and year.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("batch_year", batchYear.trim());
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("existing_image_url", existingImageUrl);
      if (newImageFile) formData.append("image", newImageFile);

      const batchRes = await fetch(`${API_BASE}/admin/association-batch/${batchId}`, {
        method: "PUT",
        body: formData,
      });
      const batchData = await batchRes.json().catch(() => ({}));
      if (!batchRes.ok) throw new Error(batchData.message || "Failed to update batch info");

      const removedMembers = originalMembers.filter(
        (originalMember) =>
          originalMember.member_id &&
          !members.some((member) => String(member.member_id) === String(originalMember.member_id))
      );

      await Promise.all(
        removedMembers.map(async (member) => {
          const response = await fetch(`${API_BASE}/admin/association-members/${member.member_id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to delete member ${member.name}`);
          }
        })
      );

      await Promise.all(
        members.map(async (member) => {
          const payload = {
            name: member.name.trim(),
            register_number: member.register_number.trim(),
            role: member.role.trim(),
            year: member.year?.trim() || "",
            batch_year: batchYear.trim(),
          };

          const response = await fetch(
            member.member_id
              ? `${API_BASE}/admin/association-members/${member.member_id}`
              : `${API_BASE}/admin/association-members`,
            {
              method: member.member_id ? "PUT" : "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to save member ${member.name}`);
          }
        })
      );

      alert("Batch and members updated successfully!");
      navigate("/admin/members");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = (index) => {
    if (!window.confirm("Remove this member?")) return;
    setMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddMember = () => {
    setMembers(prev => [
      ...prev,
      { member_id: null, name: "", register_number: "", role: "", year: "", batch_year: batchYear }
    ]);
  };

  return (
    <AdminSidebar>
      <style>{`
        .eb-scrollbar::-webkit-scrollbar { width: 6px; }
        .eb-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .eb-scrollbar::-webkit-scrollbar-thumb { background: #9ca3af; border-radius: 10px; }
        .eb-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280; }
        .eb-input { width: 100%; padding: 10px 14px; border-radius: 8px; border: 1.5px solid #e2e8ec; background: #fff; font-size: 14px; color: #023347; outline: none; box-sizing: border-box; }
        .eb-input:focus { border-color: #2A8E9E; box-shadow: 0 0 0 3px rgba(42,142,158,0.1); }
        .eb-label { display: block; font-weight: 600; font-size: 14px; color: #023347; margin-bottom: 6px; }
      `}</style>

      <div style={{ flex: 1, overflowY: "auto", padding: "36px 40px" }}>

        {/* Header: title left, Add Member right */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#083A4B", margin: 0 }}>Edit Batch</h2>
          <button
            onClick={handleAddMember}
            className="h-11 px-6 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
          >
            + Add Member
          </button>
        </div>

        {/* Batch Info: image left, form fields right */}
        <div style={{ display: "flex", gap: "28px", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap" }}>
          <div style={{ width: "320px", flexShrink: 0 }}>
            <div style={{ width: "100%", height: "180px", background: "#0d2233", borderRadius: "10px", overflow: "hidden" }}>
              <img 
                src={previewUrl || "https://placehold.jp/320x180.png"} 
                alt="Preview" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>
            <input type="file" ref={fileInputRef} hidden onChange={(e) => {
              const file = e.target.files[0];
              if (file) { setNewImageFile(file); setPreviewUrl(URL.createObjectURL(file)); }
            }} />
            <button 
              onClick={() => fileInputRef.current.click()}
              style={{ marginTop: "10px", width: "100%", padding: "9px", cursor: "pointer", background: "#f8f9fa", border: "1px solid #ccc", borderRadius: "8px", fontSize: "14px", fontWeight: 500 }}
            >
              Change Batch Image
            </button>
          </div>

          <div style={{ flex: 1, minWidth: "300px" }}>
            <label className="eb-label">Batch Year</label>
            <input className="eb-input" style={{ marginBottom: "16px" }} value={batchYear} onChange={e => setBatchYear(e.target.value)} />

            <label className="eb-label">Batch Title</label>
            <input className="eb-input" style={{ marginBottom: "16px" }} value={title} onChange={e => setTitle(e.target.value)} />

            <label className="eb-label">Description</label>
            <textarea
              className="eb-input"
              style={{ height: "80px", resize: "none" }}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Members Table — inner scrollable */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#2A8E9E]/20 overflow-hidden" style={{ maxHeight: "420px", display: "flex", flexDirection: "column" }}>
          <div className="overflow-y-auto eb-scrollbar overflow-x-auto">
            <table className="w-full text-left border-collapse" style={{ minWidth: "700px" }}>
              <thead className="bg-[#2A8E9E] sticky top-0 z-10">
                <tr className="text-white">
                  <th className="px-6 py-4 font-semibold text-center">Name</th>
                  <th className="px-6 py-4 font-semibold text-center">Phone no.</th>
                  <th className="px-6 py-4 font-semibold text-center">Role</th>
                  <th className="px-6 py-4 font-semibold text-center">Year</th>
                  <th className="px-6 py-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.length > 0 ? members.map((m, index) => (
                  <tr key={m.member_id || `new-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-center">
                      <input className="eb-input" value={m.name} onChange={e => { const u = [...members]; u[index].name = e.target.value; setMembers(u); }} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input className="eb-input" value={m.register_number} onChange={e => { const u = [...members]; u[index].register_number = e.target.value; setMembers(u); }} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input className="eb-input" value={m.role} onChange={e => { const u = [...members]; u[index].role = e.target.value; setMembers(u); }} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select className="eb-input" value={m.year} onChange={e => { const u = [...members]; u[index].year = e.target.value; setMembers(u); }}>
                        <option value="">Select year</option>
                        {YEAR_OPTIONS.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleRemoveMember(index)}
                        className="h-9 px-5 bg-[#023347] text-white rounded-xl text-xs font-semibold shadow-md hover:shadow-lg hover:bg-red-700 transition-all transform hover:-translate-y-0.5"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-20 text-center text-gray-400">No members found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer buttons */}
        <div style={{ marginTop: "28px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button
            onClick={() => navigate(-1)}
            className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-red-700 transition-all transform hover:-translate-y-0.5"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAll}
            disabled={loading}
            className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
          >
            {loading ? "Saving..." : "Update Everything"}
          </button>
        </div>
      </div>
    </AdminSidebar>
  );
}
