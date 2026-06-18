"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
            <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative overflow-hidden rounded-xl transition-transform group-hover:scale-105">
                        <Image
                            src="/assests/navlogo.jpg"
                            alt="NavLogo"
                            width={48}
                            height={48}
                            className="h-12 w-12 object-cover"
                            priority
                        />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">
                        Medi<span className="bg-gradient-to-r from-teal-500 to-teal-300 bg-clip-text text-transparent">Care</span>
                    </h2>
                </Link>

                <ul className="hidden md:flex items-center gap-8 font-semibold text-slate-600">
                    <li className="group relative py-2">
                        <Link href="/" className="hover:text-teal-600 transition duration-300">
                            Home
                        </Link>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full" />
                    </li>

                    <li className="group relative py-2">
                        <Link href="/" className="hover:text-teal-600 transition duration-300">
                             Find Doctors
                        </Link>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full" />
                    </li>

                    <li className="group relative py-2">
                        <Link href="/" className="hover:text-teal-600 transition duration-300">
                            About Us 
                        </Link>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full" />
                    </li>
                    <li className="group relative py-2">
                        <Link href="/" className="hover:text-teal-600 transition duration-300">
                            Contact Us 
                        </Link>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full" />
                    </li>
                </ul>

                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/assests/Avater.jpg"
                            alt="User Avatar"
                            width={40}
                            height={40}
                            className="rounded-full border"
                        />
                        <Link
                            href="/login"
                            className="px-5 py-2.5 rounded-xl font-bold text-slate-700 hover:text-teal-600 hover:bg-slate-50 transition duration-300"
                        >
                            Login
                        </Link>

                        <Link
                            href="/signup"
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-300 text-white font-bold shadow-[0_4px_15px_rgba(30,99,255,0.2)] hover:shadow-[0_6px_20px_rgba(30,99,255,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
                        >
                            Register
                        </Link>
                    </div>
                </div>

                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 transition focus:outline-none"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
                    </button>
                </div>
            </nav>
            <div
                className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl transition-all duration-300 ease-in-out origin-top ${isOpen ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-0 invisible"
                    }`}
            >
                <div className="px-6 py-6 flex flex-col gap-5 bg-white">
                    <ul className="flex flex-col gap-4 font-semibold text-slate-700">
                        <li>
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className="block py-2 hover:text-teal-600 transition"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className="block py-2 hover:text-teal-600 transition"
                            >
                                Find Doctors
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className="block py-2 hover:text-teal-600 transition"
                            >
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className="block py-2 hover:text-teal-600 transition"
                            >
                               Contact Us
                            </Link>
                        </li>
                    </ul>

                    <div className="w-full h-px bg-slate-100 my-2" />

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="w-full py-3 rounded-xl font-bold text-center text-slate-700 bg-slate-50 hover:bg-slate-100 transition"
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            onClick={() => setIsOpen(false)}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-300 text-white font-bold text-center shadow-md active:scale-[0.98] transition"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;