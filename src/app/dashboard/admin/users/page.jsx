"use client";

import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUsers, FaSearch, FaTrash, FaUserShield } from "react-icons/fa";

const ROLE_STYLES = {
  patient: "bg-blue-50 text-blue-700 border-blue-100",
  doctor:  "bg-teal-50 text-teal-700 border-teal-100",
  admin:   "bg-purple-50 text-purple-700 border-purple-100",
};

export default function AdminUsersPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!isPending && !user) router.push("/login");
    if (!isPending && user?.role !== "admin") router.replace("/dashboard");
  }, [user, isPending]);

  useEffect(() => {
    if (user?.role === "admin") fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch { toast.error("Failed to load users."); }
    finally { setLoading(false); }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      toast.success(`Role updated to ${role}`);
      fetchUsers();
    } catch { toast.error("Failed to update role."); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setDeleting(id);
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" });
      toast.success("User deleted.");
      fetchUsers();
    } catch { toast.error("Failed to delete user."); }
    finally { setDeleting(null); }
  };

  if (isPending || !user) return <div className="flex justify-center py-20"><Spinner size="lg" color="teal" /></div>;

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Manage Users</h1>
          <p className="text-slate-500 text-sm mt-1">{users.length} registered users</p>
        </div>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 w-64" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="md" color="teal" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FaUsers className="text-5xl text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-semibold">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Change Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {filtered.map(u => (
                  <tr key={u._id || u.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shrink-0">{u.name?.[0] || "U"}</div>
                        <span className="font-bold text-slate-800">{u.name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-black uppercase border ${ROLE_STYLES[u.role] || "bg-slate-50 text-slate-600 border-slate-200"}`}>{u.role || "patient"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <select value={u.role || "patient"} onChange={e => handleRoleChange(u._id || u.id, e.target.value)} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer">
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {(u._id || u.id) !== user.id && (
                        <button onClick={() => handleDelete(u._id || u.id)} disabled={deleting === (u._id || u.id)} className="p-2 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100 transition cursor-pointer disabled:opacity-60">
                          <FaTrash className="text-xs" />
                        </button>
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
  );
}
