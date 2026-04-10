import React, { useState, useRef, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import { API_BASE } from "../config/api";

const API_BASE_URL = `${API_BASE}/admin/glories`;

const STYLES = `
  .gl-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  .gl-form-main { flex: 1; padding: 28px 36px; overflow-y: auto; }
  .gl-list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
  .gl-form-btns { display: flex; justify-content: flex-end; gap: 12px; }
  .gl-card-btns { display: flex; gap: 10px; }

  /* Styled input/textarea — matches Announcement page */
  .gl-input {
    width: 100%;
    padding: 11px;
    border-radius: 10px;
    border: 1.5px solid #d1d5db;
    margin-bottom: 20px;
    box-sizing: border-box;
    outline: none;
    font-size: 14px;
    background: #fff;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .gl-input:focus {
    border-color: #2A8E9E;
    box-shadow: 0 0 0 3px rgba(42, 142, 158, 0.18);
  }

  /* New Styling for the Add Glory Button */
  .gl-add-btn {
    background-color: #023347;
    color: #fff;
    padding: 10px 20px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Color change on hover and touch */
  .gl-add-btn:hover {
    background-color: #2A8E9E;
    box-shadow: 0 4px 12px rgba(42, 142, 158, 0.2);
  }

  /* Slight shrink effect when actually clicked/pressed */
  .gl-add-btn:active {
    transform: scale(0.96);
    background-color: #1f6b77;
  }

  .gl-card {
    background: #fff;
    border-radius: 20px;
    border: 1px solid #e2e8ec;
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .gl-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }

  .gl-card-img-container {
    height: 180px;
    background: #f8fafc;
    overflow: hidden;
    position: relative;
  }

  .gl-card-img-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .gl-card:hover .gl-card-img-container img {
    transform: scale(1.1);
  }
  
  .img-upload-container {
    position: relative;
    border: 2px dashed #2A8E9E;
    border-radius: 12px;
    min-height: 190px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-bottom: 24px;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  .img-upload-container:hover {
    background-color: rgba(42, 142, 158, 0.05);
    border-color: #023347;
  }
  .img-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    transition: opacity 0.3s;
    font-weight: 600;
    font-size: 14px;
  }
  .img-upload-container:hover .img-overlay { opacity: 1; }
  .img-upload-container img { width: 100%; height: auto; display: block; object-fit: contain; }

  .delete-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .delete-modal-card {
    background: #fff;
    border-radius: 16px;
    padding: 36px 32px 28px 32px;
    max-width: 420px;
    width: 90%;
    box-shadow: 0 8px 40px rgba(0,0,0,0.18);
    text-align: center;
  }
  .delete-modal-icon {
    width: 56px;
    height: 56px;
    background: #fee2e2;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 18px auto;
    font-size: 26px;
  }

  @keyframes gl-spin { to { transform: rotate(360deg); } }
  @keyframes gl-toast-in {
    from { opacity: 0; transform: translateY(-16px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .gl-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: gl-spin 0.7s linear infinite;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
  }
  .gl-toast {
    position: fixed; top: 28px; right: 32px; z-index: 9999;
    display: flex; align-items: center; gap: 12px;
    background: #023347; color: #fff;
    padding: 14px 22px; border-radius: 12px;
    box-shadow: 0 8px 32px rgba(2,51,71,0.25);
    font-size: 14px; font-weight: 600;
    animation: gl-toast-in 0.3s ease forwards;
  }
  .gl-toast-icon {
    width: 26px; height: 26px; border-radius: 50%;
    background: #2A8E9E;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .gl-toast-close {
    background: none; border: none; color: #9bd3e0;
    cursor: pointer; font-size: 20px; line-height: 1; margin-left: 6px; padding: 0;
  }

  @media (max-width: 768px) { .gl-grid { grid-template-columns: repeat(2, 1fr) !important; } }
  @media (max-width: 480px) {
    .gl-grid { grid-template-columns: 1fr !important; }
    .gl-form-main { padding: 20px 16px !important; }
    .gl-form-btns { flex-direction: column !important; }
    .gl-form-btns button, .gl-list-header button { width: 100% !important; }
  }
`;

function GlToast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="gl-toast">
      <span className="gl-toast-icon">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      {message}
      <button className="gl-toast-close transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md active:scale-95" onClick={onClose}>×</button>
    </div>
  );
}

function LoadingButton({ loading, onClick, className, style, children, loadingLabel, disabled }) {
  return (
    <button
      className={`transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg active:scale-95 ${className || ""}`}
      onClick={onClick}
      disabled={loading || disabled}
      style={{ opacity: loading ? 0.8 : 1, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, ...style }}
    >
      {loading && <span className="gl-spinner" />}
      {loading ? (loadingLabel || "Please wait...") : children}
    </button>
  );
}

function DeleteModal({ glory, onCancel, onConfirm, loading }) {
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-card">
        <div className="delete-modal-icon">🗑️</div>
        <h2 style={{ color: "#023347", fontSize: "20px", fontWeight: 700, marginBottom: "10px" }}>Delete Glory</h2>
        <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "6px" }}>You are about to delete <span style={{ fontWeight: 700, color: "#023347" }}>"{glory.title}"</span>.</p>
        <p style={{ color: "#ef4444", fontSize: "13px", fontWeight: 600, marginBottom: "28px" }}>⚠️ This content will be deleted permanently.</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button className="transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg active:scale-95 h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:bg-[#2A8E9E]" onClick={onCancel} disabled={loading}>Cancel</button>
          <LoadingButton loading={loading} onClick={onConfirm} className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:bg-red-700 transition-all">Confirm Delete</LoadingButton>
        </div>
      </div>
    </div>
  );
}

function GloryForm({ heading, initialTitle, initialDescription, initialImage, onCancel, onSave, saveLabel }) {
  const [title, setTitle] = useState(initialTitle || "");
  const [description, setDescription] = useState(initialDescription || "");
  const [preview, setPreview] = useState(initialImage || null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setFieldError(true);
      return;
    }
    setFieldError(false);
    setLoading(true);
    try { await onSave({ title, description, imageFile }); } finally { setLoading(false); }
  };

  return (
    <main className="gl-form-main">
      <h1 style={{ color: "#023347", fontSize: "22px", fontWeight: 700, marginBottom: "28px" }}>{heading}</h1>
      <label style={{ marginBottom: "10px", display: "block", fontWeight: 600 }}>Thumbnail Picture</label>
      <div
        className="img-upload-container"
        onClick={() => fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          minHeight: preview ? "auto" : "190px",
          alignItems: preview ? "flex-start" : "center",
          ...(isDragging ? { borderColor: "#2A8E9E", borderStyle: "solid", background: "rgba(42,142,158,0.08)" } : {})
        }}
      >
        {preview
          ? (<><img src={preview} alt="preview" /><div className="img-overlay">{isDragging ? "Drop to replace" : "Click to Change Image"}</div></>)
          : (<div style={{ textAlign: "center", color: isDragging ? "#2A8E9E" : "#6b7280", pointerEvents: "none" }}>
              <p style={{ fontSize: "30px", margin: 0 }}>{isDragging ? "📥" : "+"}</p>
              <p style={{ fontSize: "14px" }}>{isDragging ? "Drop image here" : "Click or drag & drop image"}</p>
            </div>)
        }
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
      <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Title</label>
      <input
        value={title}
        onChange={(e) => { setTitle(e.target.value); if (fieldError) setFieldError(false); }}
        placeholder="Enter glory title..."
        className="gl-input"
        style={fieldError && !title.trim() ? { borderColor: "#ef4444", background: "#fff5f5" } : {}}
      />
      {fieldError && !title.trim() && <p style={{ color: "#ef4444", fontSize: 12, marginTop: -14, marginBottom: 14, fontWeight: 600 }}>⚠ Title is required</p>}
      <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Description</label>
      <textarea
        rows={6}
        value={description}
        onChange={(e) => { setDescription(e.target.value); if (fieldError) setFieldError(false); }}
        placeholder="Write a short description..."
        className="gl-input"
        style={{ resize: "vertical", marginBottom: fieldError && !description.trim() ? 6 : "30px", ...(fieldError && !description.trim() ? { borderColor: "#ef4444", background: "#fff5f5" } : {}) }}
      />
      {fieldError && !description.trim() && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 24, fontWeight: 600 }}>⚠ Description is required</p>}
      <div className="gl-form-btns">
        <button className="transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg active:scale-95 h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:bg-red-700" onClick={onCancel} disabled={loading}>Cancel</button>
        <LoadingButton loading={loading} loadingLabel="Saving..." onClick={handleSubmit} className="h-11 px-10 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:bg-[#2A8E9E] transition-all">{saveLabel}</LoadingButton>
      </div>
    </main>
  );
}

export default function GloriesAdmin() {
  const [glories, setGlories] = useState([]);
  const [view, setView] = useState("list");
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [isVisible, setIsVisible] = useState(false);   // ← NEW
  const sectionRef = useRef(null);                      // ← NEW

  const showToast = (msg) => { setToast(msg); };

  const getGloryId = (glory) => glory?.glorie_id ?? glory?.glory_id ?? glory?.id ?? null;

  useEffect(() => {
    loadData();
    const handleResetView = (e) => {
      if (e.detail === '/admin/glories') setView('list');
    };
    window.addEventListener('reset-view', handleResetView);

    // ← NEW: IntersectionObserver for title entrance animation
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      window.removeEventListener('reset-view', handleResetView);
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      const json = await res.json();
      setGlories(json.data || []);
    } catch (err) { console.error(err); }
  };

  const handleSaveAdd = async ({ title, description, imageFile }) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);
    const res = await fetch(API_BASE_URL, { method: "POST", body: formData });
    if (res.ok) { showToast("Glory added successfully!"); setView("list"); loadData(); }
  };

  const handleSaveEdit = async ({ title, description, imageFile }) => {
    const gloryId = getGloryId(editTarget);
    if (!gloryId) {
      showToast("Unable to update this glory. Missing id.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (editTarget?.image_url) formData.append("existing_image_url", editTarget.image_url);
    if (imageFile) formData.append("image", imageFile);
    const res = await fetch(`${API_BASE_URL}/${gloryId}`, { method: "PUT", body: formData });
    if (res.ok) { showToast("Glory updated successfully!"); setEditTarget(null); setView("list"); loadData(); }
  };

  const handleConfirmDelete = async () => {
    const gloryId = getGloryId(deleteTarget);
    if (!gloryId) {
      showToast("Unable to delete this glory. Missing id.");
      return;
    }

    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/${gloryId}`, { method: "DELETE" });
      if (res.ok) {
        setGlories((prev) => prev.filter((glory) => String(getGloryId(glory)) !== String(gloryId)));
        showToast("Glory deleted.");
        setDeleteTarget(null);
        loadData();
      }
    } catch (err) { console.error(err); }
    finally { setDeleteLoading(false); }
  };

  if (view === "add") return (
    <AdminSidebar>
      <style>{STYLES}</style>
      {toast && <GlToast message={toast} onClose={() => setToast(null)} />}
      <GloryForm heading="Add Glory" onCancel={() => setView("list")} onSave={handleSaveAdd} saveLabel="Add" />
    </AdminSidebar>
  );

  if (view === "edit") return (
    <AdminSidebar>
      <style>{STYLES}</style>
      {toast && <GlToast message={toast} onClose={() => setToast(null)} />}
      <GloryForm heading="Edit Glory" initialTitle={editTarget.title} initialDescription={editTarget.description} initialImage={editTarget.image_url} onCancel={() => setView("list")} onSave={handleSaveEdit} saveLabel="Save" />
    </AdminSidebar>
  );

  return (
    <AdminSidebar>
      <style>{STYLES}</style>
      {toast && <GlToast message={toast} onClose={() => setToast(null)} />}

      {deleteTarget && (
        <DeleteModal glory={deleteTarget} loading={deleteLoading} onCancel={() => !deleteLoading && setDeleteTarget(null)} onConfirm={handleConfirmDelete} />
      )}

      <main className="gl-form-main" ref={sectionRef}>  {/* ← ref added */}
        <div className="gl-list-header">
          {/* ← UPDATED: matches Announcement title style exactly */}
          <h1 className={`text-3xl font-extrabold text-[#023347] transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>Glories</h1>
          
          <button onClick={() => setView("add")} className="gl-add-btn transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md active:scale-95">
            + Add Glory
          </button>
        </div>

        <div className="gl-grid">
          {glories.map((g) => (
            <div key={getGloryId(g) ?? `${g.title}-${g.image_url || "glory"}`} className="gl-card group">
              <div className="gl-card-img-container">
                {g.image_url && <img src={g.image_url} alt={g.title} />}
              </div>
              <div style={{ padding: "20px", flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: 700, color: "#023347" }}>{g.title}</h3>
                <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: "1.5", marginBottom: "20px", flex: 1 }}>{g.description}</p>
                <div className="gl-card-btns">
                  <button onClick={() => { setEditTarget(g); setView("edit"); }} className="flex-1 h-10 bg-[#023347] text-white rounded-xl text-xs font-bold transition-all hover:bg-[#2A8E9E] duration-200 transform hover:-translate-y-1 hover:shadow-md active:scale-95">Edit</button>
                  <button onClick={() => setDeleteTarget(g)} className="flex-1 h-10 bg-[#023347] text-white rounded-xl text-xs font-bold transition-all hover:bg-red-600 duration-200 transform hover:-translate-y-1 hover:shadow-md active:scale-95">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </AdminSidebar>
  );
}