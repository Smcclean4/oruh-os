"use client";

import { useEffect, useState } from "react";
import WaitlistForm from "./WaitlistForm";

export default function Hero() {
  const [viewers, setViewers] = useState(12483);

  useEffect(() => {
    const id = setInterval(() => {
      setViewers((v) => v + Math.floor(Math.random() * 6) - 1);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center py-12 md:py-19">
      <div>
        <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[1.5px] text-cyan border border-cyan-dim bg-cyan/[0.06] px-3 py-1.5 rounded-md mb-[22px]">
          ● ORUH — BUILD MODE
        </div>
        <h1 className="font-display font-bold text-[34px] sm:text-[44px] lg:text-[54px] leading-[1.06] tracking-[-0.5px] mb-[22px]">
          Your stream is a business.
          <br />
          Run it from <span className="text-magenta">one control room.</span>
        </h1>
        <p className="text-[17px] text-text-dim leading-[1.6] max-w-[480px] mb-[34px]">
          Overlays, Dashboard, and your own personalized Website. Oruh wires every piece of your
          content into one place, so you spend less time patching tools and
          more time live.
        </p>
        <WaitlistForm note="EARLY ACCESS OPENING SOON // NO SPAM, JUST LAUNCH NEWS" />
      </div>

      <div
        role="img"
        aria-label="Mock stream overlay showing live status, viewer count, chat, and a subscriber alert"
        className="relative rounded-[14px] border border-line overflow-hidden aspect-[4/3] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
        style={{
          background: "linear-gradient(160deg, #0D111C, #090A10)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(255,45,120,0.14), transparent 55%), radial-gradient(circle at 80% 80%, rgba(0,229,255,0.10), transparent 55%)",
          }}
        />

        {/* corner brackets */}
        <div className="absolute top-3.5 left-3.5 w-[22px] h-[22px] border-t-2 border-l-2 border-cyan/85 rounded-tl-[4px]" />
        <div className="absolute top-3.5 right-3.5 w-[22px] h-[22px] border-t-2 border-r-2 border-cyan/85 rounded-tr-[4px]" />
        <div className="absolute bottom-3.5 left-3.5 w-[22px] h-[22px] border-b-2 border-l-2 border-cyan/85 rounded-bl-[4px]" />
        <div className="absolute bottom-3.5 right-3.5 w-[22px] h-[22px] border-b-2 border-r-2 border-cyan/85 rounded-br-[4px]" />

        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-[2]">
          <div className="flex items-center gap-1.5 font-mono text-[11.5px] font-semibold tracking-wider text-white bg-magenta/[0.18] border border-magenta rounded-full pl-2 pr-2.5 py-1.5">
            <span className="w-[7px] h-[7px] rounded-full bg-magenta shadow-[0_0_8px_#FF2D78] animate-blink" />
            LIVE
          </div>
          <div className="font-mono text-[12.5px] text-cyan flex items-center gap-1.5">
            👁 <span>{viewers.toLocaleString()}</span>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-[1]">
          <div className="font-display font-semibold text-[15px] text-text-faint tracking-[2px] text-center">
            YOUR SCENE HERE
          </div>
        </div>

        <div className="absolute bottom-6 left-6 w-[52%] bg-surface/72 border border-line rounded-lg px-3 py-2.5 text-[11.5px] z-[2] backdrop-blur-sm">
          <div className="text-text-dim mb-1.5 truncate">
            <b className="text-cyan font-semibold">nova_ttv:</b> the overlay
            glow is so clean
          </div>
          <div className="text-text-dim mb-1.5 truncate">
            <b className="text-cyan font-semibold">ok_pixel:</b> POG that
            transition
          </div>
          <div className="text-text-dim truncate">
            <b className="text-cyan font-semibold">ren_dev:</b> subbed, let's
            gooo
          </div>
        </div>

        <div className="absolute bottom-6 right-6 bg-gradient-to-br from-magenta/[0.22] to-amber/[0.14] border border-magenta-dim rounded-lg px-3.5 py-2.5 font-mono text-[11px] z-[2] animate-floatIn">
          ⚡ NEW SUB — ren_dev (3mo)
        </div>
      </div>
    </section>
  );
}
