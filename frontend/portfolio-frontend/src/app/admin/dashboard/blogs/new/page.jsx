'use client';

import { useState } from "react";
import TextInputField from "@/components/ui/input/TextInputField";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import RichTextEditor from "@/components/common/RichTextEditor";
import { uploadImageToR2 } from "@/lib/imageUpload";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation'

const NewBlogPage = () => {
  const { accessToken } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!accessToken) {
      setError("Please login again to create a blog.");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post(
        "/blogs",
        { title, content },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setSuccess("Blog created successfully.");
      setTitle("");
      setContent("");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to create the blog."
      );
    } finally {
      setIsSubmitting(false);
      router.push("/admin/dashboard/blogs");
    }
  };

  const handleImageUpload = (file) =>
    uploadImageToR2({ file, accessToken });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">New Blog</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_0_rgba(0,0,0,0.05)]"
      >
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

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <div className="flex justify-end">
          <PrimaryButton
            type="submit"
            text={isSubmitting ? "Creating..." : "Create Blog"}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default NewBlogPage;