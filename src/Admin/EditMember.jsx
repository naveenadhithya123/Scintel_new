import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function EditMember() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve the member object passed from the EditBatch table
  const memberToEdit = location.state?.member;

  // Initialize form with existing member data or empty strings
  const [form, setForm] = useState({
    name: "",
    register_number: "",
    role: "",
    year: "",
    batch_year: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (memberToEdit) {
      setForm({
        name: memberToEdit.name || "",
        register_number: memberToEdit.register_number || "",
        role: memberToEdit.role || "",
        year: memberToEdit.year || "",
        batch_year: memberToEdit.batch_year || ""
      });
    }
  }, [memberToEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.register_number) {
      alert("Register number is missing. Cannot update.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`http://localhost:3000/api/admin/association-members/${form.register_number}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          role: form.role,
          year: form.year,
          // We usually don't change reg number or batch_year in an edit, but we send them if the API requires
          batch_year: form.batch_year 
        })
      });

      if (res.ok) {
        alert("Member updated successfully");
        // Navigate back to EditBatch and pass the batch info so it knows which data to fetch
        navigate("/edit-batch", { state: { batch: { batch_year: form.batch_year } } });
      } else {
        const err = await res.json();
        alert(`Update failed: ${err.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Server connection failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: "12px",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    color: "#111827",
    background: "#fff"
  };

  const labelStyle = {
    display: "block",
    color: "#4b5563",
    marginBottom: 8,
    fontSize: 14,
    fontWeight: 500
  };

  const btnStyle = {
    background: "#023347",
    color: "#fff",
    padding: "9px 24px",
    borderRadius: 8,
    border: "none",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
    opacity: isSaving ? 0.7 : 1
  };

  return (
    <AdminSidebar>
      <style>{`
        .em-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px 48px;
          max-width: 900px;
        }
        .em-btn-row {
          margin-top: auto;
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          padding-top: 48px;
        }
        @media (max-width: 640px) {
          .em-form-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .em-btn-row {
            flex-direction: column !important;
            padding-top: 32px;
          }
          .em-btn-row button {
            width: 100% !important;
          }
          .em-main-pad {
            padding: 20px 16px !important;
          }
        }
      `}</style>

      <div
        className="em-main-pad"
        style={{ flex: 1, padding: "40px", display: "flex", flexDirection: "column", overflowY: "auto" }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#1f2937", marginBottom: 48 }}>
          Edit Member
        </h1>

        <div className="em-form-grid">
          <div>
            <label style={labelStyle}>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Register Number (Read-only)</label>
            <input
              name="register_number"
              value={form.register_number}
              readOnly
              style={{ ...inputStyle, background: "#f3f4f6", cursor: "not-allowed" }}
            />
          </div>

          <div>
            <label style={labelStyle}>Role</label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              type="text"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Year</label>
            <input
              name="year"
              value={form.year}
              onChange={handleChange}
              type="text"
              style={inputStyle}
            />
          </div>
        </div>

        <div className="em-btn-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{ ...btnStyle, background: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db" }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            style={btnStyle}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </AdminSidebar>
  );
}