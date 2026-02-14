"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

type FormState = "idle" | "submitting" | "success" | "limit-reached" | "error";

export default function ChapterDownloadForm() {
  const { user, isLoggedIn, register } = useAuth();

  const [email, setEmail] = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  const [name, setName] = useState("");
  const [initial, setInitial] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [birthdayMonth, setBirthdayMonth] = useState(0);
  const [formState, setFormState] = useState<FormState>("idle");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const effectiveEmail = isLoggedIn && user ? user.email : email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setErrorMsg("");

    // If user wants to create an account and is not logged in
    if (createAccount && !isLoggedIn) {
      if (!name.trim() || !password.trim()) {
        setErrorMsg("Name and password are required to create an account.");
        setFormState("error");
        return;
      }
      const formattedName = initial
        ? `${name.trim()}. ${initial}`
        : name.trim();
      const success = await register(
        formattedName,
        effectiveEmail,
        password,
        referralCode || undefined,
        birthdayMonth || undefined,
      );
      if (!success) {
        setErrorMsg("An account with that email already exists. Uncheck the box or sign in first.");
        setFormState("error");
        return;
      }
    }

    try {
      const res = await fetch("/api/download-chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: effectiveEmail }),
      });

      if (res.status === 429) {
        setFormState("limit-reached");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Something went wrong.");
        setFormState("error");
        return;
      }

      const downloadsRemaining = parseInt(
        res.headers.get("X-Downloads-Remaining") || "0",
        10
      );
      setRemaining(downloadsRemaining);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // Try opening in new tab, fallback to anchor download
      const newWindow = window.open(url, "_blank");
      if (!newWindow) {
        const a = document.createElement("a");
        a.href = url;
        a.download = "First Chapter - My Intuition Made Me Do It - TSA.epub";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      // Clean up blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 30000);

      setFormState("success");
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setFormState("error");
    }
  };

  if (formState === "limit-reached") {
    return (
      <div className="bg-cream rounded-xl p-6 text-center">
        <p className="font-heading text-lg text-navy mb-1">Download Limit Reached</p>
        <p className="text-sm text-navy/60">
          This email has already been used for the maximum of 3 downloads.
        </p>
      </div>
    );
  }

  if (formState === "success") {
    return (
      <div className="bg-cream rounded-xl p-6 text-center">
        <p className="font-heading text-lg text-navy mb-1">Your download has started</p>
        {remaining !== null && remaining > 0 && (
          <p className="text-sm text-navy/60">
            {remaining} download{remaining !== 1 ? "s" : ""} remaining
          </p>
        )}
        {remaining === 0 && (
          <p className="text-sm text-navy/60">
            This was your last download for this email.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      {errorMsg && (
        <div className="p-3 bg-blush/10 border border-blush/30 rounded-lg text-sm text-navy">
          {errorMsg}
        </div>
      )}

      {!isLoggedIn && !createAccount && (
        <div>
          <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors"
            placeholder="your@email.com"
            required
          />
        </div>
      )}

      {!isLoggedIn && (
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={createAccount}
            onChange={(e) => setCreateAccount(e.target.checked)}
            className="mt-1 w-4 h-4 accent-navy"
          />
          <span className="text-sm text-navy/70">
            Create account and start earning Ritual Credits with our loyalty program
          </span>
        </label>
      )}

      {createAccount && !isLoggedIn && (
        <div className="space-y-4 animate-slide-up">
          <div>
            <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors"
              placeholder="Your First Name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">
              Initial{" "}
              <span className="text-mauve font-normal normal-case">
                (Optional: max 1 character)
              </span>
            </label>
            <input
              type="text"
              value={initial}
              maxLength={1}
              onChange={(e) => {
                const value = e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z]/g, "");
                setInitial(value);
              }}
              className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors uppercase"
              placeholder="Your Initial"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors"
              placeholder="Choose a password"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">
              Birthday Month{" "}
              <span className="text-mauve font-normal normal-case">
                (optional)
              </span>
            </label>
            <select
              value={birthdayMonth}
              onChange={(e) => setBirthdayMonth(Number(e.target.value))}
              className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy focus:outline-none focus:border-navy transition-colors"
            >
              <option value={0}>Select your birthday month...</option>
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December",
              ].map((month, i) => (
                <option key={month} value={i + 1}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">
              Referral Code{" "}
              <span className="text-mauve font-normal normal-case">
                (Part of our Refer a Friend{" "}
                <Link
                  href="/loyalty"
                  className="underline hover:text-navy transition-colors"
                >
                  Loyalty Program
                </Link>
                )
              </span>
            </label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors"
              placeholder="e.g. REF-LUNA-A3B2"
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={formState === "submitting"}
        className="w-full py-3.5 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors text-sm tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {formState === "submitting" ? "Preparing Download..." : "Download First Chapter"}
      </button>
      {!isLoggedIn && createAccount && (
        <p className="text-xs text-mauve text-center">
          Earn 50 Ritual Credits just for creating an account!
        </p>
      )}
    </form>
  );
}
