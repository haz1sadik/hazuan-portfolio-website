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

const toIsoString = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toISOString();
};

const toInputDateTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    const localDate = new Date(date.getTime() - offsetMs);
    return localDate.toISOString().slice(0, 16);
};

const EditEventPage = () => {
    const { accessToken } = useAuth();
    const params = useParams();
    const router = useRouter();
    const slug = useMemo(() => params?.slug, [params]);

    const [eventId, setEventId] = useState(null);
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const resolveEventId = async (value) => {
        if (!value) return null;
        const res = await api.get("/ctf-events");
        const match = res.data?.find(
            (item) => item.slug === value || item.id === value
        );
        return match?.id || value;
    };

    useEffect(() => {
        let isMounted = true;
        const loadEvent = async () => {
            if (!slug) return;
            setIsLoading(true);
            setError(null);

            try {
                const id = await resolveEventId(slug);
                if (!id) throw new Error("Event not found.");
                const res = await api.get(`/ctf-events/${id}`);
                if (!isMounted) return;
                setEventId(res.data?.id || id);
                setName(res.data?.name || "");
                setDescription(res.data?.description || "");
                setDate(toInputDateTime(res.data?.date));
                setThumbnailUrl(res.data?.thumbnail_url || "");
            } catch (err) {
                if (!isMounted) return;
                setError(err?.response?.data?.message || "Failed to load event.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadEvent();

        return () => {
            isMounted = false;
        };
    }, [slug]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (!accessToken) {
            setError("Please login again to update the event.");
            return;
        }

        try {
            setIsSubmitting(true);
            await api.put(
                `/ctf-events/${eventId}`,
                {
                    name,
                    description,
                    date: toIsoString(date),
                    thumbnail_url: thumbnailUrl || null,
                },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setSuccess("Event updated successfully.");
            router.push("/admin/dashboard/events");
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to update event.");
        } finally {
            setIsSubmitting(false);
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
                <h1 className="text-2xl font-semibold text-gray-900">Edit Event</h1>
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_0_rgba(0,0,0,0.05)]"
            >
                {isLoading ? (
                    <p className="text-sm text-gray-500">Loading event...</p>
                ) : (
                    <>
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

export default EditEventPage;