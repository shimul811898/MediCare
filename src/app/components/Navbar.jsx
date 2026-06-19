"use client";
import { authClient } from "@/lib/auth-client";
import { Avatar, Spinner } from "@heroui/react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    setProfileOpen(false);
    setIsOpen(false);
    await authClient.signOut();
  };

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
            Doc<span className="bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">Appoint</span>
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
            <Link href="/find-doctors" className="hover:text-teal-600 transition duration-300">
              Find Doctors
            </Link>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full" />
          </li>

          <li className="group relative py-2">
            <Link href="/about" className="hover:text-teal-600 transition duration-300">
              About Us
            </Link>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full" />
          </li>

          <li className="group relative py-2">
            <Link href="/contact" className="hover:text-teal-600 transition duration-300">
              Contact Us
            </Link>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full" />
          </li>

          {user && (
            <li className="group relative py-2">
              <Link href="/dashboard" className="hover:text-teal-600 transition duration-300">
                Dashboard
              </Link>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full" />
            </li>
          )}
        </ul>

     
        <div className="hidden md:flex items-center gap-4">
          {isPending ? (
            <div className="flex flex-col items-center gap-2">
              <Spinner size="sm" />
              <span className="text-xs text-slate-400">Loading...</span>
            </div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 focus:outline-none cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-50 transition duration-200">
                  <Avatar className="w-9 h-9 border-2 border-teal-500 transition duration-300 group-hover:border-teal-600">
                    <Avatar.Image
                      alt={user?.name || "User"}
                      src={user?.image}
                      referrerPolicy="no-referrer"
                    />
                    <Avatar.Fallback className="bg-teal-500 text-white font-bold">
                      {user?.name?.[0] || "U"}
                    </Avatar.Fallback>
                  </Avatar>
                  <span className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition hidden sm:inline-block">
                    {user?.name}
                  </span>
                  <span className="text-slate-400 group-hover:text-teal-600 transition text-[10px]">▼</span>
                </div>
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2.5 w-48 rounded-xl bg-white border border-slate-100 shadow-xl py-2 z-20 transition-all duration-200 origin-top-right transform scale-100">
                    <div className="px-4 py-2 border-b border-slate-50">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                    </div>
                    <Link
                      href="/my-Profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:text-teal-600 hover:bg-teal-50 transition duration-150"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:text-teal-600 hover:bg-teal-50 transition duration-150"
                    >
                      Dashboard
                    </Link>
                    <div className="h-px bg-slate-100 my-1" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition duration-150 text-left cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-xl font-bold text-slate-700 hover:text-teal-600 hover:bg-slate-50 transition duration-300"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold shadow-[0_4px_15px_rgba(13,148,136,0.2)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
              >
                Register
              </Link>
            </div>
          )}
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
        className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl transition-all duration-300 ease-in-out origin-top ${
          isOpen ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-0 invisible"
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-5 bg-white">
          <ul className="flex flex-col gap-4 font-semibold text-slate-700">
            <li>
              <Link href="/" onClick={() => setIsOpen(false)} className="block py-2 hover:text-teal-600 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/find-doctors" onClick={() => setIsOpen(false)} className="block py-2 hover:text-teal-600 transition">
                Find Doctors
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setIsOpen(false)} className="block py-2 hover:text-teal-600 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="block py-2 hover:text-teal-600 transition">
                Contact Us
              </Link>
            </li>
            {user && (
              <li>
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block py-2 hover:text-teal-600 transition">
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          <div className="w-full h-px bg-slate-100 my-2" />

          <div className="flex flex-col gap-3">
            {isPending ? (
              <div className="flex justify-center py-2">
                <Spinner size="sm" />
              </div>
            ) : user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl">
                  <Avatar className="w-10 h-10">
                    <Avatar.Image
                      alt={user?.name || "User"}
                      src={user?.image}
                      referrerPolicy="no-referrer"
                    />
                    <Avatar.Fallback className="bg-teal-500 text-white font-bold">{user?.name?.[0] || "U"}</Avatar.Fallback>
                  </Avatar>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-800">{user?.name}</span>
                    <span className="text-xs text-slate-500">{user?.email}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 pl-2">
                  <Link
                    href="/my-Profile"
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-sm font-semibold text-slate-600 hover:text-teal-600 transition"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-sm font-semibold text-slate-600 hover:text-teal-600 transition"
                  >
                    Dashboard
                  </Link>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-6 py-2.5 w-full rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold shadow-[0_4px_15px_rgba(13,148,136,0.2)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.3)] active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 rounded-xl font-bold text-center text-slate-700 bg-slate-50 hover:bg-slate-100 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold text-center shadow-md active:scale-[0.98] transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;