"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaUserMd, FaClock, FaEdit, FaPlus, FaMinus, FaCheckCircle
} from "react-icons/fa";

export default function DoctorDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [profile, setProfile] = useState({
    specialization: "",
    hospital: "",
    fee: 0,
    bio: "",
    schedules: [],
  });

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const [tempDay, setTempDay] = useState("Monday");
  const [tempSlots, setTempSlots] = useState("");

  useEffect(() => {
    if (!isPending) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "doctor") {
        router.replace("/dashboard");
      }
    }
  }, [user, isPending, router]);

  useEffect(() => {
    if (user && user.role === "doctor") {
      fetchProfile();
      fetchAppointments();
    }
  }, [user]);

  const fetchProfile = async () => {
 
      const res = await fetch(`http://localhost:5000/api/doctors/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setProfile({
          specialization: data.specialization || "",
          hospital: data.hospital || "",
          fee: data.fee || 0,
          bio: data.bio || "",
          schedules: data.schedules || [],
        });
      }
 
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/appointments/doctor/${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error(err);
      toast.error("Error loading appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
 
      setSaveLoading(true);
      const res = await fetch("http://localhost:5000/api/doctors/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...profile }),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      toast.success("Professional profile saved successfully!");
   
  };

  const handleAddSchedule = () => {
    if (!tempSlots.trim()) {
      toast.error("Please enter at least one time slot.");
      return;
    }

    const slotsArray = tempSlots.split(",").map(s => s.trim()).filter(Boolean);
    const existingIndex = profile.schedules.findIndex(s => s.day === tempDay);

    let updatedSchedules = [...profile.schedules];

    if (existingIndex > -1) {
      updatedSchedules[existingIndex] = {
        day: tempDay,
        timeSlots: [...new Set([...updatedSchedules[existingIndex].timeSlots, ...slotsArray])]
      };
    } else {
      updatedSchedules.push({
        day: tempDay,
        timeSlots: slotsArray
      });
    }

    setProfile({ ...profile, schedules: updatedSchedules });
    setTempSlots("");
    toast.success(`Schedule added for ${tempDay}`);
  };

  const handleRemoveScheduleDay = (day) => {
    const updated = profile.schedules.filter(s => s.day !== day);
    setProfile({ ...profile, schedules: updated });
  };

  const handleUpdateApptStatus = async (id, status) => {
  
      const res = await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`Appointment marked as ${status}`);
      fetchAppointments();
    
  };

  if (isPending || !user || user.role !== "doctor") {
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
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-teal-50 text-teal-600 border border-teal-100 self-center sm:self-auto">
                  <FaUserMd className="text-xs" /> doctor
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-6">
                <FaEdit className="text-teal-500" /> Professional Details
              </h2>

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiologist, Pediatrician"
                    value={profile.specialization}
                    onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                    className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hospital / Clinic</label>
                  <input
                    type="text"
                    placeholder="e.g. Square Hospital, Dhaka"
                    value={profile.hospital}
                    onChange={(e) => setProfile({ ...profile, hospital: e.target.value })}
                    className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Consultation Fee (BDT)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1000"
                    value={profile.fee}
                    onChange={(e) => setProfile({ ...profile, fee: e.target.value })}
                    className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio / Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your medical experience..."
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saveLoading}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl shadow-md shadow-teal-500/10 transition cursor-pointer disabled:opacity-50 text-sm"
                >
                  {saveLoading ? "Saving Details..." : "Save Details"}
                </button>
              </form>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-6">
                <FaClock className="text-teal-500" /> Manage Schedules
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Day of Week</label>
                  <select
                    value={tempDay}
                    onChange={(e) => setTempDay(e.target.value)}
                    className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                  >
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time Slots (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. 09:00 AM, 10:00 AM, 04:00 PM"
                    value={tempSlots}
                    onChange={(e) => setTempSlots(e.target.value)}
                    className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm placeholder:text-slate-400"
                  />
                </div>

                <button
                  onClick={handleAddSchedule}
                  className="w-full py-3 border border-dashed border-teal-300 text-teal-600 hover:bg-teal-50 font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  <FaPlus className="text-xs" /> Add/Update Day Schedule
                </button>

                {profile.schedules.length > 0 && (
                  <div className="border-t border-slate-100 pt-4 mt-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Configured Schedules</h4>
                    {profile.schedules.map((s, idx) => (
                      <div key={idx} className="flex justify-between items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>
                          <span className="font-bold text-sm text-slate-800">{s.day}</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {s.timeSlots.map((ts, i) => (
                              <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                                {ts}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveScheduleDay(s.day)}
                          className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer transition text-xs"
                        >
                          <FaMinus />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-black text-slate-800 mb-6">Appointment Requests</h2>

              {loading ? (
                <div className="flex justify-center py-10">
                  <Spinner size="md" color="teal" />
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-500 font-semibold mb-2">No appointments scheduled by patients yet.</p>
                  <p className="text-slate-400 text-xs">Patients will book slots once you configure schedules and are verified by the Admin.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="py-4 font-bold">Patient Info</th>
                        <th className="py-4 font-bold">Date & Slot</th>
                        <th className="py-4 font-bold">Fee</th>
                        <th className="py-4 font-bold">Status</th>
                        <th className="py-4 font-bold">Payment</th>
                        <th className="py-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700 text-sm">
                      {appointments.map((appt) => (
                        <tr key={appt._id} className="hover:bg-slate-50/50 transition">
                          <td className="py-4">
                            <div className="font-bold text-slate-800">{appt.patientName}</div>
                            <div className="text-xs text-slate-400">{appt.patientEmail}</div>
                          </td>
                          <td className="py-4 font-medium">
                            <div>{appt.date}</div>
                            <div className="text-xs text-slate-500">{appt.timeSlot}</div>
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
                          <td className="py-4 text-right space-x-2">
                            {appt.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleUpdateApptStatus(appt._id, "approved")}
                                  className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition shadow shadow-emerald-500/10 cursor-pointer"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleUpdateApptStatus(appt._id, "rejected")}
                                  className="px-2.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition shadow shadow-rose-500/10 cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {appt.status === "approved" && appt.paymentStatus === "paid" && (
                              <button
                                onClick={() => handleUpdateApptStatus(appt._id, "completed")}
                                className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-xs font-bold transition shadow shadow-teal-500/10 cursor-pointer"
                              >
                                Mark Consulted
                              </button>
                            )}
                            {appt.status === "approved" && appt.paymentStatus === "unpaid" && (
                              <span className="text-slate-400 text-xs italic">Waiting patient payment</span>
                            )}
                            {appt.status === "completed" && (
                              <span className="text-emerald-500 text-xs font-bold flex items-center justify-end gap-1">
                                <FaCheckCircle /> Finished
                              </span>
                            )}
                            {appt.status === "rejected" && (
                              <span className="text-rose-500 text-xs italic">Declined</span>
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
        </div>
      </div>
    </div>
  );
}
