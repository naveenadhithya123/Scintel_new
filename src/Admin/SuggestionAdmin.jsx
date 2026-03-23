import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";

export default function SuggestionAdmin() {
  const [suggestionList, setSuggestionList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch all suggestions on load
  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/admin/suggestions");
      const result = await response.json();
      setSuggestionList(result.data || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch specific detail
  const handleViewDetail = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/admin/suggestions/${id}`);
      const result = await response.json();
      setSelectedItem(result.data);
    } catch (error) {
      alert("Error fetching details");
    } finally {
      setLoading(false);
    }
  };

  // 3. Remove Suggestion (Calls your DeleteSpecificSuggestion Controller)
  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure? This will delete the record and the image from Cloudinary.")) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/admin/suggestions/${id}`, {
        method: "DELETE",
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(result.message); // "Suggestion deleted successfully"
        setSelectedItem(null);
        fetchSuggestions(); 
      } else {
        alert(result.message || "Delete failed");
      }
    } catch (error) {
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  // 4. Accept Suggestion (Calls your Admin_AcceptSuggestionMail Controller)
  const handleAccept = async (email) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/admin/suggestions/accept-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();

      if (response.ok) {
        alert("Success: " + result.message);
      } else {
        alert("Failed: " + result.message);
      }
    } catch (error) {
      alert("Error connecting to mail server");
    } finally {
      setLoading(false);
    }
  };

  const filteredList = suggestionList.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#F5F9FA", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .sg-main::-webkit-scrollbar { width: 6px; }
        .sg-main::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .sg-header-row, .sg-data-row { display: grid; grid-template-columns: 2fr 1.2fr 1.5fr 0.8fr 1.2fr; padding: 14px 24px; }
        .sg-data-row { align-items: center; border-bottom: 1px solid #f1f5f9; transition: background 0.2s; }
        .sg-data-row:hover { background-color: #f8fafc; }
      `}</style>

      <AdminSidebar />

      <main className="sg-main" style={{ flex: 1, padding: "32px 40px", overflowY: "auto" }}>
        {selectedItem === null ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h1 style={{ color: "#023347", fontSize: "24px", fontWeight: 800 }}>Suggestions Dashboard</h1>
              <input 
                type="text" 
                placeholder="Search title or user..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8ec', width: '300px', outline: 'none' }}
              />
            </div>

            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #e2e8ec", overflow: 'hidden' }}>
              <div className="sg-header-row" style={{ backgroundColor: "#F8FAFC", color: "#64748b", fontWeight: 700, fontSize: '12px' }}>
                <div>TITLE</div>
                <div style={{ textAlign: "center" }}>CATEGORY</div>
                <div style={{ textAlign: "center" }}>SUBMITTED BY</div>
                <div style={{ textAlign: "center" }}>YEAR</div>
                <div style={{ textAlign: "center" }}>ACTION</div>
              </div>

              {loading && <div style={{padding: '20px', textAlign: 'center'}}>Processing...</div>}
              
              {!loading && filteredList.map((item) => (
                <div key={item.suggestion_id} className="sg-data-row">
                  <div style={{ color: "#0f172a", fontWeight: 600 }}>{item.title}</div>
                  <div style={{ textAlign: "center" }}>{item.category}</div>
                  <div style={{ textAlign: "center" }}>{item.name}</div>
                  <div style={{ textAlign: "center" }}>{item.year}</div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button 
                      onClick={() => handleViewDetail(item.suggestion_id)}
                      style={{ backgroundColor: "#023347", color: "#fff", padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 600 }}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* ── DETAIL VIEW ── */
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '20px', fontWeight: 600 }}>
               ← Back to List
            </button>

            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #e2e8ec", padding: "40px" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#2A8E9E', fontWeight: 800 }}>{selectedItem.type}</span>
                  <h2 style={{ fontSize: "28px", fontWeight: 800, color: '#023347' }}>{selectedItem.title}</h2>
                </div>
                <div style={{ backgroundColor: selectedItem.priority === 'High' ? '#FEE2E2' : '#E0F2F1', color: selectedItem.priority === 'High' ? '#B91C1C' : '#00796B', padding: '8px 20px', borderRadius: '12px', fontWeight: 700 }}>
                  {selectedItem.priority}
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '25px', borderRadius: '15px', marginBottom: '30px' }}>
                <p style={{ margin: 0, color: "#1e293b", lineHeight: "1.6", whiteSpace: 'pre-wrap' }}>{selectedItem.description}</p>
              </div>

              {/* IMAGE SECTION */}
              <div style={{ marginBottom: '35px' }}>
                <h4 style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', marginBottom: '15px' }}>Attachment</h4>
                {selectedItem.proof_url ? (
                  <div style={{ display: 'flex', gap: '25px', alignItems: 'center', background: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8ec' }}>
                    <img src={selectedItem.proof_url} alt="Proof" style={{ width: '200px', borderRadius: '8px' }} />
                    <a href={selectedItem.proof_url} target="_blank" rel="noreferrer" download style={{ backgroundColor: '#023347', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px' }}>
                      Download Image
                    </a>
                  </div>
                ) : <p style={{color: '#94a3b8'}}>No attachment provided.</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px', backgroundColor: '#F8FAFC', borderRadius: '15px' }}>
                <div><strong>Name:</strong> {selectedItem.name}</div>
                <div><strong>Email:</strong> {selectedItem.email}</div>
                <div><strong>Year/Sec:</strong> {selectedItem.year} - {selectedItem.section}</div>
                <div><strong>Phone:</strong> {selectedItem.phone_number}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '40px' }}>
                <button 
                  onClick={() => handleRemove(selectedItem.suggestion_id)}
                  disabled={loading}
                  style={{ backgroundColor: '#fff', color: '#ef4444', border: '1px solid #ef4444', padding: '12px 30px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700 }}
                >
                  {loading ? "Deleting..." : "Delete Record"}
                </button>
                <button 
                  onClick={() => handleAccept(selectedItem.email)}
                  disabled={loading}
                  style={{ backgroundColor: '#2A8E9E', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700 }}
                >
                  {loading ? "Sending..." : "Mark as Resolved & Email User"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}