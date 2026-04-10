import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { API_BASE } from "../config/api";

const YEAR_OPTIONS = ["I", "II", "III", "IV"];
const ROLE_OPTIONS = ["Secretary", "Joint-Secretary", "Treasurer", "Joint-Treasurer", "Executive member"];

export default function AddMember() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve batch_year from navigation state (passed from AddBatch)
  const batchYear = location.state?.batch_year;

  const [form, setForm] = useState({ name: "", reg: "", role: "", year: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    // Basic validation
    if (!form.name || !form.reg || !form.role || !form.year) {
      alert("Name, Phone Number, Role and Year are required.");
      return;
    }

    if (!batchYear) {
      alert("Batch Year context is missing. Please return to the Batch page.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/admin/association-members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          register_number: form.reg,
          name: form.name,
          role: form.role,
          year: form.year,
          batch_year: batchYear, // Associating member with the batch
        }),
      });

      console.log(form);

      if (res.ok) {
        alert("Member added successfully!");
        navigate(-1); // Go back to the previous screen (likely AdminMembers or EditBatch)
      } else {
        const errorData = await res.json();
        alert(`Failed to add member: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
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
  };

  const labelStyle = {
    display: "block",
    color: "#4b5563",
    marginBottom: 8,
    fontSize: 14,
  };

  const btnStyle = {
    background: "#083A4B",
    color: "#fff",
    padding: "9px 24px",
    borderRadius: 8,
    border: "none",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
    opacity: isSubmitting ? 0.7 : 1,
  };

  return (
    <AdminSidebar>
      <style>{`
        .am-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px 48px;
          max-width: 900px;
        }

        .am-btn-row {
          margin-top: auto;
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          padding-top: 48px;
        }

        @media (max-width: 640px) {
          .am-form-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .am-btn-row {
            flex-direction: column !important;
            padding-top: 32px;
          }
          .am-btn-row button {
            width: 100% !important;
          }
          .am-main-pad {
            padding: 20px 16px !important;
          }
        }
      `}</style>

      <div
        className="am-main-pad"
        style={{ flex: 1, padding: "40px", display: "flex", flexDirection: "column", overflowY: "auto" }}
      >
        <div style={{ marginBottom: 48 }}>
          <h1 className="text-3xl font-extrabold text-[#023347]" style={{ marginBottom: 8 }}>
            Add Member
          </h1>
          <p style={{ fontSize: 14, color: "#6b7280" }}>
            Adding member to Batch: <strong>{batchYear || "Unknown"}</strong>
          </p>
        </div>

        <div className="am-form-grid">
          <div>
            <label style={labelStyle}>Name</label>
            <input
              name="name"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Phone Number</label>
            <input
              name="reg"
              type="tel"
              placeholder="e.g. 9876543210"
              value={form.reg}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select role</option>
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Year</label>
            <select
              name="year"
              value={form.year}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select year</option>
              {YEAR_OPTIONS.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="am-btn-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-[#023347] text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md active:scale-95 hover:bg-red-700"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleAdd}
            className="bg-[#023347] text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md active:scale-95 hover:bg-[#2A8E9E] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? "Adding..." : "Add Member"}
          </button>
        </div>
      </div>
    </AdminSidebar>
  );
}
