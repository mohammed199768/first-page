"use client";

import { useEffect, useRef } from "react";

export function useGSAPFade() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        
        if (!containerRef.current) return;

        const fadeElements = containerRef.current.querySelectorAll(".fade-up");

        if (prefersReducedMotion) {
            fadeElements.forEach((el) => {
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
            rootMargin: "0px 0px -10% 0px"
        });

        fadeElements.forEach((el, index) => {
            // Apply delay based on index for stagger effect
            const delayClass = `delay-${((index % 4) + 1) * 100}`;
            el.classList.add(delayClass);
            observer.observe(el);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return containerRef;
}
