import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminMembers() {

  const navigate = useNavigate();
  const [selectedBatch, setSelectedBatch] = useState("2024-25");

  const batchMembers = {
    "2024-25": [
      { name: "Muhammed Shuaib", reg: "611224104121", role: "Technical Support", year: "II" },
      { name: "Rahul", reg: "611224104122", role: "Developer", year: "II" },
      { name: "Rithik Bharath", reg: "611224104123", role: "Developer", year: "II" },
      { name: "Santhosh Kumar", reg: "611224104124", role: "Developer", year: "II" },
      { name: "Kathir S", reg: "611224104125", role: "Developer", year: "II" },
      { name: "Naveen Aditya", reg: "611224104126", role: "Developer", year: "II" },
    ],

    "2023-24": [
      { name: "Arun", reg: "611224104111", role: "Coordinator", year: "III" },
      { name: "Sanjeevsurya", reg: "611224104112", role: "Developer", year: "II" },
    ],

    "2022-23": [
      { name: "Karthik", reg: "611224104101", role: "Designer", year: "IV" },
    ],
  };

  return (

    <div className="flex h-screen bg-[#f4f7f9]">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10 overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-2xl font-semibold text-gray-800">
            Association Members
          </h1>

          <div className="flex gap-4">

            <button
              onClick={() => navigate("/edit-batch")}
              className="bg-[#083A4B] text-white px-5 py-2 rounded-lg"
            >
              Edit
            </button>

            <button
              onClick={() => navigate("/add-batch")}
              className="bg-[#083A4B] text-white px-5 py-2 rounded-lg"
            >
              Add Batch
            </button>

          </div>

        </div>

        {/* Batch Tabs */}
        <div className="flex gap-8 text-gray-600 mb-8 text-sm">

          {["2024-25", "2023-24", "2022-23"].map((batch) => (

            <span
              key={batch}
              onClick={() => setSelectedBatch(batch)}
              className={`cursor-pointer pb-1 transition ${
                selectedBatch === batch
                  ? "border-b-2 border-[#083A4B] font-medium"
                  : "hover:text-black"
              }`}
            >
              {batch.replace("-", " - ")}
            </span>

          ))}

        </div>

        {/* Batch Info */}
        <div className="flex gap-8 items-start mb-10">

          <div className="w-[384px] h-[216px] bg-[#083A4B] rounded-xl"></div>

          <div className="max-w-md">

            <h3 className="text-lg font-semibold mb-2">
              Batch {selectedBatch.replace("-", " - ")}
            </h3>

            <p className="text-gray-500 leading-relaxed">
              The mountain peak touches the golden sunrise. Cold wind brushes
              against your face. Clouds drift lazily below your feet. Nature
              feels powerful and peaceful at once.
            </p>

          </div>

        </div>

        {/* MEMBERS TABLE */}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

          <table className="w-full">

            <thead className="bg-[#3DA6B6] text-white">

              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Register no.</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Year</th>
              </tr>

            </thead>

            <tbody>

              {batchMembers[selectedBatch].map((member, index) => (

                <tr key={index} className="border-t hover:bg-gray-50 transition">

                  <td className="p-4 text-gray-600">{member.name}</td>

                  <td className="p-4 text-gray-600">{member.reg}</td>

                  <td className="p-4 text-gray-600">{member.role}</td>

                  <td className="p-4 text-gray-600">{member.year}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}