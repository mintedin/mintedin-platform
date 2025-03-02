"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Shield } from "lucide-react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function MintPage() {
  const { isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    expertise: "",
    bio: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Integration with smart contract will go here
    setTimeout(() => setIsLoading(false), 2000);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-cyber-gradient flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphism p-8 rounded-lg text-center"
        >
          <Shield className="w-16 h-16 text-cyber-teal mx-auto mb-4" />
          <h1 className="text-3xl font-orbitron font-bold mb-4 neon-text">
            Connect Wallet
          </h1>
          <p className="text-gray-400 mb-6">
            Please connect your wallet to mint your Freelancer NFT
          </p>
          <ConnectButton />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-gradient py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto glassmorphism p-8 rounded-lg"
      >
        <h1 className="text-3xl font-orbitron font-bold mb-8 neon-text text-center">
          Mint Your Freelancer NFT
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 rounded-lg bg-black/50 border border-cyber-teal text-white focus:outline-none focus:ring-2 focus:ring-cyber-teal"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-black/50 border border-cyber-teal text-white focus:outline-none focus:ring-2 focus:ring-cyber-teal"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-2">Expertise</label>
            <select
              value={formData.expertise}
              onChange={(e) =>
                setFormData({ ...formData, expertise: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-black/50 border border-cyber-teal text-white focus:outline-none focus:ring-2 focus:ring-cyber-teal"
              required
            >
              <option value="">Select expertise</option>
              <option value="frontend">Frontend Developer</option>
              <option value="backend">Backend Developer</option>
              <option value="fullstack">Fullstack Developer</option>
              <option value="blockchain">Blockchain Developer</option>
            </select>
          </div>
          <div>
            <label className="block text-white mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-3 rounded-lg bg-black/50 border border-cyber-teal text-white h-32 focus:outline-none focus:ring-2 focus:ring-cyber-teal"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-cyber-teal to-electric-purple text-white font-semibold hover:shadow-neon-teal transition-shadow duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" />
                Minting...
              </span>
            ) : (
              "Mint NFT"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}