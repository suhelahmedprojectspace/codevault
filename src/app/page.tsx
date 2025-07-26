import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import CodeSection from '@/components/CodeSection';
import BlogSection from '@/components/BlogSection';
import Footer from '@/components/Footer';
export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <CodeSection />
      <BlogSection />
    </div>
  );
}
