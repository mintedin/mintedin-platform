"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { Code, Briefcase, User, Shield, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Code,
    },
    {
      name: "Jobs",
      href: "/jobs",
      icon: Briefcase,
    },
    {
      name: "Mint NFT",
      href: "/mint",
      icon: Shield,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    return pathname?.startsWith(path) && path !== "/";
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-cyber-teal/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-orbitron font-bold text-cyber-teal">
                MintedIn
              </span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                        active
                          ? "bg-cyber-teal text-black"
                          : "text-white/90 hover:bg-cyber-teal/10 hover:text-cyber-teal"
                      }`}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Connect Wallet Button */}
          <div className="hidden md:block">
            <ConnectButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    active
                      ? "bg-cyber-teal text-black"
                      : "text-white hover:bg-cyber-teal/10 hover:text-cyber-teal"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-cyber-teal/30">
            <div className="px-4">
              <ConnectButton />
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
