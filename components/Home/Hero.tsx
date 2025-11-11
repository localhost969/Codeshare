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
      {/* ✅ Centered hero section */}
      <div className="w-full flex justify-center px-4 sm:px-12">
        <div className="w-full max-w-2xl">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Title */}
            <div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4">
                Codeshare
              </h1>
              <p
                className="text-lg sm:text-xl md:text-2xl leading-relaxed"
                style={{ color: 'var(--muted)' }}
              >
                Secure, collaborative code sharing for teams and professionals.
              </p>
            </div>

            {/* Search bar */}
            <div className="w-full max-w-xl">
              <Bar />
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
