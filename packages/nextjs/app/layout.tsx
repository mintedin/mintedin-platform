import "./globals.scss";
import { Providers } from "@/components/providers";
import { WagmiProvider } from "@/components/wagmi-provider";
import { ParticleBackground } from "@/components/ui/particle-background";
import { SpaceObjects } from "@/components/ui/space-objects";
import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navbar";

export const metadata = {
  title: "MintedIn - Decentralized NFT Reputation System",
  description:
    "The next generation decentralized reputation management system for Web3 professionals",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-space bg-dark-bg text-white antialiased min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        <WagmiProvider>
          <Providers>
            <ParticleBackground />
            <SpaceObjects />
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </Providers>
        </WagmiProvider>
      </body>
    </html>
  );
}
