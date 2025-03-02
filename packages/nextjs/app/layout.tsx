import './globals.scss';
import { Space_Grotesk, Orbitron } from 'next/font/google';
import { Providers } from '@/components/providers';
import { WagmiProvider } from '@/components/wagmi-provider';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

export const metadata = {
  title: 'repChain - Web3 Reputation System',
  description: 'Decentralized reputation management system for the Web3 ecosystem',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${orbitron.variable} font-space bg-dark-bg text-white antialiased`} suppressHydrationWarning>
        <WagmiProvider>
          <Providers>{children}</Providers>
        </WagmiProvider>
      </body>
    </html>
  );
}