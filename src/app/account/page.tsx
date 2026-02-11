"use client";

import { useState } from "react";

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });

  if (loggedIn) {
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
                <svg className="w-5 h-5 text-blush" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <span className="text-sm font-medium text-navy">50 Points</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "My Orders", desc: "View order history and tracking", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                { title: "My Wishlist", desc: "Items you have saved for later", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
                { title: "Rewards", desc: "View points balance and earn more", icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" },
                { title: "Settings", desc: "Update your profile and preferences", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(83,91,115,0.08)] hover:shadow-[0_8px_24px_rgba(83,91,115,0.15)] transition-all duration-300 cursor-pointer">
                  <svg className="w-8 h-8 text-navy mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                  <h3 className="font-heading text-lg text-navy mb-1">{item.title}</h3>
                  <p className="text-sm text-mauve">{item.desc}</p>
                </div>
              ))}
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
            {!isLogin && <p className="text-xs text-mauve text-center mt-4">Earn 50 points just for creating an account!</p>}
          </div>
        </div>
      </section>
    </>
  );
}
