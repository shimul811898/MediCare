"use client";

import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";

export default function MyReviewsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !user) router.push("/login");
    if (!isPending && user?.role !== "patient") router.replace("/dashboard");
  }, [user, isPending]);

  useEffect(() => {
    if (user?.role === "patient") fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const apptRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/appointments/patient/${user.id}`);
      const appointments = await apptRes.json();
      const doctorIds = [...new Set(appointments.filter(a => a.status === "completed").map(a => a.doctorId))];
      const allReviews = [];
      for (const docId of doctorIds) {
        const revRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/reviews/${docId}`);
        const revData = await revRes.json();
        const myRevs = revData.filter(r => r.patientId === user.id);
        allReviews.push(...myRevs.map(r => ({
          ...r,
          doctorName: appointments.find(a => a.doctorId === docId)?.doctorName || "Doctor",
          doctorSpecialization: appointments.find(a => a.doctorId === docId)?.doctorSpecialization || "",
        })));
      }
      setReviews(allReviews);
    } catch { toast.error("Failed to load reviews."); }
    finally { setLoading(false); }
  };

  if (isPending || !user) return <div className="flex justify-center py-20"><Spinner size="lg" color="teal" /></div>;

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">My Reviews</h1>
        <p className="text-slate-500 text-sm mt-1">Feedback you've given to doctors</p>
      </div>

      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg flex items-center gap-6">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-black">{avgRating}</div>
        <div>
          <div className="flex gap-1 mb-1">
            {[1,2,3,4,5].map(s => <FaStar key={s} className={s <= Math.round(avgRating) ? "text-white" : "text-white/30"} />)}
          </div>
          <p className="font-bold text-white/80 text-sm">Average Rating Given</p>
          <p className="text-white/60 text-xs">{reviews.length} review{reviews.length !== 1 ? "s" : ""} submitted</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="md" color="teal" /></div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm text-center py-20">
          <div className="text-5xl mb-4">⭐</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Reviews Yet</h3>
          <p className="text-slate-500 text-sm">After completing appointments, you can rate your doctors.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map(r => (
            <div key={r._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-black text-slate-800 text-lg">{r.doctorName}</h3>
                  <p className="text-teal-600 font-semibold text-sm">{r.doctorSpecialization}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl">
                  <FaStar className="text-amber-500 text-sm" />
                  <span className="font-black text-amber-700">{r.rating}/5</span>
                </div>
              </div>
              {r.comment && <p className="text-slate-600 text-sm bg-slate-50 rounded-xl p-4 border border-slate-100 leading-relaxed">"{r.comment}"</p>}
              <p className="text-slate-400 text-xs mt-3">{new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
