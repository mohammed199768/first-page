"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on desktop/devices with fine pointer
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setIsVisible(true);

    let hoveredElement: HTMLElement | null = null;

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Magnetic Physics
      if (hoveredElement && hoveredElement.classList.contains("magnetic")) {
        const rect = hoveredElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance from center (max pull is 20px)
        const pullX = ((e.clientX - centerX) / rect.width) * 20;
        const pullY = ((e.clientY - centerY) / rect.height) * 20;

        hoveredElement.style.transform = `translate(${pullX}px, ${pullY}px)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest("a, button, .interactive, .magnetic") as HTMLElement;

      if (interactiveEl) {
        setIsHovering(true);
        hoveredElement = interactiveEl;
        if (interactiveEl.classList.contains("magnetic")) {
          interactiveEl.style.transition = "transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)";
        }
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (hoveredElement && hoveredElement.classList.contains("magnetic")) {
        // Reset position with a bouncy transition
        hoveredElement.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
        hoveredElement.style.transform = "translate(0px, 0px)";
      }
      hoveredElement = null;
      setIsHovering(false);
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full mix-blend-difference pointer-events-none z-[9999] transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${position.x - 6}px, ${position.y - 6}px, 0) scale(${isHovering ? 0 : 1})`
        }}
      />
      <div 
        className="fixed top-0 left-0 w-12 h-12 border border-white rounded-full mix-blend-difference pointer-events-none z-[9999] transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${position.x - 24}px, ${position.y - 24}px, 0) scale(${isHovering ? 1.5 : 0})`,
          opacity: isHovering ? 1 : 0
        }}
      />
    </>
  );
}
