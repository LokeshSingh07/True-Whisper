'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";



export default function Home() {




  return (
    <div className="max-w-7xl mx-auto">
      {/* Background visual effects */}
      <div className="absolute top-0 left-0 w-full h-[100vh] -z-10 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-500 opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] bg-pink-500 opacity-20 rounded-full blur-2xl animate-ping"></div>
        <div className="absolute top-[50%] left-[30%] w-[200px] h-[200px] bg-blue-400 opacity-10 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <main className="px-6 sm:px-8 flex flex-col items-center justify-center min-h-[80vh] max-h-[90vh]">
        <section className="max-w-5xl ">
            <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold mb-6 gradient-text leading-tight"><span className="text-purple-400">Anonymous </span> Feedback That Matters</h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Get honest opinions, suggestions, and feedback from your audience without the barrier of identity. Simple, private, and insightful.</p>

            <div className="w-full flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                  <Button size="lg" className="bg-primary hover:bg-primary/80 px-8 py-6 text-lg rounded-full">
                  Create Your Page
                  </Button>
              </Link>
              <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg border border-gray-700 rounded-full">
                  How It Works
                  </Button>
              </Link>
            </div>
        </section>        
      </main>

      {/* carousel */}
      {/* <div className="mx-auto flex justify-center items-center">
        <Carousel 
          plugins={[Autoplay({delay: 2000})]}
          className="w-full max-w-xs"
        >
          <CarouselContent>
            {messages.map((msg, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col  items-center justify-center p-6 gap-2">
                      <p className="text-xl font-semibold">{msg.title}</p>
                      <p className="text-lg font-semibold">{msg.content}</p>
                      <p className="text-lg font-semibold">{msg.received}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div> */}

      <Features/>
      <CTA/>
      <Footer/>
    </div>
  );
}
