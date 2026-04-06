import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { API_BASE } from "../config/api";

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

// ── Toast rendered via portal — always on top, outside any sidebar DOM ──
function Toast({ toast }) {
  if (!toast) return null;
  return ReactDOM.createPortal(
    <>
      <style>{`
        @keyframes abToastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
      <div style={{
        position: "fixed", bottom: 28, left: "50%",
        transform: "translateX(-50%)",
        padding: "12px 28px", borderRadius: 10,
        fontSize: 14, fontWeight: 600, color: "#fff",
        zIndex: 99999,
        boxShadow: "0 4px 18px rgba(0,0,0,0.22)",
        whiteSpace: "nowrap",
        background: toast.type === "error" ? "#dc2626" : "#2A8E9E",
        animation: "abToastIn 0.25s ease",
      }}>
        {toast.type === "error" ? "✕  " : "✓  "}{toast.message}
      </div>
    </>,
    document.body
  );
}

// ── PhoneInput: digits only, hard cap at 10 via keydown + onChange + paste ──
function PhoneInput({ value, onChange, placeholder, className }) {
  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    onChange(digits);
  };
  const handleKeyDown = (e) => {
    const nav = ["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Tab","Home","End"];
    if (nav.includes(e.key)) return;
    if (!/^\d$/.test(e.key)) { e.preventDefault(); return; }
    if (value.length >= 10) { e.preventDefault(); }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 10);
    onChange(digits);
  };
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={10}
      value={value}
      placeholder={placeholder}
      className={className}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
    />
  );
}

export default function AddBatch() {
  const navigate = useNavigate();
  const fileRef = useRef();
  const toastTimer = useRef(null);

  const [batchYear, setBatchYear]   = useState("");
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile]   = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [members, setMembers]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [memberForm, setMemberForm]     = useState({ name: "", reg: "", role: "", year: "" });
  const [removeIndex, setRemoveIndex]   = useState(null);

  /* ── Image ── */
  const handleImage = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };
  const handleDragOver  = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDrop      = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); handleImage(e.dataTransfer.files[0]); };

  /* ── Add member ── */
  const handleAddMember = () => {
    if (!memberForm.name.trim() || !memberForm.reg.trim() || !memberForm.role || !memberForm.year) {
      showToast("Name, Phone Number, Role and Year are required.", "error"); return;
    }
    if (memberForm.reg.length !== 10) {
      showToast("Phone number must be exactly 10 digits.", "error"); return;
    }
    setMembers((prev) => sortMembersByRole([...prev, memberForm]));
    showToast(`${memberForm.name} added successfully.`);
    setMemberForm({ name: "", reg: "", role: "", year: "" });
    setShowAddModal(false);
  };

  /* ── Remove member ── */
  const handleRemove = () => {
    const name = members[removeIndex]?.name || "Member";
    setMembers((prev) => prev.filter((_, i) => i !== removeIndex));
    showToast(`${name} removed from list.`);
    setRemoveIndex(null);
  };

  /* ── Save ── */
  const handleSave = async () => {
    if (!batchYear.trim() || !title.trim() || !description.trim()) {
      showToast("Please fill in Batch Year, Title, and Description.", "error"); return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("batch_year", batchYear);
      formData.append("title", title);
      formData.append("description", description);
      if (imageFile) formData.append("image", imageFile);

      const batchResponse = await fetch(`${API_BASE}/admin/association-batch`, { method: "POST", body: formData });
      if (!batchResponse.ok) {
        const err = await batchResponse.json().catch(() => ({}));
        throw new Error(err.message || "Failed to add batch");
      }

      const results = await Promise.all(
        members.map((m) =>
          fetch(`${API_BASE}/admin/association-members`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ register_number: m.reg, name: m.name, role: m.role, year: m.year, batch_year: batchYear }),
          })
        )
      );
      const failed = results.filter((r) => !r.ok);
      if (failed.length > 0) {
        showToast(`${failed.length} member(s) failed to upload, but batch was created.`, "error");
        setTimeout(() => navigate(-1), 2000);
      } else {
        showToast("Batch and members added successfully!");
        setTimeout(() => navigate(-1), 1500);
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: "100%", border: "1px solid #d1d5db", borderRadius: 8, padding: "12px", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", color: "#111827" };
  const labelStyle = { display: "block", marginBottom: 4, color: "#4b5563", fontSize: 14 };

  return (
    <AdminSidebar>
      <Toast toast={toast} />

      <style>{`
        .ab-top-form { display: flex; gap: 40px; margin-bottom: 32px; align-items: flex-start; }
        .ab-upload-box { width: 420px; min-width: 420px; height: 220px; border: 2px dashed #d1d5db; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 14px; flex-shrink: 0; cursor: pointer; overflow: hidden; position: relative; transition: border-color 0.2s, background 0.2s; }
        .ab-upload-box.dragging { border-color: #2A8E9E; border-style: solid; background: rgba(42,142,158,0.07); color: #2A8E9E; }
        .ab-upload-box img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
        .ab-fields { flex: 1; display: flex; flex-direction: column; gap: 16px; }
        .ab-table-wrap { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; }
        .ab-table { width: 100%; border-collapse: collapse; }
        .ab-table thead { background: #3DA6B6; color: #fff; }
        .ab-table th, .ab-table td { padding: 16px; text-align: left; font-size: 14px; }
        .ab-table td { color: #6b7280; border-top: 1px solid #f3f4f6; }
        .ab-input { width: 100%; border: 1px solid #d1d5db; border-radius: 8px; padding: 12px; font-size: 14px; outline: none; font-family: inherit; box-sizing: border-box; color: #111827; transition: border-color 0.2s, box-shadow 0.2s; }
        .ab-input:focus { border-color: #2A8E9E; box-shadow: 0 0 0 3px rgba(42,142,158,0.18); }
        .ab-btn-row { display: flex; justify-content: flex-end; gap: 16px; margin-top: 32px; }
        .ab-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 0 16px; }
        .ab-modal { background: #fff; border-radius: 14px; padding: 32px; width: 100%; max-width: 480px; box-sizing: border-box; }
        .ab-modal h3 { font-size: 17px; font-weight: 700; color: #111827; margin-bottom: 20px; }
        .ab-modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
        .ab-modal-btns { display: flex; justify-content: flex-end; gap: 12px; }
        .ab-btn-save { height: 44px; padding: 0 32px; background: #023347; color: #fff; border-radius: 12px; border: none; font-weight: 600; font-size: 14px; cursor: pointer; font-family: inherit; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: all 0.2s; }
        .ab-btn-save:hover:not(:disabled) { background: #2A8E9E; box-shadow: 0 4px 14px rgba(0,0,0,0.2); transform: translateY(-2px); }
        .ab-btn-save:disabled { opacity: 0.7; cursor: not-allowed; }
        .ab-btn-cancel { height: 44px; padding: 0 32px; background: #023347; color: #fff; border-radius: 12px; border: none; font-weight: 600; font-size: 14px; cursor: pointer; font-family: inherit; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: all 0.2s; }
        .ab-btn-cancel:hover:not(:disabled) { background: #b91c1c; box-shadow: 0 4px 14px rgba(0,0,0,0.2); transform: translateY(-2px); }
        .ab-btn-add-member { height: 36px; padding: 0 16px; background: #023347; color: #fff; border-radius: 10px; border: none; font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; box-shadow: 0 2px 6px rgba(0,0,0,0.15); transition: all 0.2s; }
        .ab-btn-add-member:hover { background: #2A8E9E; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transform: translateY(-1px); }
        @media (max-width: 768px) {
          .ab-top-form { flex-direction: column; gap: 20px; }
          .ab-upload-box { width: 100%; min-width: unset; height: 180px; }
          .ab-table { display: none; }
          .ab-modal-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#111827", marginBottom: 24 }}>Add New Batch</h1>

        <div className="ab-top-form">
          {/* Upload Box */}
          <div className={`ab-upload-box${isDragging ? " dragging" : ""}`} onClick={() => fileRef.current.click()} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            {previewUrl ? <img src={previewUrl} alt="Preview" /> : (
              <div style={{ textAlign: "center", pointerEvents: "none" }}>
                <span>{isDragging ? "Drop image here" : "Click or drag & drop image"}</span>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleImage(e.target.files[0])} />
          </div>

          {/* Batch Fields */}
          <div className="ab-fields">
            <div>
              <label style={labelStyle}>Batch Year (e.g. 2023)</label>
              <input type="text" className="ab-input" value={batchYear} onChange={(e) => setBatchYear(e.target.value)} placeholder="2023" />
            </div>
            <div>
              <label style={labelStyle}>Batch Title</label>
              <input type="text" className="ab-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="SCINTEL 2023" />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea rows="3" className="ab-input" style={{ resize: "none" }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of this batch..." />
            </div>
          </div>
        </div>

        {/* Members Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Members</span>
          <button onClick={() => setShowAddModal(true)} className="ab-btn-add-member">+ Add Member</button>
        </div>

        {/* Members Table */}
        <div className="ab-table-wrap">
          <table className="ab-table">
            <thead>
              <tr><th>Name</th><th>Phone no.</th><th>Role</th><th>Year</th><th>Action</th></tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>No members added to this batch yet.</td></tr>
              ) : (
                members.map((m, i) => (
                  <tr key={i}>
                    <td>{m.name}</td><td>{m.reg}</td><td>{m.role}</td><td>{m.year}</td>
                    <td>
                      <button onClick={() => setRemoveIndex(i)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="ab-btn-row">
          <button className="ab-btn-cancel" onClick={() => navigate(-1)} disabled={loading}>Cancel</button>
          <button className="ab-btn-save" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Batch"}</button>
        </div>
      </div>

      {/* ── Add Member Modal ── */}
      {showAddModal && (
        <div className="ab-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="ab-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Member</h3>
            <div className="ab-modal-grid">
              <div>
                <label style={labelStyle}>Name</label>
                <input type="text" placeholder="Full name" className="ab-input" value={memberForm.name} onChange={(e) => setMemberForm((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <PhoneInput className="ab-input" placeholder="9876543210" value={memberForm.reg} onChange={(val) => setMemberForm((p) => ({ ...p, reg: val }))} />
              </div>
              <div>
                <label style={labelStyle}>Role</label>
                <select style={inputStyle} value={memberForm.role} onChange={(e) => setMemberForm((p) => ({ ...p, role: e.target.value }))}>
                  <option value="">Select role</option>
                  {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Year</label>
                <select style={inputStyle} value={memberForm.year} onChange={(e) => setMemberForm((p) => ({ ...p, year: e.target.value }))}>
                  <option value="">Select year</option>
                  {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="ab-modal-btns">
              <button onClick={() => { setShowAddModal(false); setMemberForm({ name: "", reg: "", role: "", year: "" }); }} className="ab-btn-cancel">Cancel</button>
              <button className="ab-btn-save" onClick={handleAddMember}>Add to List</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Remove Confirm Modal ── */}
      {removeIndex !== null && (
        <div className="ab-modal-backdrop" onClick={() => setRemoveIndex(null)}>
          <div className="ab-modal" style={{ maxWidth: 380, textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <h3>Remove Member?</h3>
            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 24 }}>
              Are you sure you want to remove <strong>{members[removeIndex]?.name}</strong> from the list?
            </p>
            <button onClick={handleRemove} style={{ background: "#ef4444", color: "#fff", width: "100%", marginBottom: 10, height: 44, borderRadius: 12, border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              Remove
            </button>
            <button onClick={() => setRemoveIndex(null)} className="ab-btn-cancel" style={{ width: "100%" }}>Cancel</button>
          </div>
        </div>
      )}
    </AdminSidebar>
  );
}