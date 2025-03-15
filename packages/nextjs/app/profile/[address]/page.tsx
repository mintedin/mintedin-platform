"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Award, Briefcase, Star, Edit } from "lucide-react";
import { useAccount } from "wagmi";

export default function ProfilePage() {
  const { address } = useParams();
  const { address: userAddress } = useAccount();
  const isOwnProfile = address === userAddress;

  // Mock data - Replace with actual data from smart contract and IPFS
  const profileData = {
    type: "freelancer",
    name: "Alex Thompson",
    username: "alexdev",
    tier: "Gold",
    points: 450,
    completedJobs: 12,
    rating: 4.8,
    expertise: "Blockchain Developer",
    bio: "Experienced blockchain developer specializing in DeFi protocols and NFT marketplaces.",
  };

  const stats = [
    {
      icon: Shield,
      label: "Current Tier",
      value: profileData.tier,
    },
    {
      icon: Award,
      label: "Points",
      value: profileData.points,
    },
    {
      icon: Briefcase,
      label: "Completed Jobs",
      value: profileData.completedJobs,
    },
    {
      icon: Star,
      label: "Rating",
      value: profileData.rating,
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
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-orbitron font-bold neon-text">
                {profileData.name}
              </h1>
              <p className="text-gray-400">@{profileData.username}</p>
            </div>
            {isOwnProfile && (
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/30 border border-cyber-teal text-white hover:shadow-neon-teal transition-shadow duration-300">
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Expertise</h2>
              <p className="text-gray-300">{profileData.expertise}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Bio</h2>
              <p className="text-gray-300">{profileData.bio}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glassmorphism p-8 rounded-lg"
          >
            <h2 className="text-2xl font-orbitron font-bold mb-4 text-white">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {/* TODO: Add activity feed */}
              <p className="text-gray-400">No recent activity</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glassmorphism p-8 rounded-lg"
          >
            <h2 className="text-2xl font-orbitron font-bold mb-4 text-white">
              Reviews
            </h2>
            <div className="space-y-4">
              {/* TODO: Add reviews */}
              <p className="text-gray-400">No reviews yet</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}