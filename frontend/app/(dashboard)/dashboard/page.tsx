// ====================================================
// Dashboard Page
// Overview of stats + recent uploads. First page users
// see after logging in.
// ====================================================

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Image as ImageIcon, Users, Sparkles, IdCard, Upload } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import { api, getErrorMessage } from "@/lib/api";
import { DashboardData, ApiResponse } from "@/types";
import { timeAgo } from "@/lib/utils";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await api.get<ApiResponse<DashboardData>>("/dashboard");
        setData(response.data.data!);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading) return <Loader fullScreen label="Loading your dashboard..." />;

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-12 text-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  const stats = data!.stats;
  const recentUploads = data!.recentUploads;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted mt-1">
          Here&apos;s an overview of your photo library
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={ImageIcon} label="Total Images" value={stats.totalImages} />
        <StatCard icon={Users} label="People" value={stats.totalPeople} />
        <StatCard icon={Sparkles} label="Generated Images" value={stats.totalGeneratedImages} />
        <StatCard icon={IdCard} label="Passport Sheets" value={stats.totalPassportSheets} />
      </div>

      {/* Recent uploads */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Uploads</h2>
        <Link
          href="/upload"
          className="text-sm font-medium text-foreground hover:underline"
        >
          Upload more
        </Link>
      </div>

      {recentUploads.length === 0 ? (
        <Card>
          <EmptyState
            icon={Upload}
            title="No photos yet"
            description="Upload your first photos to start organizing your library with AI-powered face grouping."
            actionLabel="Upload photos"
            onAction={() => (window.location.href = "/upload")}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {recentUploads.map((image) => (
            <div
              key={image.id}
              className="aspect-square rounded-xl overflow-hidden bg-card border border-border relative group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt="Uploaded photo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[11px] text-white truncate">
                  {timeAgo(image.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
