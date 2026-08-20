'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto">
        <main className="relative px-6 sm:px-8 flex flex-col items-center justify-center min-h-[88vh] overflow-hidden">
          {/* faint paper-grain backdrop */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
          {/* single restrained accent — a stamp ring, slow ambient drift */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full border-[10px] border-primary/15 -z-10 animate-[ring-drift_9s_ease-in-out_infinite] motion-reduce:animate-none" />

          {/* signature element — a small stack of intercepted notes, desktop only */}
          <div
            className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-60 opacity-0 animate-[fade-up_0.7s_ease-out_forwards] motion-reduce:opacity-100 motion-reduce:animate-none"
            style={{ animationDelay: "520ms" }}
          >
            <div className="relative h-72 animate-[card-float_6s_ease-in-out_infinite] motion-reduce:animate-none">
              {/* back cards, just enough to read as a stack */}
              <div className="absolute inset-0 translate-x-3 translate-y-5 rotate-[7deg] bg-card/25 border border-border/25" />
              <div className="absolute inset-0 translate-x-1.5 translate-y-2.5 -rotate-3 bg-card/50 border border-border/30" />

              {/* front card */}
              <div className="group absolute inset-0 rotate-2 hover:rotate-0 transition-transform duration-300 bg-card border border-border/40 p-5 shadow-[6px_6px_0_0_rgba(0,0,0,0.35)]">
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-primary shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />

                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
                  From: Anonymous
                </p>

                <div className="space-y-2.5 mb-6">
                  <div className="h-2 w-[85%] bg-card-foreground/80 rounded-sm" />
                  <div className="h-2 w-[95%] bg-card-foreground/80 rounded-sm" />
                  <div className="h-2 w-[60%] bg-card-foreground/80 rounded-sm" />
                  <div className="h-2 w-[75%] bg-card-foreground/80 rounded-sm" />
                </div>

                <div className="inline-block rotate-[-10deg] border-2 border-primary/70 text-primary/70 px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] uppercase">
                  Received
                </div>
              </div>
            </div>
          </div>

          <section className="max-w-3xl text-center">
            <div
              className="mb-6 inline-flex items-center gap-2 border border-border/50 px-3 py-1 font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase opacity-0 animate-[fade-up_0.6s_ease-out_forwards] motion-reduce:opacity-100 motion-reduce:animate-none"
              style={{ animationDelay: "0ms" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Case File No. 000 — Open
            </div>

            <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] text-foreground mb-6">
              <span
                className="block opacity-0 animate-[fade-up_0.6s_ease-out_forwards] motion-reduce:opacity-100 motion-reduce:animate-none"
                style={{ animationDelay: "120ms" }}
              >
                <RedactReveal text="Anonymous" delay={480} /> feedback,
              </span>
              <span
                className="block opacity-0 animate-[fade-up_0.6s_ease-out_forwards] motion-reduce:opacity-100 motion-reduce:animate-none"
                style={{ animationDelay: "220ms" }}
              >
                actually <RedactReveal text="honest." delay={720} />
              </span>
            </h1>

            <p
              className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed opacity-0 animate-[fade-up_0.6s_ease-out_forwards] motion-reduce:opacity-100 motion-reduce:animate-none"
              style={{ animationDelay: "340ms" }}
            >
              Open a drop box for your audience. No names, no accounts to
              guess, no softened truths — just what people really think,
              delivered straight to you.
            </p>

            <div
              className="w-full flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-[fade-up_0.6s_ease-out_forwards] motion-reduce:opacity-100 motion-reduce:animate-none"
              style={{ animationDelay: "440ms" }}
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base rounded-sm -rotate-1 hover:rotate-0 transition-transform duration-200 active:scale-95 shadow-[3px_3px_0_0_rgb(156,139,94)]"
                >
                  Open Your Drop Box
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-base border border-border/50 text-foreground hover:bg-foreground/5 rounded-sm bg-transparent transition-transform duration-150 active:scale-95"
                >
                  How It Works
                </Button>
              </Link>
            </div>
          </section>
        </main>

        <Features />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}

function RedactReveal({ text, delay }: { text: string; delay: number }) {
  return (
    <span className="relative inline-block text-primary">
      {text}
      <span
        aria-hidden
        className="absolute inset-0 bg-background border border-border/40 origin-right motion-reduce:hidden"
        style={{
          animation: "redact-reveal 0.55s cubic-bezier(.65,0,.35,1) forwards",
          animationDelay: `${delay}ms`,
        }}
      />
    </span>
  );
}