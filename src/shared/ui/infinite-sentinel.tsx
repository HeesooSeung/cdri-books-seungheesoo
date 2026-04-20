import { useEffect, useRef } from 'react';

interface InfiniteSentinelProps {
  onIntersect: () => void;
  enabled: boolean;
  rootMargin?: string;
}

// IntersectionObserver 센티넬. 요소가 뷰포트 진입 시 onIntersect 호출.
export const InfiniteSentinel = ({ onIntersect, enabled, rootMargin = '200px' }: InfiniteSentinelProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onIntersect();
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, onIntersect, rootMargin]);

  return <div ref={ref} aria-hidden className="h-4 w-full" />;
};
