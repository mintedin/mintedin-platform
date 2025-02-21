import { HeroSection } from '@/components/sections/hero';
import { TopFreelancers } from '@/components/sections/top-freelancers';
import { Features } from '@/components/sections/features';

export default function Home() {
  return (
    <main className="min-h-screen bg-cyber-gradient">
      <HeroSection />
      <Features />
      <TopFreelancers />
    </main>
  );
}