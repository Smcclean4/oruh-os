"use client";

export default function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
        checked ? "bg-cyan" : "bg-line"
      }`}
    >
      <span
        className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-bg transition-transform duration-200 ease-out"
        style={{ transform: checked ? "translateX(16px)" : "translateX(0px)" }}
      />
    </button>
  );
}
