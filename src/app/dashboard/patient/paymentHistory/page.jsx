"use client";

import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaReceipt, FaCheckCircle, FaClock, FaIdCard } from "react-icons/fa";

export default function PaymentHistoryPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !user) router.push("/login");
    if (!isPending && user?.role !== "patient") router.replace("/dashboard");
  }, [user, isPending]);

  useEffect(() => {
    if (user?.role === "patient") fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/appointments/patient/${user.id}`);
      const data = await res.json();
      setPayments(data.filter(a => a.paymentStatus === "paid"));
    } catch { toast.error("Failed to load payment history."); }
    finally { setLoading(false); }
  };

  if (isPending || !user) return <div className="flex justify-center py-20"><Spinner size="lg" color="teal" /></div>;

  const total = payments.reduce((sum, p) => sum + (p.fee || 0), 0);

  return (
    <div className="space-y-6 p-2 sm:p-0">
     
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Payment History</h1>
        <p className="text-slate-500 text-sm mt-1">All your completed payments</p>
      </div>

      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-5 sm:p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <FaReceipt className="text-white" />
          </div>
          <p className="font-bold text-white/80 text-xs sm:text-sm uppercase tracking-wider">Total Spent</p>
        </div>
        <p className="text-3xl sm:text-4xl font-black">{total} <span className="text-xl sm:text-2xl font-bold text-white/70">BDT</span></p>
        <p className="text-white/60 text-xs mt-2">{payments.length} successful payment{payments.length !== 1 ? "s" : ""}</p>
      </div>

      <div>
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="md" color="teal" /></div>
        ) : payments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm text-center py-20">
            <div className="text-5xl mb-4">💳</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Payments Yet</h3>
            <p className="text-slate-500 text-sm">Your payment records will appear here.</p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Doctor</th>
                    <th className="px-6 py-4">Specialization</th>
                    <th className="px-6 py-4">Appointment Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {payments.map(p => (
                    <tr key={p._id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-bold text-slate-800">{p.doctorName}</td>
                      <td className="px-6 py-4 text-teal-600 font-semibold">{p.doctorSpecialization}</td>
                      <td className="px-6 py-4 text-slate-600">{p.date} ({p.timeSlot})</td>
                      <td className="px-6 py-4 font-black text-emerald-700 text-base">{p.fee} BDT</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-slate-600">{p.transactionId || "—"}</span>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
              {payments.map(p => (
                <div key={p._id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">{p.doctorName}</h3>
                      <p className="text-teal-600 text-xs font-semibold">{p.doctorSpecialization}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black uppercase">
                      <FaCheckCircle className="text-[8px]" /> Paid
                    </span>
                  </div>

                  <div className="border-t border-slate-50 pt-3 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-slate-400 shrink-0" />
                      <span>{p.date} ({p.timeSlot})</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FaIdCard className="text-slate-400 shrink-0" />
                      <span className="font-mono bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 text-[11px]">
                        TxID: {p.transactionId || "—"}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-50 pt-3 flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-400">Amount Paid</span>
                    <span className="font-black text-emerald-700 text-base">{p.fee} BDT</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}