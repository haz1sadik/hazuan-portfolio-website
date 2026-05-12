'use client';

import { PostCardList } from "../PostCard";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

const GuidePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/guides");
        setPosts(res.data);
        //console.log(res.data);

      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (post) => {
    if (!post?.id) return;
    const confirmed = window.confirm("Delete this guide?");
    if (!confirmed) return;

    try {
      await api.delete(`/guides/${post.id}`);
      setPosts((prev) => prev.filter((item) => item.id !== post.id));
    } catch (error) {
      console.error("Error deleting guide:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 lg:px-20 2xl:px-60">Guides</h1>
        <PrimaryButton href="/admin/dashboard/guides/new" leftIcon text="New Guide" />
      </div>
      <PostCardList
        posts={posts}
        getEditHref={(post) => `/admin/dashboard/guides/${post.slug}/edit`}
        getDeleteHref={(post) => `/admin/dashboard/guides/${post.slug}/delete`}
        getDeleteHandler={(post) => () => handleDelete(post)}
      />
    </div>
  );
};

export default GuidePage;