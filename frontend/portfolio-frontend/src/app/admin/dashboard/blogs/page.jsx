'use client';

import { PostCardList } from "../PostCard";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

const BlogPage = () => {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/blogs");
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
    const confirmed = window.confirm("Delete this blog?");
    if (!confirmed) return;

    try {
      await api.delete(`/blogs/${post.id}`);
      setPosts((prev) => prev.filter((item) => item.id !== post.id));
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Blogs</h1>
      <PostCardList
        posts={posts}
        getEditHref={(post) => `/admin/dashboard/blogs/${post.slug}/edit`}
        getDeleteHref={(post) => `/admin/dashboard/blogs/${post.slug}/delete`}
        getDeleteHandler={(post) => () => handleDelete(post)}
      />
    </div>
  );
};

export default BlogPage;