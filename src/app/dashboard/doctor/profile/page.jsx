"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaHospital, FaStethoscope, FaDollarSign, FaEdit, FaSave, FaTimes, FaCamera } from "react-icons/fa";

export default function DoctorProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({ specialization: "", hospital: "", fee: 0, bio: "" });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tempImage, setTempImage] = useState(null);

  useEffect(() => {
    if (!isPending && !user) router.push("/login");
    if (!isPending && user?.role !== "doctor") router.replace("/dashboard");
  }, [user, isPending, router]);

  useEffect(() => {
    if (user?.role === "doctor") fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/doctors/${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setProfile({ 
          specialization: data.specialization || "", 
          hospital: data.hospital || "", 
          fee: data.fee || 0, 
          bio: data.bio || "" 
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally { 
      setLoading(false); 
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const finalImageUrl = tempImage || user?.image;

      await Promise.all([
        authClient.updateUser({ 
          name: user?.name,
          image: finalImageUrl 
        }),
        fetch("http://localhost:5000/api/doctors/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?.id, ...profile }),
        })
      ]);

      toast.success("Profile saved!");
      setEditing(false);
      setTempImage(null);
    } catch (error) { 
      toast.error("Failed to save profile."); 
    } finally { 
      setSaving(false); 
    }
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
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            
            <button
              onClick={() => editing && fileInputRef.current?.click()}
              className={`relative group rounded-full border-4 border-white shadow-lg overflow-hidden ${editing ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <Avatar className="w-20 h-20 transition group-hover:opacity-80">
                <Avatar.Image src={tempImage || user.image} alt={user.name || "Doctor"} />
                <Avatar.Fallback className="bg-teal-500 text-white text-2xl font-black">
                  {user.name?.[0] || "D"}
                </Avatar.Fallback>
              </Avatar>
              {editing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 rounded-full">
                  <FaCamera className="text-white text-xl" />
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="pt-14 px-8 pb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Dr. {user.name}</h2>
              <p className="text-teal-600 font-semibold text-sm mt-0.5">{profile.specialization || "Specialist"}</p>
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
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Icon className="text-teal-500" /> {label}
                </label>
                {editing && field ? (
                  <input
                    type={type || "text"}
                    value={profile[field] || ""}
                    placeholder={placeholder}
                    onChange={(e) => setProfile(p => ({ ...p, [field]: type === "number" ? Number(e.target.value) : e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                ) : (
                  <p className="text-slate-800 font-semibold text-sm">{value || "—"}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}