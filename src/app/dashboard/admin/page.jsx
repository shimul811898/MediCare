"use client";

import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboardIndex() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!isPending) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "admin") {
        router.replace("/dashboard");
      } else {
        router.replace("/dashboard/admin/analytics");
      }
    }
  }, [user, isPending, router]);

  return (
    <div className="flex justify-center items-center py-20">
      <Spinner size="lg" color="teal" />
    </div>
  );
}
