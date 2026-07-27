"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";

const HERO_TEXTS = ["MUHAMMAD HAZUAN", "W4N{n0t_th4t_w4n}"];
const TYPE_SPEED = 78;
const DELETE_SPEED = 42;
const HOLD_DURATION = 1000;

const TOOLKIT = [
    "Kali Linux",
    "Burp Suite",
    "Nmap",
    "Wireshark",
    "Gobuster",
    "ffuf",
    "Metasploit",
    "Ghidra",
    "IDA Free",
    "Radare2",
    "Volatility",
    "YARA",
    "Hashcat",
    "tcpdump",
    "Sigma",
    "Snort",
];

const focusAreas = [
    {
        title: "Malware analysis",
        description:
            "Reads suspicious binaries, traces behavior, and extracts indicators with reverse engineering discipline.",
    },
    {
        title: "Incident response",
        description:
            "Investigates alerts, correlates evidence, and moves from signal to containment with speed.",
    },
    {
        title: "Threat intelligence",
        description:
            "Connects indicators, infrastructure, and campaigns into useful operational context.",
    },
    {
        title: "Red teaming and pentesting",
        description:
            "Follows a structured attack path, validates exposure, and communicates exploit impact clearly.",
    },
];

const skillThemes = [
    {
        title: "Defensive analysis",
        body: "Placeholder: SIEM workflows, log triage, detection logic, EDR, alert enrichment.",
    },
    {
        title: "Offensive validation",
        body: "Placeholder: web testing, credential attacks, enumeration, payload handling, post-exploitation.",
    },
    {
        title: "Research and writing",
        body: "Placeholder: case studies, breakdowns, threat reports, playbooks, post-incident lessons.",
    },
    {
        title: "Environment hardening",
        body: "Placeholder: Linux/Windows baselines, network segmentation, secure configs, monitoring.",
    },
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

const ContentCard = ({ title, href, accent, items, emptyMessage, kind }) => {
    return (
        <article className="group rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:border-white/20">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className={`text-[0.65rem] font-semibold uppercase tracking-[0.35em] ${accent}`}>
                        {kind}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        {title}
                    </h2>
                </div>

                <Link
                    href={href}
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/80 transition hover:bg-white/15 hover:text-white"
                >
                    View all
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
                                        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white/55">
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

export default function HomeLanding({ blogs = [], guides = [], writeups = [] }) {
    const rootRef = useRef(null);
    const heroRef = useRef(null);
    const [heroText, setHeroText] = useState("");

    const latestBlogs = useMemo(() => recentItems(blogs), [blogs]);
    const latestGuides = useMemo(() => recentItems(guides), [guides]);
    const latestWriteups = useMemo(() => recentItems(writeups), [writeups]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (reducedMotionQuery.matches) return;

        const mobileQuery = window.matchMedia("(max-width: 767px)");
        let frameId = 0;

        const updateMotion = () => {
            const viewportHeight = window.innerHeight || 1;
            const progress = Math.min(Math.max(window.scrollY / (viewportHeight * 1.15), 0), 1);
            const scale = mobileQuery.matches ? 0.5 : 1;
            const root = rootRef.current;
            const hero = heroRef.current;

            if (!root || !hero) return;

            root.style.setProperty("--scroll-progress", progress.toFixed(4));
            root.style.setProperty("--scroll-drift", `${progress * 24 * scale}px`);
            root.style.setProperty("--scroll-depth", `${progress * 38 * scale}px`);
            root.style.setProperty("--scroll-tilt", `${progress * 10 * scale}deg`);
            hero.style.setProperty("--hero-parallax", `${progress * 58 * scale}px`);
            hero.style.setProperty("--orb-parallax", `${progress * 34 * scale}px`);
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
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (reducedMotionQuery.matches) {
            const frameId = window.requestAnimationFrame(() => {
                setHeroText(HERO_TEXTS[0]);
            });

            return () => window.cancelAnimationFrame(frameId);
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
    }, []);

    return (
        <section
            ref={rootRef}
            className="relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-[#060b18] text-white shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:rounded-[32px]"
        >
            <div
                aria-hidden
                className="absolute inset-0"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 20% 10%, rgba(59, 130, 246, 0.28), transparent 28%), radial-gradient(circle at 80% 18%, rgba(250, 204, 21, 0.16), transparent 20%), radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.12), transparent 45%), linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 28%)",
                }}
            />
            <div
                aria-hidden
                className="absolute inset-0 opacity-[0.14]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)",
                    backgroundSize: "72px 72px",
                    transform: "translate3d(0, calc(var(--scroll-drift, 0px) * -0.35), 0)",
                }}
            />

            <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                <section className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
                    <div className="relative z-10 space-y-5 sm:space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-white/70 sm:px-4 sm:text-[0.65rem] sm:tracking-[0.35em]">
                            UPM Computer Science · Cybersecurity focus
                        </div>

                        <div className="space-y-4 sm:space-y-5">
                            <h1
                                ref={heroRef}
                                className="max-w-3xl text-[clamp(1.55rem,6vw,4rem)] font-black leading-[0.9] tracking-[-0.08em] sm:text-[clamp(2.7rem,5.4vw,4rem)]"
                                style={{ transform: "translate3d(0, calc(var(--hero-parallax, 0px) * -0.12), 0)" }}
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                <span className="block min-h-[1.1em] whitespace-nowrap bg-gradient-to-r from-white via-slate-100 to-amber-300 bg-clip-text text-transparent">
                                    {heroText || "\u00A0"}
                                    <span className="ml-[0.08em] inline-block animate-pulse text-[0.85em] text-white/85">|</span>
                                </span>
                            </h1>

                            <p className="max-w-2xl text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
                                Computer Science undergraduate from UPM focused on cybersecurity across
                                malware analysis, threat intelligence, incident response, red teaming,
                                pentesting, and defensive operations.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2.5 sm:gap-3">
                            <Link
                                href="#featured-posts"
                                className="rounded-full bg-white px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-950 transition hover:bg-amber-200 sm:px-5 sm:py-3 sm:text-sm sm:tracking-[0.22em]"
                            >
                                Explore work
                            </Link>
                            <Link
                                href="/blogs"
                                className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-white/88 transition hover:bg-white/10 sm:px-5 sm:py-3 sm:text-sm sm:tracking-[0.22em]"
                            >
                                Blogs
                            </Link>
                            <Link
                                href="/guides"
                                className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-white/88 transition hover:bg-white/10 sm:px-5 sm:py-3 sm:text-sm sm:tracking-[0.22em]"
                            >
                                Guides
                            </Link>
                        </div>

                        <div className="grid gap-2 sm:gap-3 sm:grid-cols-3">
                            {[
                                { label: "Degree", value: "Computer Science" },
                                { label: "Focus", value: "Cybersecurity" },
                                { label: "Mode", value: "Analyze · Detect · Defend" },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3.5 shadow-[0_18px_45px_rgba(0,0,0,0.18)] backdrop-blur-md sm:rounded-[24px] sm:px-5 sm:py-4"
                                >
                                    <div className="text-[0.58rem] font-semibold uppercase tracking-[0.3em] text-white/45 sm:text-[0.62rem] sm:tracking-[0.35em]">
                                        {item.label}
                                    </div>
                                    <div className="mt-1.5 text-sm font-semibold text-white/90 sm:mt-2">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-[760px]" style={{ perspective: "1500px" }}>
                        <div
                            aria-hidden
                            className="absolute left-[6%] top-[12%] hidden h-32 w-40 rounded-[30px] border border-cyan-300/15 bg-white/8 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-md md:block sm:h-36 sm:w-48"
                            style={{
                                transform: "translate3d(0, calc(var(--orb-parallax, 0px) * -0.75), 0) rotateY(-24deg) rotateZ(-10deg)",
                            }}
                        >
                            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.35em] text-cyan-200/70">
                                Threat Intel
                            </div>
                            <div className="mt-3 text-lg font-semibold text-white">Indicators, attribution, and fast triage.</div>
                        </div>

                        <div
                            aria-hidden
                            className="absolute right-[8%] top-[8%] hidden h-32 w-40 rounded-[30px] border border-amber-200/15 bg-white/8 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-md md:block sm:h-36 sm:w-48"
                            style={{
                                transform: "translate3d(0, calc(var(--orb-parallax, 0px) * 0.65), 0) rotateY(24deg) rotateZ(12deg)",
                            }}
                        >
                            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.35em] text-amber-200/70">
                                Reverse engineering
                            </div>
                            <div className="mt-3 text-lg font-semibold text-white">Ghidra, IDA, Radare2, and binary behavior.</div>
                        </div>

                        <div
                            aria-hidden
                            className="absolute left-[12%] bottom-[12%] hidden h-32 w-44 rounded-[30px] border border-white/10 bg-white/8 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-md md:block sm:h-36 sm:w-52"
                            style={{
                                transform: "translate3d(0, var(--orb-parallax, 0px), 0) rotateY(-18deg) rotateZ(8deg)",
                            }}
                        >
                            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.35em] text-emerald-200/70">
                                Incident response
                            </div>
                            <div className="mt-3 text-lg font-semibold text-white">Log review, containment, and recovery steps.</div>
                        </div>

                        <div
                            aria-hidden
                            className="absolute right-[12%] bottom-[12%] hidden h-32 w-44 rounded-[30px] border border-white/10 bg-white/8 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-md md:block sm:h-36 sm:w-52"
                            style={{
                                transform: "translate3d(0, calc(var(--orb-parallax, 0px) * -0.55), 0) rotateY(18deg) rotateZ(-8deg)",
                            }}
                        >
                            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.35em] text-fuchsia-200/70">
                                Red team
                            </div>
                            <div className="mt-3 text-lg font-semibold text-white">Burp, Nmap, ffuf, Gobuster, and disciplined testing.</div>
                        </div>

                        <div
                            className="relative mx-auto flex min-h-[380px] items-center justify-center rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.38),rgba(7,10,18,0.96)_58%)] p-4 shadow-[0_34px_120px_rgba(0,0,0,0.45)] sm:min-h-[540px] sm:rounded-[40px] sm:p-6"
                            style={{
                                transform: "translate3d(0, calc(var(--scroll-drift, 0px) * 0.35), 0) rotateX(calc(10deg - var(--scroll-tilt, 0deg) * 0.15)) rotateY(calc(var(--scroll-tilt, 0deg) * 0.18))",
                                transformStyle: "preserve-3d",
                            }}
                        >
                            <div
                                aria-hidden
                                className="absolute inset-x-[10%] top-[10%] h-20 rounded-[34px] border border-cyan-300/15 bg-slate-950/88 shadow-[inset_0_0_60px_rgba(59,130,246,0.22)] sm:inset-x-[16%] sm:h-28 sm:rounded-[44px]"
                            />
                            <div
                                aria-hidden
                                className="absolute inset-x-[20%] top-[6%] h-12 rounded-full bg-cyan-300/25 blur-2xl sm:inset-x-[24%] sm:h-16"
                                style={{ transform: "translate3d(0, calc(var(--scroll-depth, 0px) * -0.18), 0)" }}
                            />
                            <div
                                aria-hidden
                                className="absolute h-[220px] w-[220px] rounded-full border border-white/8 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.2),rgba(8,12,24,0.02)_60%)] shadow-[0_0_80px_rgba(59,130,246,0.24)] sm:h-[280px] sm:w-[280px]"
                                style={{ transform: "translate3d(0, calc(var(--scroll-depth, 0px) * 0.18), 60px)" }}
                            />
                            <div
                                aria-hidden
                                className="absolute inset-x-[16%] bottom-[18%] h-16 rounded-[999px] bg-gradient-to-r from-transparent via-amber-300/80 to-transparent blur-[12px] sm:h-24"
                                style={{ transform: "translate3d(0, calc(var(--scroll-depth, 0px) * 0.28), 0)" }}
                            />

                            <div className="relative z-10 flex max-w-[22rem] flex-col items-center text-center sm:max-w-[26rem]">
                                <div className="rounded-full border border-white/10 bg-white/8 px-3 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-white/60 backdrop-blur-md sm:px-4 sm:text-[0.62rem] sm:tracking-[0.38em]">
                                    Cybersecurity profile
                                </div>
                                <h2 className="mt-4 text-3xl font-black uppercase leading-[0.92] tracking-[-0.06em] sm:mt-6 sm:text-5xl">
                                    <span className="block text-white/90">Build. Break.</span>
                                    <span className="block bg-gradient-to-r from-white via-slate-200 to-amber-300 bg-clip-text text-transparent">
                                        Defend.
                                    </span>
                                </h2>
                                <p className="mt-3 max-w-[20rem] text-sm leading-6 text-white/70 sm:mt-4 sm:text-base">
                                    A cybersecurity profile centered on skills, practical problem solving,
                                    and the kind of depth recruiters expect from a fresh graduate.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-2 sm:hidden sm:gap-3">
                            <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                                Web testing · malware triage · incident response
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                                    Threat intel
                                </div>
                                <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                                    Red team
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {focusAreas.map((item, index) => (
                        <div
                            key={item.title}
                            className="rounded-[24px] border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-md sm:p-5"
                            style={{
                                transform: "translate3d(0, calc(var(--scroll-depth, 0px) * 0.16), 0)",
                            }}
                        >
                            <div className="text-[0.58rem] font-semibold uppercase tracking-[0.3em] text-white/45 sm:text-[0.62rem] sm:tracking-[0.35em]">
                                Focus area 0{index + 1}
                            </div>
                            <h3 className="mt-2.5 text-lg font-semibold text-white sm:mt-3 sm:text-xl">{item.title}</h3>
                            <p className="mt-2.5 text-sm leading-6 text-white/65 sm:mt-3">{item.description}</p>
                        </div>
                    ))}
                </section>

                <section className="rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.26)] backdrop-blur-md sm:p-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.3em] text-white/45 sm:text-[0.62rem] sm:tracking-[0.35em]">
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

                        <div className="text-xs text-white/50 sm:text-sm">High-signal tools, not a noisy wall of logos.</div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-3">
                        {TOOLKIT.map((tool, index) => (
                            <span
                                key={tool}
                                className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/82 transition duration-300 hover:border-white/20 hover:bg-black/28 sm:px-3.5 sm:text-xs sm:tracking-[0.2em]"
                                style={{
                                    transform: `translate3d(0, calc(var(--scroll-depth, 0px) * ${index % 4 === 0 ? 0.1 : 0.04}), 0)`,
                                }}
                            >
                                {tool}
                            </span>
                        ))}
                    </div>
                </section>

                <section className="grid gap-6 rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.26)] backdrop-blur-md sm:p-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.35em] text-white/45">
                            Cybersecurity scope
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            Broad coverage across the discipline.
                        </h2>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/65 sm:text-base">
                            Focused on the practical areas that matter in real environments, from
                            attack validation to defense, investigation, and communication.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {[
                            "Web application testing",
                            "Endpoint and malware triage",
                            "Threat intel and research",
                            "Incident response and forensics",
                            "Cloud and network defense",
                            "Exploit validation and reporting",
                        ].map((item) => (
                            <div
                                key={item}
                                className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm font-medium text-white/80"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-2">
                    {skillThemes.map((item, index) => (
                        <div
                            key={item.title}
                            className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-md"
                            style={{
                                transform: index % 2 === 0 ? "translate3d(0, 0, 0)" : "translate3d(0, 12px, 0)",
                            }}
                        >
                            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.35em] text-white/45">
                                Skills placeholder 0{index + 1}
                            </p>
                            <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                            <p className="mt-3 text-sm leading-6 text-white/65">{item.body}</p>
                        </div>
                    ))}
                </section>

                <section id="featured-posts" className="grid gap-6 xl:grid-cols-3">
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

                <section className="grid gap-5 rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-md sm:p-6 lg:grid-cols-[1fr_0.9fr]">
                    <div>
                        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.3em] text-white/45 sm:text-[0.62rem] sm:tracking-[0.35em]">
                            What I can do
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                            Practical cybersecurity skills, not just labels.
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65 sm:mt-4 sm:text-base">
                            This section can stay as-is or be edited later with your strongest skills,
                            certifications, and experiences.
                        </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
                        {[
                            "Placeholder: Linux, Windows, and network command line fluency",
                            "Placeholder: SIEM, detection engineering, and log analysis",
                            "Placeholder: web app testing and OWASP-style validation",
                            "Placeholder: reversing, triage, and structured reporting",
                        ].map((item) => (
                            <div
                                key={item}
                                className="rounded-[20px] border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium text-white/80"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </section>
    );
}