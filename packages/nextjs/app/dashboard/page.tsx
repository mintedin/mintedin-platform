"use client";

import { motion } from "framer-motion";
import { Shield, Award, Briefcase } from "lucide-react";
import { useAccount } from "wagmi";

export default function DashboardPage() {
  const { address } = useAccount();

  const stats = [
    {
      icon: Shield,
      label: "Current Tier",
      value: "Silver",
    },
    {
      icon: Award,
      label: "Points",
      value: "450",
    },
    {
      icon: Briefcase,
      label: "Completed Jobs",
      value: "12",
    },
  ];

  return (
    <div className="min-h-screen bg-cyber-gradient py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="glassmorphism p-8 rounded-lg mb-8">
          <h1 className="text-3xl font-orbitron font-bold mb-4 neon-text">
            Freelancer Dashboard
          </h1>
          <p className="text-gray-400 mb-4">
            Wallet: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="cyber-border p-6 rounded-lg bg-black/30"
              >
                <stat.icon className="w-8 h-8 text-cyber-teal mb-2" />
                <p className="text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glassmorphism p-8 rounded-lg"
          >
            <h2 className="text-2xl font-orbitron font-bold mb-4 text-white">
              Active Jobs
            </h2>
            <div className="space-y-4">
              {/* Placeholder for active jobs */}
              <p className="text-gray-400">No active jobs at the moment</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glassmorphism p-8 rounded-lg"
          >
            <h2 className="text-2xl font-orbitron font-bold mb-4 text-white">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {/* Placeholder for activity feed */}
              <p className="text-gray-400">No recent activity</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}