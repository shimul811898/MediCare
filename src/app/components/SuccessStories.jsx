"use client";
import { useEffect, useState } from "react";
import { FaQuoteLeft, FaStar, FaUserMd } from "react-icons/fa";
import { motion } from "framer-motion";
import { Avatar } from "@heroui/react";

export default function SuccessStories() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Error loading reviews:", err))
      .finally(() => setLoading(false));
  }, []);

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    return `${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/${image}`;
  };

  if (loading) return <div className="text-center py-24">Loading Success Stories...</div>;

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">Patient Success Stories</h2>
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
                {getImageUrl(rev.patientImage) ? (
                  <img src={getImageUrl(rev.patientImage)} alt="Patient" referrerPolicy="no-referrer" className="w-11 h-11 rounded-full border border-slate-100 object-cover shrink-0" />
                ) : (
                  <div className="w-11 h-11 rounded-full border border-slate-100 bg-teal-500 text-white flex items-center justify-center font-bold shrink-0">
                    {rev.patientName?.charAt(0) || "A"}
                  </div>
                )}
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