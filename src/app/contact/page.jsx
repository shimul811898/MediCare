"use client";

import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaQuestionCircle, FaChevronDown } from "react-icons/fa";

const contactInfo = [
  {
    title: "Call Us Today",
    desc: "Speak with our support center anytime.",
    detail: "+880 1712-345678",
    subDetail: "Sat - Thu: 9 AM - 6 PM",
    icon: FaPhoneAlt,
    bg: "bg-teal-50 text-teal-600 border-teal-100",
  },
  {
    title: "Email Support",
    desc: "For general inquiries and booking issues.",
    detail: "support@medicare.com",
    subDetail: "Response within 24 hours",
    icon: FaEnvelope,
    bg: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  {
    title: "Our Main Headquarters",
    desc: "Visit our main operations center.",
    detail: "Level 4, Health Tower",
    subDetail: "Mirpur-10, Dhaka, Bangladesh",
    icon: FaMapMarkerAlt,
    bg: "bg-rose-50 text-rose-600 border-rose-100",
  },
];

const faqs = [
  {
    q: "How do I book a doctor's appointment?",
    a: "Go to the 'Find Doctors' page, search and filter by specialization, choose a convenient date and time slot from the schedule, and hit Book. You will then be prompted to pay the fee securely.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support all major credit and debit card payments securely via Stripe integration, including Visa, MasterCard, and American Express.",
  },
  {
    q: "Can I cancel or reschedule my appointment?",
    a: "Yes, you can manage appointments in your Patient Dashboard. Cancellations and reschedules are permitted up to 24 hours before your slot.",
  },
];

export default function ContactUsPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Message sent! We'll get back to you shortly.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <main className="flex-1">
  
        <section className="relative overflow-hidden py-20 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 px-6">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-teal-200/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 text-xs font-black uppercase tracking-wider"
            >
              Get In Touch
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none"
            >
              We are here to{" "}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
                Support You
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium"
            >
              Have questions about booking? Encountered issues with payments? Our dedicated patient support team is ready to assist you.
            </motion.p>
          </div>
        </section>

        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
       
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Contact Information</h2>
              <p className="text-slate-500 text-sm leading-relaxed font-medium max-w-md">
                Reach out to us via any of our channels or send a direct inquiry. We monitor our channels regularly.
              </p>

              <div className="grid grid-cols-1 gap-4 pt-2">
                {contactInfo.map((info, i) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      key={info.title}
                      className="bg-white border border-slate-100 rounded-3xl p-5 flex gap-4 shadow-sm hover:shadow-md transition duration-300"
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg border ${info.bg} shrink-0`}>
                        <Icon />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-slate-800 font-extrabold text-sm">{info.title}</h4>
                        <p className="text-slate-400 text-xs font-semibold">{info.desc}</p>
                        <p className="text-slate-800 font-bold text-sm pt-1">{info.detail}</p>
                        <p className="text-slate-400 text-[10px] font-semibold">{info.subDetail}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

     
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
              <h3 className="text-xl font-black text-slate-800 tracking-tight mb-6">Send A Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your Full Name"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@email.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="What is this inquiry about?"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Message *</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write details of your question or report here..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold rounded-xl text-sm transition cursor-pointer shadow-md shadow-teal-500/10 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <FaPaperPlane className="text-xs" /> {loading ? "Sending..." : "Submit Inquiry"}
                </button>
              </form>
            </div>
          </div>
        </section>

  
        <section className="py-16 px-6 bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-black uppercase tracking-wider">
                Support Desk
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Frequently Asked Questions</h2>
              <p className="text-slate-400 text-xs font-semibold">Quick answers to common questions before reaching out.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none cursor-pointer hover:bg-slate-50/50 transition"
                    >
                      <span className="font-extrabold text-slate-800 text-sm sm:text-base flex items-center gap-2.5">
                        <FaQuestionCircle className="text-teal-500 text-sm shrink-0" />
                        {faq.q}
                      </span>
                      <FaChevronDown className={`text-slate-400 text-xs transition duration-300 ${isOpen ? "rotate-180 text-teal-500" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-slate-500 text-xs sm:text-sm font-medium border-t border-slate-50/50 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
