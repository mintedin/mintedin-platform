"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

export function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const engineRef = useRef<Engine | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const initParticles = useCallback(async () => {
    if (!containerRef.current) return;

    // Dynamic import tsparticles to avoid SSR issues
    const { tsParticles } = await import("tsparticles-engine");

    // Load the slim bundle
    await loadSlim(tsParticles);

    // Save the engine reference
    engineRef.current = tsParticles;

    // Create the particles
    await tsParticles.load({
      id: "tsparticles",
      element: containerRef.current,
      options: {
        fullScreen: {
          enable: false,
          zIndex: -1,
        },
        fpsLimit: 60,
        particles: {
          color: {
            value: "#ffffff",
          },
          links: {
            color: "#00f7ff",
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
          },
          move: {
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: true,
            speed: isMobile ? 0.5 : 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: isMobile ? 40 : 80,
          },
          opacity: {
            value: 0.5,
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
            },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
        responsive: [
          {
            maxWidth: 768,
            options: {
              particles: {
                number: {
                  value: 40,
                },
                move: {
                  speed: 0.5,
                },
              },
            },
          },
        ],
      },
    });

    // Cleanup function
    return () => {
      // Call the destroy function if it exists
      if (engineRef.current) {
        try {
          // @ts-ignore - Ignore TypeScript errors as the API might change
          engineRef.current.destroy?.();
        } catch (e) {
          console.error("Error cleaning up particles:", e);
        }
      }
    };
  }, [isMobile]);

  useEffect(() => {
    // Initialize particles
    let destroyFn: (() => void) | undefined;

    const init = async () => {
      try {
        const result = await initParticles();
        // Store any cleanup function if returned
        if (typeof result === "function") {
          destroyFn = result;
        }
      } catch (error) {
        console.error("Failed to initialize particles:", error);
      }
    };

    init();

    // Cleanup function
    return () => {
      // Call the destroy function if it exists
      if (destroyFn) {
        destroyFn();
      }

      // Additional cleanup - try to destroy the container directly
      if (engineRef.current) {
        try {
          // @ts-ignore - Ignore TypeScript errors as the API might change
          engineRef.current.destroy?.();
        } catch (e) {
          console.error("Error cleaning up particles:", e);
        }
      }
    };
  }, [initParticles]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[-1]"
      aria-hidden="true"
    />
  );
}
