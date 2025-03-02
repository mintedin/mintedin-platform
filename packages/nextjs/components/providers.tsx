"use client";

import { ThemeProvider } from "next-themes";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RainbowKitProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
      >
        {children}
      </ThemeProvider>
    </RainbowKitProvider>
  );
}