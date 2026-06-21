"use client";
import { useEffect, useState } from "react";
import { FaUserMd, FaUserCheck, FaCalendarCheck, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

export default function PlatformStats() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching platform stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statsItems = [
    { label: "Total Doctors", value: stats.totalDoctors, icon: FaUserMd, bg: "bg-teal-50 text-teal-600" },
    { label: "Total Patients", value: stats.totalPatients, icon: FaUserCheck, bg: "bg-blue-50 text-blue-600" },
    { label: "Total Appointments", value: stats.totalAppointments, icon: FaCalendarCheck, bg: "bg-purple-50 text-purple-600" },
    { label: "Total Reviews", value: stats.totalReviews, icon: FaStar, bg: "bg-amber-50 text-amber-600" },
  ];

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-600 text-xs font-bold uppercase tracking-wider">
            Live Platform Metrics
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            MediCare In Numbers
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">
            Real-time analytics showcasing our growing network of verified medical specialists and patient consultations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {statsItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03, y: -4 }}
                className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow flex items-center gap-6"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${item.bg}`}>
                  <Icon />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{item.label}</p>
                  <h3 className="text-slate-900 text-3xl font-black mt-1">
                    {loading ? (
                      <span className="inline-block w-12 h-8 bg-slate-100 animate-pulse rounded-lg"></span>
                    ) : (
                      item.value
                    )}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}