import { notFound } from "next/navigation";

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

const shouldShowUpdated = (createdAt, updatedAt) => {
    if (!createdAt || !updatedAt) return false;
    return new Date(updatedAt).getTime() !== new Date(createdAt).getTime();
};

const difficultyStyles = (difficulty) => {
    const normalized = difficulty?.toLowerCase();
    if (normalized === "beginner") {
        return "bg-[var(--layout-pill-beginner-bg)] text-[var(--layout-pill-beginner-text)]";
    }
    if (normalized === "intermediate") {
        return "bg-[var(--layout-pill-intermediate-bg)] text-[var(--layout-pill-intermediate-text)]";
    }
    if (normalized === "advanced") {
        return "bg-[var(--layout-pill-advanced-bg)] text-[var(--layout-pill-advanced-text)]";
    }
    return "bg-[var(--layout-post-border)] text-[var(--layout-post-muted)]";
};

const buildContent = (html) => {
    if (typeof html !== "string" || html.trim().length === 0) {
        return "<p>No content available.</p>";
    }
    return html;
};

export async function generateStaticParams() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const response = await fetch(`${baseUrl}/guides`);
    if (!response.ok) return [];
    const guides = await response.json();

    if (!Array.isArray(guides)) return [];
    return guides.map((guide) => ({ id: guide.id }));
}

const GuidePostPage = async ({ params }) => {
    const { id } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const response = await fetch(`${baseUrl}/guides/${id}`);

    if (!response.ok) {
        notFound();
    }

    const guide = await response.json();
    const showUpdated = shouldShowUpdated(guide.createdAt, guide.updatedAt);

    return (
        <section className="w-full">
            <div className="border border-white/20 bg-[var(--layout-nav-bg)]/35 px-5 pb-10 pt-8 text-white shadow-[0_8px_30px_rgba(255,255,255,0.25)] backdrop-blur-sm sm:rounded-3xl sm:px-8 sm:pb-14 sm:pt-10">
                <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                            Guide
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                            {guide.title}
                        </h1>
                        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
                            {guide.category ? (
                                <span className="rounded-full bg-[var(--layout-pill-category-bg)] px-3 py-1 text-[var(--layout-pill-category-text)]">
                                    {guide.category}
                                </span>
                            ) : null}
                            {guide.difficulty ? (
                                <span
                                    className={`rounded-full px-3 py-1 ${difficultyStyles(
                                        guide.difficulty
                                    )}`}
                                >
                                    {guide.difficulty}
                                </span>
                            ) : null}
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs font-medium text-white/70">
                            <span>Created {formatDate(guide.createdAt)}</span>
                            {showUpdated ? (
                                <span>Updated {formatDate(guide.updatedAt)}</span>
                            ) : null}
                        </div>
                    </div>

                    <article className="rounded-3xl border border-[var(--layout-post-border)] bg-[var(--layout-post-surface)] px-5 py-6 text-[var(--layout-post-text)] shadow-[0_18px_45px_rgba(15,23,42,0.15)] sm:px-8 sm:py-8">
                        <div
                            className="text-sm leading-relaxed text-[var(--layout-post-text)] sm:text-base [&_a]:text-[var(--layout-pill-category-text)] [&_a]:underline [&_a]:decoration-transparent [&_a]:underline-offset-4 hover:[&_a]:decoration-[var(--layout-pill-category-text)] [&_img]:mt-6 [&_img]:w-full [&_img]:rounded-2xl [&_img]:shadow-[0_18px_40px_rgba(15,23,42,0.18)] [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6"
                            dangerouslySetInnerHTML={{ __html: buildContent(guide.content) }}
                        />
                    </article>
                </div>
            </div>
        </section>
    );
};

export default GuidePostPage;
