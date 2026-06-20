"use client";

import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!isPending) {
      if (!user) {
        router.push("/login");
      } else {
        const role = user.role || "patient";
        router.replace(`/dashboard/${role}`);
      }
    }
  }, [user, isPending, router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-xl flex flex-col items-center gap-4 text-center max-w-sm">
        <Spinner size="lg" color="teal" />
        <h2 className="text-xl font-bold text-slate-800">Entering Dashboard</h2>
        <p className="text-slate-500 text-sm">Please wait while we redirect you to your personalized panel...</p>
      </div>
    </div>
  );
}
