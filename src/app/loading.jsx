import { Spinner } from "@heroui/react";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-sm">
        <div className="w-20 h-20 bg-teal-50 border border-teal-100 rounded-3xl flex items-center justify-center mx-auto shadow-md shadow-teal-500/5 animate-bounce">
          <span className="text-3xl">🏥</span>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">MediCare</h2>
          <p className="text-slate-500 text-sm font-medium">Preparing your premium healthcare workspace...</p>
        </div>

       
        <div className="flex justify-center pt-2">
          <Spinner size="lg" color="teal" />
        </div>
      </div>
    </div>
  );
}
