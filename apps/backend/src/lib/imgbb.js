const { httpError } = require("./errors");

async function uploadImageToImgbb(imageUpload = {}) {
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
        throw httpError(503, "image hosting not configured");
    }

    const { data, name, type } = imageUpload;
    if (!data || typeof data !== "string") {
        throw httpError(400, "image data is required");
    }

    const form = new FormData();
    form.append("image", data);
    if (name) form.append("name", name);
    if (type) form.append("content_type", type);

    const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
            method: "POST",
            body: form,
        }
    );

    if (!response.ok) {
        const info = await response.json().catch(() => ({}));
        const message =
            info?.error?.message || info?.message || "failed to upload image";
        throw httpError(response.status, message);
    }

    const payload = await response.json();
    const imageData = payload?.data;
    if (!imageData?.url) {
        throw httpError(502, "imgbb response missing image url");
    }

    return {
        url: imageData.url,
        displayUrl: imageData.display_url || null,
        deleteUrl: imageData.delete_url || null,
    };
}

module.exports = { uploadImageToImgbb };
