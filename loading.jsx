export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated medical cross */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 shadow-2xl shadow-teal-500/40 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 40 40" fill="none" className="w-12 h-12">
              <rect x="16" y="6" width="8" height="28" rx="3" fill="white" />
              <rect x="6" y="16" width="28" height="8" rx="3" fill="white" />
            </svg>
          </div>
          {/* Orbit rings */}
          <div className="absolute -inset-3 rounded-full border-2 border-teal-300/40 animate-spin" style={{animationDuration:'3s'}} />
          <div className="absolute -inset-6 rounded-full border border-teal-200/30 animate-spin" style={{animationDuration:'5s', animationDirection:'reverse'}} />
          {/* Orbiting dot */}
          <div className="absolute -inset-3 animate-spin" style={{animationDuration:'3s'}}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-teal-400 shadow-lg shadow-teal-400/60" />
          </div>
        </div>

        {/* Brand */}
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Medi<span className="text-teal-500">Care</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Loading your healthcare portal…</p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full animate-[loading-bar_1.5s_ease-in-out_infinite]" />
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0%   { width: 0%; margin-left: 0; }
          50%  { width: 70%; margin-left: 15%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
