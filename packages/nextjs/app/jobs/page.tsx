"use client";

import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

export default function JobsPage() {
  const [filter, setFilter] = useState("all");

  const jobs = [
    {
      id: 1,
      title: "Smart Contract Developer",
      budget: "5 ETH",
      duration: "2 months",
      skills: ["Solidity", "Hardhat", "TypeScript"],
      status: "open",
    },
    {
      id: 2,
      title: "Frontend DApp Developer",
      budget: "3 ETH",
      duration: "1 month",
      skills: ["React", "ethers.js", "TailwindCSS"],
      status: "open",
    },
  ];

  return (
    <div className="min-h-screen bg-cyber-gradient py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-orbitron font-bold neon-text">
            Available Jobs
          </h1>
          <button className="cyber-border px-6 py-3 rounded-lg bg-black/30 text-white flex items-center gap-2 hover:shadow-neon-teal transition-shadow duration-300">
            <Plus className="w-5 h-5" />
            Post Job
          </button>
        </div>

        <div className="glassmorphism p-6 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/30 border border-cyber-teal text-white focus:outline-none focus:ring-2 focus:ring-cyber-teal"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg ${
                  filter === "all"
                    ? "bg-cyber-teal text-black"
                    : "bg-black/30 text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("open")}
                className={`px-4 py-2 rounded-lg ${
                  filter === "open"
                    ? "bg-cyber-teal text-black"
                    : "bg-black/30 text-white"
                }`}
              >
                Open
              </button>
              <button
                onClick={() => setFilter("inProgress")}
                className={`px-4 py-2 rounded-lg ${
                  filter === "inProgress"
                    ? "bg-cyber-teal text-black"
                    : "bg-black/30 text-white"
                }`}
              >
                In Progress
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glassmorphism p-6 rounded-lg hover:shadow-neon-teal transition-shadow duration-300"
            >
              <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
              <div className="flex justify-between mb-4">
                <span className="text-cyber-teal">{job.budget}</span>
                <span className="text-gray-400">{job.duration}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-black/30 text-white text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <button className="w-full py-2 rounded-lg bg-cyber-teal text-black font-semibold hover:shadow-neon-teal transition-shadow duration-300">
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}