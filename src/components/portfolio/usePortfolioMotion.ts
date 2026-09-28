"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { useLocale } from "./Locale";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function usePortfolioMotion(
  root: RefObject<HTMLDivElement>,
  enabled: boolean,
) {
  const { code } = useLocale();
  useEffect(() => {
    if (!root.current || !enabled) return;
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 42,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 91%", once: true },
          clearProps: "all",
        });
      });
      gsap.utils.toArray<HTMLElement>(".project-stage").forEach((element) => {
        gsap.fromTo(
          element.querySelector(".project-mockup"),
          { rotateX: 14, rotateY: -12, y: 45 },
          {
            rotateX: 0,
            rotateY: 5,
            y: -18,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.4,
            },
          },
        );
      });
      gsap.to(".contact-asterisk", {
        rotate: 160,
        ease: "none",
        scrollTrigger: {
          trigger: "#contact",
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      gsap.from(".hilbert-trace", {
        strokeDashoffset: 1,
        duration: 2.5,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".hilbert-window",
          start: "top 85%",
          once: true,
        },
      });
      ScrollTrigger.refresh();
    }, root);
    const element = root.current;
    const refresh = () => ScrollTrigger.refresh();
    element.addEventListener("toggle", refresh, true);
    return () => {
      element.removeEventListener("toggle", refresh, true);
      context.revert();
    };
  }, [root, enabled, code]);
}
