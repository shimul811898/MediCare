"use client";
import { useEffect, useState } from "react";
import { FaQuoteLeft, FaStar, FaUserMd } from "react-icons/fa";
import { motion } from "framer-motion";
import { Avatar } from "@heroui/react";

export default function SuccessStories() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reviews");
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-100/50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider">
            Patient Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            Patient Success Stories
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">
            Hear from patients who found the right medical treatment and received care through our platform.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-3xl h-60"></div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 max-w-md mx-auto">
            <FaQuoteLeft className="text-slate-300 text-4xl mx-auto mb-4" />
            <p className="text-slate-400 italic">No testimonials written by patients yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev) => {
              const patientName = rev.patientName || "Anonymous";
              const patientImage = rev.patientImage || "";
              const reviewContent = rev.reviewText || rev.comment || "Great consultation and highly professional service.";
              const rating = Number(rev.rating) || 5;

              return (
                <motion.div
                  key={rev._id}
                  whileHover={{ y: -6 }}
                  className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 relative"
                >
                  <span className="absolute top-6 right-8 text-teal-100 text-5xl">
                    <FaQuoteLeft />
                  </span>

                  <div className="space-y-4 relative z-10">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <FaStar
                          key={idx}
                          className={idx < rating ? "text-amber-400" : "text-slate-200"}
                        />
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed italic font-medium">
                      "{reviewContent}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 border-t border-slate-100 pt-6 mt-6 relative z-10">
                    <Avatar
                      src={patientImage || undefined}
                      name={patientName}
                      className="w-11 h-11 border border-slate-100"
                    />
                    <div>
                      <h4 className="text-slate-800 font-extrabold text-sm tracking-wide">{patientName}</h4>
                      {rev.doctorName && (
                        <p className="text-slate-400 text-xs font-semibold mt-0.5 flex items-center gap-1">
                          <FaUserMd className="text-teal-500" />
                          <span>Consulted Dr. {rev.doctorName}</span>
                        </p>
                      )}
                    </div>
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