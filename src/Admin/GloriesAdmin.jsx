import React, { useState, useRef, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";

const API_BASE_URL = "http://localhost:3000/api/admin/glories";

const STYLES = `
  .gl-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  .gl-form-main { flex: 1; padding: 28px 36px; overflow-y: auto; }
  .gl-list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
  .gl-form-btns { display: flex; justify-content: flex-end; gap: 12px; }
  .gl-card-btns { display: flex; gap: 10px; }
  
  .img-upload-container {
    position: relative;
    border: 2px dashed #2A8E9E;
    border-radius: 12px;
    height: 190px;
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
  .img-upload-container:hover .img-overlay {
    opacity: 1;
  }

  @media (max-width: 768px) { .gl-grid { grid-template-columns: repeat(2, 1fr) !important; } }
  @media (max-width: 480px) {
    .gl-grid { grid-template-columns: 1fr !important; }
    .gl-form-main { padding: 20px 16px !important; }
    .gl-form-btns { flex-direction: column !important; }
    .gl-form-btns button, .gl-list-header button { width: 100% !important; }
  }
`;

function GloryForm({ heading, initialTitle, initialDescription, initialImage, onCancel, onSave, saveLabel }) {
  const [title, setTitle] = useState(initialTitle || "");
  const [description, setDescription] = useState(initialDescription || "");
  const [preview, setPreview] = useState(initialImage || null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef();

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if(!title.trim() || !description.trim()) {
      alert("Please fill in both Title and Description");
      return;
    }
    onSave({ title, description, imageFile });
  };

  return (
    <main className="gl-form-main">
      <h1 style={{ color: "#023347", fontSize: "22px", fontWeight: 700, marginBottom: "28px" }}>{heading}</h1>

      <label style={{ marginBottom: "10px", display: "block", fontWeight: 600 }}>Thumbnail Picture</label>
      
      <div className="img-upload-container" onClick={() => fileInputRef.current.click()}>
        {preview ? (
          <>
            <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div className="img-overlay">Click to Change Image</div>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: '#6b7280' }}>
            <p style={{ fontSize: '30px', margin: 0 }}>+</p>
            <p style={{ fontSize: '14px' }}>Upload Image</p>
          </div>
        )}
      </div>

      <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/*" 
        style={{ display: "none" }} 
        onChange={(e) => handleFile(e.target.files[0])} 
      />

      <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter glory title..."
        style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "1.5px solid #2A8E9E", marginBottom: "20px", boxSizing: "border-box", outline: 'none' }}
      />

      <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Description</label>
      <textarea
        rows={6}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Write a short description..."
        style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "1.5px solid #2A8E9E", marginBottom: "30px", boxSizing: "border-box", outline: 'none', resize: 'vertical' }}
      />

      <div className="gl-form-btns">
        <button
          onClick={onCancel}
          className="h-11 px-8 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-red-700 transition-all transform hover:-translate-y-0.5"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="h-11 px-10 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
        >
          {saveLabel}
        </button>
      </div>
    </main>
  );
}

export default function GloriesAdmin() {
  const [glories, setGlories] = useState([]);
  const [view, setView] = useState("list");
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { loadData(); }, []);

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
    if (res.ok) { setView("list"); loadData(); }
  };

  const handleSaveEdit = async ({ title, description, imageFile }) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    
    if (editTarget?.image_url) {
        formData.append("existing_image_url", editTarget.image_url);
    }

    if (imageFile) formData.append("image", imageFile);

    const res = await fetch(`${API_BASE_URL}/${editTarget.glorie_id}`, { method: "PUT", body: formData });
    if (res.ok) { setEditTarget(null); setView("list"); loadData(); }
  };

  if (view === "add") return (
    <AdminSidebar><style>{STYLES}</style><GloryForm heading="Add Glory" onCancel={() => setView("list")} onSave={handleSaveAdd} saveLabel="Add" /></AdminSidebar>
  );

  if (view === "edit") return (
    <AdminSidebar><style>{STYLES}</style><GloryForm heading="Edit Glory" initialTitle={editTarget.title} initialDescription={editTarget.description} initialImage={editTarget.image_url} onCancel={() => setView("list")} onSave={handleSaveEdit} saveLabel="Save" /></AdminSidebar>
  );

  return (
    <AdminSidebar>
      <style>{STYLES}</style>
      <main className="gl-form-main">
        <div className="gl-list-header">
          <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Glories</h1>
          <button onClick={() => setView("add")} style={{ backgroundColor: "#023347", color: "#fff", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add Glory</button>
        </div>
        <div className="gl-grid">
          {glories.map((g) => (
            <div key={g.glorie_id} style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8ec", overflow: "hidden shadow-sm" }}>
              <div style={{ height: "150px", background: "#f8fafc" }}>
                {g.image_url && <img src={g.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div style={{ padding: "15px" }}>
                <h3 style={{ margin: "0 0 5px 0", fontSize: '16px' }}>{g.title}</h3>
                <p style={{ fontSize: "12px", color: "#6b7280", height: '36px', overflow: 'hidden' }}>{g.description}</p>

                {/* ── ONLY THESE BUTTONS CHANGED ── */}
                <div className="gl-card-btns" style={{ marginTop: '12px' }}>
                  <button
                    onClick={() => { setEditTarget(g); setView("edit"); }}
                    className="flex-1 h-11 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => { if(window.confirm("Delete?")) { /* delete logic */ } }}
                    className="flex-1 h-11 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-red-700 transition-all transform hover:-translate-y-0.5"
                  >
                    Delete
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </main>
    </AdminSidebar>
  );
}