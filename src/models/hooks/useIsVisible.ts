import { useEffect, useState } from "react";

export function useIsVisible(el: HTMLElement | undefined, options?: IntersectionObserverInit) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting), options);

    if(el) observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [el, options]);

  return isIntersecting;
}