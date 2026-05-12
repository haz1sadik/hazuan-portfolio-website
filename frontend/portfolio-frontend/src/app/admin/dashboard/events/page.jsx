'use client';

import { useEffect, useMemo, useState } from "react";
import { PostCardList } from "../PostCard";
import api from "@/lib/axios";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import { useAuth } from "@/context/AuthContext";

const EventPage = () => {
  const { accessToken } = useAuth();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchEvents = async () => {
      try {
        const res = await api.get("/ctf-events");
        if (isMounted) setEvents(res.data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const formattedEvents = useMemo(() => {
    return (events || []).map((eventItem) => ({
      ...eventItem,
      title: eventItem.name,
      content: eventItem.description,
      createdAt: eventItem.date,
    }));
  }, [events]);

  const handleDelete = async (eventItem) => {
    if (!eventItem?.id) return;
    if (!accessToken) {
      window.alert("Please login again to delete an event.");
      return;
    }
    const confirmed = window.confirm("Delete this event?");
    if (!confirmed) return;

    try {
      await api.delete(`/ctf-events/${eventItem.id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setEvents((prev) => prev.filter((item) => item.id !== eventItem.id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 lg:px-20 2xl:px-60">CTF Events</h1>
        <PrimaryButton href="/admin/dashboard/events/new" leftIcon text="New Event" />
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading events...</p>
      ) : (
        <PostCardList
          posts={formattedEvents}
          getEditHref={(eventItem) => `/admin/dashboard/events/${eventItem.slug}/edit`}
          getDeleteHref={(eventItem) => `/admin/dashboard/events/${eventItem.slug}/delete`}
          getDeleteHandler={(eventItem) => () => handleDelete(eventItem)}
        />
      )}
    </div>
  );
};

export default EventPage;