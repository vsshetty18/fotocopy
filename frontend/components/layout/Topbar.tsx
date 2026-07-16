// ====================================================
// Topbar Component
// Top navigation bar: mobile hamburger, page context,
// theme toggle, and user menu (name + logout).
// ====================================================

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut, User as UserIcon } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { getStoredUser, clearAuth, StoredUser } from "@/lib/auth";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  function handleLogout() {
    clearAuth();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-foreground hover:bg-card rounded-lg"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Spacer for desktop (sidebar already shows logo) */}
        <div className="hidden lg:block" />

        {/* Right side: theme toggle + user menu */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-card transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-foreground">
                {user?.name || user?.email || "Account"}
              </span>
            </button>

            {menuOpen && (
              <>
                {/* Click-outside backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-card z-20 py-1">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-muted truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-background transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
