'use client';

import { PostCardList } from "../PostCard";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

const WriteupPage = () => {
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchPosts = async () => {
      try {
        const [writeupsRes, eventsRes] = await Promise.all([
          api.get("/ctf-writeups"),
          api.get("/ctf-events"),
        ]);
        if (!isMounted) return;
        setPosts(writeupsRes.data || []);
        setEvents(eventsRes.data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const eventNameMap = useMemo(() => {
    return events.reduce((acc, eventItem) => {
      acc[eventItem.id] = eventItem.name;
      return acc;
    }, {});
  }, [events]);

  const eventThumbnailMap = useMemo(() => {
    return events.reduce((acc, eventItem) => {
      acc[eventItem.id] = eventItem.thumbnail_url || "";
      return acc;
    }, {});
  }, [events]);

  const filteredPosts = useMemo(() => {
    const list = selectedEventId
      ? posts.filter((post) => post.event_id === selectedEventId)
      : posts;
    return list.map((post) => ({
      ...post,
      thumbnail_url: eventThumbnailMap[post.event_id] || post.thumbnail_url,
    }));
  }, [posts, selectedEventId, eventThumbnailMap]);

  const groupedPosts = useMemo(() => {
    return filteredPosts.reduce((acc, post) => {
      const key = post.event_id || "unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(post);
      return acc;
    }, {});
  }, [filteredPosts]);

  const handleDelete = async (post) => {
    if (!post?.id) return;
    const confirmed = window.confirm("Delete this writeup?");
    if (!confirmed) return;

    try {
      await api.delete(`/ctf-writeups/${post.id}`);
      setPosts((prev) => prev.filter((item) => item.id !== post.id));
    } catch (error) {
      console.error("Error deleting writeup:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 lg:px-20 2xl:px-60">
          Write Ups
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <select
            id="eventFilter"
            name="eventFilter"
            value={selectedEventId}
            onChange={(event) => setSelectedEventId(event.target.value)}
            className="h-11.25 border-2 border-[#a8b9c7] px-4 py-2.5 text-sm rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-hazuan-primary focus:border-hazuan-primary"
            disabled={isLoading}
          >
            <option value="">All events</option>
            {events.map((eventItem) => (
              <option key={eventItem.id} value={eventItem.id}>
                {eventItem.name}
              </option>
            ))}
          </select>
          <PrimaryButton
            href="/admin/dashboard/writeups/new"
            leftIcon
            text="New Write Up"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading writeups...</p>
      ) : (
        Object.entries(groupedPosts).map(([eventId, writeups]) => (
          <div key={eventId} className="flex flex-col gap-4 mt-2">
            <h2 className="text-xl font-semibold text-gray-800 lg:px-20 2xl:px-60">
              {eventId === "unknown"
                ? "Unassigned Event"
                : eventNameMap[eventId] || "Unknown Event"}
            </h2>
            <PostCardList
              posts={writeups}
              getEditHref={(post) => `/admin/dashboard/writeups/${post.slug}/edit`}
              getDeleteHref={(post) => `/admin/dashboard/writeups/${post.slug}/delete`}
              getDeleteHandler={(post) => () => handleDelete(post)}
            />
            <hr className="border-gray-200 border-2 lg:mx-15 2xl:mx-55" />
          </div>
        ))
      )}
    </div>
  );
};

export default WriteupPage;