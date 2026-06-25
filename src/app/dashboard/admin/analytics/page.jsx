"use client";

import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUsers, FaUserMd, FaCalendarAlt, FaStar, FaDollarSign, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaClock } from "react-icons/fa";

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !user) router.push("/login");
    if (!isPending && user?.role !== "admin") router.replace("/dashboard");
  }, [user, isPending]);

  useEffect(() => {
    if (user?.role === "admin") fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/stats`);
      const data = await res.json();
      setStats(data);
    } catch { toast.error("Failed to load analytics."); }
    finally { setLoading(false); }
  };

  if (isPending || !user) return <div className="flex justify-center py-20"><Spinner size="lg" color="teal" /></div>;

  const cards = stats ? [
    { label: "Total Users", value: stats.totalUsers, icon: FaUsers, color: "from-blue-500 to-indigo-600", sub: "Registered accounts" },
    { label: "Total Patients", value: stats.totalPatients, icon: FaUsers, color: "from-sky-500 to-blue-600", sub: "Active patients" },
    { label: "Total Doctors", value: stats.totalDoctors, icon: FaUserMd, color: "from-teal-500 to-emerald-600", sub: `${stats.verifiedDoctors} verified` },
    { label: "Appointments", value: stats.totalAppointments, icon: FaCalendarAlt, color: "from-violet-500 to-purple-600", sub: "All time" },
    { label: "Total Reviews", value: stats.totalReviews, icon: FaStar, color: "from-amber-500 to-orange-600", sub: "Patient reviews" },
    { label: "Total Revenue", value: `${stats.totalRevenue?.toLocaleString()} BDT`, icon: FaDollarSign, color: "from-emerald-500 to-green-600", sub: "From paid appointments" },
  ] : [];

  return (
    <div className="space-y-8 p-2 sm:p-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Platform-wide statistics and insights</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" color="teal" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map(({ label, value, icon: Icon, color, sub }) => (
              <div key={label} className={`bg-gradient-to-br ${color} rounded-3xl p-5 text-white shadow-lg flex flex-col justify-between`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Icon className="text-lg" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black tracking-tight">{value}</p>
                  <p className="font-bold text-white/90 text-sm mt-1">{label}</p>
                  <p className="text-white/60 text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-black text-slate-800">Recent Appointments</h2>
              <p className="text-slate-500 text-sm mt-0.5">Latest 5 appointments on the platform</p>
            </div>
            
            {!stats?.recentAppointments?.length ? (
              <div className="text-center py-12"><p className="text-slate-400">No appointments yet.</p></div>
            ) : (
              <>
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Patient</th>
                        <th className="px-6 py-4">Doctor</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Fee</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                      {stats.recentAppointments.map(a => (
                        <tr key={a._id} className="hover:bg-slate-50/50 transition">
                          <td className="px-6 py-4 font-bold text-slate-800">{a.patientName || "Patient"}</td>
                          <td className="px-6 py-4 text-slate-600">{a.doctorName || "Doctor"}</td>
                          <td className="px-6 py-4 text-slate-500 text-xs">{a.date} · {a.timeSlot}</td>
                          <td className="px-6 py-4 font-bold">{a.fee} BDT</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase border ${
                              a.status === "approved" ? "bg-teal-50 text-teal-700 border-teal-100" :
                              a.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                              a.status === "rejected" ? "bg-rose-50 text-rose-700 border-rose-100" :
                              "bg-amber-50 text-amber-700 border-amber-100"
                            }`}>
                              {a.status === "completed" && <FaCheckCircle className="text-[10px]" />}
                              {a.status === "pending" && <FaHourglassHalf className="text-[10px]" />}
                              {a.status === "rejected" && <FaTimesCircle className="text-[10px]" />}
                              {a.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-black uppercase border ${a.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>{a.paymentStatus}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="block lg:hidden divide-y divide-slate-100">
                  {stats.recentAppointments.map(a => (
                    <div key={a._id} className="p-5 space-y-3 bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Patient</p>
                          <h4 className="font-bold text-slate-800 text-base">{a.patientName || "Patient"}</h4>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Doctor</p>
                          <h4 className="font-semibold text-slate-700 text-sm">{a.doctorName || "Doctor"}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                        <FaClock className="text-slate-400 shrink-0" />
                        <span>{a.date} · {a.timeSlot}</span>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div>
                          <span className="text-xs text-slate-400 block">Consultation Fee</span>
                          <span className="font-black text-slate-800 text-sm">{a.fee} BDT</span>
                        </div>
                        <div className="flex flex-col gap-1.5 items-end">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                            a.status === "approved" ? "bg-teal-50 text-teal-700 border-teal-100" :
                            a.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                            a.status === "rejected" ? "bg-rose-50 text-rose-700 border-rose-100" :
                            "bg-amber-50 text-amber-700 border-amber-100"
                          }`}>
                            {a.status === "completed" && <FaCheckCircle className="text-[8px]" />}
                            {a.status === "pending" && <FaHourglassHalf className="text-[8px]" />}
                            {a.status === "rejected" && <FaTimesCircle className="text-[8px]" />}
                            {a.status}
                          </span>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${a.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>{a.paymentStatus}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}