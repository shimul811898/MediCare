"use client";
import { FaUserShield, FaClock, FaStripe, FaPrescriptionBottleAlt, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const advantages = [
  {
    title: "Verified Specialists",
    desc: "Every practitioner undergoes rigorous manual verification by our administrators before consulting.",
    icon: FaUserShield,
    bg: "bg-teal-50 text-teal-600 border-teal-100",
  },
  {
    title: "24/7 Availability",
    desc: "Connect and book virtual consultations or physical visits at any time of day.",
    icon: FaClock,
    bg: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    title: "Secure Payments",
    desc: "Integrated Stripe payment gateway ensures that all transactions are safe, encrypted, and transparent.",
    icon: FaStripe,
    bg: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  {
    title: "Digital Prescriptions",
    desc: "Receive instant, verified medical prescriptions and notes directly in your portal after consultation.",
    icon: FaPrescriptionBottleAlt,
    bg: "bg-rose-50 text-rose-600 border-rose-100",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 px-6 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 text-xs font-black uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            Why Choose <br />
            <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
              MediCare Connect
            </span>
          </h2>
          <p className="text-slate-600 text-base leading-relaxed max-w-xl font-medium">
            We are dedicated to bringing high-quality, reliable, and accessible healthcare to your fingertips. 
            Our platform bridges the gap between verified medical practitioners and patients with state-of-the-art tools.
          </p>

          <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm max-w-md">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl border border-amber-100">
              <FaStar />
            </div>
            <div>
              <h4 className="text-slate-800 font-black text-sm">Patient-Centric Care</h4>
              <p className="text-slate-400 text-xs font-semibold mt-0.5">Ranked #1 for client satisfaction and doctor response times.</p>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {advantages.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border ${item.bg}`}>
                  <Icon />
                </div>
                <h3 className="text-slate-800 font-extrabold text-base tracking-wide">{item.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-semibold">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
