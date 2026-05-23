import { Link } from "@tanstack/react-router";

interface HeroPanelProps {
  image: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryLabel: string;
  primaryTo: string;
  secondaryLabel?: string;
  secondaryTo?: string;
  align?: "top" | "bottom";
  theme?: "light" | "dark";
  textColor?: "light" | "dark";
  height?: "screen" | "tall";
}

export function HeroPanel({
  image,
  eyebrow,
  title,
  subtitle,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
  align = "top",
  theme = "light",
  textColor = "dark",
  height = "screen",
}: HeroPanelProps) {
  const heightClass = height === "screen" ? "min-h-[100svh]" : "min-h-[85svh]";
  const justify = align === "top" ? "justify-start pt-24 md:pt-28" : "justify-end pb-24 md:pb-28";
  const text = textColor === "light" ? "text-white" : "text-foreground";
  const subtle = textColor === "light" ? "text-white/85" : "text-foreground/70";
  const primary = theme === "dark" ? "btn-hero-dark-primary" : "btn-hero-primary";
  const secondary = theme === "dark" ? "btn-hero-dark-secondary" : "btn-hero-secondary";

  return (
    <section
      className={`relative ${heightClass} flex flex-col items-center ${justify} overflow-hidden`}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className={`relative z-10 text-center px-6 ${text} animate-fade-up`}>
        {eyebrow && (
          <p className={`text-xs font-medium uppercase tracking-[0.2em] mb-3 ${subtle}`}>
            {eyebrow}
          </p>
        )}
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
          {title}
        </h1>
        {subtitle && (
          <p className={`mt-4 text-sm md:text-base max-w-xl mx-auto ${subtle}`}>{subtitle}</p>
        )}
      </div>

      <div className="absolute bottom-10 inset-x-0 z-10 flex flex-col md:flex-row items-center justify-center gap-3 px-6">
        <Link to={primaryTo} className={`btn-hero ${primary}`}>
          {primaryLabel}
        </Link>
        {secondaryLabel && secondaryTo && (
          <Link to={secondaryTo} className={`btn-hero ${secondary}`}>
            {secondaryLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
