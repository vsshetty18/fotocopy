// ====================================================
// Login Page
// Simple email + password form. On success, saves the
// JWT and redirects to /dashboard.
// ====================================================

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { api, getErrorMessage } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { AuthResponse, ApiResponse } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        "/auth/login",
        { email, password }
      );

      const data = response.data.data!;
      saveAuth(data.token, data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">
            PhotoAI Studio
          </h1>
          <p className="text-sm text-muted mt-1">
            Organize • Find • Edit • Generate
          </p>
        </div>

        <div className="bg-card border border-border rounded-card shadow-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-muted mb-6">
            Log in to access your photos
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Log in
            </Button>
          </form>

          <p className="text-sm text-muted text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-foreground font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
