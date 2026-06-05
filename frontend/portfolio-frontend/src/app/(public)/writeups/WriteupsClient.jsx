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

const difficultyStyles = (difficulty) => {
    const normalized = difficulty?.toLowerCase();
    if (normalized === "beginner") return "bg-emerald-100 text-emerald-700";
    if (normalized === "intermediate") return "bg-yellow-100 text-yellow-700";
    if (normalized === "advanced") return "bg-red-100 text-red-700";
    return "bg-neutral-100 text-neutral-600";
};

const WriteupsClient = ({ initialWriteups }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDifficulty, setSelectedDifficulty] = useState("All");

    const router = useRouter();

    const categories = useMemo(() => {
        return Array.from(
            new Set(initialWriteups.map((writeup) => writeup.category).filter(Boolean))
        );
    }, [initialWriteups]);

    const difficulties = useMemo(() => {
        return Array.from(
            new Set(
                initialWriteups.map((writeup) => writeup.difficulty).filter(Boolean)
            )
        );
    }, [initialWriteups]);

    const filteredWriteups = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return initialWriteups.filter((writeup) => {
            const matchesSearch = normalizedSearch
                ? writeup.title?.toLowerCase().includes(normalizedSearch)
                : true;
            const matchesCategory =
                selectedCategory === "All"
                    ? true
                    : writeup.category === selectedCategory;
            const matchesDifficulty =
                selectedDifficulty === "All"
                    ? true
                    : writeup.difficulty === selectedDifficulty;

            return matchesSearch && matchesCategory && matchesDifficulty;
        });
    }, [initialWriteups, searchTerm, selectedCategory, selectedDifficulty]);

    return (
        <div className="border border-white/20 bg-[var(--layout-nav-bg)]/35 py-4 shadow-[0_8px_30px_rgba(255,255,255,0.25)] backdrop-blur-sm rounded-3xl px-5 sm:pb-16 pb-5 sm:pt-10 pt-7 mb-4 text-white">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-semibold tracking-tight">Writeups</h1>
                    <div className="flex flex-col gap-4 rounded-4xl rounded-b-xl bg-white/50 sm:p-5 p-3 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
                        <input
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search posts"
                            className="w-full rounded-full border border-neutral-200 bg-white px-3.5 sm:px-5 py-2.5 sm:py-3 text-sm font-medium text-neutral-900 outline-none transition focus:border-blue-400"
                        />
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="sm:text-sm text-xs font-semibold uppercase tracking-wide text-neutral-700">
                                    Difficulty
                                </span>
                                {difficulties.length === 0 ? (
                                    <span className="text-sm text-neutral-400">No difficulty data</span>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedDifficulty("All")}
                                            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition hover:cursor-pointer ${selectedDifficulty === "All"
                                                ? "bg-neutral-900 text-white"
                                                : "bg-white text-neutral-600 hover:bg-neutral-100"
                                                }`}
                                        >
                                            All
                                        </button>
                                        {difficulties.map((difficulty) => (
                                            <button
                                                key={difficulty}
                                                onClick={() => setSelectedDifficulty(difficulty)}
                                                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition hover:cursor-pointer ${selectedDifficulty === difficulty
                                                    ? "bg-neutral-900 text-white"
                                                    : "bg-white text-neutral-600 hover:bg-neutral-100"
                                                    }`}
                                            >
                                                {difficulty}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="sm:text-sm text-xs font-semibold uppercase tracking-wide text-neutral-700">
                                    Category
                                </span>
                                {categories.length === 0 ? (
                                    <span className="text-sm text-neutral-400">No categories yet</span>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedCategory("All")}
                                            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide hover:cursor-pointer transition ${selectedCategory === "All"
                                                ? "bg-neutral-900 text-white"
                                                : "bg-white text-neutral-600 hover:bg-neutral-100"
                                                }`}
                                        >
                                            All
                                        </button>
                                        {categories.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition hover:cursor-pointer ${selectedCategory === category
                                                    ? "bg-neutral-900 text-white"
                                                    : "bg-white text-neutral-600 hover:bg-neutral-100"
                                                    }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {filteredWriteups.length === 0 ? (
                    <div className="text-sm text-neutral-500">No writeups found.</div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {filteredWriteups.map((writeup) => {
                            const thumbnail = writeup.thumbnail_url || DEFAULT_THUMBNAIL;
                            return (
                                <article
                                    key={writeup.id}
                                    className="group overflow-hidden rounded-[28px] bg-[#f7f3ec] shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:-translate-y-1 hover:cursor-pointer"
                                    onClick={() => router.push(`/writeups/${writeup.id}`)}
                                >
                                    <div className="relative aspect-[4/3] w-full">
                                        <img
                                            src={thumbnail}
                                            alt={writeup.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="relative -mt-8 mx-4 mb-6 rounded-2xl bg-white px-5 py-4 shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
                                        <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                                            <span>{writeup.category || "Writeup"}</span>
                                            <span className="h-1 w-1 rounded-full bg-neutral-400" />
                                            <span>{formatDate(writeup.createdAt)}</span>
                                        </div>
                                        <h2 className="sm:mt-3 mt-2 sm:text-xl text-md font-semibold uppercase leading-snug tracking-tight text-neutral-900">
                                            {writeup.title}
                                        </h2>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {writeup.category ? (
                                                <span className="rounded-full bg-sky-100 px-3 py-1 text-[0.625rem] sm:text-xs font-semibold uppercase tracking-wide text-sky-700">
                                                    {writeup.category}
                                                </span>
                                            ) : null}
                                            {writeup.difficulty ? (
                                                <span
                                                    className={`rounded-full px-3 py-1 text-[0.625rem] sm:text-xs font-semibold uppercase tracking-wide ${difficultyStyles(
                                                        writeup.difficulty
                                                    )}`}
                                                >
                                                    {writeup.difficulty}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="mt-3 text-xs font-medium text-neutral-500">
                                            <span>Updated {formatDate(writeup.updatedAt)}</span>
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

export default WriteupsClient;
