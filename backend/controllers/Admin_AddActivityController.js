import sequelize from "../config/database.js";

const getTableColumns = async (tableName) => {
    const [rows] = await sequelize.query(
        `
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = :tableName
        `,
        {
            replacements: { tableName }
        }
    );

    return new Set(rows.map((row) => row.column_name));
};

const insertIntoTable = async (tableName, values) => {
    const supportedColumns = await getTableColumns(tableName);
    const entries = Object.entries(values).filter(
        ([column, value]) => supportedColumns.has(column) && value !== undefined
    );

    if (!entries.length) {
        throw new Error(`No matching columns found for ${tableName}`);
    }

    const columns = entries.map(([column]) => column);
    const placeholders = columns.map((column) => `:${column}`);
    const replacements = Object.fromEntries(entries);

    await sequelize.query(
        `
            INSERT INTO ${tableName} (${columns.join(", ")})
            VALUES (${placeholders.join(", ")})
        `,
        { replacements }
    );
};


// ================= REQUIRED FIELDS (DB NOT NULL CONSTRAINT) =================
//
// Mandatory Text Fields (req.body):
// - batch
// - title
// - description
// - start_date
// - participants
// - testimonials_name
// - testimonials_class
// - testimonials_feedback
//
// Mandatory File Fields (req.files):
// - brochure              → maps to brochure_url (NOT NULL)
// - event_images          → maps to event_image_url (NOT NULL)
//
// Optional Fields:
// - end_date
// - resource_person_image
// - resource_person_name
// - resource_person_description
// - winner_image
// - winner_name
// - winner_description
//
// NOTE:
// - If required fields are missing → DB will throw NOT NULL constraint error
// - Always validate before inserting into DB
// ============================================================================



export const addActivity = async (req, res) => {
    try {
        console.log("ADD ACTIVITY WITH IMAGES");
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        const {
            batch,
            title,
            description,
            start_date,
            end_date,
            participants,
            resource_person_name,
            resource_person_description,
            winner_name,
            winner_description,
            testimonials_name,
            testimonials_class,
            testimonials_feedback
        } = req.body;

        // Validate required text fields
        if (
            !batch ||
            !title ||
            !description ||
            !start_date ||
            !participants ||
            !testimonials_name ||
            !testimonials_class ||
            !testimonials_feedback
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Get file URLs directly from multer (already uploaded to Cloudinary)
        const brochure_url =
            req.files?.brochure?.[0]?.path || null;

        const resource_person_image_url =
            req.files?.resource_person_image?.[0]?.path || null;

        const winner_image =
            req.files?.winner_image?.[0]?.path || null;

        // Handle multiple event images
        let event_image_url = null;

        if (req.files?.event_images) {
            const urls = req.files.event_images.map(file => file.path);
            event_image_url = urls.join(",");
        }

        // Validate required file fields (based on DB constraints)
        if (!brochure_url || !event_image_url) {
            return res.status(400).json({
                success: false,
                message: "Brochure and event images are required"
            });
        }

        await insertIntoTable("activities", {
            batch,
            brochure_url,
            title,
            description,
            start_date,
            end_date: end_date || null,
            participants,
            resource_person_image_url,
            resource_person_name: resource_person_name || null,
            resource_person_description: resource_person_description || null,
            event_image_url,
            winner_image,
            winner_name: winner_name || null,
            winner_description: winner_description || null,
            testimonials_name,
            testimonials_class,
            testimonials_feedback
        });

        return res.status(201).json({
            success: true,
            message: "Activity added successfully"
        });

    } catch (error) {
        console.error("FULL ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
