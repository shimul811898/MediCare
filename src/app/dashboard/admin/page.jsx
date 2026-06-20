
"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaUser, FaUserMd, FaShieldAlt, FaCalendarCheck, FaTrash,
  FaChartLine, 
} from "react-icons/fa";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    verifiedDoctors: 0,
    totalAppointments: 0,
    totalRevenue: 0,
  });

  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("verify"); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "admin") {
        router.replace("/dashboard");
      }
    }
  }, [user, isPending, router]);

  const fetchStats = async () => {
      const res = await fetch("http://localhost:5000/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }

  };

  const fetchDoctors = async () => {
      const res = await fetch("http://localhost:5000/api/doctors-all/admin");
      if (res.ok) {
        const data = await res.json();
        setDoctors(data);
      }
  };

  const fetchUsers = async () => {
      const res = await fetch("http://localhost:5000/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
  };

  const fetchAppointments = async () => {
      const res = await fetch("http://localhost:5000/api/appointments");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchDoctors(),
        fetchUsers(),
        fetchAppointments()
      ]);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchAllData();
    }
  }, [user]);

  const handleVerifyDoctor = async (id, currentStatus) => {
      const newStatus = !currentStatus;
      const res = await fetch(`http://localhost:5000/api/doctors/${id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to change verification");
      toast.success(newStatus ? "Doctor verified successfully!" : "Doctor unverified successfully!");
      fetchDoctors();
      fetchStats();
  
  };

  const handleUpdateUserRole = async (id, role) => {
      const res = await fetch(`http://localhost:5000/api/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) throw new Error("Failed to change role");
      toast.success(`Role changed to ${role}`);
      fetchUsers();
      fetchDoctors();
      fetchStats();
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user? All bookings and doctor profile data will be erased.")) return;
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete user");
      toast.success("User deleted successfully!");
      fetchUsers();
      fetchDoctors();
      fetchStats();
  };

  if (isPending || !user || user.role !== "admin") {
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
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 self-center sm:self-auto">
                  <FaShieldAlt className="text-xs" /> admin
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center text-lg">
              <FaUser />
            </div>
            <div>
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Patients</h3>
              <p className="text-slate-800 text-2xl font-black mt-1">{stats.totalPatients}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center text-lg">
              <FaUserMd />
            </div>
            <div>
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Doctors</h3>
              <p className="text-slate-800 text-2xl font-black mt-1">
                {stats.totalDoctors} <span className="text-slate-400 text-xs font-normal">({stats.verifiedDoctors} verified)</span>
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-lg">
              <FaCalendarCheck />
            </div>
            <div>
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Bookings</h3>
              <p className="text-slate-800 text-2xl font-black mt-1">{stats.totalAppointments}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center text-lg">
              <FaChartLine />
            </div>
            <div>
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Revenue</h3>
              <p className="text-slate-800 text-2xl font-black mt-1">{stats.totalRevenue} BDT</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="flex border-b border-slate-100 pb-4 mb-6 gap-6 overflow-x-auto scrollbar-none">
            {[
              { id: "verify", label: "Verify Doctors" },
              { id: "users", label: "Manage Users" },
              { id: "appointments", label: "Monitor Appointments" },
              { id: "payments", label: "Payments Monitor" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2.5 font-bold text-sm tracking-wide transition cursor-pointer relative whitespace-nowrap ${
                  activeTab === tab.id ? "text-teal-500" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Spinner size="md" color="teal" />
            </div>
          ) : (
            <div>
              {activeTab === "verify" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="py-4">Doctor</th>
                        <th className="py-4">Specialization</th>
                        <th className="py-4">Hospital</th>
                        <th className="py-4">Fee</th>
                        <th className="py-4">Status</th>
                        <th className="py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700 text-sm">
                      {doctors.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 italic">No doctors configured in DB yet.</td>
                        </tr>
                      ) : (
                        doctors.map((doc) => {
                          const isVerified = doc.verified || doc.verificationStatus === "verified" || doc.verificationStatus === true;
                          const docName = doc.doctorName || doc.name || "Doctor";
                          const docImage = doc.profileImage || doc.image;
                          const docHospital = doc.hospitalName || doc.hospital || "Unset";
                          const docFee = doc.consultationFee || doc.fee || 0;
                          return (
                            <tr key={doc._id} className="hover:bg-slate-50/50 transition">
                              <td className="py-4 flex items-center gap-3">
                                <Avatar className="w-10 h-10 border border-slate-100">
                                  <Avatar.Image src={docImage} alt={docName} />
                                  <Avatar.Fallback className="bg-teal-500 text-white font-bold">{docName?.[0]}</Avatar.Fallback>
                                </Avatar>
                                <div>
                                  <div className="font-bold text-slate-800">{docName}</div>
                                  <div className="text-xs text-slate-400">{doc.email}</div>
                                </div>
                              </td>
                              <td className="py-4 text-teal-600 font-semibold">{doc.specialization || "Unset"}</td>
                              <td className="py-4">{docHospital}</td>
                              <td className="py-4 font-bold">{docFee} BDT</td>
                              <td className="py-4">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                                  isVerified ? "bg-teal-50 text-teal-700 border border-teal-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                                }`}>
                                  {isVerified ? "Verified" : "Pending"}
                                </span>
                              </td>
                              <td className="py-4 text-right">
                                <button
                                  onClick={() => handleVerifyDoctor(doc._id, isVerified)}
                                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shadow cursor-pointer ${
                                    isVerified
                                      ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-sm"
                                      : "bg-teal-500 hover:bg-teal-600 text-white shadow-teal-500/10"
                                  }`}
                                >
                                  {isVerified ? "Unverify" : "Verify"}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === "users" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="py-4">User</th>
                        <th className="py-4">Email</th>
                        <th className="py-4">Role</th>
                        <th className="py-4">Modify Role</th>
                        <th className="py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700 text-sm">
                      {users.map((usr) => {
                        const userName = usr.name || "User";
                        const userImage = usr.photo || usr.image;
                        return (
                          <tr key={usr.id || usr._id} className="hover:bg-slate-50/50 transition">
                            <td className="py-4 flex items-center gap-3">
                              <Avatar className="w-10 h-10 border border-slate-100">
                                <Avatar.Image src={userImage} alt={userName} />
                                <Avatar.Fallback className="bg-slate-500 text-white font-bold">{userName?.[0]}</Avatar.Fallback>
                              </Avatar>
                              <div className="font-bold text-slate-800">{userName}</div>
                            </td>
                            <td className="py-4">{usr.email}</td>
                            <td className="py-4">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                                usr.role === "admin" ? "bg-red-50 text-red-700 border border-red-100" :
                                usr.role === "doctor" ? "bg-teal-50 text-teal-700 border border-teal-100" :
                                "bg-blue-50 text-blue-700 border border-blue-100"
                              }`}>
                                {usr.role || "patient"}
                              </span>
                            </td>
                            <td className="py-4">
                              <select
                                value={usr.role || "patient"}
                                onChange={(e) => handleUpdateUserRole(usr.id || usr._id, e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none"
                              >
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="py-4 text-right">
                              <button
                                onClick={() => handleDeleteUser(usr.id || usr._id)}
                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Delete User"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === "appointments" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="py-4">Patient</th>
                        <th className="py-4">Doctor</th>
                        <th className="py-4">Date & Time</th>
                        <th className="py-4">Fee</th>
                        <th className="py-4">Status</th>
                        <th className="py-4">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700 text-sm">
                      {appointments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 italic">No appointments booked yet.</td>
                        </tr>
                      ) : (
                        appointments.map((appt) => {
                          const apptDate = appt.appointmentDate || appt.date;
                          const apptTime = appt.appointmentTime || appt.timeSlot;
                          const apptStatus = appt.appointmentStatus || appt.status || "pending";
                          const apptFee = appt.fee || appt.amount || 0;
                          return (
                            <tr key={appt._id} className="hover:bg-slate-50/50 transition">
                              <td className="py-4">
                                <div className="font-bold text-slate-800">{appt.patientName}</div>
                                <div className="text-xs text-slate-400">{appt.patientEmail}</div>
                              </td>
                              <td className="py-4">
                                <div className="font-semibold text-slate-700">{appt.doctorName}</div>
                                <div className="text-xs text-slate-400">{appt.doctorSpecialization}</div>
                              </td>
                              <td className="py-4 text-slate-600">
                                <div>{apptDate ? new Date(apptDate).toLocaleDateString() : "Unset"}</div>
                                <div className="text-xs text-slate-400">{apptTime}</div>
                              </td>
                              <td className="py-4 font-bold">{apptFee} BDT</td>
                              <td className="py-4">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                                  apptStatus === "approved" || apptStatus === "accepted" ? "bg-teal-50 text-teal-700 border border-teal-100" :
                                  apptStatus === "completed" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                                  apptStatus === "rejected" || apptStatus === "cancelled" ? "bg-rose-50 text-rose-700 border border-rose-100" :
                                  "bg-amber-50 text-amber-700 border border-amber-100"
                                }`}>
                                  {apptStatus}
                                </span>
                              </td>
                              <td className="py-4">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                                  appt.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-50 text-slate-600 border border-slate-200"
                                }`}>
                                  {appt.paymentStatus}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === "payments" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="py-4">Transaction ID</th>
                        <th className="py-4">Patient Name</th>
                        <th className="py-4">Doctor Name</th>
                        <th className="py-4">Consultation Fee</th>
                        <th className="py-4">Payment Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700 text-sm">
                      {appointments.filter(appt => appt.paymentStatus === "paid").length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400 italic">No paid transactions logged yet.</td>
                        </tr>
                      ) : (
                        appointments.filter(appt => appt.paymentStatus === "paid").map((appt) => {
                          const apptFee = appt.fee || appt.amount || 0;
                          const payDate = appt.paidAt || appt.paymentDate || appt.createdAt;
                          return (
                            <tr key={appt._id} className="hover:bg-slate-50/50 transition">
                              <td className="py-4 font-mono text-xs font-bold text-teal-600">{appt.transactionId}</td>
                              <td className="py-4 font-semibold text-slate-800">{appt.patientName}</td>
                              <td className="py-4 text-slate-700">{appt.doctorName}</td>
                              <td className="py-4 font-black">{apptFee} BDT</td>
                              <td className="py-4 text-slate-500">
                                {payDate ? new Date(payDate).toLocaleDateString() : "Unset"}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




