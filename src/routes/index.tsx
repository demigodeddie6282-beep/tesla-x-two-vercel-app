import { createFileRoute } from "@tanstack/react-router";
import { HeroPanel } from "@/components/HeroPanel";
import heroMain from "@/assets/hero-main.jpg";
import heroVehicles from "@/assets/hero-vehicles.jpg";
import heroRobots from "@/assets/hero-robots.jpg";
import heroCrypto from "@/assets/hero-crypto.jpg";
import heroIpo from "@/assets/hero-ipo.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tesla — The Future of Wealth & Intelligence" },
      { name: "description", content: "Access tomorrow's technology today. Vehicles, robotics, crypto and IPO opportunities." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="w-full">
      <HeroPanel
        image={heroMain}
        eyebrow="Tesla Vanguard"
        title="The Architecture of Wealth"
        subtitle="A unified marketplace for the future — robotics, autonomous vehicles, emerging assets and frontier ventures."
        primaryLabel="Explore Marketplace"
        primaryTo="/vehicles"
        secondaryLabel="View Investments"
        secondaryTo="/ipo"
      />

      <HeroPanel
        image={heroVehicles}
        title="Future Fleet"
        subtitle="Autonomous luxury platforms engineered for the next century."
        primaryLabel="Order Now"
        primaryTo="/vehicles"
        secondaryLabel="Bulk Pricing"
        secondaryTo="/vehicles"
      />

      <HeroPanel
        image={heroRobots}
        title="Neural Robotics"
        subtitle="Humanoid systems for the home, industry, and beyond."
        primaryLabel="Configure Unit"
        primaryTo="/robots"
        secondaryLabel="Enterprise"
        secondaryTo="/robots"
      />

      <HeroPanel
        image={heroCrypto}
        eyebrow="Newly Listed"
        title="Tomorrow's Liquidity"
        subtitle="Early access to emerging tokens, AI protocols and digital assets."
        primaryLabel="View Listings"
        primaryTo="/crypto"
        secondaryLabel="Buy Now"
        secondaryTo="/crypto"
      />

      <HeroPanel
        image={heroIpo}
        eyebrow="Institutional Access"
        title="Frontier IPOs"
        subtitle="Pre-market positions in AI, robotics, aerospace and biotech."
        primaryLabel="Investor Portal"
        primaryTo="/ipo"
        secondaryLabel="Open Offerings"
        secondaryTo="/ipo"
        textColor="light"
        theme="dark"
      />
    </div>
  );
}
