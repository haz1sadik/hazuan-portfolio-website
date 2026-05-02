'use client';

import { PostCardList } from "../PostCard";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

const WriteupPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/ctf-writeups");
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
      <h1 className="text-2xl font-semibold text-gray-900">Writeups</h1>
      <PostCardList
        posts={posts}
        getEditHref={(post) => `/admin/dashboard/writeups/${post.slug}/edit`}
        getDeleteHref={(post) => `/admin/dashboard/writeups/${post.slug}/delete`}
        getDeleteHandler={(post) => () => handleDelete(post)}
      />
    </div>
  );
};

export default WriteupPage;