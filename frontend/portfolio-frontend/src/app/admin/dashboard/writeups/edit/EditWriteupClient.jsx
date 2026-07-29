'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TextInputField from "@/components/ui/input/TextInputField";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import RichTextEditor from "@/components/common/RichTextEditor";
import { uploadImageToR2 } from "@/lib/imageUpload";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];

const EditWriteupClient = () => {
    const { accessToken } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const slug = searchParams.get("slug");

    const [writeupId, setWriteupId] = useState(null);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [eventId, setEventId] = useState("");
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const selectedEvent = useMemo(() => events.find((event) => String(event.id) === String(eventId)), [events, eventId]);
    const selectedEventThumbnail = selectedEvent?.thumbnail_url || "";

    useEffect(() => {
        let isMounted = true;

        const loadWriteup = async () => {
            if (!slug) {
                setError("Missing writeup slug.");
                setIsLoading(false);
                setEventsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const [eventsRes, writeupsRes] = await Promise.all([api.get("/ctf-events"), api.get("/ctf-writeups")]);
                const match = writeupsRes.data?.find((item) => item.slug === slug || item.id === slug);
                const id = match?.id || slug;

                if (!id) throw new Error("Writeup not found.");

                const writeupRes = await api.get(`/ctf-writeups/${id}`);
                if (!isMounted) return;

                setEvents(eventsRes.data || []);
                setEventsLoading(false);
                setWriteupId(writeupRes.data?.id || id);
                setTitle(writeupRes.data?.title || "");
                setCategory(writeupRes.data?.category || "");
                setDifficulty(writeupRes.data?.difficulty || "");
                setEventId(writeupRes.data?.event_id || "");
                setContent(writeupRes.data?.content || "");
            } catch (err) {
                if (!isMounted) return;
                setError(err?.response?.data?.message || "Failed to load writeup.");
                setEventsLoading(false);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadWriteup();

        return () => {
            isMounted = false;
        };
    }, [slug]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (!accessToken) {
            setError("Please login again to update the writeup.");
            return;
        }

        try {
            setIsSubmitting(true);
            await api.put(
                `/ctf-writeups/${writeupId}`,
                { title, content, category, difficulty, eventId },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setSuccess("Writeup updated successfully.");
            router.push("/admin/dashboard/writeups");
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to update writeup.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = (file) => uploadImageToR2({ file, accessToken });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Edit Writeup</h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_0_rgba(0,0,0,0.05)]">
                {isLoading ? (
                    <p className="text-sm text-gray-500">Loading writeup...</p>
                ) : (
                    <>
                        <div className="flex flex-wrap gap-6">
                            <TextInputField label="Title" name="title" placeholder="Enter writeup title" value={title} onChange={(event) => setTitle(event.target.value)} required />
                            <TextInputField label="Category" name="category" placeholder="e.g. Stega" value={category} onChange={(event) => setCategory(event.target.value)} />
                            <div className="flex flex-col gap-2 w-[20rem]">
                                <label htmlFor="difficulty" className="text-md text-black">Difficulty</label>
                                <select id="difficulty" name="difficulty" value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="w-full h-11.25 border-2 border-[#a8b9c7] px-4 py-2.5 text-sm rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-hazuan-primary focus:border-hazuan-primary" required>
                                    <option value="">Select difficulty</option>
                                    {difficultyOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 w-[20rem]">
                                <label htmlFor="eventId" className="text-md text-black">CTF Event</label>
                                <select id="eventId" name="eventId" value={eventId} onChange={(event) => setEventId(event.target.value)} className="w-full h-11.25 border-2 border-[#a8b9c7] px-4 py-2.5 text-sm rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-hazuan-primary focus:border-hazuan-primary" required disabled={eventsLoading}>
                                    <option value="">{eventsLoading ? "Loading events..." : "Select event"}</option>
                                    {events.map((eventItem) => (<option key={eventItem.id} value={eventItem.id}>{eventItem.name}</option>))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-md text-black">Event Thumbnail</label>
                            {selectedEventThumbnail ? <img src={selectedEventThumbnail} alt="Event thumbnail preview" className="h-40 w-full max-w-xl rounded-xl object-cover shadow" /> : <p className="text-sm text-gray-500">Select an event to preview its thumbnail.</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="content" className="text-md text-black">Content</label>
                            <RichTextEditor value={content} onChange={setContent} onImageUpload={handleImageUpload} placeholder="Write your writeup content here..." />
                        </div>
                    </>
                )}

                {error && <p className="text-sm text-red-600">{error}</p>}
                {success && <p className="text-sm text-green-600">{success}</p>}

                <div className="flex justify-end">
                    <PrimaryButton type="submit" text={isSubmitting ? "Saving..." : "Save Changes"} disabled={isSubmitting || isLoading} />
                </div>
            </form>
        </div>
    );
};

export default EditWriteupClient;