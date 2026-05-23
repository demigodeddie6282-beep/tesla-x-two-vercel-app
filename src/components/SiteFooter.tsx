const cols = [
  ["Nexora", ["About", "Careers", "Newsroom", "Investor Relations"]],
  ["Marketplace", ["Vehicles", "Robotics", "Crypto", "IPO Access"]],
  ["Support", ["Contact", "Customer Service", "Find Us", "Legal"]],
  ["Connect", ["Locations", "Events", "Forum", "Subscribe"]],
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {cols.map(([title, items]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {items.map((it) => (
                  <li key={it}>
                    <a href="#" className="text-sm text-foreground hover:opacity-60 transition-opacity">
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-xs text-muted-foreground">
          <span>Nexora © {new Date().getFullYear()}. The Future of Wealth & Intelligence.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
