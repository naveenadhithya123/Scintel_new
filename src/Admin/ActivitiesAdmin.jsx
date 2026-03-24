import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function ActivitiesAdmin() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/activities');
      const data = await response.json();
      const result = data.data || data; 
      const mappedData = result.map((item, index) => ({
        id: item.id || index,
        year: item.batch || item.year,
        count: item.activity_count || 0
      }));
      setRows(mappedData);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (year) => {
    if (!window.confirm(`Are you sure you want to delete all activities for ${year}?`)) return;
    try {
      const response = await fetch(`http://localhost:3000/api/activities/${year}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchData();
      } else {
        alert("Failed to delete the record.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting.");
    }
  };

  return (
    <AdminSidebar>
      <div className="flex-1 overflow-y-auto h-screen custom-scrollbar">
        <div className="flex flex-col py-8 px-4 md:px-12">
          
          {/* Header Section */}
          <header className="mb-8 flex-shrink-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#023347]">
                Activities
              </h2>
              <button
                onClick={() => navigate('/admin/activities/add-new-year')}
                className="bg-[#023347] text-white px-8 py-2.5 rounded-lg font-medium text-sm hover:bg-[#012535] transition-all shadow-md active:scale-95"
              >
                + Add Year
              </button>
            </div>
            <div className="border-b border-gray-200"></div>
          </header>

          {/* Table Card */}
          <div className="mx-2 md:mx-4 bg-white rounded-2xl shadow-lg border border-[#2A8E9E]/10 overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#3DA6B6] text-white">
                    <th className="px-8 py-5 font-semibold text-center text-base">Year</th>
                    <th className="px-8 py-5 font-semibold text-center text-base">No. of Activities</th>
                    <th className="px-8 py-5 font-semibold text-center text-base">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="p-20 text-center text-gray-400 italic">
                        <div className="flex flex-col items-center gap-2">
                          <span className="animate-pulse">Loading records...</span>
                        </div>
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-20 text-center text-gray-400 font-medium">
                        No data found.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr
                        key={row.id}
                        className="bg-white transition-all duration-300 hover:bg-gray-50"
                      >
                        <td className="px-8 py-6 text-[#023347] text-center font-bold text-base md:text-lg">
                          {row.year}
                        </td>
                        <td className="px-8 py-6 text-center text-gray-600 text-base">
                          {row.count}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={() => navigate(`/admin/activities/${row.year}`)}
                              className="flex-1 h-11 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#2A8E9E] transition-all transform hover:-translate-y-0.5"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(row.year)}
                              className="flex-1 h-11 bg-[#023347] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-red-700 transition-all transform hover:-translate-y-0.5"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
}