import Link from "next/link";

export const metadata = {
  title: "404 – Page Not Found | MediCare",
};

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-teal-50 min-h-screen px-6 py-20">
      <div className="max-w-lg w-full text-center">
        <div className="mx-auto mb-8 w-64 h-64">
          <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="160" cy="140" r="120" fill="#f0fdfa" />
            <circle cx="160" cy="140" r="100" fill="#ccfbf1" />
            
            <rect x="90" y="80" width="140" height="140" rx="12" fill="white" stroke="#0d9488" strokeWidth="3" />
            <rect x="130" y="70" width="60" height="24" rx="8" fill="#0d9488" />
            <circle cx="160" cy="82" r="5" fill="white" />
   
            <text x="125" y="165" fontSize="60" fontWeight="900" fill="#ccfbf1" fontFamily="Arial">?</text>
            <text x="127" y="163" fontSize="58" fontWeight="900" fill="#0f766e" fontFamily="Arial">?</text>
            

            <rect x="202" y="90" width="20" height="6" rx="3" fill="#f43f5e" />
            <rect x="208" y="84" width="6" height="18" rx="3" fill="#f43f5e" />
            
            <path d="M240 60 Q255 60 255 75 Q255 95 240 95 Q220 95 215 110 Q210 125 220 135" stroke="#0d9488" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="225" cy="140" r="8" fill="none" stroke="#0d9488" strokeWidth="3" />
            <circle cx="225" cy="140" r="3" fill="#0d9488" />
            <circle cx="240" cy="58" r="5" fill="#0d9488" />
            <circle cx="255" cy="58" r="5" fill="#0d9488" />
            
            <ellipse cx="80" cy="110" rx="14" ry="6" rx2="14" fill="#f0abfc" transform="rotate(-30 80 110)" />
            <ellipse cx="80" cy="110" rx="7" ry="6" fill="#d946ef" transform="rotate(-30 80 110)" />
            <ellipse cx="75" cy="185" rx="12" ry="5" fill="#bfdbfe" transform="rotate(20 75 185)" />
            <ellipse cx="75" cy="185" rx="6" ry="5" fill="#3b82f6" transform="rotate(20 75 185)" />
          </svg>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 border border-teal-200 text-teal-700 rounded-full text-sm font-bold mb-4">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          Error 404
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
          Page Not <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">Found</span>
        </h1>

        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
          Oops! It seems the page you're looking for has been moved, deleted, or simply doesn't exist.
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Back to Home
          </Link>
          <Link
            href="/find-doctors"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 hover:border-teal-300 text-slate-700 font-bold rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Find a Doctor
          </Link>
        </div>
      </div>
    </div>
  );
}
