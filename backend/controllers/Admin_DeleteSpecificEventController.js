import sequelize from "../config/database.js";

export const deleteAnnouncement = async (req, res) => {
    try {

        const { id, type } = req.params;

        if (!id || !type) {
            return res.status(400).json({
                success: false,
                message: "ID and type are required"
            });
        }

        let query = "";

        if (type === "event") {
            query = `
                DELETE FROM upcoming_events
                WHERE event_id = :id
            `;
        } 
        else if (type === "celebration") {
            query = `
                DELETE FROM upcoming_celebrations
                WHERE event_id = :id
            `;
        } 
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid type"
            });
        }

        const result = await sequelize.query(query, {
            replacements: { id }
        });

        console.log("Delete result:", result);

        return res.status(200).json({
            success: true,
            message: "Deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting announcement:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};