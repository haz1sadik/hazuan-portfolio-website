"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_THUMBNAIL = "/default_thumbnail.jpg";

const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    });
};

const BlogsClient = ({ initialBlogs }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDifficulty, setSelectedDifficulty] = useState("All");

    const router = useRouter();

    const categories = useMemo(() => {
        return Array.from(
            new Set(initialBlogs.map((blog) => blog.category).filter(Boolean))
        );
    }, [initialBlogs]);

    const difficulties = useMemo(() => {
        return Array.from(
            new Set(initialBlogs.map((blog) => blog.difficulty).filter(Boolean))
        );
    }, [initialBlogs]);

    const filteredBlogs = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return initialBlogs.filter((blog) => {
            const matchesSearch = normalizedSearch
                ? blog.title?.toLowerCase().includes(normalizedSearch)
                : true;
            const matchesCategory =
                selectedCategory === "All" ? true : blog.category === selectedCategory;
            const matchesDifficulty =
                selectedDifficulty === "All"
                    ? true
                    : blog.difficulty === selectedDifficulty;

            return matchesSearch && matchesCategory && matchesDifficulty;
        });
    }, [initialBlogs, searchTerm, selectedCategory, selectedDifficulty]);

    return (
        <div className="border border-white/20 bg-[var(--layout-nav-bg)]/35 py-4 shadow-[0_8px_30px_rgba(255,255,255,0.25)] backdrop-blur-sm rounded-3xl px-5 sm:pb-16 pb-5 sm:pt-10 pt-7 mb-4 text-white">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:gap-8">
                <div className="flex flex-col gap-4">
                    <h1 className="sm:text-3xl text-2xl font-semibold tracking-tight">Blogs</h1>

                    <div className="flex flex-col gap-4 rounded-full bg-white/50 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
                        <input
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search posts"
                            className="w-full rounded-full border border-neutral-200 bg-white/80 px-3.5 py-2.5 sm:px-5 sm:py-3 text-sm font-medium text-neutral-900 outline-none transition focus:border-blue-400"
                        />
                    </div>
                </div>

                {filteredBlogs.length === 0 ? (
                    <div className="text-sm text-neutral-500">No blogs found.</div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {filteredBlogs.map((blog) => {
                            const thumbnail = blog.thumbnail_url || DEFAULT_THUMBNAIL;
                            return (
                                <article
                                    key={blog.id}
                                    className="group overflow-hidden rounded-[28px] bg-[#f7f3ec] shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:-translate-y-1 hover:cursor-pointer"
                                    onClick={() => router.push(`/blogs/${blog.id}`)}
                                >
                                    <div className="aspect-[4/3] w-full">
                                        <img
                                            src={thumbnail}
                                            alt={blog.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="relative -mt-8 mx-4 mb-4 rounded-2xl bg-white px-5 py-4 shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
                                        <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 sm:text-[11px] text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                                            <span>{formatDate(blog.createdAt)}</span>
                                        </div>
                                        <h2 className="sm:mt-3 mt-2 sm:text-xl text-md font-bold uppercase leading-snug tracking-tight text-neutral-900">
                                            {blog.title}
                                        </h2>
                                        <div className="mt-1 text-xs font-medium text-neutral-500">
                                            <span>Updated {formatDate(blog.updatedAt)}</span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogsClient;
