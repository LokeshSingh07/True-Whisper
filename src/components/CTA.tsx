import React from 'react';
import { Button } from "@/components/ui/button";

import Link from "next/link";

const CTA = () => {
  return (
    <section className="py-20 px-6 sm:px-8 bg-gradient-purple relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">Ready to gather 
            <span className='text-purple-400'> honest feedback?</span>
          </h2>
        </div>
        
        <div>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Create your anonymous feedback page in seconds and start collecting valuable insights.
          </p>
        </div>
        
        <div>
          <Link href="/signup">
            <Button size="lg" className="bg-white hover:bg-white/90 border-none px-8 py-6 text-lg rounded-full">
              Create Your Page Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA