"use client";

import { motion } from "framer-motion";
import { useEffect, useState, CSSProperties } from "react";

const SpaceObject = ({
  className,
  delay = 0,
  duration = 3,
  style,
}: {
  className?: string;
  delay?: number;
  duration?: number;
  style?: CSSProperties;
}) => (
  <motion.div
    className={`absolute rounded-full ${className}`}
    initial={{ opacity: 0 }}
    animate={{
      opacity: [0.4, 0.8, 0.4],
      y: [0, -20, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    style={style}
  />
);

const ShootingStar = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute w-[2px] h-[100px] bg-gradient-to-b from-white via-cyber-teal to-transparent"
    initial={{
      opacity: 0,
      x: "0%",
      y: "0%",
      rotate: -45,
    }}
    animate={{
      opacity: [0, 1, 0],
      x: ["0%", "100%"],
      y: ["0%", "100%"],
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 5 + 3,
      ease: "linear",
    }}
    style={{
      left: `${Math.random() * 80}%`,
      top: `${Math.random() * 50}%`,
    }}
  />
);

export function SpaceObjects() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Planets */}
      <SpaceObject
        className="w-32 h-32 bg-gradient-to-br from-cyber-teal to-electric-purple opacity-20 blur-lg"
        style={{ left: '10%', top: '20%' }}
        duration={4}
      />
      <SpaceObject
        className="w-48 h-48 bg-gradient-to-br from-neon-pink to-neon-blue opacity-10 blur-xl"
        style={{ right: '15%', bottom: '25%' }}
        delay={1}
        duration={5}
      />
      <SpaceObject
        className="w-24 h-24 bg-gradient-to-br from-neon-yellow to-cyber-teal opacity-15 blur-md"
        style={{ left: '70%', top: '60%' }}
        delay={2}
        duration={3.5}
      />

      {/* Shooting Stars */}
      {Array.from({ length: 3 }).map((_, i) => (
        <ShootingStar key={i} delay={i * 2} />
      ))}

      {/* Star field */}
      <div className="absolute inset-0" style={{ perspective: '1000px' }}>
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ opacity: Math.random() * 0.5 + 0.3 }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `translateZ(${Math.random() * 100}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}