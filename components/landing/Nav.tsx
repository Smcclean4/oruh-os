export default function Nav() {
  return (
    <nav className="sticky top-0 z-[100] backdrop-blur-[14px] bg-bg/72 border-b border-line">
      <div className="max-w-[1180px] mx-auto flex items-center justify-between px-8 py-[18px]">
        <div className="font-display font-bold text-[19px] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-magenta shadow-[0_0_10px_#FF2D78] animate-blink" />
          <span className="text-3xl">Oruh</span>
        </div>
        <div className="hidden md:flex gap-9 text-[14.5px] text-text-dim">
          <a href="#features" className="hover:text-text transition-colors">
            Features
          </a>
          <a href="#pricing" className="hover:text-text transition-colors">
            Pricing
          </a>
          <a href="#join" className="hover:text-text transition-colors">
            Community
          </a>
        </div>
        <a
          href="#join"
          className="text-[13.5px] font-semibold px-[18px] py-[9px] rounded-[7px] border border-line bg-surface hover:border-cyan-dim hover:bg-surface-2 transition-colors"
        >
          Join the waitlist
        </a>
      </div>
    </nav>
  );
}
