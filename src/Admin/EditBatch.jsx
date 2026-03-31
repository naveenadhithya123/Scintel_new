import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const API_BASE = "http://localhost:3000/api";
const YEAR_OPTIONS = ["I", "II", "III", "IV"];
const ROLE_OPTIONS = ["Secretary", "Joint-Secretary", "Treasurer", "Joint-Treasurer", "Executive member"];

const sortMembersByRole = (members = []) =>
  [...members].sort((a, b) => {
    const roleOrder = ROLE_OPTIONS;
    const aIndex = roleOrder.indexOf(a.role);
    const bIndex = roleOrder.indexOf(b.role);
    const safeAIndex = aIndex === -1 ? roleOrder.length : aIndex;
    const safeBIndex = bIndex === -1 ? roleOrder.length : bIndex;
    if (safeAIndex !== safeBIndex) return safeAIndex - safeBIndex;
    return (a.name || "").localeCompare(b.name || "");
  });

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
  const [isDragging, setIsDragging] = useState(false);

  // ── Modal State ──
  const [showAddModal, setShowAddModal] = useState(false);
  const [memberForm, setMemberForm] = useState({ name: "", reg: "", role: "", year: "" });

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
      setMembers(sortMembersByRole(normalizedMembers));
      setOriginalMembers(sortMembersByRole(normalizedMembers));
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
      alert("Each member needs a name, phone number, role and year.");
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

  // ── Opens modal instead of inline row ──
  const handleAddMemberSubmit = () => {
    if (!memberForm.name.trim() || !memberForm.reg.trim() || !memberForm.role.trim() || !memberForm.year) {
      alert("Name, Phone Number, Role and Year are required.");
      return;
    }
    setMembers(prev => sortMembersByRole([...prev, {
      member_id: null,
      name: memberForm.name,
      register_number: memberForm.reg,
      role: memberForm.role,
      year: memberForm.year,
      batch_year: batchYear
    }]));
    setMemberForm({ name: "", reg: "", role: "", year: "" });
    setShowAddModal(false);
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
        .eb-img-drop { width: 320px; height: 180px; border-radius: 10px; overflow: hidden; position: relative; cursor: pointer; border: 2px dashed transparent; transition: border-color 0.2s, background 0.2s; flex-shrink: 0; }
        .eb-img-drop.dragging { border-color: #2A8E9E; background: rgba(42,142,158,0.07); }
        .eb-img-drop img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .eb-img-drop-overlay { position: absolute; inset: 0; background: rgba(2,51,71,0.55); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; font-size: 13px; font-weight: 600; opacity: 0; transition: opacity 0.2s; pointer-events: none; gap: 6px; }
        .eb-img-drop:hover .eb-img-drop-overlay { opacity: 1; }
      `}</style>

      <div style={{ flex: 1, overflowY: "auto", padding: "36px 40px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#083A4B", margin: 0 }}>Edit Batch</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="h-11 px-6 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
          >
            + Add Member
          </button>
        </div>

        {/* Batch Info */}
        <div style={{ display: "flex", gap: "28px", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap" }}>
          <div
            className={`eb-img-drop${isDragging ? " dragging" : ""}`}
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
            onDrop={(e) => {
              e.preventDefault(); e.stopPropagation(); setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file && file.type.startsWith("image/")) { setNewImageFile(file); setPreviewUrl(URL.createObjectURL(file)); }
            }}
          >
            {previewUrl
              ? <img src={previewUrl} alt="Preview" />
              : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: isDragging ? "#2A8E9E" : "#9ca3af", background: isDragging ? "rgba(42,142,158,0.07)" : "#0d2233" }}>
                  <span style={{ fontSize: 13, marginTop: 6 }}>{isDragging ? "Drop image here" : "Click or drag & drop"}</span>
                </div>
            }
            <div className="eb-img-drop-overlay">
              <span>{isDragging ? "Drop to replace" : "Click or drag to change"}</span>
            </div>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {
              const file = e.target.files[0];
              if (file) { setNewImageFile(file); setPreviewUrl(URL.createObjectURL(file)); }
            }} />
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

        {/* Members Table */}
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
                  <tr key={m.member_id || `new-${index}`} className="hover:bg-[#f4fafb] transition-colors duration-200">
                    <td className="px-6 py-4 text-center">
                      <input className="eb-input" value={m.name} onChange={e => { const u = [...members]; u[index].name = e.target.value; setMembers(sortMembersByRole(u)); }} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input className="eb-input" type="tel" value={m.register_number} onChange={e => { const u = [...members]; u[index].register_number = e.target.value; setMembers(sortMembersByRole(u)); }} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select className="eb-input" value={m.role} onChange={e => { const u = [...members]; u[index].role = e.target.value; setMembers(sortMembersByRole(u)); }}>
                        <option value="">Select role</option>
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select className="eb-input" value={m.year} onChange={e => { const u = [...members]; u[index].year = e.target.value; setMembers(sortMembersByRole(u)); }}>
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

        {/* Footer Buttons */}
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

      {/* ── Add Member Modal ── */}
      {showAddModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "0 16px" }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{ background: "#fff", borderRadius: 14, padding: 32, width: "100%", maxWidth: 480, boxSizing: "border-box" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 20 }}>Add Member</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", marginBottom: 4, color: "#4b5563", fontSize: 14 }}>Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  className="eb-input"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 4, color: "#4b5563", fontSize: 14 }}>Phone Number</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  className="eb-input"
                  value={memberForm.reg}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, reg: e.target.value }))}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 4, color: "#4b5563", fontSize: 14 }}>Role</label>
                <select
                  className="eb-input"
                  value={memberForm.role}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, role: e.target.value }))}
                >
                  <option value="">Select role</option>
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 4, color: "#4b5563", fontSize: 14 }}>Year</label>
                <select
                  className="eb-input"
                  value={memberForm.year}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, year: e.target.value }))}
                >
                  <option value="">Select year</option>
                  {YEAR_OPTIONS.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button
                onClick={() => { setShowAddModal(false); setMemberForm({ name: "", reg: "", role: "", year: "" }); }}
                className="h-11 px-6 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-red-700 transition-all transform hover:-translate-y-0.5"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMemberSubmit}
                className="h-11 px-6 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
              >
                Add to List
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminSidebar>
  );
}
