import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
  const colors = [
    { name: "Background", var: "--background" },
    { name: "Foreground", var: "--foreground" },
    { name: "Muted", var: "--muted" },
    { name: "Accent", var: "--accent" },
    { name: "Accent Hover", var: "--accent-hover" },
    { name: "Border", var: "--border" },
    { name: "Code BG", var: "--code-bg" },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-6 py-16 font-sans">
      {/* HEADER */}
      <header className="text-center mb-20 flex flex-col items-center gap-4">
        <ThemeToggle />
        <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tight mb-3">
          Solar Mist & Lunar Circuit
        </h1>
        <p className="text-(--muted) text-lg max-w-md mx-auto leading-relaxed">
          A never-before-seen fusion of warmth and digital cool. <br />
          Switch your system theme to experience <em>Solar Mist</em> (light) or{" "}
          <em>Lunar Circuit</em> (dark).
        </p>
      </header>

      {/* COLOR GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl mb-24">
        {colors.map((c) => (
          <div
            key={c.name}
            className="group rounded-2xl border border-(--border) overflow-hidden shadow-sm backdrop-blur-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`h-28`}
              style={{ backgroundColor: `var(${c.var})` }}
            />
            <div className="p-5" style={{ backgroundColor: 'var(--background)' }}>
              <h2 className="text-lg mb-1 group-hover:text-(--accent)">
                {c.name}
              </h2>
              <code className="text-xs text-(--muted) font-mono">
                {c.var}
              </code>
            </div>
          </div>
        ))}
      </section>

      {/* TYPOGRAPHY + ELEMENT SHOWCASE */}
      <section className="w-full max-w-3xl text-center space-y-8">
        <h2 className="text-3xl md:text-4xl tracking-tight">
          Typography & Elements
        </h2>

        <p className="text-(--muted) leading-relaxed max-w-2xl mx-auto">
          Experience clarity and style with the rare{" "}
          <span className="font-bold">Cal Sans</span> UI font and{" "}
          <span className="font-bold">Berkeley Mono</span> for code. <br />
          Designed for creators who want a truly unique coding environment.
        </p>

        <div className="space-y-6 mt-10">
          <div>
            <h3 className="text-2xl md:text-3xl mb-2">Primary Button</h3>
            <button
              className="px-6 py-2 rounded-lg text-(--background) shadow-sm transition-colors font-medium"
              style={{
                backgroundColor: 'var(--accent)',
                borderColor: 'var(--accent)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
              aria-label="Launch Solar Circuit"
            >
              Launch Solar Circuit
            </button>
          </div>

          <div>
            <h3 className="text-2xl md:text-3xl mb-2">Text Link</h3>
            <a
              href="#"
              className="inline-block underline decoration-dotted hover:decoration-wavy transition-colors"
              style={{
                color: 'var(--accent)',
                textDecorationColor: 'var(--accent)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-hover)';
                e.currentTarget.style.textDecorationColor = 'var(--accent-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--accent)';
                e.currentTarget.style.textDecorationColor = 'var(--accent)';
              }}
            >
              Discover the new spectrum →
            </a>
          </div>

          <div>
            <h3 className="text-2xl md:text-3xl mb-2">Code Block</h3>
            <div
              className="p-4 rounded-lg text-left font-mono text-sm overflow-x-auto"
              style={{
                backgroundColor: 'var(--code-bg)',
                color: 'var(--accent)',
              }}
            >
              <code>
                {`const theme = "🌞 Solar Mist | 🌚 Lunar Circuit";\nconsole.log("Unique code, unique colors!");`}
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-24 text-(--muted) text-sm text-center">
        <p>
          Designed for the future • Powered by Tailwind&nbsp;
          <span className="text-(--accent)">v4</span>
        </p>
      </footer>
    </div>
  );
}