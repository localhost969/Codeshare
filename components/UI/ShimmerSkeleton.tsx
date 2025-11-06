import React from 'react';

interface ShimmerSkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  count?: number;
  gap?: string;
}

export default function ShimmerSkeleton({
  width = '100%',
  height = '20px',
  borderRadius = '6px',
  className = '',
  variant = 'rectangular',
  count = 1,
  gap = '8px',
}: ShimmerSkeletonProps) {
  const skeletons = Array.from({ length: count });

  const variantStyles = {
    text: { borderRadius: '4px', height: '20px' },
    circular: { borderRadius: '50%', width: '40px', height: '40px' },
    rectangular: { borderRadius },
  };

  const style = variant === 'circular' 
    ? variantStyles.circular 
    : variant === 'text' 
    ? variantStyles.text 
    : { ...variantStyles.rectangular, width, height };

  const shimmerKeyframes = `
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
  `;

  return (
    <>
      <style>{shimmerKeyframes}</style>
      {skeletons.map((_, index) => (
        <div
          key={index}
          className={className}
          style={{
            ...style,
            marginTop: index > 0 ? gap : '0',
            backgroundImage: `linear-gradient(
              90deg,
              var(--skeleton-base, #e5e7eb) 0%,
              var(--skeleton-highlight, #f3f4f6) 50%,
              var(--skeleton-base, #e5e7eb) 100%
            )`,
            backgroundSize: '1000px 100%',
            animation: 'shimmer 2s infinite',
          }}
        />
      ))}
    </>
  );
}
