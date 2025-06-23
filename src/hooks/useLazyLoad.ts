import { useEffect, useRef, useState } from "react";

interface UseLazyLoadOptions {
  rootMargin?: string;
  threshold?: number | number[];
}

export function useLazyLoad<T extends HTMLElement>(
  options: UseLazyLoadOptions = {}
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: options.rootMargin || "50px",
        threshold: options.threshold || 0,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options.rootMargin, options.threshold]);

  return [ref, isIntersecting];
}