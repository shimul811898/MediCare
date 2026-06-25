"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@heroui/react";
import {
  FaUser, FaCalendarAlt, FaFileInvoiceDollar, FaStar,
  FaCalendarCheck, FaClipboardList, FaPrescriptionBottleAlt,
  FaUsers, FaUserMd, FaCreditCard, FaChartBar,
  FaBars, FaTimes, FaSignOutAlt, FaHome, FaCog
} from "react-icons/fa";

const NAV_CONFIG = {
  patient: [
    { href: "/dashboard/patient/profile", label: "My Profile", icon: FaUser },
    { href: "/dashboard/patient/myAppointments", label: "My Appointments", icon: FaCalendarAlt },
    { href: "/dashboard/patient/paymentHistory", label: "Payment History", icon: FaFileInvoiceDollar },
    { href: "/dashboard/patient/myReviews", label: "My Reviews", icon: FaStar },
  ],
  doctor: [
    { href: "/dashboard/doctor/profile", label: "My Profile", icon: FaUser },
    { href: "/dashboard/doctor/manageSchedule", label: "Manage Schedule", icon: FaCog },
    { href: "/dashboard/doctor/appointmentRequests", label: "Appointment Requests", icon: FaCalendarCheck },
    { href: "/dashboard/doctor/prescriptions", label: "Prescriptions", icon: FaPrescriptionBottleAlt },
  ],
  admin: [
    { href: "/dashboard/admin/users", label: "Manage Users", icon: FaUsers },
    { href: "/dashboard/admin/doctors", label: "Manage Doctors", icon: FaUserMd },
    { href: "/dashboard/admin/payments", label: "Payments", icon: FaCreditCard },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: FaChartBar },
  ],
};

const ROLE_COLORS = {
  patient: { bg: "from-blue-600 to-indigo-700", badge: "bg-blue-500", text: "Patient" },
  doctor:  { bg: "from-teal-600 to-emerald-700", badge: "bg-teal-500", text: "Doctor" },
  admin:   { bg: "from-purple-600 to-violet-700", badge: "bg-purple-500", text: "Admin" },
};

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const role = user?.role || "patient";
  const navItems = NAV_CONFIG[role] || NAV_CONFIG.patient;
  const colors = ROLE_COLORS[role] || ROLE_COLORS.patient;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
   
      <div className={`bg-gradient-to-br ${colors.bg} p-6 text-white`}>
        <Link href="/" className="flex items-center gap-2 mb-6 group">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition">
            <FaHome className="text-white text-sm" />
          </div>
          <span className="font-black text-lg tracking-tight">MediCare</span>
        </Link>
        {user && (
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-white/30 shrink-0">
              <Avatar.Image src={user.image || undefined} alt={user.name} />
              <Avatar.Fallback className="bg-white/20 text-white font-bold">
                {user.name?.[0] || "U"}
              </Avatar.Fallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="font-bold text-white truncate text-sm">{user.name}</p>
              <p className="text-white/60 text-xs truncate">{user.email}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full ${colors.badge} text-white text-[10px] font-black uppercase tracking-wider`}>
                {colors.text}
              </span>
            </div>
          </div>
        )}
      </div>


      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-3">Dashboard Menu</p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-teal-50 text-teal-700 border border-teal-100 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Icon className={`text-sm shrink-0 ${isActive ? "text-teal-600" : "text-slate-400"}`} />
              {label}
            </Link>
          );
        })}
      </nav>

  
      <div className="p-4 border-t border-slate-100 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
        >
          <FaHome className="text-slate-400 text-sm" />
          Back to Home
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
        >
          <FaSignOutAlt className="text-sm" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">

      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 shrink-0 fixed top-0 left-0 h-full z-30 shadow-sm">
        <SidebarContent />
      </aside>

 
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

     
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-100 z-50 lg:hidden shadow-xl transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>
        <SidebarContent />
      </aside>


      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
      
        <header className="lg:hidden bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <FaBars />
          </button>
          <span className="font-black text-slate-800">MediCare Dashboard</span>
          <Avatar className="w-8 h-8">
            <Avatar.Image src={user?.image} alt={user?.name} />
            <Avatar.Fallback className="bg-teal-500 text-white text-xs font-bold">
              {user?.name?.[0] || "U"}
            </Avatar.Fallback>
          </Avatar>
        </header>

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
