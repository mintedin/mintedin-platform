"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function ProfileRedirectPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      router.push(`/profile/${address}`);
    }
  }, [address, isConnected, router]);

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
            Please connect your wallet to view your profile
          </p>
          <ConnectButton />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-gradient flex items-center justify-center">
      <div className="glassmorphism p-8 rounded-lg">
        <h1 className="text-xl font-orbitron text-cyber-teal">
          Redirecting to your profile...
        </h1>
      </div>
    </div>
  );
}
