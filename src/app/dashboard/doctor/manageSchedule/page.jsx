"use client";

import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaMinus, FaSave, FaClock } from "react-icons/fa";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function ManageSchedulePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tempDay, setTempDay] = useState("Monday");
  const [tempSlots, setTempSlots] = useState("");

  useEffect(() => {
    if (!isPending && !user) router.push("/login");
    if (!isPending && user?.role !== "doctor") router.replace("/dashboard");
  }, [user, isPending]);

  useEffect(() => {
    if (user?.role === "doctor") fetchSchedule();
  }, [user]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/doctors/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setSchedules(data.schedules || []);
      }
    } catch { } finally { setLoading(false); }
  };

  const handleAddSchedule = () => {
    if (!tempSlots.trim()) { toast.error("Please enter at least one time slot."); return; }
    const slotsArray = tempSlots.split(",").map(s => s.trim()).filter(Boolean);
    const idx = schedules.findIndex(s => s.day === tempDay);
    const updated = [...schedules];
    if (idx > -1) {
      updated[idx] = { day: tempDay, timeSlots: [...new Set([...updated[idx].timeSlots, ...slotsArray])] };
    } else {
      updated.push({ day: tempDay, timeSlots: slotsArray });
    }
    setSchedules(updated);
    setTempSlots("");
    toast.success(`Schedule updated for ${tempDay}`);
  };

  const handleRemoveDay = (day) => setSchedules(schedules.filter(s => s.day !== day));

  const handleRemoveSlot = (day, slot) => {
    const updated = schedules.map(s => s.day === day ? { ...s, timeSlots: s.timeSlots.filter(t => t !== slot) } : s).filter(s => s.timeSlots.length > 0);
    setSchedules(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/doctors/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, schedules }),
      });
      if (!res.ok) throw new Error();
      toast.success("Schedule saved successfully!");
    } catch { toast.error("Failed to save schedule."); }
    finally { setSaving(false); }
  };

  if (isPending || !user || loading) return <div className="flex justify-center py-20"><Spinner size="lg" color="teal" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Manage Schedule</h1>
          <p className="text-slate-500 text-sm mt-1">Set your availability for patients to book</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold rounded-xl text-sm shadow-md shadow-teal-500/10 transition cursor-pointer disabled:opacity-60">
          <FaSave /> {saving ? "Saving..." : "Save Schedule"}
        </button>
      </div>

      {/* Add Schedule Form */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><FaPlus className="text-teal-500 text-sm" /> Add Availability</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Day</label>
            <select value={tempDay} onChange={e => setTempDay(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Time Slots (comma separated)</label>
            <input value={tempSlots} onChange={e => setTempSlots(e.target.value)} placeholder="e.g. 9:00 AM, 10:00 AM, 11:00 AM" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
          </div>
          <button onClick={handleAddSchedule} className="flex items-center justify-center gap-2 px-5 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl text-sm transition cursor-pointer">
            <FaPlus /> Add
          </button>
        </div>
      </div>


      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><FaClock className="text-teal-500 text-sm" /> Current Schedule</h2>
        {schedules.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-slate-500 font-semibold text-sm">No schedule set yet.</p>
            <p className="text-slate-400 text-xs mt-1">Add your availability above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {DAYS.filter(d => schedules.some(s => s.day === d)).map(day => {
              const s = schedules.find(sc => sc.day === day);
              return (
                <div key={day} className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-black text-slate-800">{day}</h3>
                    <button onClick={() => handleRemoveDay(day)} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold hover:bg-rose-100 transition cursor-pointer">
                      <FaMinus className="text-[10px]" /> Remove Day
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {s.timeSlots.map(slot => (
                      <span key={slot} className="flex items-center gap-2 bg-teal-50 border border-teal-100 text-teal-700 px-3 py-1.5 rounded-xl text-sm font-semibold">
                        {slot}
                        <button onClick={() => handleRemoveSlot(day, slot)} className="text-teal-400 hover:text-rose-500 transition cursor-pointer text-xs">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
