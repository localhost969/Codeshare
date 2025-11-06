import Image from 'next/image';
import { useEffect, useState } from 'react';
import Bar from './Bar';

export default function Hero() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="w-full pt-16 mb-20">
      {/* ✅ Main grid container */}
      <div className="w-full flex justify-center px-12">
        <div className="max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* LEFT: Title + Search */}
            <div className="flex flex-col justify-start mt-12">
              <div className="lg:max-w-lg">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
                  Codeshare
                </h1>

                <p
                  className="text-xl sm:text-2xl leading-relaxed mb-8"
                  style={{ color: 'var(--muted)' }}
                >
                  Real-time code sharing platform. Create, share, and collaborate on code snippets
                  securely, just like protectedtext.com for code.
                </p>

                {/* Search bar */}
                <div className="mt-4 w-full md:w-4/5 lg:w-3/4">
                  <Bar />
                </div>
              </div>
            </div>

            {/* RIGHT: Hero illustration */}
            <div className="hidden md:flex flex-col justify-start items-center lg:items-end space-y-6 mt-4">
              <div
                className="relative w-full max-w-sm flex justify-center lg:justify-end"
                style={{ maxHeight: '150px', minHeight: 120 }}
              >
                <div
                  className="absolute inset-0 rounded-3xl blur-3xl"
                  style={{
                    background:
                      'linear-gradient(to top right, var(--accent) 0%, var(--accent) 10%, transparent 70%)',
                    zIndex: 0,
                  }}
                />
                <div className="relative z-10">
                  <Image
                    src={isDark ? '/hero_d.png' : '/hero.png'}
                    alt="Notepad icon"
                    width={350}
                    height={350}
                    className="max-w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Dashboard preview OUTSIDE the grid & container */}
      <div className="w-full mt-16 flex justify-center px-12">
        <div className="w-full max-w-6xl">
          <div className="relative">
            <Image
              src={isDark ? '/d2.png' : '/d1.png'}
              alt="Dashboard screenshot"
              width={1536}
              height={512}
              className="rounded-2xl border w-full h-auto object-contain"
              style={{
                border: '4px solid transparent',
                boxShadow:
                  '0 8px 32px 0 rgba(127,90,240,0.15), 0 1.5px 8px 0 rgba(44,182,125,0.10)',
                borderRadius: '1rem', // match rounded-2xl
              }}
              priority
            />
            <style jsx>{`
              .relative::before {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: 1rem;
                padding: 4px;
                pointer-events: none;
                z-index: 2;
                background: linear-gradient(
                  135deg,
                  #7F5AF0 0%,
                  #2CB67D 20%,
                  #F7C873 50%,
                  #7F5AF0 80%,
                  #2CB67D 100%
                );
                background-size: 400% 400%;
                animation: borderMove 3s linear infinite;
                -webkit-mask:
                  linear-gradient(#fff 0 0) content-box,
                  linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
              }
              @keyframes borderMove {
                0% { background-position: 0% 50%; }
                100% { background-position: 100% 50%; }
              }
            `}</style>
          </div>
        </div>
      </div>
    </header>
  );
}
