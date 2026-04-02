import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { API_BASE } from '../config/api';
/* ─────────────────────────────────────────
   GLOBAL KEYFRAMES
───────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @keyframes toastSlideIn {
      from { opacity: 0; transform: translateY(-20px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes spinBtn {
      to { transform: rotate(360deg); }
    }
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      15%     { transform: translateX(-7px); }
      30%     { transform: translateX(7px); }
      45%     { transform: translateX(-5px); }
      60%     { transform: translateX(5px); }
      75%     { transform: translateX(-3px); }
      90%     { transform: translateX(3px); }
    }
    @keyframes flashRed {
      0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
      50%     { box-shadow: 0 0 0 4px rgba(239,68,68,0.22); }
    }
    .field-error {
      border-color: #ef4444 !important;
      background-color: #fff5f5 !important;
      animation: shake 0.45s ease, flashRed 0.6s ease !important;
    }
    input:focus, textarea:focus, select:focus {
      border-color: #2A8E9E !important;
      outline: none !important;
      box-shadow: 0 0 0 3px rgba(42,142,158,0.18) !important;
      background-color: #f0fafc !important;
    }
  `}</style>
);

/* ─────────────────────────────────────────
   SUCCESS TOAST
───────────────────────────────────────── */
function SuccessToast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', top: 28, right: 32, zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: 12,
      backgroundColor: '#023347', color: '#fff',
      padding: '14px 22px', borderRadius: 12,
      boxShadow: '0 8px 32px rgba(2,51,71,0.25)',
      fontSize: 14, fontWeight: 600,
      animation: 'toastSlideIn 0.3s ease forwards',
    }}>
      <span style={{
        width: 26, height: 26, borderRadius: '50%', backgroundColor: '#2A8E9E',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      {message}
      <button onClick={onClose} style={{
        background: 'none', border: 'none', color: '#9bd3e0',
        cursor: 'pointer', fontSize: 20, lineHeight: 1, marginLeft: 6, padding: 0,
      }}>×</button>
    </div>
  );
}

/* ─────────────────────────────────────────
   SPINNER
───────────────────────────────────────── */
function BtnSpinner() {
  return (
    <span style={{
      display: 'inline-block', width: 15, height: 15,
      border: '2.5px solid rgba(255,255,255,0.35)',
      borderTopColor: '#fff', borderRadius: '50%',
      animation: 'spinBtn 0.7s linear infinite', flexShrink: 0,
    }} />
  );
}

/* ─────────────────────────────────────────
   PRIMARY BUTTON
───────────────────────────────────────── */
function PrimaryBtn({ onClick, loading, label, loadingLabel }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button type="button" onClick={onClick} disabled={loading}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        height: 44, padding: '0 30px', borderRadius: 12, border: 'none',
        backgroundColor: loading ? '#2A8E9E' : hovered ? '#2A8E9E' : '#023347',
        color: '#fff', fontWeight: 600, fontSize: 14,
        cursor: loading ? 'not-allowed' : 'pointer',
        boxShadow: hovered && !loading ? '0 6px 16px rgba(0,0,0,0.18)' : '0 2px 6px rgba(0,0,0,0.12)',
        transform: hovered && !loading ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.2s ease', minWidth: 150,
      }}>
      {loading && <BtnSpinner />}
      {loading ? loadingLabel : label}
    </button>
  );
}

/* ─────────────────────────────────────────
   CANCEL BUTTON
───────────────────────────────────────── */
function CancelBtn({ onClick, disabled }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        height: 44, padding: '0 24px', borderRadius: 12, border: 'none',
        backgroundColor: hovered ? '#388E9C' : '#083A4B',
        color: '#fff', fontWeight: 700, fontSize: 12,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        boxShadow: hovered && !disabled ? '0 6px 16px rgba(0,0,0,0.18)' : '0 2px 6px rgba(0,0,0,0.12)',
        transform: hovered && !disabled ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.2s ease',
      }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M5 12l7 7M5 12l7-7" />
      </svg>
      Cancel
    </button>
  );
}

/* ─────────────────────────────────────────
   DROPZONE (UPDATED WITH DRAG & DROP)
───────────────────────────────────────── */
function DropZone({ value, onChange }) {
  const ref = useRef();
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (file) onChange(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const previewUrl = value instanceof File ? URL.createObjectURL(value) : value;
  const hasImage = value && value !== "Not Applicable" && value !== "";

  return (
    <div 
      onClick={() => ref.current.click()} 
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        border: isDragging ? '2px solid #2A8E9E' : '1.5px dashed #9bd3e0', 
        borderRadius: 8, 
        height: 130,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: isDragging ? '#e0f4f7' : '#f0fafc', 
        cursor: 'pointer', 
        overflow: 'hidden',
        position: 'relative', 
        fontSize: 13, 
        color: '#64748b', 
        marginBottom: '10px',
        transition: 'all 0.2s ease'
      }}
    >
      {hasImage
        ? <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : (
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8, color: '#2A8E9E' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <div>Drag and Drop or <span style={{ color: '#2563eb', fontWeight: 600 }}>choose file</span></div>
          </div>
        )
      }
      <input 
        ref={ref} 
        type="file" 
        hidden 
        accept="image/*"
        onChange={(e) => handleFile(e.target.files[0])} 
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   HELPER UTILS
───────────────────────────────────────── */
const emptyTestimonial = () => ({ name: '', className: '', feedback: '' });

const cleanStoredValue = (value) => {
  if (value === null || value === undefined) return '';
  const text = String(value).trim();
  if (!text || text.toLowerCase() === 'not applicable') return '';
  return text;
};

const parseStoredList = (value) => {
  const cleaned = cleanStoredValue(value);
  if (!cleaned) return [];
  try {
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed)
      ? parsed.map((item) => cleanStoredValue(item)).filter(Boolean)
      : [];
  } catch {
    return [cleaned];
  }
};

const normalizeTestimonials = (data = {}) => {
  const names = parseStoredList(data.testimonials_name);
  const classes = parseStoredList(data.testimonials_class);
  const feedbacks = parseStoredList(data.testimonials_feedback);
  const total = Math.max(names.length, classes.length, feedbacks.length);
  if (!total) return [emptyTestimonial()];
  return Array.from({ length: total }, (_, index) => ({
    name: names[index] || '',
    className: classes[index] || '',
    feedback: feedbacks[index] || '',
  }));
};

const appendTestimonials = (formData, testimonials = []) => {
  const filledTestimonials = testimonials.filter(
    (item) => item.name.trim() || item.className.trim() || item.feedback.trim()
  );
  if (!filledTestimonials.length) {
    formData.append('testimonials_name', '');
    formData.append('testimonials_class', '');
    formData.append('testimonials_feedback', '');
    return;
  }
  formData.append('testimonials_name', JSON.stringify(filledTestimonials.map((item) => item.name.trim())));
  formData.append('testimonials_class', JSON.stringify(filledTestimonials.map((item) => item.className.trim())));
  formData.append('testimonials_feedback', JSON.stringify(filledTestimonials.map((item) => item.feedback.trim())));
};

/* ─────────────────────────────────────────
   INLINE ERROR MESSAGE
───────────────────────────────────────── */
function ErrMsg({ show }) {
  if (!show) return null;
  return (
    <div style={{ color: '#ef4444', fontSize: 11, fontWeight: 600, marginTop: -10, marginBottom: 10 }}>
      ⚠ This field is required
    </div>
  );
}

/* ─────────────────────────────────────────
   CORE FORM
───────────────────────────────────────── */
function EventForm({ mode = 'add', initialData = {}, onSubmit, onCancel, extraTopField, loading }) {
  const [form, setForm] = useState({
    title: '', description: '', start_date: '', end_date: '',
    brochure: null, resourceImage: null, resourceName: '', resourceDescription: '',
    participants: '', eventImages: [null], winnerImage: null, winnerName: '',
    winnerFeedback: '', testimonials: [{ name: '', className: '', feedback: '' }]
  });

  const [errors, setErrors] = useState({});
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0)
      setForm(prev => ({ ...prev, ...initialData }));
  }, [initialData]);

  const updateForm = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: false }));
  };

  const addImageSlot = () => updateForm('eventImages', [...form.eventImages, null]);

  const updateImageSlot = (index, val) => {
    const imgs = [...form.eventImages]; imgs[index] = val;
    updateForm('eventImages', imgs);
  };
  const clearImageSlot = (index) => {
    const updatedImages = [...form.eventImages];
    updatedImages[index] = null;
    updateForm('eventImages', updatedImages);
  };
  const removeImageSlot = (index) => {
    const remainingImages = form.eventImages.filter((_, idx) => idx !== index);
    updateForm('eventImages', remainingImages.length > 0 ? remainingImages : [null]);
  };

  const updateTestimonial = (index, field, val) => {
    const t = [...form.testimonials]; t[index][field] = val;
    updateForm('testimonials', t);
  };
  const addTestimonial = () => updateForm('testimonials', [...form.testimonials, emptyTestimonial()]);
  const removeTestimonial = (index) => {
    const newTesti = form.testimonials.filter((_, idx) => idx !== index);
    updateForm('testimonials', newTesti.length > 0 ? newTesti : [emptyTestimonial()]);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = true;
    if (!form.start_date)         e.start_date  = true;
    if (!form.description.trim()) e.description = true;
    if (!String(form.participants).trim()) e.participants = true;
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      setAnimKey(k => k + 1);
      setTimeout(() => {
        const el = document.querySelector('.field-error');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }
    onSubmit(form);
  };

  const base = {
    width: '100%', padding: '10px', border: '1px solid #d1d5db',
    borderRadius: 6, fontSize: 13, marginBottom: 14, boxSizing: 'border-box',
    backgroundColor: '#fff', transition: 'border-color 0.2s, box-shadow 0.2s, background-color 0.2s',
  };
  const labelStyle = { display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 5, fontWeight: 500 };
  const sectionTitle = {
    fontSize: 16, fontWeight: 700, color: '#111827',
    margin: '25px 0 15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '5px',
  };

  return (
    <div style={{ background: '#fff', padding: '32px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
      {extraTopField}

      <h3 style={sectionTitle}>General Information</h3>

      <label style={labelStyle}>Title *</label>
      <input
        key={`title-${animKey}`}
        className={errors.title ? 'field-error' : ''}
        style={base} value={form.title}
        onChange={e => updateForm('title', e.target.value)} required
      />
      <ErrMsg show={errors.title} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div>
          <label style={labelStyle}>Start Date *</label>
          <input
            key={`start-${animKey}`}
            type="date"
            className={errors.start_date ? 'field-error' : ''}
            style={base} value={form.start_date}
            onChange={e => updateForm('start_date', e.target.value)}
          />
          <ErrMsg show={errors.start_date} />
        </div>
        <div>
          <label style={labelStyle}>End Date</label>
          <input type="date" style={base} value={form.end_date}
            onChange={e => updateForm('end_date', e.target.value)} />
        </div>
      </div>

      <label style={labelStyle}>Description *</label>
      <textarea
        key={`desc-${animKey}`}
        className={errors.description ? 'field-error' : ''}
        style={{ ...base, height: 80 }} value={form.description}
        onChange={e => updateForm('description', e.target.value)}
      />
      <ErrMsg show={errors.description} />

      <label style={labelStyle}>Brochure (Drop Image or Choose File)</label>
      <DropZone value={form.brochure} onChange={(v) => updateForm('brochure', v)} />
      {form.brochure && (
        <button
          type="button"
          onClick={() => updateForm('brochure', null)}
          style={{
            width: '100%', marginTop: -4, marginBottom: 14, padding: '10px 14px',
            borderRadius: 8, border: '1px solid #fed7aa', background: '#fff7ed',
            color: '#c2410c', fontWeight: 700, cursor: 'pointer'
          }}
        >
          Clear Brochure
        </button>
      )}

      <h3 style={sectionTitle}>Resource Person</h3>
      <DropZone value={form.resourceImage} onChange={v => updateForm('resourceImage', v)} />
      {form.resourceImage && (
        <button
          type="button"
          onClick={() => updateForm('resourceImage', null)}
          style={{
            width: '100%', marginTop: -4, marginBottom: 14, padding: '10px 14px',
            borderRadius: 8, border: '1px solid #fed7aa', background: '#fff7ed',
            color: '#c2410c', fontWeight: 700, cursor: 'pointer'
          }}
        >
          Clear Resource Image
        </button>
      )}
      <input placeholder="Name" style={base} value={form.resourceName}
        onChange={e => updateForm('resourceName', e.target.value)} />
      <textarea placeholder="Description" style={{ ...base, height: 60 }}
        value={form.resourceDescription}
        onChange={e => updateForm('resourceDescription', e.target.value)} />

      <h3 style={sectionTitle}>Participants</h3>
      <label style={labelStyle}>Participants Details *</label>
      <input
        key={`parts-${animKey}`}
        className={errors.participants ? 'field-error' : ''}
        style={base} value={form.participants}
        onChange={e => updateForm('participants', e.target.value)}
        placeholder="Example: 120 students and 8 faculty members"
      />
      <ErrMsg show={errors.participants} />

      <h3 style={sectionTitle}>Event Images</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {form.eventImages.map((img, idx) => (
          <div key={idx}>
            <DropZone value={img} onChange={v => updateImageSlot(idx, v)} />
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              {img && (
                <button
                  type="button"
                  onClick={() => clearImageSlot(idx)}
                  style={{
                    flex: 1, padding: '10px 14px', borderRadius: 8,
                    border: '1px solid #fed7aa', background: '#fff7ed',
                    color: '#c2410c', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Clear Image
                </button>
              )}
              {form.eventImages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageSlot(idx)}
                  style={{
                    flex: 1, padding: '10px 14px', borderRadius: 8,
                    border: '1px solid #fecaca', background: '#fff5f5',
                    color: '#dc2626', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Delete Slot
                </button>
              )}
            </div>
          </div>
        ))}
        <button type="button" onClick={addImageSlot}
          style={{ height: 130, border: '1.5px dashed #ccc', borderRadius: 8, cursor: 'pointer', background: 'none' }}>
          + Add Image Slot
        </button>
      </div>

      <h3 style={sectionTitle}>Winner Section</h3>
      <DropZone value={form.winnerImage} onChange={v => updateForm('winnerImage', v)} />
      {form.winnerImage && (
        <button
          type="button"
          onClick={() => updateForm('winnerImage', null)}
          style={{
            width: '100%', marginTop: -4, marginBottom: 14, padding: '10px 14px',
            borderRadius: 8, border: '1px solid #fed7aa', background: '#fff7ed',
            color: '#c2410c', fontWeight: 700, cursor: 'pointer'
          }}
        >
          Clear Winner Image
        </button>
      )}
      <input placeholder="Winner Name" style={base} value={form.winnerName}
        onChange={e => updateForm('winnerName', e.target.value)} />
      <textarea placeholder="Winner Feedback" style={{ ...base, height: 60 }}
        value={form.winnerFeedback}
        onChange={e => updateForm('winnerFeedback', e.target.value)} />

      <h3 style={sectionTitle}>Testimonials</h3>
      {form.testimonials.map((t, idx) => (
        <div key={idx} style={{ marginBottom: 20, padding: 15, background: '#f8fafc', borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#083A4B' }}>
              Testimonial {idx + 1}
            </span>
            {form.testimonials.length > 1 && (
              <button
                type="button"
                onClick={() => removeTestimonial(idx)}
                style={{ border: 'none', background: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
              >
                Remove
              </button>
            )}
          </div>
          <input placeholder="Name" style={base} value={t.name}
            onChange={e => updateTestimonial(idx, 'name', e.target.value)} />
          <input placeholder="Class" style={base} value={t.className}
            onChange={e => updateTestimonial(idx, 'className', e.target.value)} />
          <textarea placeholder="Feedback" style={{ ...base, height: 60 }}
            value={t.feedback}
            onChange={e => updateTestimonial(idx, 'feedback', e.target.value)} />
        </div>
      ))}
      <button
        type="button"
        onClick={addTestimonial}
        style={{ padding: '10px 18px', borderRadius: 8, border: '1px dashed #9bd3e0', background: '#f8fdff', color: '#083A4B', fontWeight: 700, cursor: 'pointer' }}
      >
        + Add Testimonial
      </button>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 40 }}>
        <CancelBtn onClick={onCancel} disabled={loading} />
        <PrimaryBtn
          onClick={handleSubmit}
          loading={loading}
          label={mode === 'add' ? 'Add Event' : 'Save Changes'}
          loadingLabel={mode === 'add' ? 'Adding...' : 'Saving...'}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   EDIT EVENT PAGE
───────────────────────────────────────── */
export function EditEvent() {
  const { year, id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`${API_BASE}/admin/activity/${id}`);
        const result = await response.json();
        const data = result.data || result;
        if (data) {
          const imgArray = (data.event_image_url || "").split(',')
            .filter(x => x && x !== "Not Applicable");
          setInitialData({
            title:               cleanStoredValue(data.title),
            description:         cleanStoredValue(data.description),
            start_date:          data.start_date ? data.start_date.split('T')[0] : '',
            end_date:            data.end_date && data.end_date !== "Not Applicable"
                                   ? data.end_date.split('T')[0] : '',
            participants:        cleanStoredValue(data.participants),
            brochure:            cleanStoredValue(data.brochure_url),
            resourceName:        cleanStoredValue(data.resource_person_name),
            resourceDescription: cleanStoredValue(data.resource_person_description),
            resourceImage:       cleanStoredValue(data.resource_person_image_url),
            winnerName:          cleanStoredValue(data.winner_name),
            winnerFeedback:      cleanStoredValue(data.winner_description),
            winnerImage:         cleanStoredValue(data.winner_image),
            eventImages:         imgArray.length > 0 ? imgArray : [null],
            testimonials:        normalizeTestimonials(data),
          });
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchEventData();
  }, [id]);

  const handleUpdate = async (formState) => {
    setSubmitting(true);
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
    appendTestimonials(formData, formState.testimonials);

    const orderMap = [];
    formState.eventImages.forEach((img, idx) => {
      if (img instanceof File) { formData.append('event_images', img); orderMap.push(`NEW_FILE_${idx}`); }
      else if (img && typeof img === 'string') { orderMap.push(img); }
    });
    formData.append('image_order', JSON.stringify(orderMap));

    if (formState.brochure instanceof File) formData.append('brochure', formState.brochure);
    else formData.append('brochure_url', formState.brochure || "");
    if (formState.resourceImage instanceof File) formData.append('resource_person_image', formState.resourceImage);
    else formData.append('existing_resource_person_image', formState.resourceImage || "");
    if (formState.winnerImage instanceof File) formData.append('winner_image', formState.winnerImage);
    else formData.append('existing_winner_image', formState.winnerImage || "");

    try {
      const response = await fetch(`${API_BASE}/admin/activity/${id}`, { method: 'PUT', body: formData });
      if (response.ok) {
        setToast('Event updated successfully!');
        setTimeout(() => navigate(`/admin/activities/${year}`), 2000);
      } else {
        const errData = await response.json();
        setToast(`Error: ${errData.message}`);
      }
    } catch (err) { setToast('Update failed. Please try again.'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <AdminSidebar><div>Loading...</div></AdminSidebar>;
  return (
    <AdminSidebar>
      <GlobalStyles />
      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}
      <div style={{ flex: 1, height: '100vh', overflowY: 'auto', padding: '32px', backgroundColor: '#f4f7f9' }}>
        <h2 style={{ color: '#083A4B', marginBottom: 20 }}>Edit Event</h2>
        <EventForm mode="edit" initialData={initialData} onSubmit={handleUpdate}
          onCancel={() => navigate(-1)} loading={submitting} />
      </div>
    </AdminSidebar>
  );
}

/* ─────────────────────────────────────────
   ADD EVENT PAGE
───────────────────────────────────────── */
export function AddEvent() {
  const { year } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleAdd = async (formState) => {
    setSubmitting(true);
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
    appendTestimonials(formData, formState.testimonials);

    if (formState.brochure) formData.append('brochure', formState.brochure);
    if (formState.resourceImage) formData.append('resource_person_image', formState.resourceImage);
    if (formState.winnerImage) formData.append('winner_image', formState.winnerImage);
    formState.eventImages.forEach(img => { if (img) formData.append('event_images', img); });

    try {
      const response = await fetch(`${API_BASE}/admin/activity`, { method: 'POST', body: formData });
      if (response.ok) {
        setToast('Event added successfully!');
        setTimeout(() => navigate(`/admin/activities/${year}`), 2000);
      } else { setToast('Failed to add event. Please try again.'); }
    } catch (err) { setToast('Failed to add event. Please try again.'); }
    finally { setSubmitting(false); }
  };

  return (
    <AdminSidebar>
      <GlobalStyles />
      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}
      <div style={{ flex: 1, height: '100vh', overflowY: 'auto', padding: '32px', backgroundColor: '#f4f7f9' }}>
        <h2 style={{ color: '#083A4B', marginBottom: 20 }}>Add Event to {year}</h2>
        <EventForm mode="add" onSubmit={handleAdd} onCancel={() => navigate(-1)} loading={submitting} />
      </div>
    </AdminSidebar>
  );
}

/* ─────────────────────────────────────────
   ADD NEW YEAR PAGE
───────────────────────────────────────── */
export function AddNewYear() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState(currentYear);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const batch = `${startYear}-${String(startYear + 1).slice(2)}`;

  const YearHeader = (
    <div style={{ marginBottom: 25, padding: '20px', background: '#f0fafc', borderRadius: 10, border: '1px solid #9bd3e0' }}>
      <label style={{ fontWeight: '700', color: '#083A4B', display: 'block', marginBottom: 10 }}>Select Academic Year</label>
      <select value={startYear} onChange={e => setStartYear(Number(e.target.value))}
        style={{ padding: '10px', borderRadius: 6 }}>
        {[...Array(10)].map((_, i) =>
          <option key={i} value={currentYear - 2 + i}>{currentYear - 2 + i}</option>
        )}
      </select>
      <span style={{ marginLeft: 20, fontWeight: 'bold', color: '#3DA6B6' }}>New Batch: {batch}</span>
    </div>
  );

  const handleAddYear = async (formState) => {
    setSubmitting(true);
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
    appendTestimonials(formData, formState.testimonials);

    if (formState.brochure) formData.append('brochure', formState.brochure);
    if (formState.resourceImage) formData.append('resource_person_image', formState.resourceImage);
    if (formState.winnerImage) formData.append('winner_image', formState.winnerImage);
    formState.eventImages.forEach(img => { if (img) formData.append('event_images', img); });

    try {
      const response = await fetch(`${API_BASE}/admin/activity`, { method: 'POST', body: formData });
      if (response.ok) {
        setToast('New academic year created successfully!');
        setTimeout(() => navigate(`/admin/activities/${batch}`), 2000);
      } else { setToast('Failed to create year. Please try again.'); }
    } catch (err) { setToast('Failed to create year. Please try again.'); }
    finally { setSubmitting(false); }
  };

  return (
    <AdminSidebar>
      <GlobalStyles />
      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}
      <div style={{ flex: 1, height: '100vh', overflowY: 'auto', padding: '32px', backgroundColor: '#f4f7f9' }}>
        <h2 style={{ color: '#083A4B', marginBottom: 20 }}>Create New Academic Year</h2>
        <EventForm mode="add" extraTopField={YearHeader} onSubmit={handleAddYear}
          onCancel={() => navigate(-1)} loading={submitting} />
      </div>
    </AdminSidebar>
  );
}