'use client';
import Link from 'next/link';
import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from "../../../context/AuthContext.jsx";
import SecondaryButton from '@/components/ui/buttons/SecondaryButton.jsx';


export default function DashboardLayout({ children }) {
    const { logout, loading, isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

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

    if (!isAuthenticated) {
        return null;
    }
    return (
        <section className="flex flex-col min-h-screen bg-gray-100">
            <nav className="flex gap-4 m-2 p-4 rounded-full bg-white justify-between items-center shadow-[0_2px_10px_0_rgba(0,0,0,0.05)]">
                <h1 className='ml-3 font-bold text-xl'>Dashboard</h1>
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
            </nav>

            {/* This is where the blog, events, etc. pages will render */}
            <main className="p-6 flex-1">
                {children}
            </main>
        </section>
    );
}
