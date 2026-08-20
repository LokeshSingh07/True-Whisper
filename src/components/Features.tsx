import React from 'react';
import { EyeOff, Share2, MessageSquareText } from "lucide-react";

const notes = [
  {
    label: "No names, ever",
    body: "Every message arrives with the sender stripped out — no account, no IP trail, no 'guess who' clues.",
    icon: EyeOff,
    rotate: "-rotate-2",
  },
  {
    label: "One link to share",
    body: "Drop your link in a bio or a group chat. Anyone can leave a note without signing up for anything.",
    icon: Share2,
    rotate: "rotate-1",
  },
  {
    label: "Feedback with teeth",
    body: "People say what they actually mean when their name isn't attached to it. That's the whole point.",
    icon: MessageSquareText,
    rotate: "-rotate-1",
  },
];

const Features = () => {
  return (
    <section className="relative py-24 px-6 sm:px-8 bg-background border-t border-border/15">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 max-w-xl">
          <p className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase mb-3">
            The Board
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-mono">
            What&apos;s pinned up
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {notes.map((note, i) => {
            const Icon = note.icon;
            return (
              <div
                key={i}
                className={`relative bg-card text-card-foreground p-7 pt-9 ${note.rotate} hover:rotate-0 transition-transform duration-200 shadow-[6px_6px_0_0_rgba(0,0,0,0.35)]`}
              >
                {/* pin */}
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-primary shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
                <Icon className="h-7 w-7 mb-4 text-primary" strokeWidth={1.75} />
                <h3 className="font-mono font-bold text-lg mb-2">{note.label}</h3>
                <p className="text-sm leading-relaxed text-card-foreground/70">{note.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;