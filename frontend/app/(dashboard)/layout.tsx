// ====================================================
// Dashboard Layout
// Wraps all authenticated pages with Sidebar + Topbar.
// Also acts as the auth guard — redirects to /login if
// no valid token is found.
// ====================================================

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Loader from "@/components/ui/Loader";
import { isAuthenticated } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setCheckingAuth(false);
  }, [router]);

  // Show a loader while verifying auth, instead of a flash
  // of dashboard content before redirecting an unauthenticated
  // user away.
  if (checkingAuth) {
    return <Loader fullScreen label="Loading..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
