import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";

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
