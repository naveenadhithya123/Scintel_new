import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

/* ── DropZone Component ── */
function DropZone({ value, onChange, isThumbnail }) {
  const ref = useRef();
  const handleFile = (file) => { if (file) onChange(file); };
  const previewUrl = value instanceof File ? URL.createObjectURL(value) : value;
  const hasImage = value && value !== "Not Applicable" && value !== "";

  return (
    <div
      onClick={() => ref.current.click()}
      style={{
        border: '1.5px dashed #9bd3e0', borderRadius: 8, height: 130,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f0fafc', cursor: 'pointer', overflow: 'hidden',
        position: 'relative', fontSize: 13, color: '#64748b', marginBottom: '10px'
      }}
    >
      {isThumbnail && (
        <div style={{ position: 'absolute', top: 5, left: 5, background: '#083A4B', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', zIndex: 2 }}>
          Thumbnail (Card Image)
        </div>
      )}
      {hasImage ? (
        <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span>Drag and Drop or <span style={{ color: '#2563eb' }}>choose file</span></span>
      )}
      <input ref={ref} type="file" hidden accept="image/*" onChange={(e) => handleFile(e.target.files[0])} />
    </div>
  );
}

const StyledBackButton = ({ onClick }) => (
  <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#083A4B', color: 'white', padding: '8px 20px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
    Back
  </button>
);

/* ── Core Form Component ── */
function EventForm({ mode = 'add', initialData = {}, onSubmit, onCancel, extraTopField }) {
  const [form, setForm] = useState({
    title: '', description: '', start_date: '', end_date: '',
    brochure: null, resourceImage: null, resourceName: '', resourceDescription: '',
    participants: '', eventImages: [null], winnerImage: null, winnerName: '', 
    winnerFeedback: '', testimonials: [{ name: '', className: '', feedback: '' }]
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
        setForm(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const addImageSlot = () => updateForm('eventImages', [...form.eventImages, null]);
  const updateImageSlot = (index, val) => {
    const newImgs = [...form.eventImages];
    newImgs[index] = val;
    updateForm('eventImages', newImgs);
  };
  const updateTestimonial = (index, field, val) => {
    const newTesti = [...form.testimonials];
    newTesti[index][field] = val;
    updateForm('testimonials', newTesti);
  };

  const inputStyle = { width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, marginBottom: 14 };
  const labelStyle = { display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 5, fontWeight: 500 };
  const sectionTitle = { fontSize: 16, fontWeight: 700, color: '#111827', margin: '25px 0 15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '5px' };

  return (
    <div style={{ background: '#fff', padding: '32px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
      {extraTopField}

      <h3 style={sectionTitle}>General Information</h3>
      <label style={labelStyle}>Title *</label>
      <input style={inputStyle} value={form.title} onChange={e => updateForm('title', e.target.value)} required />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div>
          <label style={labelStyle}>Start Date *</label>
          <input type="date" style={inputStyle} value={form.start_date} onChange={e => updateForm('start_date', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>End Date</label>
          <input type="date" style={inputStyle} value={form.end_date} onChange={e => updateForm('end_date', e.target.value)} />
        </div>
      </div>

      <label style={labelStyle}>Description *</label>
      <textarea style={{...inputStyle, height: 80}} value={form.description} onChange={e => updateForm('description', e.target.value)} />

      <label style={labelStyle}>Brochure (File/Image)</label>
      <input type="file" style={inputStyle} onChange={e => updateForm('brochure', e.target.files[0])} />

      <h3 style={sectionTitle}>Resource Person</h3>
      <DropZone value={form.resourceImage} onChange={v => updateForm('resourceImage', v)} />
      <input placeholder="Name" style={inputStyle} value={form.resourceName} onChange={e => updateForm('resourceName', e.target.value)} />
      <textarea placeholder="Description" style={{...inputStyle, height: 60}} value={form.resourceDescription} onChange={e => updateForm('resourceDescription', e.target.value)} />

      <h3 style={sectionTitle}>Participants</h3>
      <label style={labelStyle}>Number of Participants *</label>
      <input type="number" style={inputStyle} value={form.participants} onChange={e => updateForm('participants', e.target.value)} />

      <h3 style={sectionTitle}>Event Images (First one is the Thumbnail)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {form.eventImages.map((img, idx) => (
            <DropZone key={idx} value={img} isThumbnail={idx === 0} onChange={v => updateImageSlot(idx, v)} />
        ))}
        <button type="button" onClick={addImageSlot} style={{ height: 130, border: '1.5px dashed #ccc', borderRadius: 8, cursor: 'pointer', background: 'none' }}>+ Add Image Slot</button>
      </div>

      <h3 style={sectionTitle}>Winner Section</h3>
      <DropZone value={form.winnerImage} onChange={v => updateForm('winnerImage', v)} />
      <input placeholder="Winner Name" style={inputStyle} value={form.winnerName} onChange={e => updateForm('winnerName', e.target.value)} />
      <textarea placeholder="Winner Feedback" style={{...inputStyle, height: 60}} value={form.winnerFeedback} onChange={e => updateForm('winnerFeedback', e.target.value)} />

      <h3 style={sectionTitle}>Testimonials</h3>
      {form.testimonials.map((t, idx) => (
        <div key={idx} style={{ marginBottom: 20, padding: 15, background: '#f8fafc', borderRadius: 8 }}>
          <input placeholder="Name" style={inputStyle} value={t.name} onChange={e => updateTestimonial(idx, 'name', e.target.value)} />
          <input placeholder="Class" style={inputStyle} value={t.className} onChange={e => updateTestimonial(idx, 'className', e.target.value)} />
          <textarea placeholder="Feedback" style={{...inputStyle, height: 60}} value={t.feedback} onChange={e => updateTestimonial(idx, 'feedback', e.target.value)} />
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 40 }}>
        <button type="button" onClick={onCancel} style={{ padding: '10px 25px', borderRadius: 6, border: '1px solid #ccc' }}>Cancel</button>
        <button type="button" onClick={() => onSubmit(form)} style={{ padding: '10px 30px', borderRadius: 6, background: '#083A4B', color: '#fff', border: 'none' }}>
          {mode === 'add' ? 'Add Event' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

/* ── EDIT EVENT PAGE ── */
/* ── EDIT EVENT PAGE ── */
export function EditEvent() {
  const { year, id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/admin/activity/${id}`);
        const result = await response.json();
        const data = result.data || result;
        
        if (data) {
          const clean = (val) => (val === "Not Applicable" ? "" : val);
          const imgArray = (data.event_image_url || "").split(',').filter(x => x && x !== "Not Applicable");
          
          setInitialData({
            title: clean(data.title),
            description: clean(data.description),
            start_date: data.start_date ? data.start_date.split('T')[0] : '',
            end_date: data.end_date && data.end_date !== "Not Applicable" ? data.end_date.split('T')[0] : '',
            participants: clean(data.participants),
            brochure: clean(data.brochure_url),
            resourceName: clean(data.resource_person_name),
            resourceDescription: clean(data.resource_person_description),
            resourceImage: clean(data.resource_person_image_url),
            winnerName: clean(data.winner_name),
            winnerFeedback: clean(data.winner_description),
            winnerImage: clean(data.winner_image),
            eventImages: imgArray.length > 0 ? imgArray : [null],
            testimonials: [{ 
                name: clean(data.testimonials_name), 
                className: clean(data.testimonials_class), 
                feedback: clean(data.testimonials_feedback) 
            }]
          });
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchEventData();
  }, [id]);

  const handleUpdate = async (formState) => {
    const formData = new FormData();
    
    // 1. Maintain all form fields
    formData.append('batch', year);
    formData.append('title', formState.title);
    formData.append('description', formState.description);
    formData.append('start_date', formState.start_date);
    formData.append('end_date', formState.end_date || "");
    formData.append('participants', formState.participants);
    formData.append('resource_person_name', formState.resourceName);
    formData.append('resource_person_description', formState.resourceDescription);
    formData.append('winner_name', formState.winnerName);
    formData.append('winner_description', formState.winnerFeedback);
    formData.append('testimonials_name', formState.testimonials[0].name);
    formData.append('testimonials_class', formState.testimonials[0].className);
    formData.append('testimonials_feedback', formState.testimonials[0].feedback);

    // 2. THE FIX: Image Ordering Logic
    // This tells the backend EXACTLY which image (old or new) goes in which position
    const orderMap = [];
    formState.eventImages.forEach((img, idx) => {
      if (img instanceof File) {
        // If it's a new file, append it to the file list 
        // and put a placeholder in the order map
        formData.append('event_images', img);
        orderMap.push(`NEW_FILE_${idx}`); 
      } else if (img && typeof img === 'string') {
        // If it's an existing URL, just put the URL in the order map
        orderMap.push(img);
      }
    });
    
    // Send the order as a JSON string
    formData.append('image_order', JSON.stringify(orderMap));

    // 3. Handle specific single images
    if (formState.brochure instanceof File) formData.append('brochure', formState.brochure);
    else formData.append('brochure_url', formState.brochure || "");

    if (formState.resourceImage instanceof File) formData.append('resource_person_image', formState.resourceImage);
    else formData.append('existing_resource_person_image', formState.resourceImage || "");

    if (formState.winnerImage instanceof File) formData.append('winner_image', formState.winnerImage);
    else formData.append('existing_winner_image', formState.winnerImage || "");

    try {
      const response = await fetch(`http://localhost:3000/api/admin/activity/${id}`, { 
        method: 'PUT', 
        body: formData 
      });
      
      if (response.ok) { 
        alert("Updated!"); 
        navigate(`/admin/activities/${year}`); 
      } else { 
        const errData = await response.json(); 
        alert(`Error: ${errData.message}`); 
      }
    } catch (err) { 
      alert("Update failed."); 
    }
  };

  if (loading) return <AdminSidebar><div>Loading...</div></AdminSidebar>;
  return (
    <AdminSidebar>
      <div style={{ flex: 1, padding: '32px', backgroundColor: '#f4f7f9', overflowY: 'auto' }}>
        <h2 style={{ color: '#083A4B', marginBottom: 20 }}>Edit Event</h2>
        <EventForm mode="edit" initialData={initialData} onSubmit={handleUpdate} onCancel={() => navigate(-1)} />
      </div>
    </AdminSidebar>
  );
}

/* ── ADD EVENT PAGE ── */
export function AddEvent() {
  const { year } = useParams();
  const navigate = useNavigate();

  const handleAdd = async (formState) => {
    const formData = new FormData();
    formData.append('batch', year);
    formData.append('title', formState.title);
    formData.append('description', formState.description);
    formData.append('start_date', formState.start_date);
    formData.append('end_date', formState.end_date || "");
    formData.append('participants', formState.participants);
    formData.append('resource_person_name', formState.resourceName);
    formData.append('resource_person_description', formState.resourceDescription);
    formData.append('winner_name', formState.winnerName);
    formData.append('winner_description', formState.winnerFeedback);
    formData.append('testimonials_name', formState.testimonials[0].name);
    formData.append('testimonials_class', formState.testimonials[0].className);
    formData.append('testimonials_feedback', formState.testimonials[0].feedback);

    if (formState.brochure) formData.append('brochure', formState.brochure);
    if (formState.resourceImage) formData.append('resource_person_image', formState.resourceImage);
    if (formState.winnerImage) formData.append('winner_image', formState.winnerImage);
    formState.eventImages.forEach(img => { if (img) formData.append('event_images', img); });

    try {
      const response = await fetch(`http://localhost:3000/api/admin/activity`, { method: 'POST', body: formData });
      if (response.ok) { alert("Added!"); navigate(`/admin/activities/${year}`); }
    } catch (err) { alert("Failed to add."); }
  };

  return (
    <AdminSidebar>
      <div style={{ flex: 1, padding: '32px', backgroundColor: '#f4f7f9' }}>
         <h2 style={{ color: '#083A4B', marginBottom: 20 }}>Add Event to {year}</h2>
         <EventForm mode="add" onSubmit={handleAdd} onCancel={() => navigate(-1)} />
      </div>
    </AdminSidebar>
  );
}

/* ── ADD NEW YEAR PAGE ── */
export function AddNewYear() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState(currentYear);
  const batch = `${startYear}-${String(startYear + 1).slice(2)}`;

  const YearHeader = (
    <div style={{ marginBottom: 25, padding: '20px', background: '#f0fafc', borderRadius: 10, border: '1px solid #9bd3e0' }}>
      <label style={{ fontWeight: '700', color: '#083A4B', display: 'block', marginBottom: 10 }}>Select Academic Year</label>
      <select value={startYear} onChange={e => setStartYear(Number(e.target.value))} style={{ padding: '10px', borderRadius: 6 }}>
        {[...Array(10)].map((_, i) => <option key={i} value={currentYear - 2 + i}>{currentYear - 2 + i}</option>)}
      </select>
      <span style={{ marginLeft: 20, fontWeight: 'bold', color: '#3DA6B6' }}>New Batch: {batch}</span>
    </div>
  );

  const handleAddYear = async (formState) => {
    const formData = new FormData();
    formData.append('batch', batch);
    formData.append('title', formState.title);
    formData.append('description', formState.description);
    formData.append('start_date', formState.start_date);
    formData.append('end_date', formState.end_date || "");
    formData.append('participants', formState.participants);
    formData.append('resource_person_name', formState.resourceName);
    formData.append('resource_person_description', formState.resourceDescription);
    formData.append('winner_name', formState.winnerName);
    formData.append('winner_description', formState.winnerFeedback);
    formData.append('testimonials_name', formState.testimonials[0].name);
    formData.append('testimonials_class', formState.testimonials[0].className);
    formData.append('testimonials_feedback', formState.testimonials[0].feedback);

    if (formState.brochure) formData.append('brochure', formState.brochure);
    if (formState.resourceImage) formData.append('resource_person_image', formState.resourceImage);
    if (formState.winnerImage) formData.append('winner_image', formState.winnerImage);
    formState.eventImages.forEach(img => { if (img) formData.append('event_images', img); });

    try {
      const response = await fetch(`http://localhost:3000/api/admin/activity`, { method: 'POST', body: formData });
      if (response.ok) { alert("New Year Added!"); navigate(`/admin/activities/${batch}`); }
    } catch (err) { console.error(err); }
  };

  return (
    <AdminSidebar>
      <div style={{ flex: 1, padding: '32px', backgroundColor: '#f4f7f9' }}>
        <h2 style={{ color: '#083A4B', marginBottom: 20 }}>Create New Academic Year</h2>
        <EventForm mode="add" extraTopField={YearHeader} onSubmit={handleAddYear} onCancel={() => navigate(-1)} />
      </div>
    </AdminSidebar>
  );
}