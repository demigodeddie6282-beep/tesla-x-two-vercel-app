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
      {
        name: "description",
        content:
          "Tesla is accelerating the world's transition to sustainable energy with electric cars, solar and integrated renewable energy solutions.",
      },
    ],
  }),
  component: Index,
});

function IntroVideo() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-black">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        poster={modelS}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        crossOrigin="anonymous"
      >
        <source
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
          type="video/mp4"
        />
        <source
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80 pointer-events-none" />
      <div className="relative z-10 h-[100svh] flex flex-col items-center justify-center text-center text-white px-6">
        <p className="text-xs uppercase tracking-[0.3em] text-white/90 mb-4">Tesla</p>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.03] drop-shadow-lg">
          The Future, Accelerated
        </h1>
        <p className="mt-5 max-w-xl text-sm md:text-base text-white/85 drop-shadow">
          Electric vehicles, solar energy, and intelligent autonomy — engineered as one system.
        </p>
      </div>
    </section>
  );
}

function Index() {
  return (
    <div className="w-full">
      <IntroVideo />

      <HeroPanel
        image={modelY}
        eyebrow="New"
        title="Model Y"
        subtitle="The best-selling car in the world."
        primaryLabel="Order Now"
        primaryTo="/vehicles"
        secondaryLabel="Demo Drive"
        secondaryTo="/vehicles"
        textColor="light"
        imagePosition="center 55%"
        specs={[
          { label: "Range", value: "320 mi" },
          { label: "0–60 mph", value: "4.8 s" },
          { label: "Top Speed", value: "135 mph" },
          { label: "From", value: "$44,990" },
        ]}
      />

      <HeroPanel
        image={model3}
        title="Model 3"
        subtitle="Pure performance. Lease from $349/mo."
        primaryLabel="Order Now"
        primaryTo="/vehicles"
        secondaryLabel="Demo Drive"
        secondaryTo="/vehicles"
        textColor="light"
        imagePosition="center 55%"
        specs={[
          { label: "Range", value: "341 mi" },
          { label: "0–60 mph", value: "2.9 s" },
          { label: "Top Speed", value: "162 mph" },
          { label: "From", value: "$42,490" },
        ]}
      />

      <HeroPanel
        image={modelS}
        title="Model S"
        subtitle="Plaid. The quickest production sedan ever."
        primaryLabel="Order Now"
        primaryTo="/vehicles"
        secondaryLabel="Demo Drive"
        secondaryTo="/vehicles"
        textColor="light"
        imagePosition="center 55%"
        specs={[
          { label: "Range", value: "396 mi" },
          { label: "0–60 mph", value: "1.99 s" },
          { label: "Top Speed", value: "200 mph" },
          { label: "From", value: "$79,990" },
        ]}
      />

      <HeroPanel
        image={modelX}
        title="Model X"
        subtitle="Falcon Wing doors. Tri-Motor performance."
        primaryLabel="Order Now"
        primaryTo="/vehicles"
        secondaryLabel="Demo Drive"
        secondaryTo="/vehicles"
        textColor="light"
        imagePosition="center 55%"
        specs={[
          { label: "Range", value: "348 mi" },
          { label: "0–60 mph", value: "2.5 s" },
          { label: "Seating", value: "Up to 7" },
          { label: "From", value: "$84,990" },
        ]}
      />

      <HeroPanel
        image={cybertruck}
        title="Cybertruck"
        subtitle="Built for any planet."
        primaryLabel="Order Now"
        primaryTo="/vehicles"
        secondaryLabel="Demo Drive"
        secondaryTo="/vehicles"
        textColor="light"
        imagePosition="center 55%"
        specs={[
          { label: "Range", value: "340 mi" },
          { label: "0–60 mph", value: "2.6 s" },
          { label: "Towing", value: "11,000 lb" },
          { label: "From", value: "$79,990" },
        ]}
      />

      <HeroPanel
        image={semi}
        title="Tesla Semi"
        subtitle="Class 8 freight. All-electric."
        primaryLabel="Reserve"
        primaryTo="/vehicles"
        secondaryLabel="Specs"
        secondaryTo="/vehicles"
        textColor="light"
        imagePosition="center 50%"
        specs={[
          { label: "Range", value: "500 mi" },
          { label: "Charging", value: "70% in 30m" },
          { label: "Energy", value: "<2 kWh/mi" },
          { label: "From", value: "$180,000" },
        ]}
      />

      <HeroPanel
        image={roadster}
        eyebrow="Coming Soon"
        title="Roadster"
        subtitle="The quickest car in the world."
        primaryLabel="Reserve"
        primaryTo="/vehicles"
        secondaryLabel="Specs"
        secondaryTo="/vehicles"
        textColor="light"
        imagePosition="center 55%"
        specs={[
          { label: "0–60 mph", value: "1.9 s" },
          { label: "Top Speed", value: "250+ mph" },
          { label: "Range", value: "620 mi" },
          { label: "From", value: "$200,000" },
        ]}
      />

      <HeroPanel
        image={powerwall}
        title="Powerwall"
        subtitle="Power your home around the clock."
        primaryLabel="Order Now"
        primaryTo="/energy"
        secondaryLabel="Learn More"
        secondaryTo="/energy"
        textColor="light"
        imagePosition="center 50%"
        specs={[
          { label: "Capacity", value: "13.5 kWh" },
          { label: "Power", value: "11.5 kW peak" },
          { label: "Backup", value: "Whole-home" },
        ]}
      />

      <HeroPanel
        image={solarRoof}
        title="Solar Roof"
        subtitle="Produce clean energy from your roof."
        primaryLabel="Order Now"
        primaryTo="/energy"
        secondaryLabel="Learn More"
        secondaryTo="/energy"
        textColor="light"
        imagePosition="center 50%"
        specs={[
          { label: "Warranty", value: "25 years" },
          { label: "Tiles", value: "Glass + steel" },
          { label: "Integrates", value: "Powerwall" },
        ]}
      />

      <HeroPanel
        image={megapack}
        title="Megapack"
        subtitle="Utility-scale energy storage."
        primaryLabel="Learn More"
        primaryTo="/energy"
        textColor="light"
        imagePosition="center 50%"
        specs={[
          { label: "Capacity", value: "3.9 MWh" },
          { label: "Power", value: "1.9 MW" },
          { label: "Install", value: "Pre-assembled" },
        ]}
      />

      <HeroPanel
        image={charging}
        title="Supercharging"
        subtitle="Charge in minutes, not hours."
        primaryLabel="Find a Supercharger"
        primaryTo="/charging"
        secondaryLabel="Home Charging"
        secondaryTo="/charging"
        textColor="light"
        imagePosition="center 50%"
        specs={[
          { label: "Peak", value: "250 kW" },
          { label: "Range/15m", value: "200 mi" },
          { label: "Stalls", value: "60,000+" },
        ]}
      />
    </div>
  );
}
