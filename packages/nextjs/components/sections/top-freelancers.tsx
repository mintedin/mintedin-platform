"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

// Mockup data - In production, this would come from your API/subgraph
const freelancers = [
  {
    id: 1,
    name: "Alex Thompson",
    tier: "Gold",
    completedJobs: 45,
    rating: 4.9
  },
  {
    id: 2,
    name: "Sarah Chen",
    tier: "Silver",
    completedJobs: 28,
    rating: 4.8
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    tier: "Gold",
    completedJobs: 52,
    rating: 5.0
  }
];

export function TopFreelancers() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-3xl md:text-4xl font-orbitron font-bold mb-12 text-center neon-text"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          Top Rated Freelancers
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {freelancers.map((freelancer, index) => (
            <motion.div
              key={freelancer.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glassmorphism p-6 rounded-lg hover:shadow-neon-teal transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">{freelancer.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  freelancer.tier === "Gold" ? "bg-yellow-500/20 text-yellow-300" : "bg-gray-400/20 text-gray-300"
                }`}>
                  {freelancer.tier}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-cyber-teal" />
                <span className="text-white">{freelancer.rating}</span>
              </div>
              <p className="text-gray-400">
                {freelancer.completedJobs} jobs completed
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}