"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MyProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [user, isPending, router]);

  if (isPending) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" color="teal" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-1 bg-slate-50 py-10 px-6">
      <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900 mb-6 text-center">
          My Profile
        </h1>
        <div className="flex flex-col items-center gap-4 mb-6">
          <Avatar className="w-24 h-24 border-4 border-teal-500">
            <Avatar.Image alt={user.name} src={user.image} />
            <Avatar.Fallback className="bg-teal-500 text-white text-3xl font-bold">
              {user.name?.[0] || "U"}
            </Avatar.Fallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
            <p className="text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-6 text-slate-700">
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">Full Name</span>
            <span>{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">Email</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">Role</span>
            <span className="capitalize font-bold text-teal-600">{user.role || "patient"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">User ID</span>
            <span className="text-xs bg-slate-100 px-2 py-1 rounded truncate max-w-[200px]">{user.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
