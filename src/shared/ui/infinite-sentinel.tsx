import { useEffect, useRef } from 'react';

interface InfiniteSentinelProps {
  onIntersect: () => void;
  enabled: boolean;
  rootMargin?: string;
}

// IntersectionObserver 센티넬. 요소가 뷰포트 진입 시 onIntersect 호출.
// onIntersect 는 latest-ref 로 참조해 observer 재생성 없이 최신 콜백 사용.
export const InfiniteSentinel = ({ onIntersect, enabled, rootMargin = '200px' }: InfiniteSentinelProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const latestOnIntersect = useRef(onIntersect);
  useEffect(() => {
    latestOnIntersect.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) latestOnIntersect.current();
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return <div ref={ref} aria-hidden className="h-4 w-full" />;
};
