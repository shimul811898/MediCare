"use client";
import { useEffect, useState } from "react";
import { FaUserMd, FaDollarSign, FaGraduationCap, FaRegStar } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import { Avatar } from "@heroui/react";

export default function FeaturedDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctors`);
        if (res.ok) {
          const data = await res.json();
          setDoctors(data.slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching featured doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 text-xs font-black uppercase tracking-wider">
              Meet Our Specialists
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
              Featured Doctors
            </h2>
            <p className="text-slate-500 max-w-xl font-medium text-sm md:text-base">
              Consult with verified, top-tier clinical professionals directly online or schedule a physical clinic visit.
            </p>
          </div>
          <Link href="/find-doctors">
            <button className="px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm tracking-wide transition cursor-pointer">
              View All Doctors
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-slate-50 border border-slate-100 rounded-3xl h-96"></div>
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <FaUserMd className="text-slate-300 text-5xl mx-auto mb-4" />
            <p className="text-slate-400 italic">No verified doctors registered yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {doctors.map((doc) => {
              const docName = doc.doctorName || doc.name || "Doctor";
              const docImage = doc.profileImage || doc.image;
              const docFee = doc.consultationFee || doc.fee || 0;
              const docExperience = doc.experience ? `${doc.experience} Years` : "5+ Years";
              
              return (
                <motion.div
                  key={doc._id}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-[420px] group relative"
                >
                  <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden bg-slate-100 h-48 w-full flex items-center justify-center">
                      {docImage ? (
                        <img
                          src={docImage}
                          alt={docName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-slate-400 text-5xl">
                          <FaUserMd />
                        </div>
                      )}
                      <span className="absolute top-3 right-3 bg-teal-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                        Verified
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-teal-600 text-xs font-black uppercase tracking-wider">
                        {doc.specialization || "General Physician"}
                      </div>
                      <h3 className="text-lg font-black text-slate-800 tracking-wide line-clamp-1">
                        {docName}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                        <FaGraduationCap className="text-slate-400 text-sm" />
                        <span>Experience: {docExperience}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-50 pt-4 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Fee</span>
                      <span className="text-slate-800 font-extrabold text-lg">{docFee} BDT</span>
                    </div>
                    <Link href={`/find-doctors`}>
                      <button className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold shadow-md shadow-teal-500/10 transition cursor-pointer">
                        Book Now
                      </button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
