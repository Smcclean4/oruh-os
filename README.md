# CreatorOS Landing Page

Next.js 14 (App Router) + TypeScript + Tailwind CSS.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Structure

- `app/layout.tsx` — root layout, loads Chakra Petch / Inter / JetBrains Mono via `next/font/google`
- `app/page.tsx` — assembles the page from components
- `app/globals.css` — Tailwind directives + base styles
- `components/` — Nav, Hero (animated HUD mockup), StatsBar, Features (module grid), Pricing, FinalCta, Footer, and a shared `WaitlistForm`
- `tailwind.config.ts` — custom color tokens (magenta / cyan / amber), font families, and the `blink` / `floatIn` keyframes used in the hero

## Wiring up the waitlist form

`components/WaitlistForm.tsx` currently just confirms locally on submit (no backend). To connect it for real, swap the `handleSubmit` function for a call to your provider, e.g.:

```ts
async function handleSubmit(e: FormEvent) {
  e.preventDefault();
  await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  setSubmitted(true);
  setEmail("");
}
```

Then add an `app/api/waitlist/route.ts` API route that forwards to Mailchimp, ConvertKit, a database, or a Google Sheet.

## Deploy

Works out of the box on Vercel: `vercel deploy`, or any Node host that supports Next.js.
