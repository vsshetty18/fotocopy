// ====================================================
// Root Page
// No actual UI — just redirects based on auth state.
// "/" -> "/dashboard" if logged in, "/login" if not.
// ====================================================

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import { isAuthenticated } from "@/lib/auth";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  // Brief loader while the redirect happens — this page
  // is never meant to be visibly "landed on."
  return <Loader fullScreen />;
}
