'use client';

import { useState } from "react";
import TextInputField from "@/components/ui/input/TextInputField";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import RichTextEditor from "@/components/common/RichTextEditor";
import ThumbnailUpload from "@/components/common/ThumbnailUpload";
import { uploadImageToR2 } from "@/lib/imageUpload";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation'

const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];

const NewGuidesPage = () => {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!accessToken) {
      setError("Please login again to create a guide.");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post(
        "/guides",
        { title, content, category, difficulty, thumbnail_url: thumbnailUrl || null },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setSuccess("Guide created successfully.");
      setTitle("");
      setCategory("");
      setDifficulty("");
      setContent("");
      setThumbnailUrl("");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to create the guide."
      );
    } finally {
      setIsSubmitting(false);
      router.push("/admin/dashboard/guides");
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
        <h1 className="text-2xl font-semibold text-gray-900">New Guide</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_0_rgba(0,0,0,0.05)]"
      >
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

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <div className="flex justify-end">
          <PrimaryButton
            type="submit"
            text={isSubmitting ? "Creating..." : "Create Guide"}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default NewGuidesPage;