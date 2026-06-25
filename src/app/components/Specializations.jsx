"use client";
import { FaHeartbeat, FaBrain, FaBone, FaBaby, FaHandSparkles } from "react-icons/fa";
import { motion } from "framer-motion";

const specializations = [
  { name: "Cardiology", desc: "Heart health, blood pressure, and cardiovascular wellness.", icon: FaHeartbeat, color: "from-rose-500 to-red-500", bg: "bg-rose-50 border-rose-100 text-rose-600" },
  { name: "Neurology", desc: "Brain, spine, nervous system disorders, and nerve wellness.", icon: FaBrain, color: "from-indigo-500 to-purple-500", bg: "bg-indigo-50 border-indigo-100 text-indigo-600" },
  { name: "Orthopedics", desc: "Bone, joints, ligaments, muscle treatments, and surgery.", icon: FaBone, color: "from-amber-500 to-orange-500", bg: "bg-amber-50 border-amber-100 text-amber-600" },
  { name: "Pediatrics", desc: "Infant, child, adolescent health, care, and vaccinations.", icon: FaBaby, color: "from-teal-500 to-emerald-500", bg: "bg-teal-50 border-teal-100 text-teal-600" },
  { name: "Dermatology", desc: "Skin treatments, skincare, allergies, and cosmetic checks.", icon: FaHandSparkles, color: "from-cyan-500 to-blue-500", bg: "bg-cyan-50 border-cyan-100 text-cyan-600" },
];

export default function Specializations() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-6 bg-slate-50 border-y border-slate-100/50">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 text-xs font-black uppercase tracking-wider">
            Our Departments
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
            Medical Specializations
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            Access certified care across a wide range of specialized fields. Select a department to find matching doctors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {specializations.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center space-y-4 group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${spec.bg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon />
                </div>
                <h3 className="text-lg font-black text-slate-800 tracking-wide">{spec.name}</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">{spec.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
