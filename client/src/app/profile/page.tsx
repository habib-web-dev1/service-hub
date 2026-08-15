"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  User,
  Phone,
  Mail,
  Shield,
  UserCog,
  Briefcase,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Lock,
} from "lucide-react";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  createdAt?: string;
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api.get<UserInfo>("/users/me");
        setUser(data);
        setName(data.name);
        setPhone(data.phone || "");

        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load profile.",
        );
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setName(parsed.name);
            setPhone(parsed.phone || "");
          } catch {
            // ignore
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setUpdating(true);

    try {
      const updatedUser = await api.patch<UserInfo>("/users/me", {
        name,
        phone: phone || null,
      });

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update profile.",
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    setChangingPassword(true);
    try {
      await api.patch("/users/me/password", {
        currentPassword,
        newPassword,
      });

      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(""), 4000);
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Failed to change password.",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleBecomeProvider = async () => {
    if (
      !window.confirm(
        "Are you sure you want to upgrade your account to a Service Provider? This will grant you access to create services and accept bookings.",
      )
    ) {
      return;
    }

    setError("");
    setSuccess("");
    setUpgrading(true);

    try {
      const response = await api.post<UserInfo>("/users/me/become-provider");
      setUser(response);
      localStorage.setItem("user", JSON.stringify(response));
      setSuccess("Congratulations! You are now a Service Provider!");
      setTimeout(() => router.push("/provider"), 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upgrade account.",
      );
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
          <p className="text-slate-400">Loading your profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        {/* Title */}
        <div className="mb-10 flex items-center gap-3">
          <UserCog className="h-10 w-10 text-cyan-400" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Account Profile
            </h1>
            <p className="mt-1 text-slate-400">
              Manage your profile details and preferences
            </p>
          </div>
        </div>

        {/* Global alerts */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          {/* Left column: snapshot */}
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-center backdrop-blur-md">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 ring-4 ring-cyan-500/5">
                <User className="h-10 w-10" />
              </div>
              <h2 className="mt-4 text-xl font-bold">{user?.name}</h2>
              <p className="text-sm text-slate-400 break-all">{user?.email}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                <Shield className="h-3 w-3" />
                {user?.role}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 backdrop-blur-md">
              <h3 className="font-semibold text-slate-200">Account Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Member Since:</span>
                  <span className="text-white">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Account Status:</span>
                  <span className="text-green-400 font-semibold">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: forms */}
          <div className="md:col-span-2 space-y-8">
            {/* Profile form */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-md">
              <h3 className="text-xl font-bold mb-6">Profile Settings</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div>
                  <label
                    htmlFor="name-input"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      id="name-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Email Address{" "}
                    <span className="text-xs text-slate-500 font-normal">
                      (Cannot be changed)
                    </span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-700" />
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 py-3 pl-12 pr-4 text-slate-500 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone-input"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      id="phone-input"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1..."
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updating ? "Saving Changes..." : "Save Profile Details"}
                </button>
              </form>
            </div>

            {/* Password change form */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="h-5 w-5 text-cyan-400" />
                <h3 className="text-xl font-bold">Change Password</h3>
              </div>

              {passwordError && (
                <div className="mb-5 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}
              {passwordSuccess && (
                <div className="mb-5 flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-5">
                <div>
                  <label
                    htmlFor="current-password"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Current Password
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-password"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Repeat new password"
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full rounded-lg bg-slate-700 hover:bg-slate-600 px-6 py-3 font-semibold text-white transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {changingPassword
                    ? "Changing Password..."
                    : "Change Password"}
                </button>
              </form>
            </div>

            {/* Become a Provider CTA (CUSTOMER only) */}
            {user?.role === "CUSTOMER" && (
              <div className="rounded-2xl border border-blue-500/30 bg-linear-to-br from-blue-950/20 to-slate-900 p-6 md:p-8 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5">
                  <Briefcase className="h-64 w-64" />
                </div>
                <div className="relative z-10">
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    Partnership
                  </span>
                  <h3 className="mt-3 text-2xl font-bold">
                    Earn Money as a Service Provider
                  </h3>
                  <p className="mt-2 text-slate-400 leading-relaxed text-sm md:text-base">
                    List your services on ServiceHub to connect with local
                    customers, manage bookings, and grow your business today.
                  </p>
                  <button
                    onClick={handleBecomeProvider}
                    disabled={upgrading}
                    className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-blue-400 cursor-pointer disabled:opacity-50"
                  >
                    {upgrading
                      ? "Upgrading Account..."
                      : "Become a Service Provider"}
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
