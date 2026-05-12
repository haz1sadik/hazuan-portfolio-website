'use client';

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TextInputField from "@/components/ui/input/TextInputField";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import RichTextEditor from "@/components/common/RichTextEditor";
import { uploadImageToR2 } from "@/lib/imageUpload";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

const EditBlogPage = () => {
    const { accessToken } = useAuth();
    const params = useParams();
    const router = useRouter();
    const slug = useMemo(() => params?.slug, [params]);

    const [blogId, setBlogId] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const resolveBlogId = async (value) => {
        if (!value) return null;
        const res = await api.get("/blogs");
        const match = res.data?.find(
            (item) => item.slug === value || item.id === value
        );
        return match?.id || value;
    };

    useEffect(() => {
        let isMounted = true;
        const loadBlog = async () => {
            if (!slug) return;
            setIsLoading(true);
            setError(null);

            try {
                const id = await resolveBlogId(slug);
                if (!id) throw new Error("Blog not found.");
                const res = await api.get(`/blogs/${id}`);
                if (!isMounted) return;
                setBlogId(res.data?.id || id);
                setTitle(res.data?.title || "");
                setContent(res.data?.content || "");
            } catch (err) {
                if (!isMounted) return;
                setError(err?.response?.data?.message || "Failed to load blog.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadBlog();

        return () => {
            isMounted = false;
        };
    }, [slug]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (!accessToken) {
            setError("Please login again to update the blog.");
            return;
        }

        try {
            setIsSubmitting(true);
            await api.put(
                `/blogs/${blogId}`,
                { title, content },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setSuccess("Blog updated successfully.");
            router.push("/admin/dashboard/blogs");
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to update blog.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = (file) =>
        uploadImageToR2({ file, accessToken });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Edit Blog</h1>
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_0_rgba(0,0,0,0.05)]"
            >
                {isLoading ? (
                    <p className="text-sm text-gray-500">Loading blog...</p>
                ) : (
                    <>
                        <div className="flex flex-wrap gap-6">
                            <TextInputField
                                label="Title"
                                name="title"
                                placeholder="Enter blog title"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="content" className="text-md text-black">
                                Content
                            </label>
                            <RichTextEditor
                                value={content}
                                onChange={setContent}
                                onImageUpload={handleImageUpload}
                                placeholder="Write your blog content here..."
                            />
                        </div>
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

export default EditBlogPage;