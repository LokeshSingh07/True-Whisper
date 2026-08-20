import React from 'react';
import { EyeOff } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-12 px-6 sm:px-8 border-t border-border bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-primary" />
            <span className="font-mono font-bold text-foreground">TrueWhisper</span>
          </div>

          <div className="flex flex-row gap-6 font-mono text-xs tracking-wide uppercase">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition">
              About
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition">
              Privacy
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition">
              Terms
            </Link>
            <Link
              href="https://www.codewithlokesh.com/contact"
              className="text-muted-foreground hover:text-foreground transition"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="h-px bg-border/20 mb-6" />

        <div className="text-center font-mono text-[11px] tracking-wide text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TrueWhisper — All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;