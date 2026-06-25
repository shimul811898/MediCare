"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaHospital, FaStethoscope, FaDollarSign, FaEdit, FaSave, FaTimes, FaLink } from "react-icons/fa";

export default function DoctorProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [profile, setProfile] = useState({ specialization: "", hospital: "", fee: 0, bio: "" });
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !user) router.push("/login");
    if (!isPending && user?.role !== "doctor") router.replace("/dashboard");
  }, [user, isPending, router]);

  useEffect(() => {
    if (user?.role === "doctor") {
      fetchProfile();
      setName(user.name || "");
      setImage(user.image || "");
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctors/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setProfile({
          specialization: data.specialization || "",
          hospital: data.hospital || "",
          fee: data.fee || 0,
          bio: data.bio || ""
        });
      }
    } catch { } finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        authClient.updateUser({ name, image }),
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctors/profile `, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, name, image, ...profile }),
        })
      ]);
      toast.success("Profile saved!");
      setEditing(false);
      router.refresh();
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
            {image ? (
              <img src={image} alt="Doctor" referrerPolicy="no-referrer" className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover bg-white" />
            ) : (
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-teal-600 text-white flex items-center justify-center text-3xl font-black">
                {name?.charAt(0) || "D"}
              </div>
            )}
          </div>
        </div>

        <div className="pt-14 px-4 sm:px-8 pb-6 sm:pb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Dr. {name}</h2>
              <p className="text-teal-600 font-semibold text-sm mt-0.5">{profile.specialization || "Specialist"}</p>
              <span className="inline-block mt-1 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-black uppercase border border-teal-100">Doctor</span>
            </div>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition cursor-pointer">
                <FaEdit className="text-xs" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => { setEditing(false); setName(user.name || ""); setImage(user.image || ""); }} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition cursor-pointer"><FaTimes className="text-xs" /> Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition cursor-pointer disabled:opacity-60"><FaSave className="text-xs" /> {saving ? "Saving..." : "Save"}</button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2"><FaUser className="text-teal-500" /> Full Name</label>
              {editing ? (
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
              ) : (
                <p className="text-slate-800 font-semibold text-sm">{name || "—"}</p>
              )}
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2"><FaEnvelope className="text-teal-500" /> Email</label>
              <p className="text-slate-800 font-semibold text-sm">{user.email}</p>
            </div>


            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 col-span-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2"><FaLink className="text-teal-500" /> Profile Image URL</label>
              {editing ? (
                <input type="text" value={image} onChange={e => setImage(e.target.value)} placeholder="https://example.com/doctor-photo.jpg"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
              ) : (
                <p className="text-slate-800 font-semibold text-sm truncate">{image || "No image URL set"}</p>
              )}
            </div>


            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2"><FaStethoscope className="text-teal-500" /> Specialization</label>
              {editing ? (
                <input type="text" value={profile.specialization} placeholder="e.g. Cardiologist" onChange={e => setProfile(p => ({ ...p, specialization: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
              ) : (
                <p className="text-slate-800 font-semibold text-sm">{profile.specialization || "—"}</p>
              )}
            </div>


            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2"><FaHospital className="text-teal-500" /> Hospital / Clinic</label>
              {editing ? (
                <input type="text" value={profile.hospital} placeholder="Hospital name" onChange={e => setProfile(p => ({ ...p, hospital: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
              ) : (
                <p className="text-slate-800 font-semibold text-sm">{profile.hospital || "—"}</p>
              )}
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                <FaDollarSign className="text-teal-500" />
                Consultation Fee (BDT)
              </label>

              {editing ? (
                <input
                  type="number"
                  value={profile.fee || ""}
                  placeholder="500"
                  onChange={(e) =>
                    setProfile((p) => ({
                      ...p,
                      fee: Number(e.target.value),
                    }))
                  }
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              ) : (
                <p className="text-slate-800 font-semibold text-sm">
                  {profile.fee ? `${profile.fee} BDT` : "Not Set"}
                </p>
              )}
            </div>
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
