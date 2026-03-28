// import sequelize from "../config/database.js";

// export const updateAnnouncement = async (req, res) => {
//     try {
//         console.log("✅ HIT UPDATE API");
//         const { id, type } = req.params;
//         const {
//             title,
//             short_description,
//             description,
//             brochure_url,
//             start_date,
//             end_date,
//             faculty_contact,
//             student_contact,
//             event_link,
//             registration_start_date,
//             registration_end_date
//         } = req.body;

//         if (!id || !type) {
//             return res.status(400).json({
//                 success: false,
//                 message: "ID and type are required"
//             });
//         }

//         let query = "";

//         if (type === "event") {
//             query = `
//                 UPDATE upcoming_events
//                 SET
//                     event_title = :title,
//                     event_short_description = :short_description,
//                     event_description = :description,
//                     brochure_url = :brochure_url,
//                     start_date = :start_date,
//                     end_date = :end_date,
//                     faculty_contact = :faculty_contact,
//                     student_contact = :student_contact,
//                     event_link = :event_link,
//                     registration_start_date = :registration_start_date,
//                     registration_end_date = :registration_end_date
//                 WHERE event_id = :id
//             `;
//         } 
//         else if (type === "celebration") {
//             query = `
//                 UPDATE upcoming_celebrations
//                 SET
//                     event_title = :title,
//                     short_description = :short_description,
//                     event_description = :description,
//                     brochure_url = :brochure_url,
//                     start_date = :start_date,
//                     end_date = :end_date,
//                     faculty_contact = :faculty_contact,
//                     student_contact = :student_contact
//                 WHERE event_id = :id
//             `;
//         } 
//         else {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid type"
//             });
//         }

//         const result = await sequelize.query(query, {
//             replacements: {
//                 id,
//                 title,
//                 short_description,
//                 description,
//                 brochure_url,
//                 start_date,
//                 end_date,
//                 faculty_contact,
//                 student_contact,
//                 event_link,
//                 registration_start_date,
//                 registration_end_date
//             }
//         });

//         console.log("Update result:", result);


//         res.status(200).json({
//             success: true,
//             message: "Updated successfully"
//         });

//     } catch (error) {
//         console.error("Error updating announcement:", error);
//         res.status(500).json({
//             success: false,
//             message: "Server error"
//         });
//     }
// };


import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

export const updateAnnouncement = async (req, res) => {
    try {
        const { id, type } = req.params;
        const uploadedFileUrl = req.file?.path;

        if (!id || !type) {
            return res.status(400).json({
                success: false,
                message: "ID and type are required"
            });
        }

        // 🔹 Step 1: Decide table
        let table = "";
        if (type === "event") {
            table = "upcoming_events";
        } else if (type === "celebration") {
            table = "upcoming_celebrations";
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid type"
            });
        }

        // 🔹 Step 2: Fetch existing data
        const existingData = await sequelize.query(
            `SELECT * FROM ${table} WHERE event_id = :id`,
            {
                replacements: { id },
                type: QueryTypes.SELECT
            }
        );

        if (!existingData.length) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        const old = existingData[0];
        const pickValue = (value, fallback) =>
            value === undefined ? fallback : value === "" ? null : value;
        const keepOldIfBlank = (value, fallback) =>
            value === undefined || value === "" ? fallback : value;

        // 🔹 Step 3: Extract body
        const body = req.body ?? {};
        const {
            title,
            short_description,
            description,
            brochure_url,
            start_date,
            end_date,
            faculty_contact,
            student_contact,
            event_link,
            registration_start_date,
            registration_end_date
        } = body;

        const nextBrochureUrl = uploadedFileUrl ?? pickValue(brochure_url, old.brochure_url);
        const nextEventLink =
            type === "event"
                ? keepOldIfBlank(event_link, old.event_link)
                : undefined;
        const nextRegistrationStartDate =
            type === "event"
                ? keepOldIfBlank(registration_start_date, old.registration_start_date)
                : undefined;
        const nextRegistrationEndDate =
            type === "event"
                ? keepOldIfBlank(registration_end_date, old.registration_end_date)
                : undefined;

        // 🔹 Step 4: Merge old + new
        if (type === "event" && !nextEventLink) {
            return res.status(400).json({
                success: false,
                message: "Event link is required for event records"
            });
        }

        const finalData = {
            event_title: pickValue(title, old.event_title),

            // ⚠️ column name differs
            event_short_description:
                type === "event"
                    ? pickValue(short_description, old.event_short_description)
                    : undefined,

            short_description:
                type === "celebration"
                    ? pickValue(short_description, old.short_description)
                    : undefined,

            event_description: pickValue(description, old.event_description),
            brochure_url: nextBrochureUrl,
            start_date: pickValue(start_date, old.start_date),
            end_date: pickValue(end_date, old.end_date),
            faculty_contact: pickValue(faculty_contact, old.faculty_contact),
            student_contact: pickValue(student_contact, old.student_contact),

            // only for event
            event_link:
                type === "event"
                    ? nextEventLink
                    : undefined,

            registration_start_date:
                type === "event"
                    ? nextRegistrationStartDate
                    : undefined,

            registration_end_date:
                type === "event"
                    ? nextRegistrationEndDate
                    : undefined
        };

        // 🔹 Step 5: Build dynamic query
        const updates = [];
        const replacements = { id };

        Object.entries(finalData).forEach(([key, value]) => {
            if (value !== undefined) {
                updates.push(`${key} = :${key}`);
                replacements[key] = value;
            }
        });

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields to update"
            });
        }

        const query = `
            UPDATE ${table}
            SET ${updates.join(", ")}
            WHERE event_id = :id
        `;

        // 🔹 Step 6: Execute update
        await sequelize.query(query, { replacements });

        console.log("✅ Updated successfully");

        res.status(200).json({
            success: true,
            message: "Updated successfully"
        });

    } catch (error) {
        console.error("❌ Error updating announcement:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
