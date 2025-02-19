import { useState, useEffect } from "react";

export default function useScroll() {
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [bodyOffset, setBodyOffset] = useState(
    document.body.getBoundingClientRect()
  );
  const [scrollY, setScrollY] = useState(bodyOffset.top);
  const [scrollX, setScrollX] = useState(bodyOffset.left);
  const [scrollDirection, setScrollDirection] = useState("");
  const scrollThreshold = 20; // Set this to the threshold value to ignore slight scrolls

  const listener = () => {
    setBodyOffset(document.body.getBoundingClientRect());
    const currentScrollTop = -bodyOffset.top;

    // Ignore small scrolls (below the threshold)
    if (Math.abs(currentScrollTop - lastScrollTop) > scrollThreshold) {
      setScrollY(currentScrollTop);
      setScrollX(bodyOffset.left);
      setScrollDirection(currentScrollTop > lastScrollTop ? "down" : "up");
      setLastScrollTop(currentScrollTop);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listener);
    return () => {
      window.removeEventListener("scroll", listener);
    };
  });

  return {
    scrollY,
    scrollX,
    scrollDirection,
  };
}
