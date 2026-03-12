'use client'

import { Search, Briefcase, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const router = useRouter();
    const pathname = usePathname();

    const [search, setSearch] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!search.trim()) return;
        router.push(`/jobs?search=${search}`);
        setSearch('');
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="text-3xl font-bold text-gray-900 tracking-tight">
                        Editra<span className="text-indigo-600">.</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">

                        <Link
                            href="/"
                            className={`hover:text-indigo-600 transition ${pathname === '/' ? 'text-indigo-600' : ''}`}
                        >
                            Home
                        </Link>

                        <Link
                            href="/jobs"
                            className={`hover:text-indigo-600 transition ${pathname.includes('/jobs') ? 'text-indigo-600' : ''}`}
                        >
                            Jobs
                        </Link>

                        {/* <Link
                            href="/company"
                            className={`hover:text-indigo-600 transition ${pathname.includes('/company') ? 'text-indigo-600' : ''}`}
                        >
                            Companies
                        </Link> */}


                        {/* Search */}
                        <form
                            onSubmit={handleSearch}
                            className="flex items-center gap-2 bg-gray-100 focus-within:bg-gray-200 px-4 py-2 rounded-full transition"
                        >
                            <Search size={18} className="text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent outline-none text-sm w-40 placeholder-gray-500"
                            />
                        </form>
                        <Link
                            href="/job-applications"
                            className={`hover:text-indigo-600 transition ${pathname.includes('/job-applications') ? 'text-indigo-600' : ''}`}
                        >
                            Applied Jobs
                        </Link>

                        <Link href="/profile">
 My Profile
</Link>

                        {/* Auth Section */}
                        {!user ? (
                            <button
                                onClick={openSignIn}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition shadow-sm"
                            >
                                Login
                            </button>
                        ) : (
                            <UserButton afterSignOutUrl="/" />
                        )}
                    </div>
                </div>
            </nav>

            {/* Spacer */}
            <div className="h-16"></div>
        </>
    );
};

export default Navbar;