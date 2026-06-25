"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const Banner = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-[#F4FAF8] via-[#FFFFFF] to-[#E8F5F1] overflow-hidden py-12 md:py-16 px-4 md:px-6 lg:px-16">
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full relative z-10">
                
                <motion.div 
                    className="lg:col-span-6 space-y-6 text-left"
                    initial="hidden"
                    animate="visible"
                    transition={{ staggerChildren: 0.1 }}
                >
                    <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00a884]"></span>
                        <span className="text-teal-600 text-xs font-semibold tracking-wide uppercase">
                            Trusted Healthcare Platform
                        </span>
                    </motion.div>

                    <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                        Your Health, <br />
                        <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
                            Our Priority.
                        </span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="text-slate-600 text-sm sm:text-base max-w-xl font-medium leading-relaxed">
                        Connect with experienced doctors, schedule appointments, manage medical records, and receive quality healthcare — all in one place.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-2">
                        <Link href="/find-doctors">
                            <button className="px-7 py-3.5 rounded-xl bg-[#00a884] hover:bg-[#009473] text-white font-bold text-sm shadow-md transition-all duration-200">
                                Find Doctors
                            </button>
                        </Link>
                        <Link href="/about">
                            <button className="px-7 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm shadow-sm transition-all duration-200">
                                Learn More
                            </button>
                        </Link>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="pt-6 flex flex-wrap gap-4">
                        {[
                            { value: "500+", label: "Doctors" },
                            { value: "20k+", label: "Patients" },
                            { value: "99%", label: "Satisfaction" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-50 min-w-[125px] text-center lg:text-left">
                                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{stat.value}</h3>
                                <p className="text-slate-400 text-xs font-medium mt-0.5">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                <div className="lg:col-span-6 relative w-full flex justify-center items-center mt-12 lg:mt-0">
                    <div className="relative w-full max-w-[520px]">
                        
                        <motion.img 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7 }}
                            src="/assets/banner.png" 
                            alt="Healthcare Professional Team"
                            className="w-full h-auto object-contain relative z-10 mx-auto"
                        />

                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="absolute top-6 right-4 sm:right-8 bg-white py-3 px-5 rounded-2xl shadow-lg border border-slate-50 z-20 text-center min-w-[110px]"
                        >
                            <h4 className="text-slate-900 font-extrabold text-lg flex items-center justify-center gap-0.5">
                                4.9<span className="text-yellow-400 text-sm">★</span>
                            </h4>
                            <p className="text-slate-400 text-[11px] font-semibold mt-0.5 whitespace-nowrap">Patient Rating</p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="absolute left-0 bottom-1/3 bg-white py-3 px-5 rounded-2xl shadow-lg border border-slate-50 z-20 min-w-[110px]"
                        >
                            <h4 className="text-slate-900 font-black text-xl">30+</h4>
                            <p className="text-slate-400 text-[11px] font-semibold mt-0.5">Specialists</p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[92%] sm:w-[88%] bg-white p-3 rounded-2xl shadow-xl border border-slate-50 z-20 grid grid-cols-3 gap-2 items-center text-center"
                        >
                            {[
                                { title: "Easy", sub: "Booking", icon: "📋", bg: "bg-emerald-50" },
                                { title: "Verified", sub: "Doctors", icon: "👨‍⚕️", bg: "bg-teal-50" },
                                { title: "Secure &", sub: "Reliable", icon: "🔒", bg: "bg-cyan-50" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row items-center justify-center gap-2 px-1">
                                    <div className={`p-1.5 sm:p-2 rounded-xl ${item.bg} text-xs sm:text-sm`}>
                                        {item.icon}
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h5 className="text-slate-900 font-bold text-[11px] sm:text-xs leading-none">{item.title}</h5>
                                        <p className="text-slate-400 text-[9px] sm:text-[10px] font-medium mt-0.5">{item.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default Banner;