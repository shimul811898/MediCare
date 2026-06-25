"use client";

import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCreditCard, FaCheckCircle, FaUser, FaUserMd, FaStethoscope, FaCalendarAlt, FaHashtag } from "react-icons/fa";

export default function AdminPaymentsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !user) router.push("/login");
    if (!isPending && user?.role !== "admin") router.replace("/dashboard");
  }, [user, isPending]);

  useEffect(() => {
    if (user?.role === "admin") fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/appointments`);
      const data = await res.json();
      setAppointments(data.filter(a => a.paymentStatus === "paid"));
    } catch { toast.error("Failed to load payment data."); }
    finally { setLoading(false); }
  };

  if (isPending || !user) return <div className="flex justify-center py-20"><Spinner size="lg" color="teal" /></div>;

  const totalRevenue = appointments.reduce((s, a) => s + (a.fee || 0), 0);

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full box-border">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900">Payments</h1>
        <p className="text-slate-500 text-xs md:text-sm mt-1">All completed payments across the platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl md:rounded-3xl p-5 md:p-6 text-white shadow-lg">
          <FaCreditCard className="text-xl md:text-2xl mb-2 md:mb-3 text-white/70" />
          <p className="text-2xl md:text-4xl font-black">{totalRevenue.toLocaleString()}</p>
          <p className="text-white/70 font-semibold text-xs md:text-sm mt-1">Total Revenue (BDT)</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl md:rounded-3xl p-5 md:p-6 text-white shadow-lg">
          <FaCheckCircle className="text-xl md:text-2xl mb-2 md:mb-3 text-white/70" />
          <p className="text-2xl md:text-4xl font-black">{appointments.length}</p>
          <p className="text-white/70 font-semibold text-xs md:text-sm mt-1">Successful Payments</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="md" color="teal" /></div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20">
            <FaCreditCard className="text-5xl text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-semibold">No payments yet.</p>
          </div>
        ) : (
          <>
            <div className="block lg:hidden divide-y divide-slate-100">
              {appointments.map(a => (
                <div key={a._id} className="p-4 space-y-3 hover:bg-slate-50/50 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 text-slate-800 font-bold">
                        <FaUser className="text-xs text-slate-400" />
                        {a.patientName || "Patient"}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 text-xs mt-1">
                        <FaUserMd className="text-xs text-slate-400" />
                        {a.doctorName || "Doctor"}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black uppercase">
                      <FaCheckCircle className="text-[9px]" /> Paid
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-50 pt-2">
                    <div className="space-y-1">
                      <p className="text-slate-400 font-medium flex items-center gap-1"><FaStethoscope /> Specialty</p>
                      <p className="text-teal-600 font-semibold">{a.doctorSpecialization || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-400 font-medium flex items-center gap-1"><FaCalendarAlt /> Date</p>
                      <p className="text-slate-600 font-medium">{a.date}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1">
                      <FaHashtag className="text-[10px] text-slate-400" />
                      <span className="font-mono text-[11px] text-slate-500 truncate max-w-[140px]">
                        {a.transactionId || "—"}
                      </span>
                    </div>
                    <p className="font-black text-emerald-700 text-sm">{a.fee} BDT</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Doctor</th>
                    <th className="px-6 py-4">Specialization</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {appointments.map(a => (
                    <tr key={a._id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-bold text-slate-800">{a.patientName || "Patient"}</td>
                      <td className="px-6 py-4 font-semibold text-slate-700">{a.doctorName || "Doctor"}</td>
                      <td className="px-6 py-4 text-teal-600 font-semibold">{a.doctorSpecialization || "—"}</td>
                      <td className="px-6 py-4 text-slate-600">{a.date}</td>
                      <td className="px-6 py-4 font-black text-emerald-700 text-base">{a.fee} BDT</td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-slate-600">{a.transactionId || "—"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black uppercase">
                          <FaCheckCircle className="text-[10px]" /> Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}