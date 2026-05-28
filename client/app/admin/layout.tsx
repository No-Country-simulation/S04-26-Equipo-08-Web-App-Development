"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import AdminHeader from "@/app/components/admin/AdminHeader";
import { useAuthStore } from "@/app/store/use-auth-store";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || (user?.role !== "admin" && user?.role !== "operator"))) {
      router.replace("/auth/login");
    }
  }, [mounted, isAuthenticated, user, router]);

  if (!mounted || !isAuthenticated || (user?.role !== "admin" && user?.role !== "operator")) {
    return <div className="flex min-h-screen bg-[#e8eaf0]"><main className="flex-1 p-8">{children}</main></div>;
  }

  return (
    <div className="flex min-h-screen bg-[#e8eaf0]">
      <AdminSidebar />
      <main className="flex flex-1 flex-col">
        <AdminHeader />
        <section className="flex-1 space-y-8 p-8">
          {children}
        </section>
      </main>
    </div>
  );
}
