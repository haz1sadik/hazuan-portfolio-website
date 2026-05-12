'use client';

import { useState } from "react";
import TextInputField from "@/components/ui/input/TextInputField";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import RichTextEditor from "@/components/common/RichTextEditor";
import ThumbnailUpload from "@/components/common/ThumbnailUpload";
import { uploadImageToR2 } from "@/lib/imageUpload";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const toIsoString = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toISOString();
};

const NewEventPage = () => {
    const { accessToken } = useAuth();
    const router = useRouter();
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (!accessToken) {
            setError("Please login again to create an event.");
            return;
        }

        try {
            setIsSubmitting(true);
            await api.post(
                "/ctf-events",
                {
                    name,
                    description,
                    date: toIsoString(date),
                    thumbnail_url: thumbnailUrl || null,
                },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setSuccess("Event created successfully.");
            setName("");
            setDate("");
            setDescription("");
            setThumbnailUrl("");
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to create the event.");
        } finally {
            setIsSubmitting(false);
            router.push("/admin/dashboard/events");
        }
    };

    const handleImageUpload = (file) => uploadImageToR2({ file, accessToken });

    const handleThumbnailUpload = async (file) => {
        if (!accessToken) {
            throw new Error("Please login again to upload a thumbnail.");
        }
        return uploadImageToR2({ file, accessToken });
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">New Event</h1>
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_0_rgba(0,0,0,0.05)]"
            >
                <div className="flex flex-wrap gap-6">
                    <TextInputField
                        label="Name"
                        name="name"
                        placeholder="Enter event name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />

                    <TextInputField
                        label="Date"
                        name="date"
                        type="datetime-local"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="description" className="text-md text-black">
                        Description
                    </label>
                    <RichTextEditor
                        value={description}
                        onChange={setDescription}
                        onImageUpload={handleImageUpload}
                        placeholder="Write your event description here..."
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
                        text={isSubmitting ? "Creating..." : "Create Event"}
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </div>
    );
};

export default NewEventPage;