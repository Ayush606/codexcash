import HeroSection from "@/components/ui/hero-section";
import ContestCard from "@/components/ui/contest-card";
import FeatureSection from "@/components/ui/features-section";
import FAQSection from "@/components/ui/faq-section";
import { Card, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CodeAnimation from "@/components/ui/code-animation";
import type { Metadata } from 'next'

export const metadata: Metadata = ({
  title: "CodeXcash - Unlock Top Dev Talent With Solana Coding Contests",
  description: "Host coding contests with Solana rewards to find the perfect solution for your project",
  openGraph: {
    images: [
      {
        url: "https://codexcash.com/images/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "CodeXcash - Unlock Top Dev Talent With Solana Coding Contests"
      }
    ]
  }
});
export default function Home() {

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">

        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <hr id="features" />
        <FeatureSection />


        {/* Explore Contest  Section */}
        <hr id="explore" />
        <Card className="container w-full p-4 rounded-md bg-background">
          <CardTitle className="text-3xl font-bold text-center my-4 py-4">Explore Contests</CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" >
            <ContestCard
              title="Create A sol nft cntract with good looking website"
              description="I want as website which has a nft contract intigarated with the sol and made it using react nextjs, appwrite etc"
              price={149.99}
              endDate={new Date('2024-12-31T23:59:59')}
            />

            <ContestCard
              title="Create A sol nft cntract with good looking website"
              description="I want as website which has a nft contract intigarated with the sol and made it using react nextjs, appwrite etc"
              price={149.99}
              endDate={new Date('2024-12-31T23:59:59')}
            />

            <ContestCard
              title="Create A sol nft cntract with good looking website"
              description="I want as website which has a nft contract intigarated with the sol and made it using react nextjs, appwrite etc"
              price={149.99}
              endDate={new Date('2024-12-31T23:59:59')}
            />

            <ContestCard
              title="Create A sol nft cntract with good looking website"
              description="I want as website which has a nft contract intigarated with the sol and made it using react nextjs, appwrite etc"
              price={149.99}
              endDate={new Date('2024-12-31T23:59:59')}
            />
          </div>
          <div className="text-center m-2">
            <Link href='/explore'>
              <span className=" bg-secondary rounded-md py-2 px-4  shadow-md hover:bg-primary ">Explore More</span>
            </Link>
          </div>
        </Card>


        {/* FAQ Section */}
        <hr id="faq" />
        <FAQSection />

      </main>
    </div>
  );
}
