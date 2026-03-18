import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function EditBatch() {

  const navigate = useNavigate();

  const [members, setMembers] = useState([
    {
      name: "Muhammed Shuaib",
      reg: "611224104121",
      role: "Technical Support",
      year: "II",
    },
    {
      name: "Rahul",
      reg: "611224104122",
      role: "Developer",
      year: "II",
    },
    {
      name: "Santhosh",
      reg: "611224104123",
      role: "Developer",
      year: "II",
    },
    {
      name: "Kathir",
      reg: "611224104124",
      role: "Designer",
      year: "II",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleDelete = () => {
    const updated = members.filter((_, i) => i !== selectedIndex);
    setMembers(updated);
    setShowModal(false);
  };

  return (

    <div className="flex h-screen bg-[#f4f7f9]">

      <AdminSidebar />

      <div className="flex-1 p-10 overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-semibold text-gray-800">
            Edit Batch
          </h1>

          <button
            onClick={() => navigate("/add-member")}
            className="bg-[#083A4B] text-white px-4 py-2 rounded-lg"
          >
            + Add Member
          </button>

        </div>

        {/* Batch Info */}
        <div className="flex gap-6 mb-8">

          <div className="w-64 h-40 bg-[#083A4B] rounded-lg"></div>

          <div>

            <h3 className="text-lg font-semibold mb-2">
              Batch 2022 - 23
            </h3>

            <p className="text-gray-500 max-w-md">
              The mountain peak touches the golden sunrise. Cold wind brushes
              against your face. Clouds drift lazily below your feet.
              Nature feels powerful and peaceful at once.
            </p>

          </div>

        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#2A8E9E]/40 overflow-hidden mt-6">

          <table className="w-full">

            <thead className="bg-[#2F8C95] text-white">

              <tr>
                <th className="p-5 text-left">Name</th>
                <th className="p-5 text-left">Register no.</th>
                <th className="p-5 text-left">Role</th>
                <th className="p-5 text-left">Year</th>
                <th className="p-5 text-right pr-10">Action</th>
              </tr>

            </thead>

            <tbody>

              {members.map((member, index) => (

                <tr key={index} className="border-t">

                  <td className="p-5">{member.name}</td>
                  <td className="p-5">{member.reg}</td>
                  <td className="p-5">{member.role}</td>
                  <td className="p-5">{member.year}</td>

                  <td className="p-5 pr-10">

                    <div className="flex justify-end gap-3">

                      <button
                        onClick={() => navigate("/edit-member")}
                        className="bg-[#083A4B] text-white px-5 py-2 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setSelectedIndex(index);
                          setShowModal(true);
                        }}
                        className="bg-[#083A4B] text-white px-5 py-2 rounded-lg"
                      >
                        Remove
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Delete Confirmation Modal */}

      {showModal && (

        <div className="fixed inset-0 flex items-center justify-center bg-black/40">

          <div className="bg-white rounded-xl p-8 w-[420px] text-center">

            <h2 className="text-xl font-semibold mb-2">
              Are you sure?
            </h2>

            <p className="text-gray-500 mb-6">
              This member will be permanently removed.
            </p>

            <div className="flex justify-center gap-6">

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-6 py-2 rounded-lg"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}