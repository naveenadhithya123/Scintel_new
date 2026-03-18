import React from "react";

function EventRegister() {
  return (
    <div className="min-h-screen bg-[#f2f3f4] flex items-center justify-center py-12">

      <div className="flex flex-col items-start">

        {/* MAIN CARD WRAPPER */}
        <div className="flex bg-white rounded-2xl shadow-md overflow-hidden">

          {/* LEFT IMAGE (588 x 844) */}
          <div
            className="bg-[#1E1E1E] flex-shrink-0"
            style={{ width: "588px", height: "844px" }}
          />

          {/* RIGHT CONTENT CARD (652 x 842) */}
          <div
            className="bg-white rounded-r-2xl px-10 py-8 flex flex-col"
            style={{ width: "652px", height: "842px" }}
          >

            <h1 className="text-2xl font-bold text-[#023347] mb-4">
              Tech Talk 4.0
            </h1>

            {/* SCROLLABLE DESCRIPTION AREA */}
            <div className="overflow-y-auto pr-4 flex-1">

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Technology is shaping the world in powerful ways. Every day new innovations make communication faster,
                learning easier, and businesses more efficient. Students now use online platforms to study, collaborate,
                and build real-world skills. Artificial intelligence is helping doctors diagnose diseases, engineers design
                smarter systems, and developers create intelligent applications. At the same time, it is important to use
                technology responsibly and ethically, privacy and digital well-being are becoming more important than ever.
                As we move forward, creativity and problem-solving will matter more than just technical knowledge.
              </p>

              <div className="space-y-4 text-gray-700 text-sm">
                <p>Registration starts : 31.08.2079</p>
                <p>Registration End : 31.08.2079</p>
                <p>Event end Date : 31.08.2079</p>
                <p>Event start Date : 31.08.2079</p>
                <p>Faculty Coordinator : 99999 99999</p>
                <p>Student Coordinator : 99999 99999</p>
              </div>

            </div>
          </div>
        </div>

        {/* BUTTON SECTION (aligned exactly to right card) */}
        <div className="flex mt-8">

          {/* Spacer = image width */}
          <div style={{ width: "588px" }} />

          {/* Button container = right card width */}
          <div
            className="flex justify-between"
            style={{ width: "652px" }}
          >
            <button
              className="bg-[#023347] text-white w-[300px] h-[50px] rounded-lg text-base font-medium hover:bg-[#03465e] transition"
            >
              Download pdf
            </button>

            <button
              className="bg-[#023347] text-white w-[300px] h-[50px] rounded-lg text-base font-medium hover:bg-[#03465e] transition"
            >
              Register
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default EventRegister;