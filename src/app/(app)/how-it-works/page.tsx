'use client'

import React from 'react';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, User, Link, Shield, SendHorizontal } from "lucide-react";


const HowItWorks = () => {


  const steps = [
    {
      title: "Create Your Profile",
      description: "Sign up for an TrueWhisper account in seconds. No personal information required.",
      icon: <User className="h-12 w-12 text-primary" />
    },
    {
      title: "Share Your Link",
      description: "Get your unique feedback link and share it on social media, email, or with friends.",
      icon: <Link className="h-12 w-12 text-primary" />
    },
    {
      title: "Stay Anonymous",
      description: "People can send you messages without revealing their identity.",
      icon: <Shield className="h-12 w-12 text-primary" />
    },
    {
      title: "Receive Feedback",
      description: "Get honest opinions, feedback, and messages in your private dashboard.",
      icon: <MessageSquare className="h-12 w-12 text-primary" />
    },
    {
      title: "Respond If You Want",
      description: "Optionally respond to messages while maintaining everyone's privacy.",
      icon: <SendHorizontal className="h-12 w-12 text-primary" />
    }
  ];

  const faqItems = [
    {
      question: "Is it really anonymous?",
      answer:
        "Yes, completely! We don't track IP addresses or store any identifying information about message senders.",
    },
    {
      question: "Can I delete messages I receive?",
      answer:
        "Absolutely. You have full control over your inbox and can delete any message at any time.",
    },
    {
      question: "Is there a limit to how many messages I can receive?",
      answer:
        "Our free plan allows up to 25 messages per month. Premium plans offer unlimited messaging.",
    },
];
  

  return (
    <div className="bg-gradient-dark min-h-screen">
      <div className="pt-24 pb-16 px-6 sm:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">How TrueWhisper Works</h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Receive honest, anonymous feedback from anyone in just a few simple steps.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index}>
                <Card className="glass-effect h-full border-primary/20 hover:border-primary/40 transition-all">
                  <CardContent className="pt-6 flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 animate-pulse-glow mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqItems.map((faq, index) => (
                <Card key={index} className="glass-effect">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
                    <p className="text-gray-300">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorks;
