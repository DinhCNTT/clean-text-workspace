import { useState, useEffect } from 'react';
import type { RefObject } from 'react';

export function useScroll(
  workspaceTopRef: RefObject<HTMLElement | null>,
  actionBarRef: RefObject<HTMLElement | null>
) {
  const [scrollPosition, setScrollPosition] = useState<'top' | 'bottom' | 'middle' | 'none'>('none');

  useEffect(() => {
    const handleScroll = () => {
      const isScrollable = document.documentElement.scrollHeight > window.innerHeight + 100;
      if (!isScrollable) {
        setScrollPosition('none');
        return;
      }

      let isTop = window.scrollY < 250;
      if (workspaceTopRef.current) {
        const rect = workspaceTopRef.current.getBoundingClientRect();
        isTop = rect.top > 80;
      }
      
      let isAtOrPastActionBar = false;
      if (actionBarRef.current) {
        const rect = actionBarRef.current.getBoundingClientRect();
        isAtOrPastActionBar = rect.top <= window.innerHeight;
      }

      if (isTop) {
        setScrollPosition('top');
      } else if (isAtOrPastActionBar) {
        setScrollPosition('bottom');
      } else {
        setScrollPosition('middle');
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    const resizeObserver = new ResizeObserver(() => handleScroll());
    resizeObserver.observe(document.body);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      resizeObserver.disconnect();
    };
  }, [workspaceTopRef, actionBarRef]);

  return scrollPosition;
}
