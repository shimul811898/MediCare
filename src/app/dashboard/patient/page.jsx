"use client";

import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PatientDashboardIndex() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!isPending) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "patient") {
        router.replace("/dashboard");
      } else {
        router.replace("/dashboard/patient/myAppointments");
      }
    }
  }, [user, isPending, router]);

  return (
    <div className="flex justify-center items-center py-20">
      <Spinner size="lg" color="teal" />
    </div>
  );
}
