"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Shield, User, Briefcase } from "lucide-react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type UserType = "freelancer" | "client";

interface FormData {
  name: string;
  username: string;
  type: UserType;
  expertise?: string;
  bio: string;
  email: string;
}

export default function MintPage() {
  const { isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    type: "freelancer",
    expertise: "",
    bio: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Upload metadata to IPFS via Pinata
      // TODO: Mint NFT with metadata URI
      setTimeout(() => setIsLoading(false), 2000);
    } catch (error) {
      console.error("Error minting NFT:", error);
      setIsLoading(false);
    }
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
            Please connect your wallet to mint your NFT
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
        className="max-w-2xl mx-auto"
      >
        <Tabs defaultValue="freelancer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="freelancer" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Freelancer
            </TabsTrigger>
            <TabsTrigger value="client" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Client
            </TabsTrigger>
          </TabsList>

          <TabsContent value="freelancer" className="glassmorphism p-8 rounded-lg">
            <h2 className="text-3xl font-orbitron font-bold mb-8 neon-text text-center">
              Mint Freelancer NFT
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
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
                <label className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
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
                  <option value="designer">UI/UX Designer</option>
                </select>
              </div>
              <div>
                <label className="block text-white mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
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
                  "Mint Freelancer NFT"
                )}
              </button>
            </form>
          </TabsContent>

          <TabsContent value="client" className="glassmorphism p-8 rounded-lg">
            <h2 className="text-3xl font-orbitron font-bold mb-8 neon-text text-center">
              Mint Client NFT
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
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
                <label className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyber-teal text-white focus:outline-none focus:ring-2 focus:ring-cyber-teal"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
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
                  "Mint Client NFT"
                )}
              </button>
            </form>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}