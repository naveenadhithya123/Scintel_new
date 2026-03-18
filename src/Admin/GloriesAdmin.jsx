import React, { useState, useRef } from "react";
import AdminSidebar from "./AdminSidebar";

/* ================= INITIAL DATA ================= */

const initialGlories = [
  {
    id: 1,
    name: "Name",
    description:
      "Student have developed the web application for solving the problem of CGPA calculation.",
    image: null,
  },
  {
    id: 2,
    name: "Name",
    description:
      "Student have developed the web application for solving the problem of CGPA calculation.",
    image: null,
  },
  {
    id: 3,
    name: "Name",
    description:
      "Student have developed the web application for solving the problem of CGPA calculation.",
    image: null,
  },
  {
    id: 4,
    name: "Name",
    description:
      "Student have developed the web application for solving the problem of CGPA calculation.",
    image: null,
  },
];

/* ================= DELETE MODAL ================= */

function DeleteModal({ glory, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          width: "380px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "220px",
            backgroundColor: glory.image ? "transparent" : "#e8ecee",
          }}
        >
          {glory.image && (
            <img
              src={glory.image}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>

        <div style={{ padding: "16px 20px 20px" }}>
          <button
            onClick={onConfirm}
            style={{
              width: "100%",
              backgroundColor: "#e84040",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 700,
              padding: "13px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <div onClick={onCancel} style={{ position: "fixed", inset: 0 }} />
    </div>
  );
}

/* ================= GLORY FORM ================= */

function GloryForm({
  heading,
  initialName,
  initialDescription,
  initialImage,
  onCancel,
  onSave,
  saveLabel,
}) {
  const [name, setName] = useState(initialName || "");
  const [description, setDescription] = useState(initialDescription || "");
  const [image, setImage] = useState(initialImage || null);

  const fileInputRef = useRef();

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <main style={{ flex: 1, padding: "28px 36px" }}>
      <h1
        style={{
          color: "#023347",
          fontSize: "22px",
          fontWeight: 700,
          marginBottom: "28px",
        }}
      >
        {heading}
      </h1>

      {/* Thumbnail */}
      <label style={{ marginBottom: "10px", display: "block" }}>
        Thumbnail Picture
      </label>

      <div
        onClick={() => fileInputRef.current.click()}
        style={{
          border: "2px dashed #2A8E9E",
          borderRadius: "12px",
          height: "190px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          marginBottom: "24px",
        }}
      >
        {image ? (
          <img
            src={image}
            alt="preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <p>Drag and Drop or choose file</p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {/* Name */}
      <label>Name</label>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: "11px",
          borderRadius: "10px",
          border: "1.5px solid #2A8E9E",
          marginBottom: "20px",
        }}
      />

      {/* Description */}

      <label>Short Description</label>

      <textarea
        rows={6}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          width: "100%",
          padding: "11px",
          borderRadius: "10px",
          border: "1.5px solid #2A8E9E",
          marginBottom: "30px",
        }}
      />

      {/* Buttons */}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button
          onClick={onCancel}
          style={{
            backgroundColor: "#023347",
            color: "#ffffff",
            padding: "9px 28px",
            borderRadius: "10px",
            border: "none",
          }}
        >
          Cancel
        </button>

        <button
          onClick={() =>
            onSave({
              name,
              description,
              image,
            })
          }
          style={{
            backgroundColor: "#023347",
            color: "#ffffff",
            padding: "9px 36px",
            borderRadius: "10px",
            border: "none",
          }}
        >
          {saveLabel}
        </button>
      </div>
    </main>
  );
}

/* ================= MAIN PAGE ================= */

export default function GloriesAdmin() {
  const [glories, setGlories] = useState(initialGlories);
  const [view, setView] = useState("list");
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleAdd = (data) => {
    setGlories((prev) => [...prev, { id: Date.now(), ...data }]);
    setView("list");
  };

  const handleEdit = (data) => {
    setGlories((prev) =>
      prev.map((g) => (g.id === editTarget.id ? { ...g, ...data } : g))
    );
    setEditTarget(null);
    setView("list");
  };

  const handleDelete = () => {
    setGlories((prev) => prev.filter((g) => g.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  /* ================= ADD PAGE ================= */

  if (view === "add") {
    return (
      <div className="flex h-screen bg-[#f4f7f9]">
        <AdminSidebar />

        <GloryForm
          heading="Add Glories"
          onCancel={() => setView("list")}
          onSave={handleAdd}
          saveLabel="Add"
        />
      </div>
    );
  }

  /* ================= EDIT PAGE ================= */

  if (view === "edit" && editTarget) {
    return (
      <div className="flex h-screen bg-[#f4f7f9]">
        <AdminSidebar />

        <GloryForm
          heading="Edit Glories"
          initialName={editTarget.name}
          initialDescription={editTarget.description}
          initialImage={editTarget.image}
          onCancel={() => {
            setEditTarget(null);
            setView("list");
          }}
          onSave={handleEdit}
          saveLabel="Save"
        />
      </div>
    );
  }

  /* ================= LIST PAGE ================= */

  return (
    <div className="flex h-screen bg-[#f4f7f9]">
      <AdminSidebar />

      <main style={{ flex: 1, padding: "28px 36px" }}>
        {deleteTarget && (
          <DeleteModal
            glory={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Glories</h1>

          <button
            onClick={() => setView("add")}
            style={{
              backgroundColor: "#023347",
              color: "#fff",
              padding: "9px 20px",
              borderRadius: "10px",
              border: "none",
            }}
          >
            + Add Glory
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "18px",
          }}
        >
          {glories.map((glory) => (
            <div
              key={glory.id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                border: "1px solid #e2e8ec",
                overflow: "hidden",
              }}
            >
              <div style={{ height: "160px", background: "#3a3f44" }}>
                {glory.image && (
                  <img
                    src={glory.image}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
              </div>

              <div style={{ padding: "14px" }}>
                <h3 style={{ fontWeight: 700 }}>{glory.name}</h3>

                <p style={{ fontSize: "12.5px", marginBottom: "12px" }}>
                  {glory.description}
                </p>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => {
                      setEditTarget(glory);
                      setView("edit");
                    }}
                    style={{
                      background: "#023347",
                      color: "#fff",
                      padding: "7px 24px",
                      borderRadius: "10px",
                      border: "none",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteTarget(glory)}
                    style={{
                      background: "#023347",
                      color: "#fff",
                      padding: "7px 20px",
                      borderRadius: "10px",
                      border: "none",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}