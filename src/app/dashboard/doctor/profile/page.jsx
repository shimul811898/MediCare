"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaHospital, FaStethoscope, FaDollarSign, FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function DoctorProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [profile, setProfile] = useState({ specialization: "", hospital: "", fee: 0, bio: "" });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !user) router.push("/login");
    if (!isPending && user?.role !== "doctor") router.replace("/dashboard");
  }, [user, isPending]);

  useEffect(() => {
    if (user?.role === "doctor") fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/doctors/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setProfile({ specialization: data.specialization || "", hospital: data.hospital || "", fee: data.fee || 0, bio: data.bio || "" });
      }
    } catch { } finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        authClient.updateUser({ name: user.name }),
        fetch("http://localhost:5000/api/doctors/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, ...profile }),
        })
      ]);
      toast.success("Profile saved!");
      setEditing(false);
    } catch { toast.error("Failed to save profile."); }
    finally { setSaving(false); }
  };

  if (isPending || !user || loading) return <div className="flex justify-center py-20"><Spinner size="lg" color="teal" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Your professional information visible to patients</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-700 h-28 relative">
          <div className="absolute -bottom-10 left-8">
            <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
              <Avatar.Image src={user.image} alt={user.name} />
              <Avatar.Fallback className="bg-teal-500 text-white text-2xl font-black">{user.name?.[0] || "D"}</Avatar.Fallback>
            </Avatar>
          </div>
        </div>

        <div className="pt-14 px-8 pb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Dr. {user.name}</h2>
              <p className="text-teal-600 font-semibold text-sm mt-0.5">{profile.specialization || "Specialist"}</p>
              <span className="inline-block mt-1 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-black uppercase border border-teal-100">Doctor</span>
            </div>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition cursor-pointer">
                <FaEdit className="text-xs" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition cursor-pointer"><FaTimes className="text-xs" /> Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition cursor-pointer disabled:opacity-60"><FaSave className="text-xs" /> {saving ? "Saving..." : "Save"}</button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: FaEnvelope, label: "Email", value: user.email, field: null },
              { icon: FaStethoscope, label: "Specialization", value: profile.specialization, field: "specialization", placeholder: "e.g. Cardiologist" },
              { icon: FaHospital, label: "Hospital / Clinic", value: profile.hospital, field: "hospital", placeholder: "Hospital name" },
              { icon: FaDollarSign, label: "Consultation Fee (BDT)", value: profile.fee, field: "fee", type: "number", placeholder: "500" },
            ].map(({ icon: Icon, label, value, field, placeholder, type }) => (
              <div key={label} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2"><Icon className="text-teal-500" /> {label}</label>
                {editing && field ? (
                  <input type={type || "text"} value={profile[field]} placeholder={placeholder} onChange={e => setProfile(p => ({ ...p, [field]: type === "number" ? Number(e.target.value) : e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                ) : (
                  <p className="text-slate-800 font-semibold text-sm">{value || "—"}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2"><FaUser className="text-teal-500" /> Bio</label>
            {editing ? (
              <textarea rows={3} value={profile.bio} placeholder="Tell patients about yourself..." onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
            ) : (
              <p className="text-slate-800 font-semibold text-sm">{profile.bio || "No bio added yet."}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
