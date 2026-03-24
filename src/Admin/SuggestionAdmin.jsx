import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";

export default function SuggestionAdmin() {
  const [suggestionList, setSuggestionList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure? This will delete the record and the image from Cloudinary.")) return;
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/admin/suggestions/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
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
        .sg-table-scroll::-webkit-scrollbar { width: 6px; }
        .sg-table-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>

      <AdminSidebar />

      <main className="sg-main" style={{ flex: 1, padding: "32px 40px", overflowY: "auto" }}>
        {selectedItem === null ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h1 style={{ color: "#023347", fontSize: "24px", fontWeight: 800 }}>Suggestions Dashboard</h1>
              <div style={{ position: 'relative', width: '300px' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af', pointerEvents: 'none' }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search title or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 16px 10px 40px',
                    borderRadius: '12px',
                    border: '1.5px solid #e2e8ec',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#023347',
                    backgroundColor: '#F5F9FA',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#2A8E9E'; e.target.style.boxShadow = '0 0 0 3px rgba(42,142,158,0.1)'; e.target.style.backgroundColor = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8ec'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#F5F9FA'; }}
                />
              </div>
            </div>

            {/* TABLE — ProblemAdmin style with inner scroll */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#2A8E9E]/20 overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 180px)' }}>
              <div className="overflow-y-auto sg-table-scroll">
                <table className="w-full text-left border-collapse" style={{ minWidth: '700px' }}>
                  <thead className="bg-[#2A8E9E] sticky top-0 z-10">
                    <tr className="text-white">
                      <th className="px-6 py-4 font-semibold text-center text-sm">Title</th>
                      <th className="px-6 py-4 font-semibold text-center text-sm">Category</th>
                      <th className="px-6 py-4 font-semibold text-center text-sm">Submitted By</th>
                      <th className="px-6 py-4 font-semibold text-center text-sm">Year</th>
                      <th className="px-6 py-4 font-semibold text-center text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading && (
                      <tr><td colSpan="5" className="py-20 text-center text-gray-400">Processing...</td></tr>
                    )}
                    {!loading && filteredList.map((item) => (
                      <tr key={item.suggestion_id} className="hover:bg-gray-50">
                        <td className="px-6 py-5 text-[#023347] font-bold text-center">{item.title}</td>
                        <td className="px-6 py-5 text-center text-gray-600 text-sm">{item.category}</td>
                        <td className="px-6 py-5 text-center text-gray-600 text-sm">{item.name}</td>
                        <td className="px-6 py-5 text-center text-gray-600 text-sm">{item.year}</td>
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={() => handleViewDetail(item.suggestion_id)}
                            className="bg-[#023347] text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-[#2A8E9E] transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* ── DETAIL VIEW — unchanged ── */
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