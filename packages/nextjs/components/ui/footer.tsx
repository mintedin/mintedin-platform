"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, MessageSquare } from "lucide-react";
import Link from "next/link";

const socialLinks = [
  {
    name: "X (Twitter)",
    icon: Twitter,
    href: "#",
  },
  {
    name: "GitHub",
    icon: Github,
    href: "#",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "#",
  },
  {
    name: "Discord",
    icon: MessageSquare,
    href: "#",
  },
];

export function Footer() {
  return (
    <footer className="w-full py-8 px-4 mt-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="glassmorphism p-6 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h3 className="font-orbitron text-xl font-bold neon-text mb-2">
                MintedIn
              </h3>
              <p className="text-gray-400 text-sm">
                The Next Generation Web3 Reputation System
              </p>
            </div>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-black/30 transition-colors duration-200 group"
                  aria-label={link.name}
                >
                  <link.icon className="w-5 h-5 text-gray-400 group-hover:text-cyber-teal transition-colors duration-200" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}