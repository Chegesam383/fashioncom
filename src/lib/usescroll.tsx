import { useState, useEffect } from "react";

export default function useScroll() {
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("");
  const scrollThreshold = 50; // Set this to the threshold value to ignore slight scrolls

  useEffect(() => {
    const updateScrollPosition = () => {
      const currentScrollTop = window.scrollY;
      const currentScrollLeft = window.scrollX;

      // Ignore small scrolls (below the threshold)
      if (Math.abs(currentScrollTop - lastScrollTop) > scrollThreshold) {
        setScrollY(currentScrollTop);
        setScrollX(currentScrollLeft);
        setScrollDirection(currentScrollTop > lastScrollTop ? "down" : "up");
        setLastScrollTop(currentScrollTop);
      }
    };

    window.addEventListener("scroll", updateScrollPosition);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("scroll", updateScrollPosition);
    };
  }, [lastScrollTop]); // Re-run the effect when `lastScrollTop` changes

  return {
    lastScrollTop,
    scrollY,
    scrollX,
    scrollDirection,
  };
}
