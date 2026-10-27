const ITEMS = [
  "WEBSITES",
  "APLICATIVOS",
  "SISTEMAS",
  "AUTOMAÇÕES",
  "DESIGN",
  "ENGENHARIA",
];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-line bg-charcoal py-4">
      <div className="marquee-track">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center" aria-hidden={half === 1}>
            {row.map((item, i) => (
              <span key={`${half}-${i}`} className="flex items-center">
                <span className="px-6 font-mono text-[11px] tracking-[0.3em] text-steel">
                  {item}
                </span>
                <span className="h-1 w-1 rotate-45 bg-cobalt/70" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
