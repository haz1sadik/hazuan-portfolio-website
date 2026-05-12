import api from "@/lib/axios";

const MAX_IMAGE_SIZE_BYTES = 300_000;
const MAX_IMAGE_DIMENSION = 1080;

const loadImage = (file) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = (error) => {
            URL.revokeObjectURL(url);
            reject(error);
        };
        img.src = url;
    });

const canvasToBlob = (canvas, type, quality) =>
    new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), type, quality);
    });

const replaceExtension = (name, extension) => {
    const parts = name.split(".");
    if (parts.length <= 1) return `${name}.${extension}`;
    parts.pop();
    return `${parts.join(".")}.${extension}`;
};

export async function compressImage(file) {
    const image = await loadImage(file);
    const scale = Math.min(
        1,
        MAX_IMAGE_DIMENSION / Math.max(image.width, image.height)
    );
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    let quality = 0.9;
    let blob = await canvasToBlob(canvas, "image/jpeg", quality);

    while (blob && blob.size > MAX_IMAGE_SIZE_BYTES && quality > 0.4) {
        quality -= 0.1;
        blob = await canvasToBlob(canvas, "image/jpeg", quality);
    }

    while (blob && blob.size > MAX_IMAGE_SIZE_BYTES) {
        canvas.width = Math.max(320, Math.round(canvas.width * 0.9));
        canvas.height = Math.max(320, Math.round(canvas.height * 0.9));
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        blob = await canvasToBlob(canvas, "image/jpeg", Math.max(0.6, quality));
        if (canvas.width <= 320 || canvas.height <= 320) break;
    }

    if (!blob) {
        throw new Error("Image compression failed.");
    }

    return new File([blob], replaceExtension(file.name, "jpg"), {
        type: "image/jpeg",
    });
}

export async function uploadImageToR2({ file, accessToken }) {
    if (!accessToken) {
        throw new Error("Missing access token.");
    }

    const compressedFile = await compressImage(file);
    const fileName = `${Date.now()}-${compressedFile.name}`;

    const { data } = await api.post(
        "/images/upload-url",
        { fileName, contentType: compressedFile.type },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    await fetch(data.url, {
        method: "PUT",
        headers: {
            "Content-Type": compressedFile.type,
        },
        body: compressedFile,
    });

    return data.public_url || data.publicUrl;
}