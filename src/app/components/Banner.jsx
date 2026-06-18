"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const Banner = () => {
    return (
        <section className="relative overflow-hidden py-24 px-6 bg-white">

            <div className="absolute top-0 left-0 w-96 h-96 bg-teal-100 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-100 blur-[120px] rounded-full"></div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">

                <motion.div className="flex-1">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-600 text-sm font-semibold mb-6 tracking-wide uppercase">
                        Trusted Healthcare Platform
                    </span>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight">
                        Your Health, <br />
                        <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
                            Our Priority.
                        </span>
                    </h1>

                    <p className="mt-6 text-lg text-slate-600 max-w-xl">
                        Connect with experienced doctors, schedule appointments,
                        manage medical records, and receive quality healthcare —
                        all in one place.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-8">
                        <Link href="/find-doctors">
                            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold shadow-lg shadow-teal-500/30 hover:scale-105 transition-all duration-300">
                                Find Doctors
                            </button>
                        </Link>

                        <Link href="/about">
                            <button className="px-8 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all duration-300">
                                Learn More
                            </button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mt-12 border-t border-slate-100 pt-8">
                        {["500+ Doctors", "20k+ Patients", "99% Satisfaction"].map((stat, i) => (
                            <div key={i}>
                                <h3 className="text-3xl font-black text-slate-900">{stat.split(" ")[0]}</h3>
                                <p className="text-slate-500 font-medium">{stat.split(" ")[1]}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div className="flex-1">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-teal-100 to-cyan-100 rounded-[35px] blur-xl"></div>
                        <div className="relative bg-white border border-slate-100 p-2 rounded-[32px] shadow-2xl">
                            <img
                                src="/assests/Banner.png"
                                alt="Doctor consultation"
                                className="w-full h-[450px] object-cover rounded-3xl"
                            />
                        </div>

                        {/* Floating Card */}
                        <div className="absolute -bottom-6 -left-6 bg-white border border-teal-100 rounded-2xl px-6 py-4 shadow-xl">
                            <h4 className="text-slate-900 font-bold text-lg">24/7 Support</h4>
                            <p className="text-teal-600 text-sm">Instant assistance</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Banner;