'use client';

import Link from "next/link";

const formatDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
};

const toPlainText = (value = "") =>
    value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const resolveHref = (href) => (typeof href === "string" && href.length ? href : null);

const Badge = ({ label, variant = "default" }) => {
    const base = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold";
    const styles = {
        category: "bg-blue-100 text-blue-700",
        beginner: "bg-green-100 text-green-700",
        intermediate: "bg-yellow-100 text-yellow-700",
        advanced: "bg-red-100 text-red-700",
        default: "bg-hazuan-accent text-hazuan-primary",
    };

    return (
        <span className={`${base} ${styles[variant] || styles.default}`}>
            {label}
        </span>
    );
};

const ActionLink = ({ href, label, variant }) => {
    const style =
        variant === "danger"
            ? "inline-flex items-center justify-center rounded-full border border-red-500 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
            : "inline-flex items-center justify-center rounded-full border border-hazuan-primary px-4 py-2 text-xs font-semibold text-hazuan-primary hover:bg-hazuan-primary hover:text-white";

    const resolved = resolveHref(href);

    if (!resolved) {
        return (
            <span className={`${style} opacity-50 cursor-not-allowed`} aria-disabled="true">
                {label}
            </span>
        );
    }

    return (
        <Link href={resolved} className={style}>
            {label}
        </Link>
    );
};

const ActionButton = ({ onClick, label, variant }) => {
    const style =
        variant === "danger"
            ? "inline-flex items-center justify-center rounded-full border border-red-500 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
            : "inline-flex items-center justify-center rounded-full border border-hazuan-primary px-4 py-2 text-xs font-semibold text-hazuan-primary hover:bg-hazuan-primary hover:text-white";

    if (!onClick) {
        return (
            <span className={`${style} opacity-50 cursor-not-allowed`} aria-disabled="true">
                {label}
            </span>
        );
    }

    return (
        <button type="button" onClick={onClick} className={style}>
            {label}
        </button>
    );
};

const PostCard = ({
    title,
    slug,
    content,
    createdAt,
    updatedAt,
    thumbnail_url,
    category,
    difficulty,
    editHref,
    deleteHref,
    onDelete,
}) => {
    const createdLabel = formatDate(createdAt);
    const updatedLabel = formatDate(updatedAt);
    const hasUpdate = updatedLabel && updatedLabel !== createdLabel;
    const summary = toPlainText(content);

    return (
        <article className="flex w-full flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_2px_10px_0_rgba(0,0,0,0.05)]">
            <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-gray-100">
                {thumbnail_url ? (
                    <img
                        src={thumbnail_url}
                        alt={title ? `${title} thumbnail` : "Post thumbnail"}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <img
                        src="/default_thumbnail.jpg"
                        alt={title ? `${title} thumbnail` : "Post thumbnail"}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                )}
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    {category && <Badge label={category} variant="category" />}
                    {difficulty && (
                        <Badge
                            label={difficulty}
                            variant={difficulty.toLowerCase()}
                        />
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {title || slug}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                        {summary || "No content provided."}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    {createdLabel && <span>Posted on {createdLabel}</span>}
                    {hasUpdate && <span>Edited on {updatedLabel}</span>}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <ActionLink href={editHref} label="Edit" />
                {onDelete ? (
                    <ActionButton onClick={onDelete} label="Delete" variant="danger" />
                ) : (
                    <ActionLink href={deleteHref} label="Delete" variant="danger" />
                )}
            </div>
        </article>
    );
};

const PostCardList = ({ posts = [], getEditHref, getDeleteHref, getDeleteHandler }) => (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
            <PostCard
                key={post.id}
                {...post}
                editHref={getEditHref ? getEditHref(post) : post.editHref}
                deleteHref={getDeleteHref ? getDeleteHref(post) : post.deleteHref}
                onDelete={getDeleteHandler ? getDeleteHandler(post) : post.onDelete}
            />
        ))}
    </section>
);

export { PostCard, PostCardList };
export default PostCard;
