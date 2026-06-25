"use client";

import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaTimes, FaClock } from "react-icons/fa";

const STATUS_STYLES = {
  pending:   "bg-amber-50 text-amber-700 border-amber-100",
  approved:  "bg-teal-50 text-teal-700 border-teal-100",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rejected:  "bg-rose-50 text-rose-700 border-rose-100",
};

export default function AppointmentRequestsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!isPending && !user) router.push("/login");
    if (!isPending && user?.role !== "doctor") router.replace("/dashboard");
  }, [user, isPending]);

  useEffect(() => {
    if (user?.role === "doctor") fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/appointments/doctor/${user.id}`);
      const data = await res.json();
      setAppointments(data);
    } catch { toast.error("Failed to load appointments."); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/appointments/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Appointment ${status}!`);
      fetchAppointments();
    } catch { toast.error("Failed to update status."); }
  };

  const deleteAppointment = async (id) => {
    if (!confirm("Are you sure you want to delete this appointment request? This action cannot be undone.")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/appointments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Appointment deleted successfully!");
      fetchAppointments();
    } catch {
      toast.error("Failed to delete appointment.");
    }
  };

  if (isPending || !user) return <div className="flex justify-center py-20"><Spinner size="lg" color="teal" /></div>;

  const filters = ["all", "pending", "approved", "completed", "rejected"];
  const filtered = filter === "all" ? appointments : appointments.filter(a => a.status === filter);
  const counts = { all: appointments.length, pending: appointments.filter(a => a.status === "pending").length, approved: appointments.filter(a => a.status === "approved").length, completed: appointments.filter(a => a.status === "completed").length, rejected: appointments.filter(a => a.status === "rejected").length };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-6 space-y-6 box-border">
      <div className="px-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Appointment Requests</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Review and manage patient appointments</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        {[
          { label: "Pending", count: counts.pending, color: "from-amber-500 to-orange-500" },
          { label: "Approved", count: counts.approved, color: "from-teal-500 to-teal-600" },
          { label: "Completed", count: counts.completed, color: "from-emerald-500 to-emerald-600" },
          { label: "Rejected", count: counts.rejected, color: "from-rose-500 to-rose-600" },
        ].map(({ label, count, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white shadow-sm flex flex-col justify-between`}>
            <p className="text-xl sm:text-2xl md:text-3xl font-black">{count}</p>
            <p className="text-white/80 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1 sm:mt-2">{label}</p>
          </div>
        ))}
      </div>

      <div className="w-full flex flex-wrap gap-1.5 sm:gap-2">
        {filters.map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)} 
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer capitalize flex-grow sm:flex-grow-0 text-center ${
              filter === f ? "bg-teal-500 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f} <span className="opacity-70 text-[10px] sm:text-xs">({f !== "all" ? counts[f] : counts.all})</span>
          </button>
        ))}
      </div>

      <div className="w-full">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="md" color="teal" /></div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl text-center py-16 px-4 shadow-sm">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Appointments Found</h3>
            <p className="text-slate-500 text-xs">No {filter !== "all" ? filter : ""} appointments yet.</p>
          </div>
        ) : (
         
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map(appt => (
              <div 
                key={appt._id} 
                className="bg-white rounded-2xl border border-slate-100 p-3 sm:p-4 shadow-sm flex flex-col justify-between hover:border-slate-200 transition min-w-0 w-full box-border"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs flex-shrink-0">
                      {appt.patientName?.[0] || "P"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-xs sm:text-sm truncate">{appt.patientName || "Patient"}</p>
                      <p className="text-slate-400 text-[11px] truncate">{appt.patientEmail}</p>
                    </div>
                  </div>
                  <span className={`inline-block px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase border flex-shrink-0 tracking-wider ${STATUS_STYLES[appt.status] || ""}`}>
                    {appt.status}
                  </span>
                </div>

                <div className="bg-slate-50/70 p-2.5 sm:p-3 rounded-xl space-y-2 text-xs mb-3">
                  <div className="flex justify-between items-start border-b border-slate-200/40 pb-2">
                    <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider mt-0.5">Schedule</span>
                    <div className="text-right min-w-0">
                      <div className="flex items-center justify-end gap-1 text-slate-700 font-bold text-[11px] sm:text-xs">
                        <FaClock className="text-slate-400 text-[10px] flex-shrink-0" /> 
                        <span className="truncate">{appt.date}</span>
                      </div>
                      <p className="text-teal-600 font-bold text-[11px] mt-0.5 truncate">{appt.timeSlot}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-200/40 pb-2">
                    <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider">Payment</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800 text-[11px] sm:text-xs">{appt.fee} BDT</span>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase border ${appt.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>
                        {appt.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="pt-0.5">
                    <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider block mb-0.5">Symptoms</span>
                    <p className="text-slate-600 font-medium line-clamp-2 text-[11px] sm:text-xs break-words">
                      {appt.symptoms || "General Checkup"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 mt-auto w-full">
                  {appt.status === "pending" && (
                    <div className="flex gap-1.5 flex-grow min-w-0">
                      <button 
                        onClick={() => updateStatus(appt._id, "approved")} 
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-teal-500 hover:bg-teal-600 text-white text-[11px] sm:text-xs font-bold rounded-lg transition cursor-pointer shadow-sm truncate"
                      >
                        <FaCheck className="text-[9px] flex-shrink-0" /> Approve
                      </button>
                      <button 
                        onClick={() => updateStatus(appt._id, "rejected")} 
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-rose-500 hover:bg-rose-600 text-white text-[11px] sm:text-xs font-bold rounded-lg transition cursor-pointer shadow-sm truncate"
                      >
                        <FaTimes className="text-[9px] flex-shrink-0" /> Reject
                      </button>
                    </div>
                  )}
                  
                  {appt.status === "approved" && (
                    <button 
                      onClick={() => updateStatus(appt._id, "completed")} 
                      className="flex-grow px-2 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] sm:text-xs font-bold rounded-lg transition cursor-pointer shadow-sm text-center truncate"
                    >
                      Mark Complete
                    </button>
                  )}

                  {["completed", "rejected"].includes(appt.status) && (
                    <span className="text-slate-400 text-xs italic capitalize flex-grow pl-1 truncate">{appt.status}</span>
                  )}
                  
                  <button 
                    onClick={() => deleteAppointment(appt._id)} 
                    className="px-2.5 py-2 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white text-[11px] sm:text-xs font-bold rounded-lg transition flex-shrink-0 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}