'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from "../../../context/AuthContext.jsx";
import SecondaryButton from '@/components/ui/buttons/SecondaryButton.jsx';


export default function DashboardLayout({ children }) {
    const { logout, loading, isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        }
    }, [loading, isAuthenticated, router]);

    const handleLogout = async () => {
        const ok = await logout();
        if (ok) {
            router.push("/");
        }
    }

    const handleNavClick = () => {
        setMenuOpen(false);
    };

    if (loading) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-gray-100">
                <p className="text-sm font-medium text-gray-500">Loading dashboard...</p>
            </section>
        );
    }

    if (!isAuthenticated) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-gray-100">
                <p className="text-sm font-medium text-gray-500">Redirecting to login...</p>
            </section>
        );
    }
    return (
        <section className="flex flex-col min-h-screen bg-gray-100">
            <nav className="m-2 rounded-3xl bg-white shadow-[0_2px_10px_0_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between gap-4 p-4">
                    <h1 className='ml-3 font-bold text-xl'>Dashboard</h1>
                    <button
                        type="button"
                        className="md:hidden inline-flex items-center justify-center rounded-full border border-gray-200 p-2 text-gray-700"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-label="Toggle navigation"
                        aria-expanded={menuOpen}
                    >
                        <span className="sr-only">Toggle navigation</span>
                        <div className="flex flex-col gap-1">
                            <span className="block h-0.5 w-5 bg-gray-700" />
                            <span className="block h-0.5 w-5 bg-gray-700" />
                            <span className="block h-0.5 w-5 bg-gray-700" />
                        </div>
                    </button>
                </div>

                <div className="hidden md:flex items-center justify-between gap-4 px-6 pb-4">
                    <div className='flex gap-4'>
                        <Link
                            href="/admin/dashboard/blogs"
                            className={`font-bold transition-colors duration-200 ease-out hover:text-hazuan-primary ${pathname === '/admin/dashboard/blogs' ? 'text-hazuan-primary' : ''}`}
                        >
                            Blog
                        </Link>
                        <Link
                            href="/admin/dashboard/guides"
                            className={`font-bold transition-colors duration-200 ease-out hover:text-hazuan-primary ${pathname === '/admin/dashboard/guides' ? 'text-hazuan-primary' : ''}`}
                        >
                            Guide
                        </Link>
                        <Link
                            href="/admin/dashboard/writeups"
                            className={`font-bold transition-colors duration-200 ease-out hover:text-hazuan-primary ${pathname === '/admin/dashboard/writeups' ? 'text-hazuan-primary' : ''}`}
                        >
                            Writeup
                        </Link>
                        <Link
                            href="/admin/dashboard/events"
                            className={`font-bold transition-colors duration-200 ease-out hover:text-hazuan-primary ${pathname === '/admin/dashboard/events' ? 'text-hazuan-primary' : ''}`}
                        >
                            Events
                        </Link>
                    </div>
                    <SecondaryButton text="Logout" onClick={handleLogout} color='hover:bg-red-400 disabled:bg-red-400/45 text-red-400 border-red-400' />
                </div>

                {menuOpen && (
                    <div className="flex flex-col gap-3 border-t border-gray-100 px-6 pb-4 pt-3 md:hidden">
                        <Link
                            href="/admin/dashboard/blogs"
                            onClick={handleNavClick}
                            className={`font-bold transition-colors duration-200 ease-out hover:text-hazuan-primary ${pathname === '/admin/dashboard/blogs' ? 'text-hazuan-primary' : ''}`}
                        >
                            Blog
                        </Link>
                        <Link
                            href="/admin/dashboard/guides"
                            onClick={handleNavClick}
                            className={`font-bold transition-colors duration-200 ease-out hover:text-hazuan-primary ${pathname === '/admin/dashboard/guides' ? 'text-hazuan-primary' : ''}`}
                        >
                            Guide
                        </Link>
                        <Link
                            href="/admin/dashboard/writeups"
                            onClick={handleNavClick}
                            className={`font-bold transition-colors duration-200 ease-out hover:text-hazuan-primary ${pathname === '/admin/dashboard/writeups' ? 'text-hazuan-primary' : ''}`}
                        >
                            Writeup
                        </Link>
                        <Link
                            href="/admin/dashboard/events"
                            onClick={handleNavClick}
                            className={`font-bold transition-colors duration-200 ease-out hover:text-hazuan-primary ${pathname === '/admin/dashboard/events' ? 'text-hazuan-primary' : ''}`}
                        >
                            Events
                        </Link>
                        <SecondaryButton
                            text="Logout"
                            onClick={handleLogout}
                            color='hover:bg-red-400 disabled:bg-red-400/45 text-red-400 border-red-400'
                        />
                    </div>
                )}
            </nav>

            {/* This is where the blog, events, etc. pages will render */}
            <main className="p-6 flex-1">
                {children}
            </main>
        </section>
    );
}
