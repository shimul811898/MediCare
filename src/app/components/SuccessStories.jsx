"use client";
import { useEffect, useState } from "react";
import { FaQuoteLeft, FaStar, FaUserMd } from "react-icons/fa";
import { motion } from "framer-motion";
import { Avatar } from "@heroui/react";

export default function SuccessStories() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Error loading reviews:", err))
      .finally(() => setLoading(false));
  }, []);

  // ইমেজের পাথ ঠিক করার ফাংশন
  const getImageUrl = (image) => {
    if (!image) return null;
    // যদি ইমেজ লিঙ্কটি পূর্ণাঙ্গ URL হয়
    if (image.startsWith("http")) return image;
    // যদি লোকাল ফাইল হয় তবে সার্ভার পাথ যুক্ত করবে
    return `http://localhost:5000/uploads/${image}`;
  };

  if (loading) return <div className="text-center py-24">Loading Success Stories...</div>;

  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center">
          <h2 className="text-4xl font-black text-slate-900">Patient Success Stories</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <motion.div
              key={rev._id}
              whileHover={{ y: -6 }}
              className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm relative"
            >
              <span className="absolute top-6 right-8 text-teal-100 text-5xl">
                <FaQuoteLeft />
              </span>

              <div className="space-y-4 relative z-10">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={i < (rev.rating || 5) ? "text-amber-400" : "text-slate-200"} 
                    />
                  ))}
                </div>
                <p className="text-slate-600 text-sm italic">
                  "{rev.reviewText || rev.comment || "Great experience with the doctor."}"
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-slate-100 pt-6 mt-6 relative z-10">
                <Avatar
                  src={getImageUrl(rev.patientImage)}
                  name={rev.patientName || "Anonymous"}
                  className="w-11 h-11 border border-slate-100"
                  // যদি ইমেজ লোড না হয়, তাহলে নাম থেকে ইনিশিয়াল দেখাবে
                  fallback={rev.patientName?.charAt(0) || "A"}
                />
                <div>
                  <h4 className="text-slate-800 font-extrabold text-sm">
                    {rev.patientName || "Anonymous"}
                  </h4>
                  <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                    <FaUserMd className="text-teal-500" />
                    <span>Consulted Dr. {rev.doctorName || "Doctor"}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}