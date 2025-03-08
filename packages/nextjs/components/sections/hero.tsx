"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          className="font-orbitron text-5xl md:text-7xl font-bold mb-6 neon-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          MintedIn
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8 text-cyber-teal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          The Next Generation Web3 Reputation System
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row justify-center gap-4 items-center"
        >
          <Link
            href="/mint"
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyber-teal to-electric-purple text-white font-semibold hover:shadow-neon-teal transition-shadow duration-300"
          >
            Get Started
          </Link>
          <ConnectButton />
        </motion.div>
      </div>
    </section>
  );
}
