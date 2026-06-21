"use client";

import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { FaHeartbeat, FaUserShield, FaHospital, FaAward, FaUserMd, FaSmile } from "react-icons/fa";
import Link from "next/link";

const stats = [
  { label: "Verified Doctors", value: "150+", desc: "Top tier specialists across departments" },
  { label: "Happy Patients", value: "10k+", desc: "Recovered and satisfied patients" },
  { label: "Success Rate", value: "99.2%", desc: "Accurate diagnoses and treatment" },
  { label: "Years of Care", value: "8+", desc: "Providing trust and support" },
];

const values = [
  {
    title: "Compassion First",
    desc: "We approach healthcare with understanding, sympathy, and a deep commitment to patient well-being.",
    icon: FaHeartbeat,
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50 border-rose-100 text-rose-500",
  },
  {
    title: "Trust & Safety",
    desc: "Rigorous manual vetting of every medical professional ensures you always receive authentic guidance.",
    icon: FaUserShield,
    color: "from-teal-500 to-emerald-600",
    bg: "bg-teal-50 border-teal-100 text-teal-600",
  },
  {
    title: "Seamless Access",
    desc: "Connecting you to primary care, emergency consultations, and specialist opinions in minutes.",
    icon: FaHospital,
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50 border-blue-100 text-blue-600",
  },
  {
    title: "Medical Excellence",
    desc: "Continuous innovation in telehealth technology keeps patient healthcare records clear and instant.",
    icon: FaAward,
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50 border-amber-100 text-amber-600",
  },
];

const team = [
  { name: "Dr. Sarah Jenkins", role: "Chief Medical Officer", dept: "Cardiology Specialist", imgText: "SJ" },
  { name: "Dr. Alex Rivera", role: "Head of Doctor Relations", dept: "Neurologist", imgText: "AR" },
  { name: "Jessica Thompson", role: "Director of Patient Care", dept: "Customer Experience", imgText: "JT" },
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <main className="flex-1">
        <section className="relative overflow-hidden py-24 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 px-6">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 text-xs font-black uppercase tracking-wider"
            >
              Who We Are
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none"
            >
              Bridging the gap between patients and{" "}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
                Exceptional Healthcare
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium"
            >
              MediCare Connect is a modern telemedicine and appointment booking ecosystem built to streamline hospital and expert clinic consultations. Our mission is to make healthcare immediate, secure, and available to anyone, anywhere.
            </motion.p>
          </div>
        </section>

        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={stat.label}
                className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 shadow-sm text-center space-y-2 hover:shadow-md hover:border-slate-200 transition-all duration-300"
              >
                <p className="text-4xl font-black bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-slate-800 font-extrabold text-sm">{stat.label}</p>
                <p className="text-slate-400 text-xs font-semibold">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-20 px-6 bg-slate-50/50 border-t border-b border-slate-100">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-black uppercase tracking-wider">
                Our Core Ideals
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Values that drive our commitment
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                We believe healthcare is a fundamental human right. Here is how we enforce care standards every day.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((val, i) => {
                const Icon = val.icon;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -6 }}
                    key={val.title}
                    className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5 hover:shadow-lg transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border ${val.bg} shadow-sm shrink-0`}>
                      <Icon />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-slate-800 font-extrabold text-base tracking-wide">{val.title}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed font-semibold">{val.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

  
        <section className="py-20 px-6 max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 text-xs font-black uppercase tracking-wider">
              Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Experienced healthcare leaders
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Meet the medical experts and strategists directing the Medicare platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={member.name}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center space-y-4 hover:shadow-md transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-indigo-600 text-white flex items-center justify-center mx-auto text-2xl font-black shadow-md">
                  {member.imgText}
                </div>
                <div>
                  <h3 className="text-slate-800 font-black text-lg">{member.name}</h3>
                  <p className="text-teal-600 text-xs font-bold mt-0.5">{member.role}</p>
                  <p className="text-slate-400 text-xs font-semibold mt-1">{member.dept}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-16 px-6 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight relative z-10 leading-tight">
              Ready to find your specialist doctor?
            </h2>
            <p className="text-teal-50 text-sm max-w-md mx-auto relative z-10 font-medium leading-relaxed">
              Book a verified consultation in minutes. Pay securely with Stripe and receive your medical files online.
            </p>
            <div className="pt-2 relative z-10 flex justify-center gap-4">
              <Link href="/find-doctors" className="px-6 py-3 bg-white text-teal-600 font-extrabold text-sm rounded-xl hover:bg-slate-50 shadow-md transition cursor-pointer">
                Find Doctors
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
