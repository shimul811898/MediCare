"use client";

import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaClock, FaStar, FaCalendarAlt, FaFileMedical } from "react-icons/fa";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  approved: "bg-teal-50 text-teal-700 border-teal-100",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rejected: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function MyAppointmentsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null);
  const [prescriptionModal, setPrescriptionModal] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !user) router.push("/login");
    if (!isPending && user?.role !== "patient") router.replace("/dashboard");
  }, [user, isPending, router]);

  useEffect(() => {
    if (user?.role === "patient") fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/appointments/patient/${user.id}`);
      const data = await res.json();
      setAppointments(data);
    } catch { toast.error("Failed to load appointments."); }
    finally { setLoading(false); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: reviewModal._id,
          doctorId: reviewModal.doctorId,
          patientId: user.id,
          patientName: user.name,
          patientImage: user.image,
          rating,
          comment
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Review submitted!");
      setReviewModal(null);
      setComment("");
      fetchAppointments();
    } catch { toast.error("Failed to submit review."); }
    finally { setReviewLoading(false); }
  };

  if (isPending || !user) return <div className="flex justify-center py-20"><Spinner size="lg" color="teal" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">My Appointments</h1>
          <p className="text-slate-500 text-sm mt-1">Track all your medical appointments</p>
        </div>
        <button onClick={() => router.push("/find-doctors")} className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold rounded-xl text-sm shadow-md shadow-teal-500/10 transition cursor-pointer">
          + Book New Appointment
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="md" color="teal" /></div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Appointments Yet</h3>
            <p className="text-slate-500 text-sm">Book your first appointment with a doctor.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Doctor</th>
                  <th className="px-6 py-4">Specialization</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Fee</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700 text-sm">
                {appointments.map(appt => (
                  <tr key={appt._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">{appt.doctorName}</td>
                    <td className="px-6 py-4 text-teal-600 font-semibold">{appt.doctorSpecialization}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5"><FaClock className="text-slate-400 text-xs" /> {appt.date} ({appt.timeSlot})</div>
                    </td>
                    <td className="px-6 py-4 font-bold">{appt.fee} BDT</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-black uppercase border ${STATUS_STYLES[appt.status] || "bg-slate-50 text-slate-600 border-slate-100"}`}>{appt.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-black uppercase border ${appt.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>{appt.paymentStatus}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col sm:flex-row gap-2 justify-end items-center">
                        {appt.paymentStatus === "unpaid" && (
                          <button onClick={() => router.push(`/payment?appointmentId=${appt._id}`)} className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-lg transition cursor-pointer">Pay Fee</button>
                        )}
                        {appt.status === "completed" && (
                          <>
                            {appt.prescription ? (
                              <button onClick={() => setPrescriptionModal(appt)} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1">
                                <FaFileMedical className="text-[10px]" /> View Prescription
                              </button>
                            ) : (
                              <span className="text-slate-400 text-xs italic">Prescription pending</span>
                            )}
                            <button onClick={() => { setReviewModal(appt); setRating(5); setComment(""); }} className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition cursor-pointer">Rate Doctor</button>
                          </>
                        )}
                        {appt.status === "pending" && <span className="text-slate-400 text-xs italic">Waiting approval</span>}
                        {appt.status === "rejected" && <span className="text-rose-400 text-xs italic">Declined</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-black text-xl flex items-center gap-2"><FaStar /> Rate Consultation</h3>
                <p className="text-amber-50 text-sm mt-0.5">With {reviewModal.doctorName}</p>
              </div>
              <button onClick={() => setReviewModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xl font-bold cursor-pointer">×</button>
            </div>
            <form onSubmit={handleReviewSubmit} className="p-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} type="button" onClick={() => setRating(s)} className="text-2xl cursor-pointer">
                      <FaStar className={s <= rating ? "text-amber-400" : "text-slate-200"} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Your Comments</label>
                <textarea rows={4} value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
              </div>
              <button type="submit" disabled={reviewLoading} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-60">
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}


      {prescriptionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100">

  
              <div className="flex items-center justify-between p-6 text-white bg-gradient-to-r from-teal-500 to-emerald-600 rounded-t-3xl">
                <div>
                  <h3 className="flex items-center gap-2 text-2xl font-black">
                    <FaFileMedical />
                    Medical Prescription
                  </h3>
                  <p className="text-sm text-teal-50">
                    MediCare Digital Health Network
                  </p>
                </div>

                <button
                  onClick={() => setPrescriptionModal(null)}
                  className="flex items-center justify-center w-10 h-10 text-xl font-bold rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  ×
                </button>
              </div>

              <div className="p-8">

                <div className="flex justify-between items-start pb-6 border-b border-slate-200">
                  <div>
                    <h2 className="text-3xl font-black text-slate-800">
                      Dr. {prescriptionModal.doctorName}
                    </h2>

                    <p className="text-lg font-semibold text-teal-600">
                      {prescriptionModal.doctorSpecialization}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      Reg. No: MC-2026-
                      {(prescriptionModal.doctorId || "DOC")
                        .substring(0, 4)
                        .toUpperCase()}
                    </p>
                  </div>

                  <div className="text-right">
                    <h3 className="text-xl font-bold text-slate-700">
                      MediCare Care Point
                    </h3>

                    <p className="text-sm text-slate-500">
                      Telemedicine Consultation
                    </p>

                    <p className="text-sm text-slate-500">
                      support@medicare.com
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 my-6 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Patient Name
                    </p>

                    <h4 className="text-xl font-bold text-slate-800 mt-1">
                      {prescriptionModal.patientName}
                    </h4>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Date Issued
                    </p>

                    <h4 className="text-xl font-semibold text-slate-700 mt-1">
                      {prescriptionModal.date}
                    </h4>
                  </div>

                  <div className="md:col-span-2 border-t pt-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Symptoms
                    </p>

                    <p className="text-slate-700 mt-2">
                      {prescriptionModal.symptoms ||
                        "General Checkup / Consultation"}
                    </p>
                  </div>
                </div>

                <div className="relative mt-10">
                  <span className="absolute -top-6 left-0 text-8xl font-black text-teal-100 select-none">
                    Rx
                  </span>

                  <div className="pt-12">
                    <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
                      Medications & Dosage Instructions
                    </h4>

                    <div className="p-6 min-h-[250px] whitespace-pre-wrap text-base leading-relaxed text-slate-800 bg-teal-50/40 border border-teal-100 rounded-2xl">
                      {prescriptionModal.prescription}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mt-10 pt-8 border-t border-slate-200">

                  <div>
                    <p className="text-xs text-slate-400">
                      * This is a computer generated prescription.
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Please follow the doctor's instructions carefully.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-48 border-b border-slate-400 mx-auto"></div>

                    <p className="mt-2 font-bold text-slate-700">
                      Authorized Signature
                    </p>

                    <p className="text-sm text-slate-500">
                      Dr. {prescriptionModal.doctorName}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-3 font-semibold border border-slate-300 rounded-xl hover:bg-slate-50 transition"
                  >
                    Print / Save PDF
                  </button>

                  <button
                    onClick={() => setPrescriptionModal(null)}
                    className="px-6 py-3 font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition"
                  >
                    Close
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
