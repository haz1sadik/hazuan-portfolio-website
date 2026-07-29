"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const NAV_LINKS = [
    { label: "Home", href: "/home" },
    { label: "Blogs", href: "/blogs" },
    { label: "Guides", href: "/guides" },
    { label: "Writeups", href: "/writeups" },
]

export default function HomescreenLayout({ children }) {
    const pathname = usePathname()
    const router = useRouter()
    const navContainerRef = useRef(null)
    const linkRefs = useRef(new Map())
    const [indicatorStyle, setIndicatorStyle] = useState({ opacity: 0, width: 0, height: 0, transform: "translateX(0px) translateY(0px)" })
    const [isPageVisible, setIsPageVisible] = useState(false)
    const [isNavVisible, setIsNavVisible] = useState(true)

    const activeHref = useMemo(() => {
        const exactMatch = NAV_LINKS.find((link) => pathname === link.href)
        if (exactMatch) return exactMatch.href
        const prefixMatch = NAV_LINKS.find((link) => pathname.startsWith(`${link.href}/`))
        return prefixMatch?.href ?? NAV_LINKS[0]?.href
    }, [pathname])

    useEffect(() => {
        const updateIndicator = () => {
            const container = navContainerRef.current
            const activeLink = linkRefs.current.get(activeHref)
            if (!container || !activeLink) return
            const containerRect = container.getBoundingClientRect()
            const linkRect = activeLink.getBoundingClientRect()
            const left = linkRect.left - containerRect.left
            const top = linkRect.top - containerRect.top
            setIndicatorStyle({
                opacity: 1,
                width: linkRect.width,
                height: linkRect.height,
                transform: `translateX(${left}px) translateY(${top}px)`,
            })
        }

        updateIndicator()
        window.addEventListener("resize", updateIndicator)
        return () => window.removeEventListener("resize", updateIndicator)
    }, [activeHref])

    useEffect(() => {
        setIsPageVisible(true)
    }, [pathname])

    useEffect(() => {
        if (typeof window === "undefined") return
        const mediaQuery = window.matchMedia("(max-width: 767px)")
        let lastScrollY = window.scrollY
        let ticking = false

        const updateVisibility = () => {
            const currentScrollY = window.scrollY
            const scrollingDown = currentScrollY > lastScrollY
            const scrollDelta = Math.abs(currentScrollY - lastScrollY)

            if (currentScrollY <= 8) {
                setIsNavVisible(true)
            } else if (scrollDelta > 4) {
                setIsNavVisible(!scrollingDown)
            }

            lastScrollY = currentScrollY
            ticking = false
        }

        const onScroll = () => {
            if (!mediaQuery.matches) return
            if (!ticking) {
                window.requestAnimationFrame(updateVisibility)
                ticking = true
            }
        }

        setIsNavVisible(true)
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const handleNavigate = (event, href) => {
        if (href === pathname) return
        event.preventDefault()
        setIsPageVisible(false)
        window.setTimeout(() => {
            router.push(href)
        }, 180)
    }

    return (
        <section className="relative min-h-screen overflow-hidden bg-[var(--layout-bg)]">
            <div aria-hidden className="pointer-events-none fixed inset-0 z-0 lava-bg" />
            <nav className={`sticky top-4 z-50 px-3 transition-transform duration-300 ease-out will-change-transform sm:px-4 md:translate-y-0 ${isNavVisible ? "translate-y-0" : "-translate-y-44"}`}>
                <div className="mx-auto flex w-full max-w-6xl flex-col items-stretch gap-4 rounded-[28px] border border-white/20 bg-[var(--layout-nav-bg)] px-4 py-4 shadow-[0_8px_30px_var(--layout-nav-shadow)] backdrop-blur-sm sm:rounded-full sm:px-6 sm:py-3 md:flex-row md:items-center md:justify-between md:gap-6">
                    <div className="flex items-center gap-3 justify-center hover:cursor-pointer" onClick={(event) => handleNavigate(event, "/home")}>
                        <div className="flex h-15 w-15 items-center justify-center rounded-full p-2 pt-2.5 bg-white/50 text-xs font-semibold text-white/90">
                            <img src="/MHLogo.png" alt="Hazuan Logo" className="h-full w-full object-contain" />
                        </div>
                        <span className="text-lg font-black uppercase tracking-[0.1em] text-white/80">Muhammad Hazuan</span>
                    </div>

                    <div
                        ref={navContainerRef}
                        className="relative flex w-full flex-nowrap items-center justify-between gap-1 rounded-full bg-white/10 px-2 py-2 sm:w-auto sm:justify-start sm:gap-2"
                    >
                        <span
                            aria-hidden
                            className="pointer-events-none absolute left-0 top-0 rounded-full bg-white/25 shadow-sm transition-[transform,width,opacity] duration-300 ease-out"
                            style={indicatorStyle}
                        />
                        {NAV_LINKS.map((link) => {
                            const isActive = activeHref === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    ref={(element) => {
                                        if (element) linkRefs.current.set(link.href, element)
                                    }}
                                    onClick={(event) => handleNavigate(event, link.href)}
                                    className={`relative z-10 flex-1 rounded-full px-2 py-2 text-[13px] font-bold text-white/90 transition sm:flex-none sm:px-4 sm:text-sm ${isActive ? "text-white" : "hover:text-white"} text-center whitespace-nowrap`}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </nav>
            <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-10">
                <div className={`transition-opacity duration-300 ${isPageVisible ? "opacity-100" : "opacity-0"}`}>
                    {children}
                </div>
            </main>
        </section>
    )
}

