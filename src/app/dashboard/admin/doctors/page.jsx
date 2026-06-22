"use client";

import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUserMd, FaCheckCircle, FaTimesCircle, FaStar } from "react-icons/fa";

export default function AdminDoctorsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!isPending && !user) router.push("/login");
    if (!isPending && user?.role !== "admin") router.replace("/dashboard");
  }, [user, isPending]);

  useEffect(() => {
    if (user?.role === "admin") fetchDoctors();
  }, [user]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/doctors-all/admin");
      const data = await res.json();
      setDoctors(data);
    } catch { toast.error("Failed to load doctors."); }
    finally { setLoading(false); }
  };

  const toggleVerify = async (id, currentVerified) => {
    try {
      await fetch(`http://localhost:5000/api/doctors/${id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: !currentVerified }),
      });
      toast.success(`Doctor ${!currentVerified ? "verified" : "unverified"}!`);
      fetchDoctors();
    } catch { toast.error("Failed to update verification."); }
  };

  const handleDeleteDoctor = async (userId) => {
    if (!confirm("Are you sure you want to delete this doctor? This will permanently delete their account, doctor profile, and all their appointments.")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Doctor deleted successfully!");
      fetchDoctors();
    } catch {
      toast.error("Failed to delete doctor.");
    }
  };

  if (isPending || !user) return <div className="flex justify-center py-20"><Spinner size="lg" color="teal" /></div>;

  const filters = ["all", "verified", "unverified"];
  const filtered = filter === "all" ? doctors : filter === "verified" ? doctors.filter(d => d.verified) : doctors.filter(d => !d.verified);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Manage Doctors</h1>
          <p className="text-slate-500 text-sm mt-1">{doctors.filter(d => d.verified).length} verified · {doctors.filter(d => !d.verified).length} pending</p>
        </div>
        <div className="flex gap-2">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer capitalize ${filter === f ? "bg-teal-500 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{f}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="md" color="teal" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm text-center py-20">
          <FaUserMd className="text-5xl text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-semibold">No {filter !== "all" ? filter : ""} doctors found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(doc => (
            <div key={doc._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-lg shrink-0 ${doc.verified ? "bg-gradient-to-br from-teal-500 to-emerald-600" : "bg-gradient-to-br from-slate-400 to-slate-500"}`}>{doc.name?.[0] || "D"}</div>
                <div className="overflow-hidden">
                  <h3 className="font-black text-slate-800 truncate">Dr. {doc.name}</h3>
                  <p className="text-teal-600 font-semibold text-sm">{doc.specialization || "—"}</p>
                  <p className="text-slate-500 text-xs truncate">{doc.hospital || "—"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1 text-slate-600">
                  <FaStar className="text-amber-500 text-xs" />
                  <span className="font-bold">{doc.averageRating || "—"}</span>
                  <span className="text-slate-400 text-xs">({doc.reviewCount || 0})</span>
                </div>
                <span className="font-bold text-slate-800">{doc.fee || 0} BDT</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                {doc.verified ? (
                  <span className="flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full"><FaCheckCircle /> Verified</span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-black text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full"><FaTimesCircle /> Unverified</span>
                )}
                <button onClick={() => toggleVerify(doc._id, doc.verified)} className={`px-4 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${doc.verified ? "bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100" : "bg-teal-500 text-white hover:bg-teal-600"}`}>
                  {doc.verified ? "Unverify" : "Verify"}
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleDeleteDoctor(doc.userId)}
                  className="px-4 py-1.5 rounded-xl text-xs font-black bg-rose-50 hover:bg-rose-600 border border-rose-100 text-rose-600 hover:text-white transition cursor-pointer"
                >
                  Delete Doctor
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
