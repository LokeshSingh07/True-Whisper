'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CTA = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = panelRef.current;
    if (!node) return;

    // If the browser can't observe, or the user prefers less motion, just show it.
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 px-6 sm:px-8 bg-background border-t border-border/15">
      <div className="max-w-4xl mx-auto">
        <div
          ref={panelRef}
          className={`relative border border-border/40 p-10 sm:p-14 text-center transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* corner marks — stamp in one at a time once the panel is visible */}
          <span
            className={`absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-muted-foreground origin-top-left transition-transform duration-300 ${
              isVisible ? "scale-100" : "scale-0"
            }`}
            style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}
          />
          <span
            className={`absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-muted-foreground origin-top-right transition-transform duration-300 ${
              isVisible ? "scale-100" : "scale-0"
            }`}
            style={{ transitionDelay: isVisible ? "380ms" : "0ms" }}
          />
          <span
            className={`absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-muted-foreground origin-bottom-left transition-transform duration-300 ${
              isVisible ? "scale-100" : "scale-0"
            }`}
            style={{ transitionDelay: isVisible ? "460ms" : "0ms" }}
          />
          <span
            className={`absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-muted-foreground origin-bottom-right transition-transform duration-300 ${
              isVisible ? "scale-100" : "scale-0"
            }`}
            style={{ transitionDelay: isVisible ? "540ms" : "0ms" }}
          />

          <p className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase mb-4">
            Ready when you are
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-mono mb-5">
            Open your drop box
          </h2>
          <p className="text-muted-foreground mb-9 max-w-xl mx-auto">
            Takes under a minute. No credit card, no verification — just a
            link you can start sharing today.
          </p>

          <Link href="/signup">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-9 py-6 text-base rounded-sm rotate-1 hover:rotate-0 transition-transform duration-200 active:scale-95 shadow-[3px_3px_0_0_rgb(156,139,94)]"
            >
              Create Your Page
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;