import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Image } from "../models/index.model.js"

// 1. Initialize S3 Client for Cloudflare R2
const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

async function getUrl(fileName, contentType) {
    if (!fileName || !contentType) {
        throw new Error("Missing fileName or contentType");
    }
    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        ContentType: "image/png", // Highly recommended to enforce file types
        requestChecksumCalculation: "WHEN_REQUIRED",
        responseChecksumValidation: "WHEN_REQUIRED",
    });

    // 2. Generate the URL (expires in 60 minutes)
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return url;
}

export const getUploadUrl = async (req, res) => {
    const { fileName, contentType } = req.body;

    if (!fileName || !contentType) {
        return res.status(400).json({ message: "Missing fileName or contentType" });
    }

    try {
        const existingImage = await Image.findOne({ where: { r2_key: fileName } });
        if (existingImage) {
            return res.status(400).json({ message: "File with the same name already exists." });
        }
        const url = await getUrl(fileName, contentType);
        const publicUrl = `${process.env.R2_PUBLIC_DOMAIN}/${fileName}`;
        await Image.create({ r2_key: fileName, public_url: publicUrl, alt_text: `${fileName} image` });
        res.json({ url, publicUrl });
    } catch (error) {
        console.error("Error generating upload URL:", error);
        res.status(500).json({ message: "Failed to generate upload URL" });
    }
};