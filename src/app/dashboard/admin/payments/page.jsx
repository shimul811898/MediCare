"use client";

import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCreditCard, FaCheckCircle } from "react-icons/fa";

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
      const res = await fetch("http://localhost:5000/api/appointments");
      const data = await res.json();
      setAppointments(data.filter(a => a.paymentStatus === "paid"));
    } catch { toast.error("Failed to load payment data."); }
    finally { setLoading(false); }
  };

  if (isPending || !user) return <div className="flex justify-center py-20"><Spinner size="lg" color="teal" /></div>;

  const totalRevenue = appointments.reduce((s, a) => s + (a.fee || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Payments</h1>
        <p className="text-slate-500 text-sm mt-1">All completed payments across the platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg">
          <FaCreditCard className="text-2xl mb-3 text-white/70" />
          <p className="text-4xl font-black">{totalRevenue.toLocaleString()}</p>
          <p className="text-white/70 font-semibold text-sm mt-1">Total Revenue (BDT)</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg">
          <FaCheckCircle className="text-2xl mb-3 text-white/70" />
          <p className="text-4xl font-black">{appointments.length}</p>
          <p className="text-white/70 font-semibold text-sm mt-1">Successful Payments</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="md" color="teal" /></div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20">
            <FaCreditCard className="text-5xl text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-semibold">No payments yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black uppercase"><FaCheckCircle className="text-[10px]" /> Paid</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
