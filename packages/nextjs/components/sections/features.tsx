"use client";

import { motion } from "framer-motion";
import { Shield, Award, Wallet } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Reputation",
    description: "Your professional reputation, secured on the blockchain"
  },
  {
    icon: Award,
    title: "Tier System",
    description: "Progress through tiers as you complete projects"
  },
  {
    icon: Wallet,
    title: "Escrow Protection",
    description: "Safe and secure payments for all projects"
  }
];

export function Features() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="glassmorphism p-6 rounded-lg"
            >
              <feature.icon className="w-12 h-12 text-cyber-teal mb-4" />
              <h3 className="text-xl font-orbitron font-bold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}