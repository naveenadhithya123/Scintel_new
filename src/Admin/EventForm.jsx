import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

/* ── DROP ZONE COMPONENT ── */
function DropZone({ value, onChange }) {
  const ref = useRef();
  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target.result);
    reader.readAsDataURL(file);
  };
  const hasImage = value && value !== "Not Applicable";

  return (
    <div
      onClick={() => ref.current.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
      style={{
        border: "1.5px dashed #9bd3e0", borderRadius: 8, height: 130,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#f0fafc", cursor: "pointer", overflow: "hidden",
        position: "relative", fontSize: 13, color: "#64748b",
      }}
    >
      {hasImage ? (
        <img src={value} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
      ) : (
        <span style={{ textAlign: "center", padding: "0 16px" }}>Drag and Drop or <span style={{ color: "#2563eb" }}>choose file</span></span>
      )}
      <input ref={ref} type="file" hidden accept="image/*" onChange={(e) => handleFile(e.target.files[0])} />
    </div>
  );
}

/* ── ICONS ── */
const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

/* ── INITIAL STATE ── */
const emptyForm = {
  title: "",
  description: "",
  resourceImage: null,
  resourceName: "",
  resourceDescription: "",
  participants: "",
  participantImages: [null, null],
  winnerImage: null,
  winnerName: "",
  winnerFeedback: "",
  testimonials: [{ name: "", className: "", feedback: "" }],
};

/* ── EVENT FORM (CHILD) ── */
export function EventForm({ onSubmit, onCancel, mode = "add", initialData = {} }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialData });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm(initialData);
    }
  }, [initialData]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const updateParticipantImage = (index, value) => {
    const arr = [...form.participantImages];
    arr[index] = value;
    set("participantImages", arr);
  };

  const inputStyle = { width: "100%", padding: "9px 11px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13 };
  const textareaStyle = { ...inputStyle, height: 90, resize: "vertical", display: "block" };

  return (
    <div style={{ maxWidth: 800 }}>
      <style>{`.ef-btn-row { display: flex; justify-content: flex-end; gap: 10px; margin-top: 28px; }`}</style>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 12, color: "#6b7280", marginBottom: 5 }}>Title</label>
        <input style={inputStyle} value={form.title} onChange={(e) => set("title", e.target.value)} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 12, color: "#6b7280", marginBottom: 5 }}>Description</label>
        <textarea style={textareaStyle} value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>

      <p style={{ fontSize: 15, fontWeight: 600, margin: "22px 0 12px" }}>Resource Person</p>
      <DropZone value={form.resourceImage} onChange={(v) => set("resourceImage", v)} />
      <input placeholder="Name" style={{ ...inputStyle, marginTop: 10 }} value={form.resourceName} onChange={(e) => set("resourceName", e.target.value)} />

      <p style={{ fontSize: 15, fontWeight: 600, margin: "22px 0 12px" }}>Participants</p>
      <input placeholder="Count" style={inputStyle} value={form.participants} onChange={(e) => set("participants", e.target.value)} />
      <div style={{ marginTop: 10 }}>
        <DropZone value={form.participantImages[0]} onChange={(v) => updateParticipantImage(0, v)} />
      </div>

      <p style={{ fontSize: 15, fontWeight: 600, margin: "22px 0 12px" }}>Winner</p>
      <DropZone value={form.winnerImage} onChange={(v) => set("winnerImage", v)} />
      <input placeholder="Winner Name" style={{ ...inputStyle, marginTop: 10 }} value={form.winnerName} onChange={(e) => set("winnerName", e.target.value)} />
      <textarea placeholder="Winner Feedback" style={{ ...textareaStyle, marginTop: 10 }} value={form.winnerFeedback} onChange={(e) => set("winnerFeedback", e.target.value)} />

      <div className="ef-btn-row">
        <button onClick={onCancel} style={{ padding: "9px 22px", borderRadius: 6, cursor: "pointer", background: "#f1f5f9", border: "1px solid #d1d5db" }}>Cancel</button>
        <button onClick={() => onSubmit(form)} style={{ padding: "9px 25px", borderRadius: 6, cursor: "pointer", background: "#083A4B", color: "#fff", border: "none" }}>
          {mode === "add" ? "Add Event" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

/* ── EDIT EVENT PAGE (MAIN) ── */
export function EditEvent() {
  const { year, id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data on load
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/admin/activity/${id}`);
        const data = await response.json();

        if (response.ok) {
          // Map DB fields back to Form state
          const mappedData = {
            title: data.title !== "Not Applicable" ? data.title : '',
            description: data.description !== "Not Applicable" ? data.description : '',
            resourceImage: data.resource_person_image_url !== "Not Applicable" ? data.resource_person_image_url : null,
            resourceName: data.resource_person_name !== "Not Applicable" ? data.resource_person_name : '',
            resourceDescription: data.resource_person_description !== "Not Applicable" ? data.resource_person_description : '',
            participants: data.participants !== "Not Applicable" ? data.participants : '',
            // Convert comma string back to array
            eventImages: data.event_image_url && data.event_image_url !== "Not Applicable" 
                         ? data.event_image_url.split(',') 
                         : [null],
            winnerImage: data.winner_image !== "Not Applicable" ? data.winner_image : null,
            winnerName: data.winner_name !== "Not Applicable" ? data.winner_name : '',
            winnerFeedback: data.winner_description !== "Not Applicable" ? data.winner_description : '',
            testimonials: [{
              name: data.testimonials_name !== "Not Applicable" ? data.testimonials_name : '',
              className: data.testimonials_class !== "Not Applicable" ? data.testimonials_class : '',
              feedback: data.testimonials_feedback !== "Not Applicable" ? data.testimonials_feedback : ''
            }]
          };
          setInitialData(mappedData);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id]);

  // 2. Handle Update (Sending Multipart Form Data)
  const handleUpdate = async (formState) => {
    const formData = new FormData();

    // Append text fields
    formData.append('title', formState.title);
    formData.append('description', formState.description);
    formData.append('batch', year);
    formData.append('participants', formState.participants);
    formData.append('resource_person_name', formState.resourceName);
    formData.append('resource_person_description', formState.resourceDescription);
    formData.append('winner_name', formState.winnerName);
    formData.append('winner_description', formState.winnerFeedback);
    formData.append('testimonials_name', formState.testimonials[0].name);
    formData.append('testimonials_class', formState.testimonials[0].className);
    formData.append('testimonials_feedback', formState.testimonials[0].feedback);

    // Handle single images (if they are new files)
    if (formState.resourceImage?.startsWith('data:')) {
      const blob = await (await fetch(formState.resourceImage)).blob();
      formData.append('resource_person_image', blob, 'resource.png');
    } else {
      formData.append('existing_resource_person_image', formState.resourceImage);
    }

    if (formState.winnerImage?.startsWith('data:')) {
      const blob = await (await fetch(formState.winnerImage)).blob();
      formData.append('winner_image', blob, 'winner.png');
    } else {
      formData.append('existing_winner_image', formState.winnerImage);
    }

    // Handle multiple event images
    const existingImgs = [];
    for (const img of formState.eventImages) {
      if (img?.startsWith('data:')) {
        const blob = await (await fetch(img)).blob();
        formData.append('event_images', blob, 'event.png');
      } else if (img) {
        existingImgs.push(img);
      }
    }
    formData.append('existing_event_images', existingImgs.join(','));

    try {
      const response = await fetch(`http://localhost:3000/api/admin/activity/${id}`, {
        method: 'PUT',
        body: formData, // No Content-Type header needed, browser sets it for FormData
      });

      if (response.ok) {
        alert("Event updated successfully!");
        navigate(`/admin/activities/${year}`);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (loading) return <AdminSidebar><p>Loading...</p></AdminSidebar>;

  return (
    <AdminSidebar>
      <div style={{ flex: 1, padding: '32px', backgroundColor: '#f4f7f9' }}>
        <h2>Edit Event ({year})</h2>
        <EventForm 
          mode="edit" 
          initialData={initialData} 
          onSubmit={handleUpdate} 
          onCancel={() => navigate(`/admin/activities/${year}`)} 
        />
      </div>
    </AdminSidebar>
  );
}

/* ── ADD EVENT PAGE ── */
export function AddEvent() {
  const { year } = useParams();
  const navigate = useNavigate();

  const handleAdd = async (data) => {
      // In your AddEvent, you would similarly map 'data' to 'payload' 
      // then perform a fetch(..., { method: 'POST' })
      console.log("Saving new event for batch:", year, data);
      navigate(`/admin/activities/${year}`);
  };

  return (
    <AdminSidebar>
      <div style={{ padding: "16px 32px", flex: 1 }}>
        <h1 style={{ marginBottom: 20 }}>Add Event for {year}</h1>
        <EventForm mode="add" onSubmit={handleAdd} onCancel={() => navigate(-1)} />
      </div>
    </AdminSidebar>
  );
}