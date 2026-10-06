import Sidebar from "@/components/studio/Sidebar";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg font-body text-text antialiased">
      <Sidebar />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
