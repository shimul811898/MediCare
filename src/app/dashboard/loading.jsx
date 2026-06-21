export default function DashboardLoading() {
  return (
    <div className="flex-1 bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-slate-200" />
          <div className="space-y-3 flex-1">
            <div className="h-6 bg-slate-200 rounded-xl w-56" />
            <div className="h-4 bg-slate-100 rounded-xl w-40" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-1.5 flex gap-1">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex-1 h-10 bg-slate-100 rounded-xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-slate-100" />
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-slate-200 rounded-lg w-16" />
                <div className="h-3 bg-slate-100 rounded-lg w-28" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="h-6 bg-slate-200 rounded-xl w-48" />
          </div>
          <div className="divide-y divide-slate-50">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded-lg" style={{width: `${40 + i * 10}%`}} />
                  <div className="h-3 bg-slate-50 rounded-lg w-32" />
                </div>
                <div className="h-6 bg-slate-100 rounded-full w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
