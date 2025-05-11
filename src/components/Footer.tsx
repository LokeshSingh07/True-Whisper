import React from 'react';
import { MessageSquare } from "lucide-react";
import Link from "next/link"
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="py-12 px-6 sm:px-8 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <MessageSquare className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold gradient-text">TrueWhisper</span>
          </div>
          
          <div className="flex flex-row gap-4 justify-center">
            <Link href="/" className="text-gray-300 hover:text-white transition">
              About
            </Link>
            <Link href="/" className="text-gray-300 hover:text-white transition">
              Privacy
            </Link>
            <Link href="/" className="text-gray-300 hover:text-white transition">
              Terms
            </Link>
            <Link href="https://www.codewithlokesh.com/contact" className="text-gray-300 hover:text-white transition">
              Contact
            </Link>
          </div>
        </div>
        
        <Separator className="bg-white/10 my-6" />
        
        <div className="text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} TrueWhisper. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;