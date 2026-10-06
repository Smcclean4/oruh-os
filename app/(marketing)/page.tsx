import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import StatsBar from "@/components/landing/StatsBar";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <div className="max-w-[1180px] mx-auto px-8">
        <Hero />
        <StatsBar />
        <Features />
        <Pricing />
        <FinalCta />
      </div>
      <Footer />
    </>
  );
}
