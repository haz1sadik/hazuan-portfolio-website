'use client';

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TextInputField from "@/components/ui/input/TextInputField";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import RichTextEditor from "@/components/common/RichTextEditor";
import ThumbnailUpload from "@/components/common/ThumbnailUpload";
import { uploadImageToR2 } from "@/lib/imageUpload";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];

const EditGuidePage = () => {
    const { accessToken } = useAuth();
    const params = useParams();
    const router = useRouter();
    const slug = useMemo(() => params?.slug, [params]);

    const [guideId, setGuideId] = useState(null);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [content, setContent] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const resolveGuideId = async (value) => {
        if (!value) return null;
        const res = await api.get("/guides");
        const match = res.data?.find(
            (item) => item.slug === value || item.id === value
        );
        return match?.id || value;
    };

    useEffect(() => {
        let isMounted = true;
        const loadGuide = async () => {
            if (!slug) return;
            setIsLoading(true);
            setError(null);

            try {
                const id = await resolveGuideId(slug);
                if (!id) throw new Error("Guide not found.");
                const res = await api.get(`/guides/${id}`);
                if (!isMounted) return;
                setGuideId(res.data?.id || id);
                setTitle(res.data?.title || "");
                setCategory(res.data?.category || "");
                setDifficulty(res.data?.difficulty || "");
                setContent(res.data?.content || "");
                setThumbnailUrl(res.data?.thumbnail_url || "");
            } catch (err) {
                if (!isMounted) return;
                setError(err?.response?.data?.message || "Failed to load guide.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadGuide();

        return () => {
            isMounted = false;
        };
    }, [slug]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (!accessToken) {
            setError("Please login again to update the guide.");
            return;
        }

        try {
            setIsSubmitting(true);
            await api.put(
                `/guides/${guideId}`,
                { title, content, category, difficulty, thumbnail_url: thumbnailUrl || null },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setSuccess("Guide updated successfully.");
            router.push("/admin/dashboard/guides");
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to update guide.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = (file) =>
        uploadImageToR2({ file, accessToken });

    const handleThumbnailUpload = async (file) => {
        if (!accessToken) {
            throw new Error("Please login again to upload a thumbnail.");
        }
        return uploadImageToR2({ file, accessToken });
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Edit Guide</h1>
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_0_rgba(0,0,0,0.05)]"
            >
                {isLoading ? (
                    <p className="text-sm text-gray-500">Loading guide...</p>
                ) : (
                    <>
                        <div className="flex flex-wrap gap-6">
                            <TextInputField
                                label="Title"
                                name="title"
                                placeholder="Enter guide title"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                required
                            />

                            <TextInputField
                                label="Category"
                                name="category"
                                placeholder="e.g. Proxmox"
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                            />

                            <div className="flex flex-col gap-2 w-[20rem]">
                                <label htmlFor="difficulty" className="text-md text-black">
                                    Difficulty
                                </label>
                                <select
                                    id="difficulty"
                                    name="difficulty"
                                    value={difficulty}
                                    onChange={(event) => setDifficulty(event.target.value)}
                                    className="w-full h-11.25 border-2 border-[#a8b9c7] px-4 py-2.5 text-sm rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-hazuan-primary focus:border-hazuan-primary"
                                    required
                                >
                                    <option value="">Select difficulty</option>
                                    {difficultyOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="content" className="text-md text-black">
                                Content
                            </label>
                            <RichTextEditor
                                value={content}
                                onChange={setContent}
                                onImageUpload={handleImageUpload}
                                placeholder="Write your guide content here..."
                            />
                        </div>

                        <ThumbnailUpload
                            label="Thumbnail"
                            value={thumbnailUrl}
                            onChange={setThumbnailUrl}
                            onUpload={handleThumbnailUpload}
                            disabled={isSubmitting}
                        />
                    </>
                )}

                {error && <p className="text-sm text-red-600">{error}</p>}
                {success && <p className="text-sm text-green-600">{success}</p>}

                <div className="flex justify-end">
                    <PrimaryButton
                        type="submit"
                        text={isSubmitting ? "Saving..." : "Save Changes"}
                        disabled={isSubmitting || isLoading}
                    />
                </div>
            </form>
        </div>
    );
};

export default EditGuidePage;