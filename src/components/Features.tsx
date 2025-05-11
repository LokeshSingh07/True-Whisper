import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, User, Shield } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "100% Anonymous",
      description: "Messages are completely anonymous with no tracking or user identification.",
      icon: <Shield className="h-12 w-12 text-primary" />
    },
    {
      title: "Easy Sharing",
      description: "Share your unique feedback link on social media or directly to friends.",
      icon: <User className="h-12 w-12 text-primary" />
    },
    {
      title: "Honest Feedback",
      description: "Get genuine insights from people who can express themselves freely.",
      icon: <MessageSquare className="h-12 w-12 text-primary" />
    }
  ];
  
  return (
    <section className="py-16 px-6 sm:px-8 bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            TrueWhisper makes it simple to gather anonymous feedback from anyone in your network.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index}>
              <Card className="h-full border-primary/20 hover:border-primary/40 transition-all rounded-2xl">
                <CardHeader className="flex items-center pb-2">
                  <div className="p-3 rounded-lg bg-primary/10 animate-pulse-glow mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;