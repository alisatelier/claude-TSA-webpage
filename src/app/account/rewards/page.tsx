"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { getTierProgress } from "@/lib/loyalty-utils";
import { products } from "@/lib/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCopy,
  faCheck,
  faGift,
  faPen,
  faUserPlus,
  faCake,
} from "@fortawesome/free-solid-svg-icons";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function RewardsPage() {
  const {
    user,
    isLoggedIn,
    tier,
    submitReview,
    setBirthdayMonth,
    claimBirthdayCredits,
  } = useAuth();
  const [copied, setCopied] = useState(false);
  const [reviewProduct, setReviewProduct] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [birthdayClaimed, setBirthdayClaimed] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(0);

  if (!isLoggedIn || !user) {
    return (
      <>
        <section className="bg-navy py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">
              Rewards
            </h1>
          </div>
        </section>
        <section className="py-20 px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 bg-cream rounded-full mx-auto mb-6 flex items-center justify-center">
              <FontAwesomeIcon icon={faStar} className="w-8 h-8 text-mauve" />
            </div>
            <h2 className="font-heading text-3xl text-navy mb-4">
              Sign in to view your rewards
            </h2>
            <p className="text-mauve mb-8 font-accent italic">
              Create an account or sign in to start earning Ritual Credits.
            </p>
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

  const progress = getTierProgress(user.loyalty.lifetimeCredits);

  const purchasedNotReviewed = user.loyalty.purchasedProducts.filter(
    (id) => !user.loyalty.reviewedProducts.includes(id),
  );
  const reviewableProducts = products.filter((p) =>
    purchasedNotReviewed.includes(p.id),
  );

  const handleCopyReferral = async () => {
    try {
      await navigator.clipboard.writeText(user.loyalty.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewProduct || reviewText.length < 100) return;
    const success = submitReview(reviewProduct, reviewRating, reviewText);
    if (success) {
      setReviewSubmitted(true);
      setReviewProduct("");
      setReviewText("");
      setReviewRating(5);
      setTimeout(() => setReviewSubmitted(false), 3000);
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedProductName =
    reviewableProducts.find((p) => p.id === reviewProduct)?.name || "";

  const handleSetBirthday = () => {
    if (selectedMonth > 0) {
      setBirthdayMonth(selectedMonth);
    }
  };

  const handleClaimBirthday = () => {
    const success = claimBirthdayCredits();
    if (success) {
      setBirthdayClaimed(true);
      setTimeout(() => setBirthdayClaimed(false), 3000);
    }
  };

  const currentMonth = new Date().getMonth() + 1;
  const canClaimBirthday =
    user.loyalty.birthdayMonth === currentMonth &&
    user.loyalty.birthdayClaimed !== new Date().getFullYear();

  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">
            Ritual Rewards
          </h1>
          <p className="font-accent italic text-white/70 text-lg">
            Your spiritual journey, rewarded
          </p>
        </div>
      </section>

      {/* Points Dashboard */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-cream rounded-xl p-8 text-center mb-8">
            <p className="text-sm text-mauve uppercase tracking-wider mb-2">
              Current Balance
            </p>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="font-heading text-5xl text-navy">
                ✨{user.loyalty.currentCredits}✨
              </span>
            </div>
            <p className="text-navy font-medium mb-4">Ritual Credits</p>

            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-semibold text-navy">
                  {user.loyalty.lifetimeCredits}
                </p>
                <p className="text-xs text-mauve uppercase tracking-wider">
                  Lifetime Credits
                </p>
              </div>
              <div className="w-px h-10 bg-navy/20" />
              <div className="text-center">
                <span className="inline-block px-3 py-1 bg-navy text-white text-sm font-medium tracking-wider uppercase rounded-full">
                  {tier}
                </span>
                <p className="text-xs text-mauve uppercase tracking-wider mt-1">
                  Current Tier
                </p>
              </div>
            </div>

            {/* Progress bar */}
            {progress.nextTier && (
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-xs text-mauve mb-1">
                  <span>{tier}</span>
                  <span>{progress.nextTier}</span>
                </div>
                <div className="w-full bg-navy/10 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blush to-navy h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress.progressPercent}%` }}
                  />
                </div>
                <p className="text-sm text-navy/70 mt-2">
                  {progress.creditsToNext} credits until {progress.nextTier}{" "}
                  status
                </p>
              </div>
            )}
            {!progress.nextTier && (
              <p className="text-sm text-navy/70">
                You&apos;ve reached the highest tier!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Earn More */}
      <section className="py-12 px-4 bg-cream">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl text-navy mb-8 text-center">
            Earn More Credits
          </h2>

          <div className="space-y-6">
            {/* Write a Review */}
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(83,91,115,0.08)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-navy/10 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faPen} className="w-5 h-5 text-navy" />
                </div>
                <div>
                  <h3 className="font-heading text-lg text-navy">
                    Write a Review
                  </h3>
                  <p className="text-sm text-mauve">+100 credits per review</p>
                </div>
              </div>

              {reviewableProducts.length > 0 ? (
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div className="relative">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full px-4 py-3 bg-white border border-navy/20 rounded-xl text-sm text-navy flex justify-between items-center hover:border-blush transition-colors"
                      >
                        <span>
                          {selectedProductName ||
                            "Select a product to review..."}
                        </span>
                        <svg
                          className={`w-4 h-4 text-mauve transition-transform ${
                            dropdownOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {dropdownOpen && (
                        <div className="absolute z-20 mt-2 w-full bg-white border border-cream rounded-xl shadow-[0_8px_30px_rgba(83,91,115,0.12)] max-h-60 overflow-y-auto animate-fade-in">
                          {reviewableProducts.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setReviewProduct(p.id);
                                setDropdownOpen(false);
                              }}
                              className="w-full px-4 py-3 text-left text-sm text-navy hover:bg-cream transition-colors"
                            >
                              {p.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Custom Chevron */}
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-mauve">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-navy font-medium">
                      Rating:
                    </span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`text-lg ${star <= reviewRating ? "text-blush" : "text-mauve/30"}`}
                      >
                        &#9733;
                      </button>
                    ))}
                  </div>

                  <div>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience (minimum 100 characters)..."
                      className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy text-sm placeholder:text-mauve focus:outline-none focus:border-navy resize-none h-24"
                    />
                    <p className={`text-xs mt-1 ${reviewText.length >= 100 ? "text-teal-400" : "text-mauve"}`}>
                      {reviewText.length}/100 characters {reviewText.length < 100 ? `(${100 - reviewText.length} more needed)` : "— minimum met"}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={!reviewProduct || reviewText.length < 100}
                    className="px-6 py-2.5 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Review (+100 Credits)
                  </button>

                  {reviewSubmitted && (
                    <p className="text-sm text-teal-400 font-medium">
                      Review submitted! +100 Ritual Credits earned.
                    </p>
                  )}
                </form>
              ) : (
                <p className="text-sm text-mauve">
                  {user.loyalty.purchasedProducts.length === 0 ? (
                    "Make a purchase to unlock review rewards."
                  ) : (
                    <>
                      You’ve reviewed all your purchased products.{" "}
                      <Link
                        href="/shop"
                        className="text-navy underline underline-offset-2 hover:text-blush transition-colors"
                      >
                        Keep shopping
                      </Link>{" "}
                      to unlock more.
                    </>
                  )}
                </p>
              )}
            </div>

            {/* Refer a Friend */}
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(83,91,115,0.08)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-navy/10 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    className="w-5 h-5 text-navy"
                  />
                </div>
                <div>
                  <h3 className="font-heading text-lg text-navy">
                    Refer a Friend
                  </h3>
                  <p className="text-sm text-mauve">
                    +200 credits for you and your friends
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 px-4 py-3 bg-cream rounded-lg text-navy font-mono text-sm">
                  {user.loyalty.referralCode}
                </div>
                <button
                  onClick={handleCopyReferral}
                  className="px-4 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
                >
                  <FontAwesomeIcon
                    icon={copied ? faCheck : faCopy}
                    className="w-4 h-4"
                  />
                </button>
              </div>

              <p className="text-sm text-mauve">
                {user.loyalty.referralCount > 0
                  ? `${user.loyalty.referralCount} friend${user.loyalty.referralCount === 1 ? "" : "s"} referred so far!`
                  : "Share your code with friends to earn bonus credits."}
              </p>
            </div>

            {/* Birthday Credit */}
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(83,91,115,0.08)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-navy/10 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faCake}
                    className="w-5 h-5 text-navy"
                  />
                </div>
                <div>
                  <h3 className="font-heading text-lg text-navy">
                    Birthday Credit
                  </h3>
                  <p className="text-sm text-mauve">
                    +150 credits on your birthday month
                  </p>
                </div>
              </div>

              {user.loyalty.birthdayMonth === null ? (
                <div className="flex items-center gap-3">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="flex-1 px-4 py-3 border border-navy/20 rounded-lg text-navy text-sm focus:outline-none focus:border-navy"
                  >
                    <option value={0}>Select your birthday month...</option>
                    {MONTHS.map((month, i) => (
                      <option key={month} value={i + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSetBirthday}
                    disabled={selectedMonth === 0}
                    className="px-6 py-3 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                </div>
              ) : canClaimBirthday ? (
                <div>
                  <p className="text-sm text-navy mb-3">
                    Happy birthday month! Your birthday gift is ready.
                  </p>
                  <button
                    onClick={handleClaimBirthday}
                    className="px-6 py-2.5 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy/90 transition-colors"
                  >
                    <FontAwesomeIcon icon={faGift} className="w-4 h-4 mr-2" />
                    Claim 150 Birthday Credits
                  </button>
                  {birthdayClaimed && (
                    <p className="text-sm text-green-600 font-medium mt-2">
                      Birthday credits claimed!
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-mauve">
                  Birthday month set to{" "}
                  {MONTHS[(user.loyalty.birthdayMonth || 1) - 1]}.
                  {user.loyalty.birthdayClaimed === new Date().getFullYear()
                    ? " You've already claimed this year's birthday credits!"
                    : ` Your gift will be available in ${MONTHS[(user.loyalty.birthdayMonth || 1) - 1]}.`}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Points History */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl text-navy mb-8 text-center">
            Points History
          </h2>

          {user.loyalty.pointsHistory.length > 0 ? (
            <div className="space-y-3">
              {user.loyalty.pointsHistory.map((entry, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 shadow-[0_4px_12px_rgba(83,91,115,0.08)] flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-navy">
                      {entry.action}
                    </p>
                    <p className="text-xs text-mauve">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${entry.credits > 0 ? "text-teal-400" : "text-blush"}`}
                    >
                      {entry.credits > 0 ? "+" : ""}
                      {entry.credits}
                    </p>
                    <p className="text-xs text-mauve">
                      Balance: {entry.runningBalance}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-cream rounded-xl">
              <FontAwesomeIcon
                icon={faStar}
                className="w-8 h-8 text-mauve/40 mb-4"
              />
              <p className="text-mauve font-accent italic">
                Your rewards journey starts here. Make a purchase or refer a
                friend to begin earning credits.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
