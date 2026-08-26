export default function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <div className="max-w-[1180px] mx-auto px-8 flex flex-wrap justify-between items-center gap-4 text-[13px] text-text-faint">
        <div>© 2026 Oruh. Built for people who stream for a living.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-text-dim transition-colors">
            X
          </a>
          <a href="#" className="hover:text-text-dim transition-colors">
            Discord
          </a>
          <a href="#" className="hover:text-text-dim transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
