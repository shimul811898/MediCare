"use client";

import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaTimes, FaClock, FaUser } from "react-icons/fa";

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
      const res = await fetch(`http://localhost:5000/api/appointments/doctor/${user.id}`);
      const data = await res.json();
      setAppointments(data);
    } catch { toast.error("Failed to load appointments."); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
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
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Appointment Requests</h1>
        <p className="text-slate-500 text-sm mt-1">Review and manage patient appointments</p>
      </div>

 
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending", count: counts.pending, color: "from-amber-500 to-orange-500" },
          { label: "Approved", count: counts.approved, color: "from-teal-500 to-teal-600" },
          { label: "Completed", count: counts.completed, color: "from-emerald-500 to-emerald-600" },
          { label: "Rejected", count: counts.rejected, color: "from-rose-500 to-rose-600" },
        ].map(({ label, count, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-4 text-white shadow-sm`}>
            <p className="text-3xl font-black">{count}</p>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mt-1">{label}</p>
          </div>
        ))}
      </div>


      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer capitalize ${filter === f ? "bg-teal-500 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            {f} {f !== "all" ? `(${counts[f]})` : `(${counts.all})`}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="md" color="teal" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Appointments Found</h3>
            <p className="text-slate-500 text-sm">No {filter !== "all" ? filter : ""} appointments yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Symptoms</th>
                  <th className="px-6 py-4">Fee</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {filtered.map(appt => (
                  <tr key={appt._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs">{appt.patientName?.[0] || "P"}</div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{appt.patientName || "Patient"}</p>
                          <p className="text-slate-400 text-xs">{appt.patientEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium"><FaClock className="text-slate-400 text-xs" /> {appt.date}</div>
                      <p className="text-teal-600 text-xs font-semibold mt-0.5">{appt.timeSlot}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs max-w-[150px]">{appt.symptoms || "General"}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{appt.fee} BDT</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-black uppercase border ${appt.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>{appt.paymentStatus}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-black uppercase border ${STATUS_STYLES[appt.status] || ""}`}>{appt.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end items-center">
                        {appt.status === "pending" && (
                          <>
                            <button onClick={() => updateStatus(appt._id, "approved")} className="flex items-center gap-1 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-lg transition cursor-pointer"><FaCheck className="text-[10px]" /> Approve</button>
                            <button onClick={() => updateStatus(appt._id, "rejected")} className="flex items-center gap-1 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg transition cursor-pointer"><FaTimes className="text-[10px]" /> Reject</button>
                          </>
                        )}
                        {appt.status === "approved" && (
                          <button onClick={() => updateStatus(appt._id, "completed")} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition cursor-pointer">Mark Complete</button>
                        )}
                        {["completed", "rejected"].includes(appt.status) && <span className="text-slate-400 text-xs italic capitalize mr-2">{appt.status}</span>}
                        <button onClick={() => deleteAppointment(appt._id)} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-100 text-xs font-bold rounded-lg transition cursor-pointer" title="Delete Appointment">Delete</button>
                      </div>
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
