"use client";

import { useEffect, useRef } from "react";

export function useKineticType() {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        
        if (!containerRef.current) return;

        const revealElements = containerRef.current.querySelectorAll(".clip-reveal");

        if (prefersReducedMotion) {
            revealElements.forEach((el) => {
                el.classList.add("in-view");
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -15% 0px"
        });

        revealElements.forEach((el, index) => {
            if (!el.className.includes("delay-")) {
                 const delayClass = `delay-${((index % 5) + 1) * 100}`;
                 el.classList.add(delayClass);
            }
            observer.observe(el);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return containerRef;
}
