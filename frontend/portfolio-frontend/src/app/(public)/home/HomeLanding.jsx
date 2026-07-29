"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";

const HERO_TEXTS = ["MUHAMMAD HAZUAN", "W4N {n0t_th4t_w4n}", "HAZUAN { WAN }"];
const TYPE_SPEED = 78;
const DELETE_SPEED = 42;
const HOLD_DURATION = 1000;

const TOOLKIT = [
    "Kali Linux",
    "Burp Suite",
    "Nmap",
    "Wireshark",
    "Gobuster",
    "Metasploit",
    "Ghidra",
    "IDA Free",
    "YARA",
    "Hashcat",
    "tcpdump",
    "Snort",
];

// Four real focus areas. Order matches the radar node layout below —
// the dot on the HUD and the card here point at the same thing.
const FOCUS_AREAS = [
    {
        code: "MAL-01",
        title: "Malware Analysis & Detection",
        description:
            "Building a multimodal malware detection pipeline for my FYP: static feature models (LightGBM, XGBoost, Random Forest) fused with CNN-based binary-to-image classification through a late-fusion meta-classifier.",
    },
    {
        code: "IR-02",
        title: "Incident Response & Forensics",
        description:
            "Comfortable in Windows Event Log and Sysmon analysis — tracing C2 attack chains, correlating beacon activity, and turning raw log noise into a clear timeline of what happened.",
    },
    {
        code: "OFF-03",
        title: "Offensive Security & CTF",
        description:
            "Active competitor across web exploitation, reverse engineering, and boot2root challenges — from header-injection SSRF chains to unpacking obfuscated binaries and defeating endpoint defenses.",
    },
    {
        code: "AI-04",
        title: "Applied AI for Security",
        description:
            "Shipped PiCatchU, an AI-powered scam and phishing detector that scores risk with Gemini-driven analysis, built on Flutter, Express, and MongoDB.",
    },
];

// Positions approximate an ellipse on the tilted radar disc.
const RADAR_NODES = [
    { label: "Malware Analysis", top: "10%", left: "50%" },
    { label: "Applied AI", top: "46%", left: "89%" },
    { label: "Offensive Security", top: "84%", left: "50%" },
    { label: "Incident Response", top: "46%", left: "11%" },
];

const STATS = [
    { label: "Degree", value: "Computer Science, UPM" },
    { label: "Track", value: "Cybersecurity + Applied ML" },
    { label: "Status", value: "Final-year" },
];

// Real projects first, then a couple of open slots — fill these in as
// you finish more work. Category drives the filter tabs below.
const PROJECT_CATEGORIES = ["All", "AI & Security", "Research", "Concept"];

const PROJECTS = [
    {
        code: "PROJECT-01",
        title: "Cyber Security Homelab",
        tagline: "Cyber Security Playground",
        description:
            "Designed and deployed a multi-zone virtualized environment. Configured OPNsense as a perimeter firewall with custom VLAN segmentation to isolate Offensive, Defensive, and Malware Analysis traffic.",
        tags: ["Malware Detection", "Machine Learning", "Static Analysis", "MongoDB"],
        status: "On Going",
        category: "AI & Security",
    },
    {
        code: "PROJECT-02",
        title: "Multimodal Malware Detection",
        tagline: "Final Year Project",
        description:
            "Detects EXE, PDF, and APK threats through two parallel pipelines through static feature models and CNN binary-to-image analysis and fused by a logistic regression meta-classifier.",
        tags: ["Malware Detection", "Machine Learning", "Static Analysis", "MongoDB"],
        status: "In progress",
        category: "Research",
    },
    {
        code: "PROJECT-03",
        title: "PiCatchU",
        tagline: "AI-powered scam & phishing detector",
        description:
            "A Gemini-driven suspicion score (0–100) built on rubric-based structured prompting, paired with gamified phishing simulations and a community-sourced scam scenario library.",
        tags: ["AI", "Phishing Detection", "Web Application", "Gemini API"],
        status: "Hackathon",
        category: "AI & Security",
    },
    {
        code: "PROJECT-04",
        title: "FeedLoop",
        tagline: "Sustainability marketplace concept",
        description:
            "Pairs IoT smart scales with an AI-driven matchmaking platform that connects farms' and butchers' organic waste with industrial buyers.",
        tags: ["IoT", "Marketplace", "Sustainability"],
        status: "Competition concept",
        category: "Concept",
    },
    {
        code: "PROJECT-05",
        title: "UPM Convocation Fest Portal",
        tagline: "Pesta Konvokesyen UPM 2025",
        description: "Engineered a secure event management hub. Developed a secure Admin Dashboard with role-based access control (RBAC) to manage announcements and event data.",
        tags: ["Web Application", "Event Management", "RBAC"],
        status: "Production",
        category: "All",
    },
    // {
    //     code: "PROJECT-06",
    //     title: "Add your next build",
    //     tagline: "Open slot",
    //     description: "Keep this ready for whatever you ship next.",
    //     tags: [],
    //     status: "Placeholder",
    //     category: "All",
    //     isPlaceholder: true,
    // },
];

const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    });
};

const recentItems = (items) =>
    [...items]
        .sort((left, right) => {
            const leftDate = new Date(left.updatedAt || left.createdAt || 0).getTime();
            const rightDate = new Date(right.updatedAt || right.createdAt || 0).getTime();
            return rightDate - leftDate;
        })
        .slice(0, 2);

const normalizeRouteId = (item) => item?.id ?? item?.slug ?? "";

// Reveals an element with a short fade + rise the first time it enters
// the viewport. No dependency — a single IntersectionObserver per element,
// disconnected after it fires. Reduced-motion users see content immediately.
const useReveal = () => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
            setVisible(true);
            return;
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return [ref, visible];
};

const revealClass = (visible) =>
    `transition-all duration-700 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`;

// Applies a scroll-linked drift + zoom directly to a DOM node (bypasses
// React state for perf — this runs every rAF tick while scrolling).
// A card is largest/sharpest near the viewport center and eases back
// as it moves toward the edges, which is what reads as "zooming in".
const applyScrollZoom = (node, viewportHeight) => {
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const center = rect.top + rect.height / 2 - viewportHeight / 2;
    const normalized = Math.min(Math.max(center / viewportHeight, -1), 1);
    const translate = normalized * -16;
    const scale = 1 - Math.min(Math.abs(normalized), 1) * 0.07;

    node.style.transform = `translate3d(0, ${translate.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
};

const ContentCard = ({ title, href, accent, items, emptyMessage, kind }) => {
    return (
        <article className="group rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:border-white/20">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className={`font-mono text-[0.62rem] font-semibold uppercase tracking-[0.3em] ${accent}`}>
                        {kind}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        {title}
                    </h2>
                </div>

                <Link
                    href={href}
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-2 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:bg-white/15 hover:text-white"
                >
                    View
                </Link>
            </div>

            <div className="mt-5 space-y-3">
                {items.length > 0 ? (
                    items.map((item) => {
                        const routeId = normalizeRouteId(item);
                        const updatedLabel = formatDate(item.updatedAt || item.createdAt);

                        return (
                            <Link
                                key={routeId || `${kind}-${item.title}`}
                                href={`${href}/${routeId}`}
                                className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20 hover:bg-black/30"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold uppercase tracking-wide text-white/95">
                                            {item.title}
                                        </p>
                                        <p className="mt-1 text-sm text-white/55">
                                            {item.category || item.difficulty || "New entry"}
                                        </p>
                                    </div>
                                    {updatedLabel ? (
                                        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/55">
                                            {updatedLabel}
                                        </span>
                                    ) : null}
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-white/60">
                        {emptyMessage}
                    </div>
                )}
            </div>
        </article>
    );
};

const RadarHUD = ({ stageRef, motionAllowed }) => {
    const spinClass = motionAllowed ? "animate-spin" : "";

    return (
        <div
            ref={stageRef}
            className="relative mx-auto flex w-full max-w-[420px] items-center justify-center py-6 sm:max-w-[480px]"
            style={{ perspective: "1400px" }}
        >
            <div
                aria-hidden
                className="absolute h-[280px] w-[280px] rounded-full bg-cyan-400/10 blur-3xl sm:h-[360px] sm:w-[360px]"
            />
            <div
                aria-hidden
                className="absolute bottom-[8%] h-8 w-[62%] rounded-full bg-black/50 blur-2xl"
            />

            <div
                className="relative h-[260px] w-[260px] sm:h-[340px] sm:w-[340px]"
                style={{
                    transformStyle: "preserve-3d",
                    transform:
                        "rotateX(calc(56deg + var(--pointer-y, 0deg) - var(--scroll-tilt, 0deg) * 0.12)) rotateZ(calc(var(--pointer-x, 0deg) + var(--page-scroll, 0) * 360deg)) scale(calc(1 - var(--scroll-tilt, 0deg) / 10deg * 0.05))",
                    transition: "transform 0.25s ease-out",
                }}
            >
                <div className="absolute inset-0 rounded-full border border-cyan-300/25 bg-white/[0.03] shadow-[0_0_80px_rgba(56,189,248,0.16),inset_0_0_50px_rgba(56,189,248,0.08)]" />
                <div className="absolute inset-[16%] rounded-full border border-white/10" />
                <div className="absolute inset-[34%] rounded-full border border-white/10" />

                <div
                    aria-hidden
                    className="absolute inset-0 rounded-full opacity-70"
                    style={{
                        backgroundImage:
                            "linear-gradient(90deg, transparent 49.4%, rgba(255,255,255,0.08) 49.4%, rgba(255,255,255,0.08) 50.6%, transparent 50.6%), linear-gradient(0deg, transparent 49.4%, rgba(255,255,255,0.08) 49.4%, rgba(255,255,255,0.08) 50.6%, transparent 50.6%)",
                    }}
                />

                <div
                    aria-hidden
                    className={`absolute inset-0 rounded-full ${spinClass}`}
                    style={{
                        animationDuration: "7s",
                        background: "conic-gradient(from 0deg, rgba(56,189,248,0.5), transparent 24%)",
                        maskImage: "radial-gradient(circle, black 60%, transparent 61%)",
                        WebkitMaskImage: "radial-gradient(circle, black 60%, transparent 61%)",
                    }}
                />

                <div
                    aria-hidden
                    className={`absolute inset-[9%] rounded-full border border-dashed border-amber-200/25 ${spinClass}`}
                    style={{ animationDuration: "22s", animationDirection: "reverse" }}
                />

                <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/85 shadow-[0_0_30px_rgba(56,189,248,0.4)] sm:h-16 sm:w-16">
                    <span className="font-mono text-[0.82rem] font-bold tracking-[0.14em] text-cyan-200">W4N</span>
                </div>
            </div>

            <div aria-hidden className="pointer-events-none absolute inset-0">
                {RADAR_NODES.map((node) => (
                    <div
                        key={node.label}
                        className="absolute flex flex-col items-center"
                        style={{ top: node.top, left: node.left, transform: "translate(-50%, -50%)" }}
                    >
                        <span className="relative flex h-2.5 w-2.5">
                            {/* {motionAllowed ? (
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-60" />
                            ) : null} */}
                            {/* <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.85)]" /> */}
                        </span>
                        <span className="mt-2 whitespace-nowrap rounded-full border border-white/10 bg-black/50 animate-pulse shadow-[0_0_12px_rgba(56,189,248,0.85)] px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-white/70 backdrop-blur-sm">
                            {node.label}
                        </span>
                    </div>
                ))}
            </div>

            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 font-mono text-[0.58rem] uppercase text-center tracking-[0.25rem] text-cyan-200/80 backdrop-blur-md">
                Always learning, always exploring
            </div>
        </div>
    );
};

const ProjectCard = ({ project, cardRef, onTiltMove, onTiltLeave }) => {
    if (project.isPlaceholder) {
        return (
            <div ref={cardRef} className="will-change-transform">
                <div className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-[24px] border border-dashed border-white/15 bg-white/[0.02] p-5 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-lg text-white/50">
                        +
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-white/70">{project.title}</h3>
                    <p className="mt-2 max-w-[16rem] text-sm leading-6 text-white/45">{project.description}</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={cardRef} className="will-change-transform">
            <article
                onMouseMove={onTiltMove}
                onMouseLeave={onTiltLeave}
                className="h-full rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-white/20"
                style={{ transition: "transform 0.25s ease-out, border-color 0.3s, box-shadow 0.3s" }}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2.5 py-1 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-cyan-200/90">
                        {project.code}
                    </div>
                    <div className="shrink-0 rounded-full border border-white/10 bg-black/20 px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-white/55">
                        {project.status}
                    </div>
                </div>

                <h3 className="mt-3 text-lg font-semibold text-white sm:text-xl">{project.title}</h3>
                <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-amber-200/70">
                    {project.tagline}
                </p>
                <p className="mt-2.5 text-sm leading-6 text-white/65">{project.description}</p>

                {project.tags.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-white/60"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                ) : null}
            </article>
        </div>
    );
};

export default function HomeLanding({ blogs = [], guides = [], writeups = [] }) {
    const rootRef = useRef(null);
    const heroRef = useRef(null);
    const radarStageRef = useRef(null);
    const focusCardRefs = useRef([]);
    const projectCardRefs = useRef([]);
    const [heroText, setHeroText] = useState("");
    const [motionAllowed, setMotionAllowed] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [emailCopied, setEmailCopied] = useState(false);

    const [focusRef, focusVisible] = useReveal();
    const [projectsRef, projectsVisible] = useReveal();
    const [toolkitRef, toolkitVisible] = useReveal();
    const [contentRef, contentVisible] = useReveal();
    const [connectRef, connectVisible] = useReveal();

    const latestBlogs = useMemo(() => recentItems(blogs), [blogs]);
    const latestGuides = useMemo(() => recentItems(guides), [guides]);
    const latestWriteups = useMemo(() => recentItems(writeups), [writeups]);

    const visibleProjects = useMemo(
        () =>
            PROJECTS.filter(
                (project) =>
                    project.isPlaceholder || activeCategory === "All" || project.category === activeCategory
            ),
        [activeCategory]
    );

    // Detect the user's reduced-motion preference once on mount.
    useEffect(() => {
        if (typeof window === "undefined") return;
        setMotionAllowed(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }, []);

    // Scroll-driven parallax. One rAF-throttled listener drives:
    // - CSS custom properties consumed by the background layers + radar
    // - direct transform writes on registered focus/project cards (zoom)
    useEffect(() => {
        if (typeof window === "undefined" || !motionAllowed) return;

        const mobileQuery = window.matchMedia("(max-width: 767px)");
        let frameId = 0;

        const updateMotion = () => {
            const viewportHeight = window.innerHeight || 1;
            const progress = Math.min(Math.max(window.scrollY / (viewportHeight * 1.15), 0), 1);
            const maxScroll = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
            const pageProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
            const scale = mobileQuery.matches ? 0.5 : 1;
            const root = rootRef.current;
            const hero = heroRef.current;

            if (!root || !hero) return;

            root.style.setProperty("--scroll-drift", `${progress * 24 * scale}px`);
            root.style.setProperty("--scroll-depth", `${progress * 34 * scale}px`);
            root.style.setProperty("--scroll-tilt", `${progress * 10 * scale}deg`);
            root.style.setProperty("--page-scroll", pageProgress.toFixed(4));
            hero.style.setProperty("--hero-parallax", `${progress * 46 * scale}px`);

            focusCardRefs.current.forEach((node) => applyScrollZoom(node, viewportHeight));
            projectCardRefs.current.forEach((node) => applyScrollZoom(node, viewportHeight));
        };

        const onScroll = () => {
            window.cancelAnimationFrame(frameId);
            frameId = window.requestAnimationFrame(updateMotion);
        };

        updateMotion();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [motionAllowed]);

    // Subtle pointer-follow tilt on the radar, desktop + fine pointer only.
    useEffect(() => {
        if (typeof window === "undefined" || !motionAllowed) return;

        const stage = radarStageRef.current;
        if (!stage) return;

        if (!window.matchMedia("(pointer: fine)").matches) return;

        let frameId = 0;

        const onMove = (event) => {
            const rect = stage.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const py = (event.clientY - rect.top) / rect.height - 0.5;

            window.cancelAnimationFrame(frameId);
            frameId = window.requestAnimationFrame(() => {
                stage.style.setProperty("--pointer-x", `${(px * 8).toFixed(2)}deg`);
                stage.style.setProperty("--pointer-y", `${(py * -8).toFixed(2)}deg`);
            });
        };

        const onLeave = () => {
            stage.style.setProperty("--pointer-x", "0deg");
            stage.style.setProperty("--pointer-y", "0deg");
        };

        stage.addEventListener("pointermove", onMove);
        stage.addEventListener("pointerleave", onLeave);

        return () => {
            window.cancelAnimationFrame(frameId);
            stage.removeEventListener("pointermove", onMove);
            stage.removeEventListener("pointerleave", onLeave);
        };
    }, [motionAllowed]);

    // Typewriter effect cycling through name / handle.
    useEffect(() => {
        if (typeof window === "undefined") return;

        if (!motionAllowed) {
            setHeroText(HERO_TEXTS[0]);
            return;
        }

        let timeoutId;
        let active = true;
        let textIndex = 0;
        let charIndex = 0;
        let deleting = false;

        const tick = () => {
            if (!active) return;

            const targetText = HERO_TEXTS[textIndex];

            if (!deleting) {
                charIndex += 1;
                setHeroText(targetText.slice(0, charIndex));

                if (charIndex >= targetText.length) {
                    timeoutId = window.setTimeout(() => {
                        deleting = true;
                        timeoutId = window.setTimeout(tick, DELETE_SPEED);
                    }, HOLD_DURATION);
                    return;
                }

                timeoutId = window.setTimeout(tick, TYPE_SPEED);
                return;
            }

            charIndex -= 1;
            setHeroText(targetText.slice(0, Math.max(charIndex, 0)));

            if (charIndex <= 0) {
                deleting = false;
                textIndex = (textIndex + 1) % HERO_TEXTS.length;
                charIndex = 0;
                timeoutId = window.setTimeout(tick, TYPE_SPEED);
                return;
            }

            timeoutId = window.setTimeout(tick, DELETE_SPEED);
        };

        tick();

        return () => {
            active = false;
            window.clearTimeout(timeoutId);
        };
    }, [motionAllowed]);

    const handleCardTiltMove = (event) => {
        if (!motionAllowed) return;

        const card = event.currentTarget;
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `perspective(800px) rotateX(${(py * -6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-4px)`;
    };

    const handleCardTiltLeave = (event) => {
        event.currentTarget.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    };

    const handleCopyEmail = async () => {
        const email = "hazuansadik3@gmail.com";

        try {
            await navigator.clipboard.writeText(email);
            setEmailCopied(true);
            window.setTimeout(() => setEmailCopied(false), 2000);
        } catch {
            // Clipboard API unavailable — the email is still visible to copy manually.
        }
    };

    return (
        <>
            {/* Fixed page-scroll indicator */}
            <div
                aria-hidden
                className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-cyan-300 via-cyan-200 to-amber-300"
                style={{ transform: "scaleX(var(--page-scroll, 0))" }}
            />

            <section
                ref={rootRef}
                className="relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-[#060b18] text-white shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:rounded-[32px]"
            >
                <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 20% 10%, rgba(59, 130, 246, 0.24), transparent 28%), radial-gradient(circle at 80% 18%, rgba(250, 204, 21, 0.14), transparent 20%), radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.1), transparent 45%), linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 28%)",
                    }}
                />
                <div
                    aria-hidden
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)",
                        backgroundSize: "72px 72px",
                        transform: "translate3d(0, calc(var(--scroll-drift, 0px) * -0.35), 0)",
                    }}
                />
                {/* Extra background parallax depth layers — different drift speeds
                    so the backdrop shifts at a different rate than the foreground. */}
                <div
                    aria-hidden
                    className="absolute left-[6%] top-[18%] h-64 w-64 rounded-full bg-cyan-500/[0.08] blur-[90px]"
                    style={{ transform: "translate3d(0, calc(var(--scroll-drift, 0px) * 0.6), 0)" }}
                />
                <div
                    aria-hidden
                    className="absolute bottom-[10%] right-[8%] h-72 w-72 rounded-full bg-amber-400/[0.07] blur-[100px]"
                    style={{
                        transform:
                            "translate3d(0, calc(var(--scroll-drift, 0px) * -0.8), 0) scale(calc(1 + var(--page-scroll, 0) * 0.5))",
                    }}
                />

                <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                    <section className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
                        <div className="relative order-2  z-10 space-y-5 sm:space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-white/70 sm:px-4 sm:text-[0.65rem] sm:tracking-[0.3em]">
                                Computer Science · Cybersecurity
                            </div>

                            <div className="space-y-4 sm:space-y-5">
                                <h1
                                    ref={heroRef}
                                    className="max-w-3xl text-[clamp(2rem,8.3vw,6.3rem)] font-black leading-[0.9] tracking-[-0.08em] sm:text-[clamp(2.7rem,5.4vw,3rem)]"
                                    style={{ transform: "translate3d(0, calc(var(--hero-parallax, 0px) * -0.1), 0)" }}
                                    aria-live="polite"
                                    aria-atomic="true"
                                >
                                    <span className="block min-h-[1.1em] whitespace-nowrap bg-gradient-to-r from-white via-slate-100 to-amber-300 bg-clip-text text-transparent">
                                        {heroText || "\u00A0"}
                                        <span className="ml-[0.08em] inline-block animate-pulse text-[0.85em] text-white/85">|</span>
                                    </span>
                                </h1>

                                <p className="max-w-2xl text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
                                    Computer Science undergraduate at UPM, focused on cybersecurity from
                                    malware analysis and incident response to red teaming and building
                                    ML-driven detection systems.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2.5 sm:gap-3">
                                <Link
                                    href="#projects"
                                    className="rounded-full bg-white px-4 py-2.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-amber-200 sm:px-5 sm:py-3 sm:text-xs sm:tracking-[0.2em]"
                                >
                                    See projects
                                </Link>
                                <Link
                                    href="/blogs"
                                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/88 transition hover:bg-white/10 sm:px-5 sm:py-3 sm:text-xs sm:tracking-[0.2em]"
                                >
                                    Blogs
                                </Link>
                                <Link
                                    href="/guides"
                                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/88 transition hover:bg-white/10 sm:px-5 sm:py-3 sm:text-xs sm:tracking-[0.2em]"
                                >
                                    Guides
                                </Link>
                            </div>

                            <div className="grid gap-2 sm:gap-3 sm:grid-cols-3">
                                {STATS.map((item) => (
                                    <div
                                        key={item.label}
                                        className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3.5 shadow-[0_18px_45px_rgba(0,0,0,0.18)] backdrop-blur-md sm:rounded-[24px] sm:px-5 sm:py-4"
                                    >
                                        <div className="font-mono text-[0.56rem] font-semibold uppercase tracking-[0.26em] text-white/45 sm:text-[0.6rem] sm:tracking-[0.3em]">
                                            {item.label}
                                        </div>
                                        <div className="mt-1.5 text-sm font-semibold text-white/90 sm:mt-2">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="order-1 xl:order-none">
                            <RadarHUD stageRef={radarStageRef} motionAllowed={motionAllowed} />
                        </div>
                    </section>

                    <section
                        ref={focusRef}
                        className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-4 ${revealClass(focusVisible)}`}
                    >
                        <div className="sm:col-span-2 lg:col-span-4">
                            <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-white/45 sm:text-[0.64rem] sm:tracking-[0.34em]">
                                Focus areas
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                Where I put the work in.
                            </h2>
                        </div>

                        {FOCUS_AREAS.map((item, index) => (
                            <div
                                key={item.title}
                                ref={(node) => (focusCardRefs.current[index] = node)}
                                className="will-change-transform"
                            >
                                <div className="h-full rounded-[24px] border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-md transition-colors duration-300 hover:border-white/20 sm:p-5">
                                    <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2.5 py-1 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-cyan-200/90">
                                        {item.code}
                                    </div>
                                    <h3 className="mt-3 text-lg font-semibold text-white sm:text-xl">{item.title}</h3>
                                    <p className="mt-2.5 text-sm leading-6 text-white/65">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </section>

                    <section
                        id="projects"
                        ref={projectsRef}
                        className={revealClass(projectsVisible)}
                    >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-white/45 sm:text-[0.64rem] sm:tracking-[0.34em]">
                                    Previous work
                                </p>
                                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                    Projects I've shipped or shaped.
                                </h2>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {PROJECT_CATEGORIES.map((category) => (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() => setActiveCategory(category)}
                                        className={`rounded-full border px-3.5 py-1.5 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] transition ${activeCategory === category
                                                ? "border-cyan-300/40 bg-cyan-400/15 text-cyan-100"
                                                : "border-white/10 bg-white/5 text-white/55 hover:border-white/20 hover:text-white/80"
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {visibleProjects.map((project, index) => (
                                <ProjectCard
                                    key={project.code}
                                    project={project}
                                    cardRef={(node) => (projectCardRefs.current[index] = node)}
                                    onTiltMove={handleCardTiltMove}
                                    onTiltLeave={handleCardTiltLeave}
                                />
                            ))}
                        </div>
                    </section>

                    
                    <section
                        id="featured-posts"
                        ref={contentRef}
                        className={`grid gap-6 xl:grid-cols-3 ${revealClass(contentVisible)}`}
                    >
                        
                        <ContentCard
                            kind="Blogs"
                            title="Security thinking, written clearly"
                            href="/blogs"
                            accent="text-cyan-200"
                            items={latestBlogs}
                            emptyMessage="Blog posts will surface here once they are published."
                        />

                        <ContentCard
                            kind="Guides"
                            title="Practical walkthroughs and references"
                            href="/guides"
                            accent="text-emerald-200"
                            items={latestGuides}
                            emptyMessage="Guides will show here as soon as the library grows."
                        />

                        <ContentCard
                            kind="CTF writeups"
                            title="Tactical notes from challenges"
                            href="/writeups"
                            accent="text-amber-200"
                            items={latestWriteups}
                            emptyMessage="CTF writeups will appear here after the first capture."
                        />
                    </section>

                    <section
                        ref={toolkitRef}
                        className={`rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.26)] backdrop-blur-md sm:p-6 ${revealClass(toolkitVisible)}`}
                    >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-white/45 sm:text-[0.64rem] sm:tracking-[0.34em]">
                                    Core toolkit
                                </p>
                                <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-3xl">
                                    The tools I reach for most.
                                </h2>
                                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/65 sm:text-base">
                                    A compact stack for web testing, network visibility, reversing, endpoint
                                    work, and host-level investigation.
                                </p>
                            </div>

                            <div className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-white/45 sm:text-xs">
                                High-signal tools, not a noisy wall of logos.
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-3">
                            {TOOLKIT.map((tool) => (
                                <span
                                    key={tool}
                                    className="rounded-full border border-white/10 bg-black/20 px-3 py-2 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/82 transition duration-300 hover:border-white/20 hover:bg-black/28 sm:px-3.5 sm:text-[0.68rem] sm:tracking-[0.16em]"
                                >
                                    {tool}
                                </span>
                            ))}
                        </div>
                    </section>

                    <section
                        ref={connectRef}
                        className={`rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-md sm:p-8 ${revealClass(connectVisible)}`}
                    >
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-white/45 sm:text-[0.64rem] sm:tracking-[0.34em]">
                                    Get in touch
                                </p>
                                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                    Feel free to contact me.
                                </h2>
                            </div>

                            <div className="flex flex-col gap-2.5 sm:min-w-[220px]">
                                <button
                                    type="button"
                                    onClick={handleCopyEmail}
                                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10 hover:cursor-pointer"
                                >
                                    {emailCopied ? "Copied!" : "Copy email"}
                                </button>
                                <a
                                    href="https://github.com/haz1sadik"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-center font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10"
                                >
                                    GitHub
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/muhammadhazuan"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-center font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10"
                                >
                                    LinkedIn
                                </a>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </>
    );
}