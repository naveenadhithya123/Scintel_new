import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "celebrations",
        resource_type: "auto", // supports image/pdf
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // ✅ 50MB
    }
});

export default upload;