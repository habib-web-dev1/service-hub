import type { User } from "../types";

/**
 * Persist auth data in both localStorage (for client reads) and cookies
 * (for middleware route protection — cookies are readable server-side).
 */
export const saveAuth = (token: string, user: User) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  // Write cookies so Next.js middleware can read them on navigation
  const maxAge = 60 * 60 * 24 * 7; // 7 days, matches JWT expiry
  document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

export const getAuthUser = (): User | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as User;
  } catch {
    return null;
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Clear cookies
  document.cookie = "token=; path=/; max-age=0";
  document.cookie = "user=; path=/; max-age=0";
};
