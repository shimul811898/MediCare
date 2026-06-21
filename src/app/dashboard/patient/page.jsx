"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaUser, FaClock, FaStar,
  FaFileInvoiceDollar, 
} from "react-icons/fa";

export default function PatientDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);



  const [reviewingAppointment, setReviewingAppointment] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);


  useEffect(() => {
    if (!isPending) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "patient") {
        router.replace("/dashboard");
      }
    }
  }, [user, isPending, router]);

  useEffect(() => {
    if (user && user.role === "patient") {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try{
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/appointments/patient/${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      setAppointments(data);
       } catch (error) {
      console.error(error);
      toast.error("Error loading appointments.");
    } finally {
      setLoading(false);
    }
  };



  const handleReviewSubmit = async (e) => {
    e.preventDefault();
      setReviewLoading(true);
      const res = await fetch(`http://localhost:5000/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: reviewingAppointment._id,
          doctorId: reviewingAppointment.doctorId,
          patientId: user.id,
          patientName: user.name,
          patientImage: user.image,
          rating,
          comment,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit review");
      toast.success("Review submitted! Thank you.");
      setReviewingAppointment(null);
      setComment("");
      fetchAppointments();
  };

  if (isPending || !user || user.role !== "patient") {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" color="teal" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <Avatar className="w-20 h-20 border-4 border-teal-500">
              <Avatar.Image alt={user.name} src={user.image} />
              <Avatar.Fallback className="bg-teal-500 text-white text-2xl font-bold">
                {user.name?.[0] || "U"}
              </Avatar.Fallback>
            </Avatar>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-3xl font-black text-slate-900">
                  Hello, {user.name}!
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 self-center sm:self-auto">
                  <FaUser className="text-xs" /> patient
                </span>
              </div>
              <p className="text-slate-500 mt-1 text-sm">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/my-Profile")}
            className="px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition cursor-pointer"
          >
            View Profile
          </button>
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-800">Your Appointments</h2>
              <p className="text-slate-500 text-sm">Keep track of your medical visits and consulting statuses</p>
            </div>
            <button
              onClick={() => router.push("/find-doctors")}
              className="px-5 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-teal-500/10 cursor-pointer"
            >
              Book New Appointment
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Spinner size="md" color="teal" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-semibold mb-2">No appointments scheduled.</p>
              <p className="text-slate-400 text-xs">Search for a doctor and book a slot to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 font-bold">Doctor Name</th>
                    <th className="py-4 font-bold">Specialization</th>
                    <th className="py-4 font-bold">Date & Time</th>
                    <th className="py-4 font-bold">Fee</th>
                    <th className="py-4 font-bold">Status</th>
                    <th className="py-4 font-bold">Payment</th>
                    <th className="py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700 text-sm">
                  {appointments.map((appt) => (
                    <tr key={appt._id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 font-bold text-slate-800">{appt.doctorName}</td>
                      <td className="py-4 text-teal-600 font-semibold">{appt.doctorSpecialization}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                          <FaClock className="text-slate-400 text-xs" /> {appt.date} ({appt.timeSlot})
                        </div>
                      </td>
                      <td className="py-4 font-bold">{appt.fee} BDT</td>
                      <td className="py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                          appt.status === "approved" ? "bg-teal-50 text-teal-700 border border-teal-100" :
                          appt.status === "completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                          appt.status === "rejected" ? "bg-rose-50 text-rose-700 border border-rose-100" :
                          "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                          appt.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {appt.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {appt.paymentStatus === "unpaid" && (
                          <button
                            onClick={() => router.push(`/payment?appointmentId=${appt._id}`)}
                            className="px-3 py-1.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-xs font-bold rounded-lg transition-all shadow shadow-teal-500/10 cursor-pointer"
                          >
                            Pay Fee
                          </button>
                        )}
                        {appt.status === "completed" && (
                          <button
                            onClick={() => setReviewingAppointment(appt)}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-all shadow shadow-amber-500/10 cursor-pointer"
                          >
                            Review Doctor
                          </button>
                        )}
                        {appt.status === "pending" && (
                          <span className="text-slate-400 text-xs italic">Waiting approval</span>
                        )}
                        {appt.status === "rejected" && (
                          <span className="text-rose-400 text-xs italic">Declined by doctor</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>


      {reviewingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-black text-xl flex items-center gap-2">
                  <FaStar /> Rate Consultation
                </h3>
                <p className="text-amber-50 text-sm mt-0.5">Share your experience with {reviewingAppointment.doctorName}</p>
              </div>
              <button
                onClick={() => setReviewingAppointment(null)}
                className="text-white/80 hover:text-white text-2xl font-bold bg-white/10 hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-2xl cursor-pointer focus:outline-none"
                    >
                      <FaStar className={star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Review / Comments</label>
                <textarea
                  rows={4}
                  placeholder="Explain how your appointment went..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={reviewLoading}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/10 transition cursor-pointer disabled:opacity-50"
              >
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

