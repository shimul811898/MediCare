import Link from "next/link";
import { FaHome, FaArrowLeft } from "react-icons/fa";

export default function RootNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Animated Error Badge */}
        <div className="w-24 h-24 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto text-4xl shadow-sm animate-pulse">
          🔍
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-black uppercase tracking-wider">
            Error 404
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Page Not Found</h1>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            The page you are looking for doesn't exist or has been moved to another address.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            id="not-found-back-home"
            href="/"
            className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-500/10 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-sm"
          >
            <FaHome className="text-xs" /> Back to Home
          </Link>
          <Link
            id="not-found-back-dashboard"
            href="/dashboard"
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-sm"
          >
            <FaArrowLeft className="text-xs" /> Go to Dashboard
          </Link>
        </div>
        
        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest pt-2">
          MediCare Premium Portal
        </p>
      </div>
    </div>
  );
}
