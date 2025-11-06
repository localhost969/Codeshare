import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import Features from "@/components/Home/Features";
import Footer from "@/components/Home/Footer";
import Hero from "@/components/Home/Hero";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (!isLoading && user) {
      router.push(`/dashboard/${user.userId}`);
    }
  }, [user, isLoading, router]);

  return (
    <div
      className="min-h-screen w-full font-sans pb-16"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      {/* HERO SECTION */}
      <Hero />
      <Features />
      {/* FIXED FOOTER */}
      <Footer />
    </div>
  );
}