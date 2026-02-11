"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faClipboardList, faHeart, faGift, faGear } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });

  if (loggedIn) {
    const dashboardItems: { title: string; desc: string; icon: IconDefinition; href: string }[] = [
      { title: "My Orders", desc: "View order history and tracking", icon: faClipboardList, href: "" },
      { title: "My Wishlist", desc: "Items you have saved for later", icon: faHeart, href: "/wishlist" },
      { title: "Rewards", desc: "View Ritual Credits and earn more", icon: faGift, href: "/loyalty" },
      { title: "Settings", desc: "Update your profile and preferences", icon: faGear, href: "" },
    ];

    return (
      <>
        <section className="bg-navy py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">Welcome Back</h1>
          </div>
        </section>
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-cream rounded-xl p-8 mb-8 text-center">
              <h2 className="font-heading text-3xl text-navy mb-2">Hello, {formData.name || "Seeker"}</h2>
              <p className="text-mauve font-accent italic">For You, On Your Journey</p>
              <div className="mt-4 inline-flex items-center gap-2 bg-navy/10 px-4 py-2 rounded-full">
                <FontAwesomeIcon icon={faStar} className="w-5 h-5 text-blush" />
                <span className="text-sm font-medium text-navy">50 Ritual Credits</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardItems.map((item) => {
                const card = (
                  <div key={item.title} className="bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(83,91,115,0.08)] hover:shadow-[0_8px_24px_rgba(83,91,115,0.15)] transition-all duration-300 cursor-pointer">
                    <FontAwesomeIcon icon={item.icon} className="w-8 h-8 text-navy mb-4" />
                    <h3 className="font-heading text-lg text-navy mb-1">{item.title}</h3>
                    <p className="text-sm text-mauve">{item.desc}</p>
                  </div>
                );
                return item.href ? <Link key={item.title} href={item.href}>{card}</Link> : card;
              })}
            </div>
            <div className="mt-8 text-center">
              <button onClick={() => setLoggedIn(false)} className="text-sm text-mauve hover:text-navy transition-colors">Sign Out</button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">{isLogin ? "Welcome Back" : "Join the Journey"}</h1>
          <p className="font-accent italic text-white/70 text-lg">{isLogin ? "Sign in to your account" : "Create an account to begin"}</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(83,91,115,0.08)]">
            <div className="flex mb-8 border-b border-cream">
              <button onClick={() => setIsLogin(true)} className={`flex-1 pb-3 text-sm font-medium tracking-wider uppercase transition-colors border-b-2 ${isLogin ? "border-navy text-navy" : "border-transparent text-mauve"}`}>Sign In</button>
              <button onClick={() => setIsLogin(false)} className={`flex-1 pb-3 text-sm font-medium tracking-wider uppercase transition-colors border-b-2 ${!isLogin ? "border-navy text-navy" : "border-transparent text-mauve"}`}>Register</button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setLoggedIn(true); }} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors" placeholder="Your name" />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors" placeholder="your@email.com" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">Password</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors" placeholder="Your password" required />
              </div>
              {isLogin && <div className="text-right"><button type="button" className="text-sm text-mauve hover:text-navy transition-colors">Forgot password?</button></div>}
              <button type="submit" className="w-full py-3.5 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors text-sm tracking-wider uppercase">
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>
            {!isLogin && <p className="text-xs text-mauve text-center mt-4">Earn 50 Ritual Credits just for creating an account!</p>}
          </div>
        </div>
      </section>
    </>
  );
}
