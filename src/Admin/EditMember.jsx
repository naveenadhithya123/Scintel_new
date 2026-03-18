import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function EditMember() {

  const navigate = useNavigate();

  return (

    <div className="flex h-screen bg-[#f4f7f9]">  // Container for the entire page, using flexbox to create a sidebar and main content area, with a light background color

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-10 flex flex-col">

        <h1 className="text-2xl font-semibold text-gray-800 mb-12">
          Edit Member
        </h1>
 {/* FORM */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 max-w-5xl">

          {/* NAME */}
          <div>
            <label className="block text-gray-600 mb-2">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* REGISTER NUMBER */}
          <div>
            <label className="block text-gray-600 mb-2 ml-43">Register Number</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 ml-43"
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="block text-gray-600 mb-2">Role</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* YEAR */}
          <div>
            <label className="block text-gray-600 mb-2 ml-43">Year</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 ml-43"
            />
          </div>

        </div>

        {/* Buttons */}
     <div className="mt-auto flex justify-end gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-[#023347] text-white px-6 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            className="bg-[#023347] text-white px-6 py-2 rounded-lg"
          >
            Save
          </button>

        </div>

      </div>

    </div>

  );
}