import { API_ENDPOINTS } from "./apiEndpoints.js";

const CLOUDINARY_UPLOAD_PRESET = "spendwise";

const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const uploadProfileImage = async (image) => {
    if (!image) return "";

    // If image is already a string (URL or Base64), return it directly
    if (typeof image === "string") return image;

    try {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(API_ENDPOINTS.UPLOAD_IMAGE, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            if (data.secure_url) {
                return data.secure_url;
            }
        }
    } catch (error) {
        console.warn("Cloudinary upload failed or not configured, falling back to local base64 encoding", error);
    }

    // Fallback to base64 data URL if Cloudinary is not configured or fails
    return await convertFileToBase64(image);
};

export default uploadProfileImage;