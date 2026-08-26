import WaitlistForm from "./WaitlistForm";

export default function FinalCta() {
  return (
    <section id="join" className="text-center py-[100px]">
      <h2 className="font-display font-bold text-[30px] sm:text-[38px] lg:text-[46px] mb-[18px]">
        Be first in the room.
      </h2>
      <p className="text-text-dim text-base max-w-[480px] mx-auto mb-[34px]">
        We&apos;re opening access in small cohorts so onboarding stays
        personal. Get in early and help shape what ships next.
      </p>
      <WaitlistForm note="NEXT COHORT IN PRODUCTION" align="center" />
    </section>
  );
}
