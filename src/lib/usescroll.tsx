import { useState, useEffect } from "react";

export default function useScroll() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("");

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const currentScrollX = window.scrollX;

          if (Math.abs(currentScrollY - lastScrollTop) > 10) {
            // Added threshold
            setScrollDirection(lastScrollTop > currentScrollY ? "up" : "down");
            setLastScrollTop(currentScrollY);
          }

          setScrollY(currentScrollY);
          setScrollX(currentScrollX);

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]);

  return { scrollY, scrollX, scrollDirection };
}
