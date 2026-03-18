import React from "react";
import AdminSidebar from "./AdminSidebar";

export default function AddBatch() {

  return (
    <div className="flex h-screen bg-[#f4f7f9]">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN PAGE */}
      <div className="flex-1 p-10 overflow-y-auto">

        <h1 className="text-2xl font-semibold mb-6">
          Add Batch
        </h1>

        {/* TOP FORM */}
        <div className="flex gap-10 mb-8">

          {/* Upload box */}
          <div className="w-[420px] h-[220px] border-2 border-dashed rounded-xl flex items-center justify-center text-gray-500">

            Drag and Drop or 
            <span className="text-blue-600 ml-1 cursor-pointer">
              choose file
            </span>

          </div>

          {/* Form */}
          <div className="flex-1 space-y-4">

            <div>
              <label className="block mb-1 text-gray-600">
                Title
              </label>

              <input
                type="text"
                className="w-full border rounded-lg p-3 outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600">
                Description
              </label>

              <textarea
                rows="4"
                className="w-full border rounded-lg p-3 outline-none"
              ></textarea>
            </div>

          </div>

        </div>

        {/* TABLE */}

        <div className="bg-white rounded-xl border overflow-hidden">

          <table className="w-full">

            <thead className="bg-[#3DA6B6] text-white">

              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Register no.</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Year</th>
                <th className="p-4 text-left">Action</th>
              </tr>

            </thead>

            <tbody>

              <tr>
                <td colSpan="5" className="text-center p-16 text-gray-500">
                  Members are not added yet
                </td>
              </tr>

            </tbody>

          </table>

        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-4 mt-8">

          <button className="bg-[#083A4B] text-white px-6 py-2 rounded-lg">
            Cancel
          </button>

          <button className="bg-[#083A4B] text-white px-6 py-2 rounded-lg">
            Save
          </button>

        </div>

      </div>

    </div>
  );
}