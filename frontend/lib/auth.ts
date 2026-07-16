// ====================================================
// Auth Helpers
// Manages JWT token storage (localStorage) and basic
// auth state helpers. Kept separate from theme.ts since
// auth doesn't need React context — pages just check
// isAuthenticated() and redirect if needed.
// ====================================================

const TOKEN_KEY = "photoai-token";
const USER_KEY = "photoai-user";

export interface StoredUser {
  id: string;
  email: string;
  name?: string | null;
}

/**
 * Save the JWT and user info after login/register.
 * Call this once, right after a successful auth API call.
 */
export function saveAuth(token: string, user: StoredUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Get the stored JWT (used by lib/api.ts to attach the
 * Authorization header on every request).
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null; // SSR guard
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get the stored user info (for displaying name/email
 * in the Topbar without an extra API call).
 */
export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

/**
 * Quick check for whether a token exists (does NOT verify
 * it's still valid — the backend will reject expired/invalid
 * tokens on the next API call, and lib/api.ts handles that
 * by redirecting to /login).
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Clear all stored auth data — used for logout.
 */
export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
