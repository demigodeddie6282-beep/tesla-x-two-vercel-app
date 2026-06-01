import { createFileRoute } from "@tanstack/react-router";
import { HeroPanel } from "@/components/HeroPanel";
import modelY from "@/assets/model-y.jpg";
import modelS from "@/assets/model-s.jpg";
import model3 from "@/assets/model-3.jpg";
import modelX from "@/assets/model-x.jpg";
import cybertruck from "@/assets/cybertruck.jpg";
import semi from "@/assets/semi.jpg";
import roadster from "@/assets/roadster.jpg";
import powerwall from "@/assets/powerwall.jpg";
import solarRoof from "@/assets/solar-roof.jpg";
import megapack from "@/assets/megapack.jpg";
import charging from "@/assets/charging.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tesla — Electric Cars, Solar & Clean Energy" },
      { name: "description", content: "Tesla is accelerating the world's transition to sustainable energy with electric cars, solar and integrated renewable energy solutions." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="w-full">
      <HeroPanel image={modelY} eyebrow="New" title="Model Y" subtitle="The best-selling car in the world." primaryLabel="Order Now" primaryTo="/vehicles" secondaryLabel="Learn More" secondaryTo="/vehicles" />
      <HeroPanel image={model3} title="Model 3" subtitle="Lease starting at $349/mo." primaryLabel="Order Now" primaryTo="/vehicles" secondaryLabel="Demo Drive" secondaryTo="/vehicles" />
      <HeroPanel image={modelS} title="Model S" subtitle="Plaid — 0–60 mph in 1.99 s." primaryLabel="Order Now" primaryTo="/vehicles" secondaryLabel="Learn More" secondaryTo="/vehicles" />
      <HeroPanel image={modelX} title="Model X" subtitle="Falcon Wing doors. Tri-Motor performance." primaryLabel="Order Now" primaryTo="/vehicles" secondaryLabel="Learn More" secondaryTo="/vehicles" textColor="light" />
      <HeroPanel image={cybertruck} title="Cybertruck" subtitle="Built for any planet." primaryLabel="Order Now" primaryTo="/vehicles" secondaryLabel="Learn More" secondaryTo="/vehicles" textColor="light" />
      <HeroPanel image={semi} title="Tesla Semi" subtitle="Class 8 freight. 500-mile range." primaryLabel="Reserve" primaryTo="/vehicles" secondaryLabel="Specs" secondaryTo="/vehicles" />
      <HeroPanel image={roadster} eyebrow="Coming Soon" title="Roadster" subtitle="The quickest car in the world." primaryLabel="Reserve" primaryTo="/vehicles" secondaryLabel="Learn More" secondaryTo="/vehicles" textColor="light" />
      <HeroPanel image={powerwall} title="Powerwall" subtitle="Power your home around the clock." primaryLabel="Order Now" primaryTo="/energy" secondaryLabel="Learn More" secondaryTo="/energy" />
      <HeroPanel image={solarRoof} title="Solar Roof" subtitle="Produce clean energy from your roof." primaryLabel="Order Now" primaryTo="/energy" secondaryLabel="Learn More" secondaryTo="/energy" />
      <HeroPanel image={megapack} title="Megapack" subtitle="Massive energy storage for utilities." primaryLabel="Learn More" primaryTo="/energy" textColor="light" />
      <HeroPanel image={charging} title="Supercharging" subtitle="Charge in minutes, not hours." primaryLabel="Find a Supercharger" primaryTo="/charging" secondaryLabel="Home Charging" secondaryTo="/charging" textColor="light" />
    </div>
  );
}
