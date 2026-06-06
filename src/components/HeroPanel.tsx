import { Link } from "@tanstack/react-router";

export interface SpecItem {
  label: string;
  value: string;
}

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
  imagePosition?: string;
  specs?: SpecItem[];
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
  imagePosition = "center",
  specs,
}: HeroPanelProps) {
  const heightClass = height === "screen" ? "min-h-[100svh]" : "min-h-[85svh]";
  const justify = align === "top" ? "justify-start pt-20 md:pt-24" : "justify-end pb-32 md:pb-36";
  const text = textColor === "light" ? "text-white" : "text-foreground";
  const subtle = textColor === "light" ? "text-white/90" : "text-foreground/75";
  const primary = theme === "dark" ? "btn-hero-dark-primary" : "btn-hero-primary";
  const secondary = theme === "dark" ? "btn-hero-dark-secondary" : "btn-hero-secondary";

  // Soft gradient ensures text legibility without obscuring the vehicle.
  const overlayClass =
    textColor === "light"
      ? "bg-gradient-to-b from-black/30 via-transparent to-black/40"
      : "bg-gradient-to-b from-white/0 via-transparent to-white/30";

  return (
    <section className={`relative ${heightClass} flex flex-col items-center ${justify} overflow-hidden`}>
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: imagePosition }}
        loading="lazy"
      />
      <div className={`absolute inset-0 ${overlayClass} pointer-events-none`} />

      <div className={`relative z-10 text-center px-6 ${text} animate-fade-up`}>
        {eyebrow && (
          <p className={`text-xs font-medium uppercase tracking-[0.25em] mb-3 ${subtle}`}>{eyebrow}</p>
        )}
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] drop-shadow-sm">
          {title}
        </h2>
        {subtitle && (
          <p className={`mt-4 text-sm md:text-base max-w-xl mx-auto ${subtle}`}>{subtitle}</p>
        )}
      </div>

      {specs && specs.length > 0 && (
        <div className="hidden md:flex absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-10 flex-col gap-3 max-w-[220px]">
          {specs.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl backdrop-blur-md bg-white/15 border border-white/25 px-4 py-3 text-white shadow-lg"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] opacity-80">{s.label}</p>
              <p className="text-base font-semibold tabular-nums leading-tight mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {specs && specs.length > 0 && (
        <div className="md:hidden absolute left-4 right-4 bottom-24 z-10 flex flex-wrap gap-2 justify-center">
          {specs.map((s) => (
            <span
              key={s.label}
              className="text-[11px] font-medium tracking-wide rounded-full bg-white/85 text-black px-3 py-1.5 backdrop-blur"
            >
              <span className="opacity-60 uppercase mr-1">{s.label}</span>
              <span className="font-semibold">{s.value}</span>
            </span>
          ))}
        </div>
      )}

      <div className="absolute bottom-8 inset-x-0 z-10 flex flex-col md:flex-row items-center justify-center gap-3 px-6">
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
