"use client";

import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFileMedical, FaUser, FaClock, FaCheckCircle, FaExclamationCircle, FaPrescriptionBottleAlt, FaHeartbeat } from "react-icons/fa";

export default function PrescriptionsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [prescText, setPrescText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !user) router.push("/login");
    if (!isPending && user?.role !== "doctor") router.replace("/dashboard");
  }, [user, isPending, router]);

  useEffect(() => {
    if (user?.role === "doctor") fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/appointments/doctor/${user.id}`);
      const data = await res.json();
      const completed = data.filter(a => a.status === "completed");
      setAppointments(completed);
      const prescs = {};
      completed.forEach(a => { if (a.prescription) prescs[a._id] = a.prescription; });
      setPrescriptions(prescs);
    } catch { toast.error("Failed to load appointments."); }
    finally { setLoading(false); }
  };

  const handleSavePrescription = async (apptId) => {
    if (!prescText.trim()) {
      toast.error("Prescription text cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${apptId}/prescription`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prescription: prescText }),
      });
      if (!res.ok) throw new Error();
      setPrescriptions(p => ({ ...p, [apptId]: prescText }));
      setEditingId(null);
      toast.success("Prescription saved successfully!");
    } catch { toast.error("Failed to save prescription."); }
    finally { setSaving(false); }
  };

  if (isPending || !user) return <div className="flex justify-center py-20"><Spinner size="lg" color="teal" /></div>;

  const totalCompleted = appointments.length;
  const totalPrescribed = Object.keys(prescriptions).length;
  const pendingPresc = totalCompleted - totalPrescribed;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-sm">
              <FaPrescriptionBottleAlt className="text-2xl" />
            </span>
            Prescriptions
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage, issue and edit prescriptions for your completed sessions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <FaHeartbeat className="text-xl" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{totalCompleted}</p>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Completed Sessions</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <FaCheckCircle className="text-xl" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{totalPrescribed}</p>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Prescriptions Written</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <FaExclamationCircle className="text-xl" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{pendingPresc}</p>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Pending Action</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" color="teal" /></div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 border-dashed text-center py-20 px-4">
          <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4 text-2xl">📋</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Completed Appointments</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">Once you mark patient appointment requests as &quot;Completed&quot;, they will show up here so you can write prescriptions.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {appointments.map(appt => {
            const hasPrescription = !!prescriptions[appt._id];
            const isEditing = editingId === appt._id;

            return (
              <div key={appt._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:border-slate-200 transition-all duration-300">
                <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-black text-base shadow-sm shrink-0">
                      {appt.patientName?.[0] || "P"}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-lg leading-tight">{appt.patientName || "Patient"}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-slate-500 text-xs font-medium">
                        <span className="flex items-center gap-1"><FaClock className="text-[10px]" /> {appt.date} · {appt.timeSlot}</span>
                        {appt.symptoms && (
                          <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 border border-teal-100 font-semibold">{appt.symptoms}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {hasPrescription ? (
                      <span className="flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                        <FaCheckCircle className="text-xs" /> Issued
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-black text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
                        <FaExclamationCircle className="text-xs" /> Pending
                      </span>
                    )}

                    {/* Action Button */}
                    {!isEditing && (
                      <button
                        onClick={() => { setEditingId(appt._id); setPrescText(prescriptions[appt._id] || ""); }}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <FaFileMedical /> {hasPrescription ? "Edit" : "Write"} Prescription
                      </button>
                    )}
                  </div>
                </div>               
                <div className="p-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="border border-teal-100 rounded-2xl bg-teal-50/10 overflow-hidden">
                        <div className="px-5 py-3.5 bg-teal-50/50 border-b border-teal-100 flex justify-between items-center text-xs font-bold text-teal-800">
                          <span>PRESCRIPTION WRITING PAD</span>
                          <span className="font-mono">Dr. {user.name}</span>
                        </div>
                        <div className="p-4 relative bg-white">
                          <span className="absolute top-3 left-4 text-2xl font-black text-teal-300 select-none font-serif">Rx</span>
                          <textarea
                            rows={4}
                            value={prescText}
                            onChange={e => setPrescText(e.target.value)}
                            placeholder="Type prescription content here... E.g.&#10;1. Tab. Paracetamol 500mg - 1+0+1 (After meal) - 5 days&#10;2. Cap. Omeprazole 20mg - 1+0+1 (Before meal) - 14 days&#10;&#10;Advice: Drink plenty of water and take bed rest."
                            className="w-full pl-8 pr-4 py-1.5 bg-transparent rounded-xl text-slate-800 text-sm focus:outline-none placeholder-slate-400 font-mono leading-relaxed"
                          />
                        </div>
                      </div>

                   
                      <div className="flex justify-end gap-2.5">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSavePrescription(appt._id)}
                          disabled={saving}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-teal-500/10 transition cursor-pointer disabled:opacity-60"
                        >
                          {saving ? "Saving..." : "Save & Issue"}
                        </button>
                      </div>
                    </div>
                  ) : hasPrescription ? (
                    <div className="border border-slate-100 rounded-2xl bg-slate-50/50 p-5 relative overflow-hidden">
                      <span className="absolute top-4 right-5 text-4xl font-black text-slate-100/70 select-none font-serif">Rx</span>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Issued Prescription</p>
                      <div className="text-slate-700 text-sm font-mono whitespace-pre-wrap leading-relaxed bg-white border border-slate-100 rounded-xl p-4 shadow-inner">
                        {prescriptions[appt._id]}
                      </div>
                    </div>
                  ) : (
                 
                    <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/30">
                      <p className="text-slate-400 text-sm font-medium">No prescription has been written for this consultation yet.</p>
                      <button
                        onClick={() => { setEditingId(appt._id); setPrescText(""); }}
                        className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-600 font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        <FaFileMedical /> Write Prescription Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
