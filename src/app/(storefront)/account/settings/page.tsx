"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const { user, isLoggedIn } = useAuth();

  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Email preferences state
  const [emailLoyalty, setEmailLoyalty] = useState(true);
  const [emailNewsletters, setEmailNewsletters] = useState(true);
  const [emailPrefsLoaded, setEmailPrefsLoaded] = useState(false);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");
  const [deleteError, setDeleteError] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch email preferences on mount
  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("/api/user/email-preferences")
      .then((res) => res.json())
      .then((data) => {
        setEmailLoyalty(data.loyalty ?? true);
        setEmailNewsletters(data.newsletters_promotions ?? true);
        setEmailPrefsLoaded(true);
      })
      .catch(() => setEmailPrefsLoaded(true));
  }, [isLoggedIn]);

  const toggleEmailPref = useCallback(
    async (field: "loyalty" | "newsletters_promotions", current: boolean) => {
      const newValue = !current;
      // Optimistic update
      if (field === "loyalty") setEmailLoyalty(newValue);
      else setEmailNewsletters(newValue);

      try {
        const res = await fetch("/api/user/email-preferences", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: newValue }),
        });
        if (!res.ok) {
          // Revert on failure
          if (field === "loyalty") setEmailLoyalty(current);
          else setEmailNewsletters(current);
        }
      } catch {
        // Revert on failure
        if (field === "loyalty") setEmailLoyalty(current);
        else setEmailNewsletters(current);
      }
    },
    []
  );

  if (!isLoggedIn || !user) {
    return (
      <>
        <section className="bg-navy py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">Settings</h1>
          </div>
        </section>
        <section className="py-20 px-4">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="font-heading text-3xl text-navy mb-4">Sign in to manage your account</h2>
            <Link
              href="/account"
              className="inline-block px-8 py-3.5 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors text-sm tracking-wider uppercase"
            >
              Go to Account
            </Link>
          </div>
        </section>
      </>
    );
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordError(false);

    if (newPassword !== confirmPassword) {
      setPasswordMsg("New passwords do not match.");
      setPasswordError(true);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg("New password must be at least 6 characters.");
      setPasswordError(true);
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordMsg("Password updated successfully.");
        setPasswordError(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg(data.error || "Failed to update password.");
        setPasswordError(true);
      }
    } catch {
      setPasswordMsg("Something went wrong. Please try again.");
      setPasswordError(true);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteMsg("");
    setDeleteError(false);
    setDeleteLoading(true);

    try {
      const res = await fetch("/api/user/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmEmail: deleteEmail }),
      });

      const data = await res.json();
      if (res.ok) {
        await signOut({ callbackUrl: "/" });
      } else {
        setDeleteMsg(data.error || "Failed to delete account.");
        setDeleteError(true);
      }
    } catch {
      setDeleteMsg("Something went wrong. Please try again.");
      setDeleteError(true);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">Settings</h1>
          <p className="font-accent italic text-white/70 text-lg">
            Manage your account preferences
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-lg mx-auto space-y-8">
          {/* Back link */}
          <Link href="/account" className="text-sm text-mauve hover:text-navy transition-colors">
            &larr; Back to Account
          </Link>

          {/* Change Password */}
          <div className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(83,91,115,0.08)]">
            <h2 className="font-heading text-2xl text-navy mb-6">Change Password</h2>

            {passwordMsg && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${passwordError ? "bg-blush/10 border border-blush/30 text-navy" : "bg-green-50 border border-green-200 text-green-800"}`}>
                {passwordMsg}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors"
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors"
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-3 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors text-sm tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>

          {/* Email Notifications */}
          <div className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(83,91,115,0.08)]">
            <h2 className="font-heading text-2xl text-navy mb-6">Email Notifications</h2>

            <p className="text-sm text-mauve mb-6">
              Order confirmations, shipping updates, booking confirmations, and session reminders are always sent and cannot be turned off.
            </p>

            {emailPrefsLoaded ? (
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailLoyalty}
                    onChange={() => toggleEmailPref("loyalty", emailLoyalty)}
                    className="mt-1 h-4 w-4 rounded border-navy/30 text-navy focus:ring-navy accent-[#535B73]"
                  />
                  <div>
                    <span className="block text-sm font-semibold text-navy">Loyalty & Rewards</span>
                    <span className="block text-xs text-mauve mt-0.5">
                      Welcome emails, birthday rewards, referral updates, and tier upgrades
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNewsletters}
                    onChange={() => toggleEmailPref("newsletters_promotions", emailNewsletters)}
                    className="mt-1 h-4 w-4 rounded border-navy/30 text-navy focus:ring-navy accent-[#535B73]"
                  />
                  <div>
                    <span className="block text-sm font-semibold text-navy">Newsletters & Promotions</span>
                    <span className="block text-xs text-mauve mt-0.5">
                      Wishlist back-in-stock alerts, new product announcements, and promotional offers
                    </span>
                  </div>
                </label>
              </div>
            ) : (
              <div className="text-sm text-mauve">Loading preferences...</div>
            )}
          </div>

          {/* Delete Account */}
          <div className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(83,91,115,0.08)] border border-blush/20">
            <h2 className="font-heading text-2xl text-navy mb-2">Delete Account</h2>
            <p className="text-sm text-mauve mb-6">
              This action is permanent. All your data including orders, reviews, and Ritual Credits will be permanently deleted.
            </p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-3 border-2 border-blush text-blush font-medium rounded-lg hover:bg-blush/10 transition-colors text-sm tracking-wider uppercase"
              >
                Delete My Account
              </button>
            ) : (
              <div className="space-y-4 animate-slide-up">
                <p className="text-sm text-navy font-medium">
                  To confirm, please enter your email address: <span className="text-mauve">{user.email}</span>
                </p>

                {deleteMsg && (
                  <div className={`p-3 rounded-lg text-sm ${deleteError ? "bg-blush/10 border border-blush/30 text-navy" : ""}`}>
                    {deleteMsg}
                  </div>
                )}

                <input
                  type="email"
                  value={deleteEmail}
                  onChange={(e) => setDeleteEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-blush/30 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-blush transition-colors"
                  placeholder="Enter your email to confirm"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteEmail("");
                      setDeleteMsg("");
                    }}
                    className="flex-1 py-3 border-2 border-navy text-navy font-medium rounded-lg text-sm tracking-wider uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading || deleteEmail.toLowerCase() !== user.email.toLowerCase()}
                    className="flex-1 py-3 bg-blush text-white font-medium rounded-lg text-sm tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteLoading ? "Deleting..." : "Permanently Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
