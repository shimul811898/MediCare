"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function PatientProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", gender: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !user) router.push("/login");
    if (!isPending && user?.role !== "patient") router.replace("/dashboard");
  }, [user, isPending]);

  useEffect(() => {
    if (user) setForm({ name: user.name || "", phone: user.phone || "", gender: user.gender || "" });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authClient.updateUser({ name: form.name });
      toast.success("Profile updated!");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (isPending || !user) return <div className="flex justify-center py-20"><Spinner size="lg" color="teal" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your personal information</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-28 relative">
          <div className="absolute -bottom-10 left-8">
            <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
              <Avatar.Image src={user.image || undefined} alt={user.name} />
              <Avatar.Fallback className="bg-blue-500 text-white text-2xl font-black">
                {user.name?.[0] || "P"}
              </Avatar.Fallback>
            </Avatar>
          </div>
        </div>

        <div className="pt-14 px-4 sm:px-8 pb-6 sm:pb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">{user.name}</h2>
              <span className="inline-block mt-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase border border-blue-100">Patient</span>
            </div>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition cursor-pointer">
                <FaEdit className="text-xs" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition cursor-pointer">
                  <FaTimes className="text-xs" /> Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition cursor-pointer disabled:opacity-60">
                  <FaSave className="text-xs" /> {saving ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2"><FaUser className="text-blue-500" /> Full Name</label>
                {editing ? (
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                ) : (
                  <p className="text-slate-800 font-semibold text-sm">{user.name || "—"}</p>
                )}
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2"><FaEnvelope className="text-blue-500" /> Email</label>
                <p className="text-slate-800 font-semibold text-sm">{user.email || "—"}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2"><FaPhone className="text-blue-500" /> Phone</label>
                {editing ? (
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Add phone number" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                ) : (
                  <p className="text-slate-800 font-semibold text-sm">{user.phone || "Not set"}</p>
                )}
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2"><FaVenusMars className="text-blue-500" /> Gender</label>
                {editing ? (
                  <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-slate-800 font-semibold text-sm">{user.gender || "Not set"}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
