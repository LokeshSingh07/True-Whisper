'use client'

import React from 'react';
import Footer from '@/components/Footer';
import { MessageSquare, User, Link as LinkIcon, Shield, SendHorizontal } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      title: "Create Your Profile",
      description: "Sign up for a TrueWhisper account in seconds. No personal information required.",
      icon: User,
    },
    {
      title: "Share Your Link",
      description: "Get your unique feedback link and share it on social media, email, or with friends.",
      icon: LinkIcon,
    },
    {
      title: "Stay Anonymous",
      description: "People can send you messages without revealing their identity.",
      icon: Shield,
    },
    {
      title: "Receive Feedback",
      description: "Get honest opinions, feedback, and messages in your private dashboard.",
      icon: MessageSquare,
    },
    {
      title: "Respond If You Want",
      description: "Optionally respond to messages while maintaining everyone's privacy.",
      icon: SendHorizontal,
    },
  ];

  const faqItems = [
    {
      question: "Is it really anonymous?",
      answer:
        "Yes, completely. We don't track IP addresses or store any identifying information about message senders.",
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
    <div className="bg-background min-h-screen">
      <div className="pt-28 pb-20 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <p className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase mb-3">
              Procedure Manual
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 font-mono text-foreground">
              How TrueWhisper Works
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Receive honest, anonymous feedback from anyone in five simple steps.
            </p>
          </div>

          {/* Steps — docket list */}
          <div className="relative">
            <div className="absolute left-[27px] top-2 bottom-2 w-px bg-border/25" />
            <div className="space-y-10">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative flex gap-6 items-start">
                    <div className="relative z-10 flex-shrink-0 h-14 w-14 rounded-full bg-background border border-border/50 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" strokeWidth={1.75} />
                    </div>
                    <div className="pt-2">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="font-mono text-xs text-muted-foreground tracking-widest">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-xl font-bold font-mono text-foreground">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-28">
            <p className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase mb-3 text-center">
              Addendum
            </p>
            <h2 className="text-3xl font-bold mb-10 text-center font-mono text-foreground">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <div
                  key={index}
                  className="bg-card text-card-foreground p-6 sm:p-7 border-l-4 border-primary"
                >
                  <h3 className="font-mono font-bold text-lg mb-2">{faq.question}</h3>
                  <p className="text-[#3A362C] leading-relaxed">{faq.answer}</p>
                </div>
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