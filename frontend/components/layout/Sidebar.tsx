// ====================================================
// Sidebar Component
// Primary navigation for the dashboard shell. Fixed on
// desktop, collapses to a bottom-accessible drawer on
// mobile (toggled from Topbar).
// ====================================================

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  Users,
  Search,
  Sparkles,
  IdCard,
  Eraser,
  Maximize2,
  RefreshCw,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/upload", label: "Upload", icon: Upload },
    ],
  },
  {
    label: "Organize",
    items: [
      { href: "/people", label: "People", icon: Users },
      { href: "/search", label: "Search", icon: Search },
    ],
  },
  {
    label: "Create",
    items: [
      { href: "/generate-image", label: "Generate Image", icon: Sparkles },
    ],
  },
  {
    label: "Tools",
    items: [
      { href: "/passport-photo", label: "Passport Photo", icon: IdCard },
      { href: "/background-remover", label: "Background Remover", icon: Eraser },
      { href: "/resize", label: "Resize", icon: Maximize2 },
      { href: "/convert", label: "Convert", icon: RefreshCw },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-card border-r border-border z-50",
          "flex flex-col transition-transform duration-200",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">PhotoAI Studio</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-muted hover:text-foreground"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-6">
              <p className="px-3 mb-2 text-xs font-medium text-muted uppercase tracking-wider">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-background"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
