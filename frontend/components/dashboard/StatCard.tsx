// ====================================================
// Stat Card Component
// Displays a single dashboard metric (Total Images,
// People, Generated Images, Passport Sheets).
// ====================================================

import { LucideIcon } from "lucide-react";
import Card from "@/components/ui/Card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
}

export default function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted mb-1">{label}</p>
          <p className="text-2xl font-semibold text-foreground">
            {value.toLocaleString()}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </Card>
  );
}
