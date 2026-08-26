"use client";

import { useState, FormEvent } from "react";

export default function WaitlistForm({
  note,
  align = "left",
}: {
  note: string;
  align?: "left" | "center";
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // No backend wired up yet — swap this for your real signup endpoint
    // (Mailchimp, ConvertKit, a Google Sheet, your own API route, etc).
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 5000);
  }

  return (
    <div className={align === "center" ? "flex flex-col items-center" : ""}>
      <form
        onSubmit={handleSubmit}
        className={`flex gap-2.5 max-w-[440px] w-full flex-col sm:flex-row ${align === "center" ? "mx-auto" : ""
          }`}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@stream.tv"
          aria-label="Email address"
          className="flex-1 bg-surface border border-line text-text placeholder:text-text-faint px-4 py-3.5 rounded-lg text-[14.5px] focus:border-cyan-dim outline-none"
        />
        <button
          type="submit"
          className="bg-gradient-to-br from-magenta to-[#C91E5C] text-white font-semibold px-6 py-3.5 rounded-lg text-[14.5px] whitespace-nowrap transition-all hover:shadow-[0_4px_24px_rgba(255,45,120,0.4)] hover:-translate-y-px"
        >
          Get Early Access
        </button>
      </form>
      <span
        className={`mt-3.5 block font-mono text-[12.5px] ${align === "center" ? "text-center" : ""
          } ${submitted ? "text-cyan" : "text-text-faint"}`}
      >
        {submitted ? "YOU'RE ON THE LIST — WE'LL EMAIL YOU AT LAUNCH" : note}
      </span>
    </div>
  );
}
